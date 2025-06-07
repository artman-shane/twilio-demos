import { getTwilioClient } from "/demos/voiceIntelligenceDemo/utils/twilioClient";

export async function POST(req,res) {
  const { transcriptSids = [] } = await req.json();
  if (!Array.isArray(transcriptSids || transcriptSids.length === 0)) {
    return res.status(400).json({
      error: "Invalid transcriptSids format. It should be a non-empty array.",
    });
  }

  console.log(
    `Received ${transcriptSids} transcriptSids to delete:`,
    transcriptSids
  );

  const client = await getTwilioClient();

  async function deleteOneTranscript(sid) {
    let attempt = 0;
    const maxAttempts = 15;
    const baseDelay = 500;
    while (attempt < maxAttempts) {
      try {
        await client.intelligence.v2.transcripts(sid).remove();
        return { sid, success: true };
      } catch (err) {
        if (err.status === 429 && attempt < maxAttempts - 1) {
          attempt += 1;
          const retryAfter =
            err.headers?.["retry-after"] || baseDelay * attempt + Math.random() * 100;
          console.log(
            `Rate limit exceeded for transcript SID: ${sid}. Retrying in ${retryAfter} ms...`
          );
          await new Promise((r) => setTimeout(r, retryAfter));
          continue;
        }
        console.error(
          `Failed to delete transcript SID ${sid}:`,
          err.message || err
        );
        return { sid, success: false, error: err };
      }
    }
    return { sid, success: false, error: "Max retry attempts reached" };
  }

  const results = [];

  for (let sid of transcriptSids) {
    const singleResult = deleteOneTranscript(sid);
    results.push(singleResult);
  }
  Promise.all(results);
  console.log("Deletion results:", results);
  const failed = results.filter((result) => !result.success);

  if (failed.length > 0) {
    return res.status(207).json({
      message: "Some transcripts failed to delete",
      failedSids: results,
    });
  }
  return res.status(200).json({
    message: "All transcripts deleted successfully",
  });
}
