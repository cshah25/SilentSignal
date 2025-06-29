import React, { useEffect, useState, useRef } from 'react';

const THRESHOLD = 50;           // dB threshold for violations
const POLL_INTERVAL_MS = 5000;  // poll every 5 seconds

export default function ReadingHistory({ userId }) {
  const [readings, setReadings] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}?userId=${userId}`);
        const json = await res.json();
        setReadings(Array.isArray(json.readings) ? json.readings : []);
      } catch (err) {
        console.error('Failed to load readings:', err);
        setReadings([]);
      }
    }

    // initial fetch + start polling
    load();
    intervalRef.current = setInterval(load, POLL_INTERVAL_MS);

    // cleanup on unmount
    return () => clearInterval(intervalRef.current);
  }, [userId]);

  // pick out the last 10
  const lastReadings = readings.slice(-10);
  const violationsAll = readings.filter(r => r.decibel > THRESHOLD);
  const lastViolations = violationsAll.slice(-10);

  // we'll render as many rows as the longer of the two lists
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
              return (
                <tr key={i}>
                  <td style={{ padding: '4px', borderTop: '1px solid #eee' }}>
                    {r
                      ? `${new Date(r.timestamp).toLocaleTimeString()}: ${r.decibel} dB`
                      : ''}
                  </td>
                  <td style={{ padding: '4px', borderTop: '1px solid #eee' }}>
                    {v
                      ? `${new Date(v.timestamp).toLocaleTimeString()}: ${v.decibel} dB`
                      : ''}
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
