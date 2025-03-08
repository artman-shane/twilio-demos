export async function POST(req) {
  // console.log(req);
  try {
    const data = await req.json();
    const surveyResponse = {
      sessionId: data.sessionId,
      userID: data.userID,
      question: data.question,
      questionTopic: data.questionTopic,
      customerSatisfaction: data.customerSatisfaction,
      response: data.response,
      summaryResponse: data.summaryResponse,
    };
    const surveyResponses = [];
    // Log the survey response centrally (for now, just log to console)
    console.log("Received survey response:", surveyResponse);

    surveyResponses.push(surveyResponse);

    return new Response("Successfully logged response", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to log response" }), {
      status: 500,
    });
  }
}
