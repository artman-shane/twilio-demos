import { getTwilioClient } from "/demos/voiceIntelligenceDemo/utils/twilioClient";

import { NextResponse } from "next/server";

export async function GET() {
  const client = getTwilioClient();
  try {
    const start = new Date('2025-07-01');
    const end = new Date('2025-07-31');

    const numbers = await client.incomingPhoneNumbers.list({ limit: 100 });

    const results = [];

    for (const num of numbers) {
      const inbound = await client.calls.list({
        to: num.phoneNumber,
        startTimeAfter: start,
        startTimeBefore: end
      });

      const outbound = await client.calls.list({
        from: num.phoneNumber,
        startTimeAfter: start,
        startTimeBefore: end
      });

      results.push({
        phoneNumber: num.phoneNumber,
        inboundCount: inbound.length,
        outboundCount: outbound.length
      });
    }

    return Response.json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}