// app/voiceInsights/page.js
export default function VoiceInsightsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Twilio Voice Insights</h1>
      <p className="mb-4">
        Twilio Voice Insights provides deep visibility into your voice call performance and behavior.
        It helps developers and operations teams diagnose and troubleshoot issues with real-time and historical data.
      </p>
      <ul className="list-disc ml-6">
        <li>Track call metrics like jitter, latency, and packet loss</li>
        <li>Analyze call paths and SIP signaling</li>
        <li>Improve call quality across networks</li>
        <li>Integrate with Twilio's APIs for automated monitoring</li>
      </ul>
    </div>
  );
}