import React, { useEffect, useState } from 'react';

export default function ReadingHistory({ userId }) {
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}?userId=${userId}`
        );
        const json = await res.json();
        // If the backend returned an error shape or no readings, default to []
        setReadings(Array.isArray(json.readings) ? json.readings : []);
      } catch (err) {
        console.error('Failed to load readings:', err);
        setReadings([]);
      }
    }
    load();
  }, [userId]);

  return (
    <div>
      <h4>Reading History</h4>
      <ul>
        {readings.map((r, i) => (
          <li key={i}>
            {new Date(r.timestamp).toLocaleTimeString()}: {r.decibel} dB
          </li>
        ))}
      </ul>
      {readings.length === 0 && <p>No readings yet.</p>}
    </div>
  );
}
