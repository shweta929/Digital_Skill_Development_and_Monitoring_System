import { createEvent } from "ics";

export function generateICS({ title, description, location, finalDate, durationMinutes = 30 }) {
    const [datePart, timePartRaw] = finalDate.split(" at ");
    let [time, ampm] = timePartRaw.split(" ");
    let [hh, mm] = time.split(":").map(Number);

    if (ampm === "PM" && hh !== 12) hh += 12;
    if (ampm === "AM" && hh === 12) hh = 0;

    const [yyyy, mon, dd] = datePart.split("-").map(Number);

    const event = {
        start: [yyyy, mon, dd, hh, mm],
        duration: { minutes: durationMinutes },
        title,
        description,
        location,
        status: "CONFIRMED",
        organizer: { name: "Career Guidance Portal", email: "noreply@careerportal.com" },
    };

    const { error, value } = createEvent(event);
    if (error) throw error;

    return value.replace("BEGIN:VCALENDAR", "BEGIN:VCALENDAR\r\nMETHOD:REQUEST");
}
