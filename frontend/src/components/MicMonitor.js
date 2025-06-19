// src/components/MicMonitor.js
import React, { useEffect, useRef, useState } from 'react';

const THRESHOLD = 50;          // dB threshold
const SEND_INTERVAL_MS = 5000; // 5 seconds

export default function MicMonitor({ userId }) {
  const [volume, setVolume] = useState(0);
  const [status, setStatus] = useState('Waiting for input…');

  // last time we sent a POST
  const lastSentRef = useRef(0);

  // audio/WebAudio refs — MUST be top-level Hooks
  const audioCtxRef   = useRef(null);
  const analyserRef   = useRef(null);
  const dataArrayRef  = useRef(null);
  const scriptNodeRef = useRef(null);

  useEffect(() => {
    async function setupMic() {
      try {
        // 1) create AudioContext
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        audioCtxRef.current = audioCtx;

        // 2) get mic input
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioCtx.createMediaStreamSource(stream);

        // 3) create analyser
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyserRef.current = analyser;
        source.connect(analyser);

        // 4) buffer to hold frequency data
        const bufferLength = analyser.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        // 5) create scriptProcessor to tap into audio pipeline
        const scriptNode = audioCtx.createScriptProcessor(2048, 1, 1);
        scriptNodeRef.current = scriptNode;
        analyser.connect(scriptNode);
        scriptNode.connect(audioCtx.destination);

        // 6) on each audio frame...
        scriptNode.onaudioprocess = () => {
          const dataArray = dataArrayRef.current;
          analyser.getByteFrequencyData(dataArray);

          // compute average magnitude (0–255) → map to 0–100
          const avg = dataArray.reduce((sum, v) => sum + v, 0) / bufferLength;
          const decibels = Math.round((avg / 255) * 100);
          setVolume(decibels);
          setStatus(decibels > THRESHOLD ? '🔊 Too Loud!' : '✔️ You’re good');

          // throttle to once every SEND_INTERVAL_MS
          const now = Date.now();
          if (decibels > THRESHOLD && now - lastSentRef.current >= SEND_INTERVAL_MS) {
            lastSentRef.current = now;
            sendToAPI(userId, decibels);
          }
        };
      } catch (err) {
        console.error('Mic init failed:', err);
        setStatus('Mic access denied');
      }
    }

    setupMic();

    return () => {
      // cleanup all Web Audio nodes & context
      scriptNodeRef.current && scriptNodeRef.current.disconnect();
      analyserRef.current   && analyserRef.current.disconnect();
      audioCtxRef.current   && audioCtxRef.current.close();
    };
  }, [userId]);

  async function sendToAPI(userId, decibel) {
    try {
      const res = await fetch(process.env.REACT_APP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, decibel })
      });
      if (!res.ok) {
        console.error('API error', res.status, await res.text());
      }
    } catch (err) {
      console.error('Failed to send data:', err);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>Mic Volume Monitor</h2>
      <div style={{ fontSize: '1.5rem' }}>
        Volume: {volume} dB
      </div>
      <div>{status}</div>
    </div>
  );
}
