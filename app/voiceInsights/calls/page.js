'use client';

import { useEffect, useState } from 'react';

export default function VoiceInsightsCallsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/voiceInsights/calls')
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setData(res.data);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Voice Insights: Call Logs</h1>

      {loading ? (
        <p>Loading call data...</p>
      ) : (
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2 border">Phone Number</th>
              <th className="px-4 py-2 border">Inbound Calls</th>
              <th className="px-4 py-2 border">Outbound Calls</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{row.phoneNumber}</td>
                <td className="px-4 py-2 border">{row.inboundCount}</td>
                <td className="px-4 py-2 border">{row.outboundCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}