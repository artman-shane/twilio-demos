import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getTwilioClient } from "/demos/voiceIntelligenceDemo/utils/twilioClient";
import { convertToWav } from "/demos/voiceIntelligenceDemo/utils/convertToWav";
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    let file = formData.get("file");
    let filePath = path.join(process.cwd(), "public", "uploads", file.name); // If the filename has spaces, escape them

    // If the file is an MP4, extract the audio
    if (file.name.endsWith(".mp4")) {
      const wavBuffer = await convertToWav(await file.arrayBuffer());
      const newName = file.name.replace(/\.mp4$/, ".wav");
      file = new File([wavBuffer], newName, { type: "audio/wav" });
      // Build the new path (again, Node can handle spaces)
      filePath = path.join(process.cwd(), "public", "uploads", newName);
    }

    // Save the file to the uploads directory
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    // Use the Twilio client to upload the file and get the transcript SID
    const client = getTwilioClient();
    const mediaUrl = `http://shane.ngrok.io/uploads/${encodeURIComponent(
      file.name
    )}`;
    console.log("Uploading with formData:", formData);
    const participants = JSON.parse(formData.get("participants") || "[]");

    const transcript = await client.intelligence.v2.transcripts.create({
      channel: {
        media_properties: {
          media_url: mediaUrl,
        },
        participants: participants,
      },
      serviceSid: process.env.SERVICE_SID,
    });

    return new NextResponse(JSON.stringify({ transcriptSid: transcript.sid }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
