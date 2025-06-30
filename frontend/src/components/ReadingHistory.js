import React, { useEffect, useState, useRef } from 'react';

const THRESHOLD = 40;           // dB threshold
const POLL_INTERVAL_MS = 5000;        // refresh every 5 seconds
const REACT_APP_API_URL = process.env.REACT_APP_API_URL

export default function ReadingHistory({ userId }) {
  const [readings, setReadings] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `${REACT_APP_API_URL}/readings?userId=${userId}`
        );

        if (res.status === 404) {
          setReadings([]);
          return;
        }
        if (!res.ok) throw new Error(`Status ${res.status}`);

        const json = await res.json();
        setReadings(Array.isArray(json.readings) ? json.readings : []);
      } catch (err) {
        console.error('Failed to load readings:', err);
        setReadings([]);
      }
    }

    load();
    intervalRef.current = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [userId]);

  const lastReadings = readings.slice(-10);
  const lastViolations = readings
    .filter(r => r.decibel > THRESHOLD)
    .slice(-10);

  const rowCount = Math.max(lastReadings.length, lastViolations.length);

  return (
    <div>
      <h4>Reading History</h4>
      {readings.length === 0 ? (
        <p>No readings yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '4px' }}>
                Last 10 Readings
              </th>
              <th style={{ textAlign: 'left', padding: '4px' }}>
                Last 10 Violations (&gt; {THRESHOLD} dB)
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }).map((_, i) => {
              const r = lastReadings[i];
              const v = lastViolations[i];

              const formatLocalTime = (ts) => {
                return new Date(new Date(ts).getTime() - new Date().getTimezoneOffset() * 60000)
                  .toLocaleTimeString();
              };

              return (
                <tr key={i}>
                  <td style={{ padding: '4px', borderTop: '1px solid #eee' }}>
                    {r ? `${formatLocalTime(r.timestamp)}: ${r.decibel} dB` : ''}
                  </td>
                  <td style={{ padding: '4px', borderTop: '1px solid #eee' }}>
                    {v ? `${formatLocalTime(v.timestamp)}: ${v.decibel} dB` : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      )}
    </div>
  );
}
