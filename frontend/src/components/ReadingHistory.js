import React, {useEffect, useState} from 'react';

export default function ReadingHistory({ userId }) {
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}?userId=${userId}`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(json => setReadings(json.readings))
      .catch(console.error);
  }, [userId]);

  return (
    <div>
      <h3>Reading History</h3>
      <ul>
        {readings.map((r,i) => (
          <li key={i}>
            {new Date(r.timestamp).toLocaleTimeString()}: {r.decibel} dB
          </li>
        ))}
      </ul>
    </div>
  );
}
