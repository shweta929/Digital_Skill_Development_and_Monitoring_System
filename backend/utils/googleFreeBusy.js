import { google } from "googleapis";

export async function isSlotBusy(tokens, timeMinISO, timeMaxISO, calendarId = "primary") {
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const res = await calendar.freebusy.query({
        requestBody: {
            timeMin: timeMinISO,
            timeMax: timeMaxISO,
            items: [{ id: calendarId }],
        },
    });

    const busy = res.data.calendars?.[calendarId]?.busy || [];
    return busy.length > 0;
}
