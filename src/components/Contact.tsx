"use client";

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Button } from './ui/Button';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import styles from './Contact.module.css';

export const Contact = () => {
    // Translated Services
    const SERVICES = [
        { id: 'cleaning', name: 'Limpieza Dental', duration: 60, autoBook: true },
        { id: 'evaluation', name: 'Evaluación Dental / Diagnóstico', duration: 60, autoBook: true },
        { id: 'fillings', name: 'Restauraciones Simples / Rellenos', duration: 60, autoBook: true },
        { id: 'whitening', name: 'Blanqueamiento Dental', duration: 0, autoBook: false },
        { id: 'extractions', name: 'Extracciones', duration: 0, autoBook: false },
        { id: 'endodontics', name: 'Endodoncia', duration: 0, autoBook: false },
        { id: 'prosthetics', name: 'Prótesis Dental', duration: 0, autoBook: false },
    ];

    // Message Validation - Optional now
    // if (!formData.message.trim()) {
    //     valid = false;
    // }

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        service: '',
        date: '',
        time: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        service: '',
        date: '',
        time: ''
    });

    const [isValid, setIsValid] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation Regex
    const nameRegex = /^[a-zA-Z\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{4} \d{4}$/;

    useEffect(() => {
        validateForm();
    }, [formData]);

    useEffect(() => {
        if (formData.service && formData.date) {
            const selectedService = SERVICES.find(s => s.id === formData.service);
            if (selectedService && selectedService.autoBook) {
                fetchSlots(formData.date, selectedService.duration);
            }
        } else {
            setAvailableSlots([]);
        }
    }, [formData.service, formData.date]);

    const fetchSlots = async (date: string, duration: number) => {
        setLoadingSlots(true);
        try {
            const response = await fetch(`/api/availability?date=${date}&duration=${duration}`);
            const data = await response.json();
            if (data.slots) {
                setAvailableSlots(data.slots);
            } else {
                setAvailableSlots([]);
            }
        } catch (error) {
            console.error('Error fetching slots:', error);
            setAvailableSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const validateForm = () => {
        const newErrors = {
            name: '',
            email: '',
            phone: '',
            message: '',
            service: '',
            date: '',
            time: ''
        };
        let valid = true;

        // Name Validation
        if (!formData.name.trim()) {
            valid = false;
        } else if (!nameRegex.test(formData.name)) {
            newErrors.name = 'Solo se permiten letras';
            valid = false;
        }

        // Email Validation
        if (!formData.email.trim()) {
            valid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Ingresa un correo válido';
            valid = false;
        }

        // Phone Validation
        if (!formData.phone.trim()) {
            valid = false;
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'El teléfono debe tener 8 dígitos';
            valid = false;
        }

        // Service Validation
        if (!formData.service) {
            valid = false;
        }

        // Auto-bookable logic
        const selectedService = SERVICES.find(s => s.id === formData.service);
        if (selectedService?.autoBook) {
            if (!formData.date) {
                valid = false;
            }
            if (!formData.time) {
                valid = false;
            }
        }

        // Message Validation
        // if (!formData.message.trim()) {
        //    valid = false;
        // }

        setErrors(newErrors);
        setIsValid(valid);
        return valid;
    };

    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const truncated = cleaned.slice(0, 8);
        if (truncated.length > 4) {
            return `${truncated.slice(0, 4)} ${truncated.slice(4)}`;
        }
        return truncated;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;

        if (id === 'phone') {
            const formattedPhone = formatPhoneNumber(value);
            setFormData(prev => ({ ...prev, [id]: formattedPhone }));
        } else if (id === 'name') {
            if (nameRegex.test(value)) {
                setFormData(prev => ({ ...prev, [id]: value }));
            }
        } else {
            // If service changes, reset date/time
            if (id === 'service') {
                setFormData(prev => ({ ...prev, service: value, date: '', time: '' }));
            } else {
                setFormData(prev => ({ ...prev, [id]: value }));
            }
        }
    };

    const handleTimeSelect = (slot: string) => {
        setFormData(prev => ({ ...prev, time: slot }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                // Prepare Payload
                const selectedServiceData = SERVICES.find(s => s.id === formData.service);
                const payload = {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                    service: selectedServiceData?.name || formData.service, // Send friendly name or ID
                    date: formData.date,
                    time: formData.time,
                    isAutoBooking: selectedServiceData?.autoBook || false
                };

                const response = await fetch('/api/appointments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });

                    setSubmittedEmail(formData.email);
                    setShowSuccessModal(true);

                    // Clear form
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        message: '',
                        service: '',
                        date: '',
                        time: ''
                    });
                    setIsValid(false);
                } else {
                    const errorData = await response.json();
                    if (response.status === 409) {
                        alert(errorData.error || 'Este horario ya no está disponible.');
                        // Refresh slots
                        if (formData.date && selectedServiceData) {
                            fetchSlots(formData.date, selectedServiceData.duration);
                        }
                    } else {
                        alert('Hubo un error al agendar la cita. Por favor intenta de nuevo.');
                    }
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Hubo un error de conexión.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setSubmittedEmail('');
    };

    const selectedServiceData = SERVICES.find(s => s.id === formData.service);

    return (
        <section id="contact" className={styles.section}>
            <div className={`container ${styles.container}`}>
                <div className={styles.infoCol}>
                    <h2 className={styles.heading}>Agenda tu Cita</h2>
                    <p className={styles.text}>Estamos listos para atenderte y mejorar tu sonrisa.</p>

                    <div className={styles.contactDetails}>
                        <div className={styles.detailItem}>
                            <MapPin className="text-gold" size={24} />
                            <div>
                                <h4 className={styles.detailTitle}>Ubicación</h4>
                                <p className={styles.detailText}>Avenida Jose Matias Delgado 365, San Salvador 1101, El Salvador</p>
                            </div>
                        </div>

                        <div className={styles.detailItem}>
                            <Phone className="text-gold" size={24} />
                            <div>
                                <h4 className={styles.detailTitle}>Teléfono</h4>
                                <p className={styles.detailText}>+503 6185 9128</p>
                            </div>
                        </div>

                        <div className={styles.detailItem}>
                            <Mail className="text-gold" size={24} />
                            <div>
                                <h4 className={styles.detailTitle}>Email</h4>
                                <p className={styles.detailText}>artigadental.info@gmail.com</p>
                            </div>
                        </div>

                        <div className={styles.detailItem}>
                            <Clock className="text-gold" size={24} />
                            <div>
                                <h4 className={styles.detailTitle}>Horarios</h4>
                                <p className={styles.detailText}>Lun - Vie: 9:00 AM - 4:00 PM <br /> Sáb: 9:00 AM - 12:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.formCol}>
                    <form className={styles.form} onSubmit={handleSubmit}>

                        {/* Personal Info Group */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="name">Nombre Completo *</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Tu nombre"
                                className={styles.input}
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <span style={{ color: 'red', fontSize: '12px' }}>{errors.name}</span>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Correo Electrónico *</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="tucorreo@ejemplo.com"
                                className={styles.input}
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="phone">Teléfono *</label>
                            <input
                                type="tel"
                                id="phone"
                                placeholder="#### ####"
                                className={styles.input}
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && <span style={{ color: 'red', fontSize: '12px' }}>{errors.phone}</span>}
                        </div>

                        {/* Service Selection */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="service">Servicio Dental *</label>
                            <select
                                id="service"
                                className={styles.input}
                                value={formData.service}
                                onChange={handleChange}
                                style={{ backgroundColor: 'white', color: '#333' }}
                            >
                                <option value="">Selecciona un servicio...</option>
                                {SERVICES.map(service => (
                                    <option key={service.id} value={service.id}>
                                        {service.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Dynamic Booking UI */}
                        {selectedServiceData?.autoBook && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className={styles.inputGroup}>
                                    <label htmlFor="date">Fecha Cita *</label>
                                    <input
                                        type="date"
                                        id="date"
                                        className={styles.input}
                                        value={formData.date}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={handleChange}
                                    />
                                </div>

                                {formData.date && (
                                    <div className={styles.inputGroup}>
                                        <label>Horarios Disponibles *</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px', marginTop: '5px' }}>
                                            {loadingSlots ? (
                                                <p style={{ gridColumn: '1 / -1', color: '#666', fontSize: '14px' }}>Cargando horarios...</p>
                                            ) : availableSlots.length > 0 ? (
                                                <>
                                                    {availableSlots.map((slot: any) => (
                                                        <button
                                                            key={slot.time}
                                                            type="button"
                                                            disabled={slot.status !== 'available'}
                                                            onClick={() => slot.status === 'available' && handleTimeSelect(slot.time)}
                                                            className={slot.status === 'available' ? 'hover:scale-105 transition-transform' : ''}
                                                            style={{
                                                                padding: '8px',
                                                                borderRadius: '5px',
                                                                border: formData.time === slot.time ? '2px solid #D4AF37' : '1px solid #ddd',
                                                                backgroundColor:
                                                                    formData.time === slot.time ? '#FDF8E4' :
                                                                        slot.status === 'booked' ? '#ffdddd' :
                                                                            slot.status === 'past' ? '#f0f0f0' : 'white',
                                                                color: slot.status === 'available' ? '#333' : '#999',
                                                                cursor: slot.status === 'available' ? 'pointer' : 'not-allowed',
                                                                fontSize: '12px',
                                                                textDecoration: slot.status === 'booked' || slot.status === 'past' ? 'none' : 'none',
                                                                opacity: slot.status === 'available' ? 1 : 0.7
                                                            }}
                                                            title={
                                                                slot.status === 'booked' ? 'Ya reservado' :
                                                                    slot.status === 'past' ? 'Horario pasado' : 'Disponible'
                                                            }
                                                        >
                                                            {slot.time}
                                                        </button>
                                                    ))}
                                                    <div style={{ gridColumn: '1 / -1', marginTop: '10px', display: 'flex', gap: '15px', fontSize: '12px', color: '#666', justifyContent: 'center' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                            <div style={{ width: '12px', height: '12px', border: '1px solid #ddd', backgroundColor: 'white' }}></div> Disponible
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                            <div style={{ width: '12px', height: '12px', border: '1px solid #ddd', backgroundColor: '#ffdddd' }}></div> Reservado
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                            <div style={{ width: '12px', height: '12px', border: '1px solid #ddd', backgroundColor: '#f0f0f0' }}></div> No Disponible
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div style={{ gridColumn: '1 / -1', padding: '15px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '5px', textAlign: 'center', border: '1px solid #ffeeba' }}>
                                                    No hay espacios disponibles para este día. Por favor selecciona otra fecha.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Non Auto-bookable Message */}
                        {selectedServiceData && !selectedServiceData.autoBook && (
                            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #D4AF37' }}>
                                <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>
                                    <strong>Nota:</strong> Este tratamiento requiere una evaluación previa.
                                    Por favor envía tu solicitud y nuestro equipo te contactará para coordinar tu diagnóstico.
                                </p>
                            </div>
                        )}

                        <div className={styles.inputGroup}>
                            <label htmlFor="message">Mensaje / Notas Adicionales (Opcional)</label>
                            <textarea
                                id="message"
                                rows={4}
                                placeholder="¿Alguna condición médica o pregunta específica?"
                                className={styles.textarea}
                                value={formData.message}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        {!isValid && (
                            <p style={{ fontSize: '14px', marginBottom: '10px', color: '#666' }}>
                                Por favor completa todos los campos requeridos.
                            </p>
                        )}
                        <Button
                            type="submit"
                            variant="primary"
                            className={styles.submitBtn}
                            disabled={!isValid || isSubmitting}
                            style={{
                                opacity: (!isValid || isSubmitting) ? 0.5 : 1,
                                cursor: (!isValid || isSubmitting) ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <span style={{
                                        width: '16px',
                                        height: '16px',
                                        border: '2px solid white',
                                        borderTop: '2px solid transparent',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }}></span>
                                    Procesando...
                                </>
                            ) : (
                                selectedServiceData?.autoBook ? 'Agendar Cita' : 'Solicitar Información'
                            )}
                        </Button>
                        <style jsx>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </form>
                </div>
            </div>

            {/* Map Section */}
            <div id="location">
                <div className={styles.locationHeader}>
                    <h1 className={styles.locationTitle}>Estamos ubicados en San Salvador</h1>
                    <p className={styles.locationSubtitle}>Será un gusto atenderte y mejorar tu sonrisa</p>
                </div>
                <div className={styles.mapWrapper}>
                    <div className={styles.mapPlaceholder}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1938.834641619478!2d-89.2396209!3d13.7063844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f633100410643b9%3A0x71875cc4081bfe08!2sArtiga%20Dental%20Care!5e0!3m2!1sen!2svi!4v1700000000000!5m2!1sen!2svi"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ color: '#2C3E50', marginBottom: '15px', fontSize: '24px' }}>¡Cita Agendada!</h3>
                        <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.5' }}>
                            Tu cita se ha agendado correctamente. Se te envió un mensaje de confirmación a <strong>{submittedEmail}</strong>.
                        </p>
                        <Button
                            variant="primary"
                            onClick={closeSuccessModal}
                            style={{ width: '100%' }}
                        >
                            Aceptar
                        </Button>
                    </div>
                </div>
            )}
        </section>
    );
};
