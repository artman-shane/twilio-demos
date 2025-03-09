import dotenv from "dotenv";
dotenv.config();

export async function POST(req) {
  try {
    const body = await req.json();
    const response = await fetch(
      "https://assistants.twilio.com/v1/Assistants/aia_asst_0195053d-982a-792c-afbf-54b5c8ffef4c/Messages",
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
