import React, { useEffect, useRef, useState } from 'react';
import addNotification from 'react-push-notification';
import { Notifications } from 'react-push-notification';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const NOISE_API_URL = process.env.REACT_APP_API_URL;
const THRESHOLD = 60;
const NOTIFY_INTERVAL = 5000;


export default function MicMonitor({ userId }) {
  const [volumeHistory, setVolumeHistory] = useState([]);
  const [status, setStatus] = useState("Waiting for input...");
  const intervalRef = useRef(null);
  const lastNotifyRef = useRef(0);


  function overLimit() {
    addNotification({
      title: "🔊 Mic Warning!",
      message: `Mic seems to be picking up background noise. Consider muting yourself`,
      native: true
    })
  };
  
  useEffect(() => {
    let audioContext;
    let analyser;
    let microphone;
    let javascriptNode;

    async function setupMic() {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphone = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
        javascriptNode.onaudioprocess = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
          const decibels = Math.round((avg / 255) * 100);

          setVolumeHistory(prev => {
            const newData = [...prev, decibels];
            return newData.length > 50 ? newData.slice(-50) : newData;
          });


          // Throttle notifications to once every NOTIFY_INTERVAL ms
          if (
            decibels > THRESHOLD &&
            Date.now() - lastNotifyRef.current > NOTIFY_INTERVAL
          ) {
            overLimit();
            lastNotifyRef.current = Date.now();
          }

          if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
              sendToAPI(userId, decibels);
            }, 3000);
          }
        };


        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);
      } catch (err) {
        console.error("Microphone access denied:", err);
        setStatus("Mic access denied");
      }
    }

    setupMic();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [userId]);

  async function sendToAPI(userId, decibel) {
    try {
      await fetch(NOISE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, decibel })
      });
    } catch (err) {
      console.error("Failed to send data:", err);
    }
  }

  const chartData = {
    labels: volumeHistory.map((_, i) => i),
    datasets: [
      {
        label: 'Mic Volume',
        data: volumeHistory,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3,
        pointRadius: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    animation: false,
    scales: {
      y: {
        min: 0,
        max: 100
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };


  return (
    <div className="p-4 bg-gray-100 rounded shadow">
      <div className="mt-4">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
