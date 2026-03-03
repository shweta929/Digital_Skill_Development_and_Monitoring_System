import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const SLOT_DURATION_MIN = 30;

const WINDOWS = [
    { start: 9, end: 12 },
    { start: 12, end: 15 },
    { start: 15, end: 18 },
    { start: 18, end: 21 },
];

function makeISTDate(baseDate, hour, minute = 0) {
    const y = baseDate.getFullYear();
    const m = String(baseDate.getMonth() + 1).padStart(2, "0");
    const d = String(baseDate.getDate()).padStart(2, "0");
    const hh = String(hour).padStart(2, "0");
    const mm = String(minute).padStart(2, "0");

    return new Date(`${y}-${m}-${d}T${hh}:${mm}:00+05:30`);
}

function formatAMPM(hour24, minute = 0) {
    const ampm = hour24 >= 12 ? "PM" : "AM";
    let h = hour24 % 12 || 12;
    return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${ampm}`;
}

function overlaps(busy, start, end) {
    return busy.some(b =>
        new Date(b.start) < end && new Date(b.end) > start
    );
}

export async function findNextAvailableGoogleSlot(tokens) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const now = new Date();

    for (let day = 0; day < 7; day++) {
        const date = new Date();
        date.setDate(date.getDate() + day);

        const dayStart = makeISTDate(date, 9);
        const dayEnd = makeISTDate(date, 21);

        const fb = await calendar.freebusy.query({
            requestBody: {
                timeMin: dayStart.toISOString(),
                timeMax: dayEnd.toISOString(),
                timeZone: "Asia/Kolkata",
                items: [{ id: process.env.GOOGLE_CALENDAR_ID || "primary" }],
            },
        });

        const busy =
            fb.data.calendars?.[process.env.GOOGLE_CALENDAR_ID || "primary"]?.busy || [];

        for (const w of WINDOWS) {
            for (let h = w.start; h < w.end; h++) {
                for (let m of [0, 30]) {
                    const start = makeISTDate(date, h, m);
                    const end = new Date(start.getTime() + SLOT_DURATION_MIN * 60000);

                    if (start < now) continue;

                    if (!overlaps(busy, start, end)) {
                        const yyyy = start.getFullYear();
                        const mm = String(start.getMonth() + 1).padStart(2, "0");
                        const dd = String(start.getDate()).padStart(2, "0");

                        return {
                            finalDate: `${yyyy}-${mm}-${dd} at ${formatAMPM(h, m)}`,
                            startISO: start.toISOString(),
                            endISO: end.toISOString(),
                        };
                    }
                }
            }
        }
    }

    throw new Error("No free slot available in next 7 days");
}
