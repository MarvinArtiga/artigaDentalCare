import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date');
    const durationParam = searchParams.get('duration');

    if (!dateParam || !durationParam) {
        return NextResponse.json({ error: 'Missing date or duration parameters' }, { status: 400 });
    }

    const targetDate = new Date(dateParam);
    const serviceDuration = parseInt(durationParam, 10);

    if (isNaN(targetDate.getTime()) || isNaN(serviceDuration)) {
        return NextResponse.json({ error: 'Invalid date or duration' }, { status: 400 });
    }

    // Clinic Hours
    // Mon-Fri: 9:00 - 16:00 (4:00 PM)
    // Sat: 9:00 - 12:00
    // Sun: Closed
    const dayOfWeek = targetDate.getUTCDay(); // 0 = Sunday, 1 = Monday, ...

    // Adjust for local time assumption if needed, but simplified to just day index
    // Assuming the dateParam comes in as YYYY-MM-DD, we can treat it as local or UTC. 
    // Best practice: treat input date as the day in the clinic's timezone.

    let openHour = 9;
    let closeHour = 16;

    if (dayOfWeek === 0) {
        // Sunday
        return NextResponse.json({ slots: [] });
    } else if (dayOfWeek === 6) {
        // Saturday
        closeHour = 12;
    }

    // Generate all possible slots for the day in 30 min intervals
    // El Salvador is UTC-6 (Standard Time, no DST usually).
    // We need to work with "Clinic Time".
    // Let's interpret the `dateParam` as a day in Clinic Time.

    // Helper to get time in El Salvador
    const getElSalvadorTime = (date?: Date) => {
        return new Date((date || new Date()).toLocaleString("en-US", { timeZone: "America/El_Salvador" }));
    };

    const nowInES = getElSalvadorTime();

    // Parse target date in ES context
    // We assume input "2023-12-25" is a date in ES.
    // Create a date object that represents midnight of that day in ES.
    const [year, month, day] = dateParam.split('-').map(Number);
    const startOfDayInES = new Date(year, month - 1, day, 0, 0, 0); // Local constructor uses system local, but we'll adjust manually if needed or just use as reference for HH:mm.

    // Actually, simpler approach: 
    // Just construct the slots as Date objects. If the date matches "today" in ES, we check hours.

    // Check if target date is "today" (or past)
    const isToday = nowInES.getDate() === day && nowInES.getMonth() === (month - 1) && nowInES.getFullYear() === year;
    const isPastDate = new Date(year, month - 1, day, 23, 59, 59) < nowInES;

    if (isPastDate && !isToday) {
        // entirely past day
        // But maybe user wants to see what was there? Usually no, just return empty or blocked.
        // Let's just let the logic run, "past" status will handle it if we check correctly, 
        // OR we just say no slots. Let's return slots as 'past' if it's a past day? 
        // User said "only future appointments".
        // If it's yesterday, all slots are past.
    }



    const possibleSlots: { time: string, status: 'available' | 'booked' | 'past' }[] = [];

    // We'll iterate using simple integer hours/minutes to avoid timezone unexpected shifts during addition
    // Start at openHour:00
    let currentHour = openHour;
    let currentMinute = 0;

    // Convert closeHour to minutes from midnight for easier comparison
    const closeTimeMinutes = closeHour * 60;

    while (true) {
        const currentTotalMinutes = currentHour * 60 + currentMinute;
        const serviceDurationMinutes = serviceDuration;
        const endTimeMinutes = currentTotalMinutes + serviceDurationMinutes;

        if (endTimeMinutes > closeTimeMinutes) {
            break;
        }

        // Create a Date object for this slot to compare with 'now'
        // We constructed startOfDayInES above using local components. 
        // We can create a specific date for this slot start.
        const slotDate = new Date(year, month - 1, day, currentHour, currentMinute);

        let status: 'available' | 'booked' | 'past' = 'available';

        // Check for Past Time
        // We strictly compare this slot's start time against 'now' in ES.
        // If slotDate < nowInES, it's past.
        // Make sure `slotDate` is treated as ES time. 
        // Since we constructed it with `new Date(y,m,d,h,m)`, it uses server local. 
        // We need to compare apples to apples.
        // Let's normalize `nowInES` to the same "local" components representation if server is UTC.
        // Actually, best way: Compare timestamps assuming both represent the same timezone.
        // If server is UTC, `new Date(y,m,d...)` is UTC. `nowInES` was created via toLocaleString... wait.

        // Robust Comp:
        // nowInES is a Date object representing the time in ES.
        // slotDate needs to represent that specific time in ES.

        // Let's simply check:
        if (isToday) {
            const nowHour = nowInES.getHours();
            const nowMin = nowInES.getMinutes();
            if (currentHour < nowHour || (currentHour === nowHour && currentMinute <= nowMin)) {
                status = 'past';
            }
        } else if (isPastDate) {
            status = 'past';
        }

        // Format time 12h
        const timeString = new Date(0, 0, 0, currentHour, currentMinute).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        possibleSlots.push({ time: timeString, status });

        // Increment by 60 mins
        currentMinute += 60;
        if (currentMinute >= 60) {
            currentHour += 1;
            currentMinute = 0;
        }
    }

    // Checking Bookings
    const supabase = await createClient();
    const startRange = new Date(year, month - 1, day, 0, 0, 0).toISOString();
    // We need to be careful with ISO strings. Supabase expects UTC ISO strings.
    // If we constructed `new Date(y,m,d)` in UTC (node default often), then ISO is correct for 00:00 UTC.
    // But El Salvador is UTC-6. So 00:00 ES is 06:00 UTC.
    // If we query 00:00 UTC, we might miss late appointments from previous day or include early ones.
    // Ideally we filter by the *clinic day*. 
    // Start: YYYY-MM-DDT09:00:00-06:00 -> UTC
    // End:   YYYY-MM-DDT16:00:00-06:00 -> UTC
    // Let's construct explicit ISOs with offset for the query? 
    // Or just use the `date` column if available? We only have `start_time` (timestamptz).

    // Simplification for prototype: Query a wide range (UTC day coverage) and filter in JS using the same timezone logic.
    // Or just trust the `date` string matching.

    const { data: appointments } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        .gte('start_time', `${dateParam}T00:00:00`)
        .lte('end_time', `${dateParam}T23:59:59`);
    // Note: This string comparison works if Supabase stores as text or if implicit casting works. 
    // For timestamptz, this is ambiguous.
    // Better:
    const dayStartISO = new Date(`${dateParam}T00:00:00`).toISOString(); // This uses Server Local
    const dayEndISO = new Date(`${dateParam}T23:59:59`).toISOString();

    // Fetch
    const { data: rawAppointments, error } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        // We'll broaden the search to avoid timezone misses, filter in memory
        .gte('start_time', new Date(new Date(dateParam).getTime() - 24 * 60 * 60 * 1000).toISOString())
        .lte('end_time', new Date(new Date(dateParam).getTime() + 48 * 60 * 60 * 1000).toISOString());


    if (rawAppointments) {
        // Filter for actual day overlap in ES time
        // And check conflicts
        const bookings = rawAppointments.map(app => ({
            start: new Date(app.start_time),
            end: new Date(app.end_time)
        }));

        possibleSlots.forEach(slot => {
            if (slot.status === 'past') return;

            // Convert slot time string back to a comparable time for today/targetDate
            // We can reconstruct the date object from our loop variables
            // But we lost them in the map. Let's redo or map smartly.
            // Actually, let's parse the `time` string "09:00 AM".
            const [t, meridian] = slot.time.split(' ');
            let [h, m] = t.split(':').map(Number);
            if (meridian === 'PM' && h < 12) h += 12;
            if (meridian === 'AM' && h === 12) h = 0;

            // Construct slot Date in UTC or Local? 
            // We need to compare with `bookings` which are Dates (UTC internally).
            // We decided `dateParam` is the day in ES. 
            // So this slot starts at `dateParam` at `h:m` in ES.
            // We need to convert that ES time to a Date object (absolute time) to compare with bookings.

            // Construct string with offset
            // "2023-10-25T09:00:00-06:00"
            const isoString = `${dateParam}T${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00-06:00`;
            const slotStartAbs = new Date(isoString);
            const slotEndAbs = new Date(slotStartAbs.getTime() + serviceDuration * 60000);

            // Check overlap
            const isBooked = bookings.some(b => {
                return (slotStartAbs.getTime() < b.end.getTime()) && (slotEndAbs.getTime() > b.start.getTime());
            });

            if (isBooked) {
                slot.status = 'booked';
            }
        });
    }

    return NextResponse.json({ slots: possibleSlots });
}
