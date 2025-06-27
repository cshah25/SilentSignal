// src/components/ReadingHistory.js
import React, { useEffect, useState } from 'react';

const READINGS_API_URL = process.env.REACT_APP_READINGS_URL;

export default function ReadingHistory({ userId }) {
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    fetch(`${READINGS_API_URL}?userId=${userId}`)
      .then(res => res.json())
      .then(json => setReadings(json.readings))
      .catch(console.error);
  }, [userId]);

  return (
    <div>
      <h3>Reading History</h3>
      <ul>
        {readings.map((r, i) => (
          <li key={i}>
            {new Date(r.timestamp).toLocaleTimeString()}: {r.decibel} dB
          </li>
        ))}
      </ul>
    </div>
  );
}
