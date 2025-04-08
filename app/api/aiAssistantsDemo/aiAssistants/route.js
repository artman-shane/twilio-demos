import dotenv from "dotenv";
dotenv.config();

export async function POST(req) {
  try {
    console.log("Connecting to bot");
    const body = await req.json();
    console.log("identity: ", body.identity);
    console.log("session_id: ", body.session_id);
    console.log("message: ", body.message);
    // DiffCust
    // "https://assistants.twilio.com/v1/Assistants/aia_asst_019321b2-d23f-7b89-9af1-38e569eec609/Messages",
    // "https://assistants.twilio.com/v1/Assistants/aia_asst_0195053d-982a-792c-afbf-54b5c8ffef4c/Messages",
    const response = await fetch(
    "https://assistants.twilio.com/v1/Assistants/aia_asst_019321b2-d23f-7b89-9af1-38e569eec609/Messages",
    {
        method: "POST",
        body: JSON.stringify({
          identity: body.identity,
          session_id: body.session_id,
          body: body.message, // Assuming the message is sent in the request body
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.ACCOUNT_SID}:${process.env.AUTH_TOKEN}`
          ).toString("base64")}`,
        },
      }
    );
    // console.log("Response: ", response);

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ error: "Failed to send message to Twilio" }),
      { status: 500 }
    );
  }
}
