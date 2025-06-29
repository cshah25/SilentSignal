import React, { useEffect, useRef, useState } from 'react';
import addNotification, { Notifications } from 'react-push-notification';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const THRESHOLD          = 30;    // dB threshold
const SEND_INTERVAL_MS   = 5000;  // send data at least every 5 seconds
const NOTIFY_INTERVAL_MS = 10000; // notify at most every 10 seconds

export default function MicMonitor({ userId }) {
  const [volume, setVolume]         = useState(0);
  const [status, setStatus]         = useState('Waiting for input…');
  const [history, setHistory]       = useState([]);

  const lastSendRef    = useRef(0);
  const lastNotifyRef  = useRef(0);
  const prevAboveRef   = useRef(false);

  const audioCtxRef    = useRef(null);
  const analyserRef    = useRef(null);
  const dataArrayRef   = useRef(null);
  const scriptNodeRef  = useRef(null);

  useEffect(() => {
    async function setupMic() {
      try {
        // 1) set up audio context & analyser
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx     = new AudioContext();
        audioCtxRef.current = audioCtx;

        const analyser     = audioCtx.createAnalyser();
        analyser.fftSize   = 512;
        analyserRef.current = analyser;

        // 2) connect mic → analyser
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        // 3) prepare buffer for frequency data
        const bufferLength     = analyser.frequencyBinCount;
        dataArrayRef.current   = new Uint8Array(bufferLength);

        // 4) script processor to read audio frames
        const scriptNode       = audioCtx.createScriptProcessor(2048, 1, 1);
        scriptNodeRef.current  = scriptNode;
        analyser.connect(scriptNode);
        scriptNode.connect(audioCtx.destination);

        scriptNode.onaudioprocess = () => {
          const dataArray = dataArrayRef.current;
          analyser.getByteFrequencyData(dataArray);

          // compute “dB” as avg of 0–255 → 0–100
          const avg = dataArray.reduce((sum, v) => sum + v, 0) / bufferLength;
          const db  = Math.round((avg / 255) * 100);

          setVolume(db);
          setStatus(db > THRESHOLD ? '🔊 Too Loud!' : '✔️ You’re good');

          // update chart history (last 50 readings)
          setHistory(prev => {
            const next = [...prev, db];
            return next.length > 50 ? next.slice(-50) : next;
          });

          const now   = Date.now();
          const above = db > THRESHOLD;

          // 1) send immediately on threshold crossing
          if (above && !prevAboveRef.current) {
            sendToAPI(userId, db);
            lastSendRef.current = now;
          }

          // 2) send every SEND_INTERVAL_MS
          if (now - lastSendRef.current >= SEND_INTERVAL_MS) {
            sendToAPI(userId, db);
            lastSendRef.current = now;
          }

          // 3) notify on threshold (throttled)
          if (above && now - lastNotifyRef.current >= NOTIFY_INTERVAL_MS) {
            addNotification({
              title:   '🔊 Mic Warning!',
              message: 'Background noise is high—consider muting yourself.',
              native:  true
            });
            lastNotifyRef.current = now;
          }

          prevAboveRef.current = above;
        };
      } catch (err) {
        console.error('Mic init failed:', err);
        setStatus('Mic access denied');
      }
    }

    setupMic();

    return () => {
      // cleanup Web Audio nodes & context
      scriptNodeRef.current && scriptNodeRef.current.disconnect();
      analyserRef.current   && analyserRef.current.disconnect();
      audioCtxRef.current   && audioCtxRef.current.close();
    };
  }, [userId]);

  async function sendToAPI(userId, decibel) {
    try {
      const res = await fetch(process.env.REACT_APP_API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ userId, decibel })
      });
      if (!res.ok) {
        console.error('API error', res.status, await res.text());
      }
    } catch (err) {
      console.error('Failed to send data:', err);
    }
  }

  // prepare Line chart data & options
  const chartData = {
    labels: history.map((_, i) => i),
    datasets: [{
      label:       'Mic Volume',
      data:        history,
      fill:        false,
      borderColor: 'rgb(75, 192, 192)',
      tension:     0.3,
      pointRadius: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    animation:  false,
    scales: {
      y: { min: 0, max: 100 }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Notifications container */}
      <Notifications />

      <h4><strong>Mic Volume Monitor</strong></h4>
        <div style={{ fontSize: '1.1rem' }}>
          Volume: {volume} dB
        </div>
        <div>{status}</div>
        <div style={{ marginTop: '1rem' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
    </div>
  );
}
