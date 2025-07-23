import { getTwilioClient } from "/demos/voiceIntelligenceDemo/utils/twilioClient";

import { NextResponse } from "next/server";
import { createCarousel } from "../generateContentTemplate";

// POST /api/rcs/generateContentTemplate
export async function POST(req) {
  try {
    const { activities } = await req.json();

    // Wrap activities with id/fields if needed
    const formattedActivities = activities.map((a, idx) => ({
      id: a.id || (idx + 1).toString(),
      fields: a,
    }));

    const template = await createCarousel(formattedActivities);

    // Get Twilio client from your helper
    const client = getTwilioClient();

    // Create the content template in Twilio
    const twilioResponse = await client.content.v1.contents.create(template);

    return NextResponse.json({ template, twilio: twilioResponse });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to generate content template." },
      { status: 400 }
    );
  }
}
