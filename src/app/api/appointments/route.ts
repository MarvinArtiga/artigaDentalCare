import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const SERVICES_DURATION: Record<string, number> = {
    'Limpieza Dental': 60,
    'Evaluación Dental / Diagnóstico': 60,
    'Restauraciones Simples / Rellenos': 60,
    // Others are 0 or handled as inquiry
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, message, service, date, time, isAutoBooking } = body;

        // Basic validation
        if (!name || !email || !phone || !service) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabase = await createClient();

        let startTime = null;
        let endTime = null;
        let status = 'pending';

        if (isAutoBooking && date && time) {
            // Parse Date and Time to create ISO strings
            // Date: "YYYY-MM-DD", Time: "09:00 AM"
            // We need to match the logic used in availability/route.ts
            // But here we construct the actual timestamp.

            // Note: This parsing depends on the time format. 
            // The browser's date input gives YYYY-MM-DD.
            // TIME is formatted as "09:00 AM" (en-US 12h) in my frontend code: 
            // slot.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

            const timeParts = time.match(/(\d+):(\d+)\s?(AM|PM)/i);
            if (timeParts) {
                let hours = parseInt(timeParts[1], 10);
                const minutes = parseInt(timeParts[2], 10);
                const meridian = timeParts[3].toUpperCase();

                if (meridian === 'PM' && hours < 12) hours += 12;
                if (meridian === 'AM' && hours === 12) hours = 0;

                const startDt = new Date(date);
                startDt.setHours(hours, minutes, 0, 0);

                // Adjust for timezone? 
                // Currently assuming the server and frontend agree on "local" time or simplified UTC.
                // For a robust app, we'd handle timezones explicitly.
                // Here we store as is (conceptually local time), Supabase stores as timestamptz (UTC).
                // If we construct `new Date(string)`, it effectively uses server local time or UTC if ISO.
                // `date` is YYYY-MM-DD. `new Date("2023-10-27")` is UTC 00:00 usually.
                // Let's use string manipulation to ensure correct ISO construction if possible,
                // OR just trust the Date object to work in this context (local dev).
                // Better approach:
                const [year, month, day] = date.split('-').map(Number);
                const safeStart = new Date(year, month - 1, day, hours, minutes, 0);

                startTime = safeStart.toISOString();

                // Calculate End Time
                const duration = SERVICES_DURATION[service] || 30;
                const endDt = new Date(safeStart.getTime() + duration * 60000);
                endTime = endDt.toISOString();

                status = 'confirmed'; // Auto-bookings generally imply immediate slot reservation, or 'pending' if you want manual approval.
                // Let's set to 'confirmed' for the "Auto-bookable" feel, or 'pending' if cautious.
                // User said "The booking logic to work... auto-bookable".
            }
        }
        // Check for conflicts before booking
        if (startTime && endTime) {
            const { data: existingAppointments, error: conflictError } = await supabase
                .from('appointments')
                .select('start_time, end_time')
                .or(`and(start_time.lt.${endTime},end_time.gt.${startTime})`);

            if (conflictError) {
                console.error('Error checking conflicts:', conflictError);
                return NextResponse.json({ error: 'Error checking availability' }, { status: 500 });
            }

            if (existingAppointments && existingAppointments.length > 0) {
                return NextResponse.json({ error: 'Este horario acabada de ser reservado. Por favor elige otro.' }, { status: 409 });
            }
        }

        const { data, error } = await supabase
            .from('appointments')
            .insert([
                {
                    name,
                    email,
                    phone,
                    message,
                    service_type: service,
                    start_time: startTime,
                    end_time: endTime,
                    status: status
                }
            ]);

        if (error) {
            console.error('Supabase Error:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // Send Email Notifications
        try {
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const { transporter, mailOptions } = await import('@/lib/nodemailer');

                // 1. Email to Clinic
                await transporter.sendMail({
                    ...mailOptions,
                    to: 'artigadental.info@gmail.com', // Clinic email
                    subject: `Nueva Cita: ${name} - ${service}`,
                    text: `
                        Nueva solicitud de cita recibida:
                        
                        Nombre: ${name}
                        Email: ${email}
                        Teléfono: ${phone}
                        Servicio: ${service}
                        Fecha: ${date || 'No especificada'}
                        Hora: ${time || 'No especificada'}
                        Mensaje: ${message || 'Sin mensaje adicional'}
                        
                        Tipo: ${isAutoBooking ? 'Reserva Automática' : 'Solicitud de Información'}
                    `,
                    html: `
                        <h3>Nueva Solicitud de Cita</h3>
                        <p><strong>Nombre:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Teléfono:</strong> ${phone}</p>
                        <p><strong>Servicio:</strong> ${service}</p>
                        <p><strong>Fecha:</strong> ${date || 'No especificada'}</p>
                        <p><strong>Hora:</strong> ${time || 'No especificada'}</p>
                        <p><strong>Mensaje:</strong> ${message || 'Sin mensaje adicional'}</p>
                        <br/>
                        <p><strong>Tipo:</strong> ${isAutoBooking ? 'Reserva Automática' : 'Solicitud de Información'}</p>
                    `
                });

                // 2. Email to Patient
                await transporter.sendMail({
                    ...mailOptions,
                    to: email,
                    subject: 'Confirmación de Solicitud - Artiga Dental Care',
                    text: `
                        Hola ${name},
                        
                        Hemos recibido tu solicitud para ${service}.
                        
                        ${isAutoBooking
                            ? `Tu cita ha sido pre-reservada para el ${date} a las ${time}. Te esperamos.`
                            : 'Gracias por tu interés. Nos pondremos en contacto contigo pronto para coordinar tu evaluación.'}
                        
                        Detalles:
                        Teléfono registrado: ${phone}
                        
                        Si necesitas cambiar algo, contáctanos al +503 6185 9128.
                        
                        Atentamente,
                        Artiga Dental Care
                    `,
                    html: `
                        <h3>Hola ${name},</h3>
                        <p>Hemos recibido tu solicitud para <strong>${service}</strong>.</p>
                        
                        ${isAutoBooking
                            ? `<p style="background-color: #f8f9fa; padding: 10px; border-left: 4px solid #D4AF37;"><strong>Tu cita ha sido reservada para el ${date} a las ${time}.</strong> Te esperamos.</p>`
                            : '<p>Gracias por tu interés. Nos pondremos en contacto contigo pronto para coordinar tu evaluación.</p>'}
                        
                        <p><strong>Detalles:</strong><br/>Teléfono registrado: ${phone}</p>
                        
                        <p>Si necesitas cambiar algo, contáctanos al +503 6185 9128.</p>
                        <br/>
                        <p>Atentamente,<br/>Artiga Dental Care</p>
                    `
                });
            } else {
                console.warn('Email credentials not found. Skipping email notification.');
            }

        } catch (emailError) {
            console.error('Error sending emails:', emailError);
            // Don't fail the request, just log it. The appointment is saved.
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Request Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
