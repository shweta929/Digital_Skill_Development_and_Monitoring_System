import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

export async function createGoogleMeetEvent({
    tokens,
    summary,
    description,
    startISO,
    endISO,
    attendees = [],
}) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
        summary,
        description,
        start: {
            dateTime: startISO,
            timeZone: "Asia/Kolkata",
        },
        end: {
            dateTime: endISO,
            timeZone: "Asia/Kolkata",
        },
        attendees: attendees.map((email) => ({ email })),
        conferenceData: {
            createRequest: {
                requestId: "meet-" + Date.now(),
                conferenceSolutionKey: { type: "hangoutsMeet" },
            },
        },
    };

    const response = await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
        requestBody: event,
        conferenceDataVersion: 1,
        sendUpdates: "all",
    });

    return response.data;
}

export async function updateGoogleCalendarEvent({
    tokens,
    eventId,
    startISO,
    endISO,
}) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.patch({
        calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
        eventId,
        requestBody: {
            start: {
                dateTime: startISO,
                timeZone: "Asia/Kolkata",
            },
            end: {
                dateTime: endISO,
                timeZone: "Asia/Kolkata",
            },
        },
        sendUpdates: "all",
    });

    return response.data;
}
