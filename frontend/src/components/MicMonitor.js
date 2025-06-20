// src/components/MicMonitor.js
import React, { useEffect, useRef, useState } from 'react';
import PaddingContainer from './PaddingContainer';

const THRESHOLD = 50;          // dB threshold
const SEND_INTERVAL_MS = 5000; // 5 seconds
export default function MicMonitor({ userId }) {
  const [volume, setVolume] = useState(0);
  const [status, setStatus] = useState('Waiting for input…');

  const lastSentRef = useRef(0);

  const audioCtxRef   = useRef(null);
  const analyserRef   = useRef(null);
  const dataArrayRef  = useRef(null);
  const scriptNodeRef = useRef(null);

  useEffect(() => {
    async function setupMic() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        audioCtxRef.current = audioCtx;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioCtx.createMediaStreamSource(stream);

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyserRef.current = analyser;
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        const scriptNode = audioCtx.createScriptProcessor(2048, 1, 1);
        scriptNodeRef.current = scriptNode;
        analyser.connect(scriptNode);
        scriptNode.connect(audioCtx.destination);

        scriptNode.onaudioprocess = () => {
          const dataArray = dataArrayRef.current;
          analyser.getByteFrequencyData(dataArray);

          const avg = dataArray.reduce((sum, v) => sum + v, 0) / bufferLength;
          const decibels = Math.round((avg / 255) * 100);
          setVolume(decibels);
          setStatus(decibels > THRESHOLD ? '🔊 Too Loud!' : '✔️ You’re good');

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
    <div style={{ fontFamily: 'sans-serif' }}>
      <h4><strong>Mic Volume Monitor</strong></h4>
      <PaddingContainer>
        <div style={{ fontSize: '1.1rem' }}>
          Volume: {volume} dB
        </div>
        <div>{status}</div>
      </PaddingContainer>
    </div>
  );
}
