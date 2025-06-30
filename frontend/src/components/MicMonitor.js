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

const THRESHOLD = 40;
const SEND_INTERVAL_MS = 5000;
const NOTIFY_INTERVAL_MS = 10000;
const CLASSIFY_API_URL = "http://localhost:6969/classify";

export default function MicMonitor({ userId }) {
  const [volume, setVolume] = useState(0);
  const [status, setStatus] = useState('Waiting for input…');
  const [history, setHistory] = useState([]);

  const lastSendRef = useRef(0);
  const lastNotifyRef = useRef(0);
  const prevAboveRef = useRef(false);

  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const scriptNodeRef = useRef(null);
  const micStreamRef = useRef(null);

  useEffect(() => {
    async function setupMic() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        audioCtxRef.current = audioCtx;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyserRef.current = analyser;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        const scriptNode = audioCtx.createScriptProcessor(2048, 1, 1);
        scriptNodeRef.current = scriptNode;
        analyser.connect(scriptNode);

        scriptNode.onaudioprocess = () => {
          const dataArray = dataArrayRef.current;
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((sum, v) => sum + v, 0) / bufferLength;
          const db = Math.round((avg / 255) * 100);

          setVolume(db);
          setStatus(db > THRESHOLD ? '🔊 Too Loud!' : '✔️ You’re good');
          setHistory(prev => {
            const next = [...prev, db];
            return next.length > 50 ? next.slice(-50) : next;
          });

          const now = Date.now();
          const above = db > THRESHOLD;

          if (above && !prevAboveRef.current) {
            lastSendRef.current = now;
          }

          if (now - lastSendRef.current >= SEND_INTERVAL_MS) {
            sendToAPI(userId, db);
            lastSendRef.current = now;
          }

          if (above && now - lastNotifyRef.current >= NOTIFY_INTERVAL_MS) {
            triggerAudioClassification();
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
      scriptNodeRef.current?.disconnect();
      analyserRef.current?.disconnect();
      audioCtxRef.current?.close();
      micStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [userId]);

  async function sendToAPI(userId, decibel) {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/noise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, decibel })
      });
      if (!res.ok) console.error('API error', res.status, await res.text());
    } catch (err) {
      console.error('Failed to send data:', err);
    }
  }

  async function triggerAudioClassification() {
    try {
      const chunks = [];
      const recorder = new MediaRecorder(micStreamRef.current);
      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = reader.result.split(',')[1];
          const res = await fetch(CLASSIFY_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio: base64Audio })
          });
          const data = await res.json();
          const label = data.label || 'Unknown noise';

          var label_split = label.split(',');
          var detected = label_split[label_split.length - 1];
          detected = detected.toLowerCase() === "whale vocalization" ? "Instrument" : detected;

          addNotification({
            title: '🔊 Mic seems high',
            message: `Consider muting the microphone\nDetected: ${detected}.\n `,
            native: true
          });
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();
      setTimeout(() => recorder.stop(), 1000);
    } catch (err) {
      console.error('Audio classification error:', err);
    }
  }

  const chartData = {
    labels: history.map((_, i) => i),
    datasets: [{
      label: 'Mic Volume',
      data: history,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.3,
      pointRadius: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    animation: false,
    scales: {
      y: { min: 0, max: 100 }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <Notifications />
      <h4><strong>Mic Volume Monitor</strong></h4>
      <div style={{ fontSize: '1.1rem' }}>Volume: {volume} dB</div>
      <div>{status}</div>
      <div style={{ marginTop: '1rem' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}