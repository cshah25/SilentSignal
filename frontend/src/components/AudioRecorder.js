// src/components/AudioRecorder.js
import React, { useRef, useState } from "react";

const CLASSIFY_API_URL = process.env.REACT_APP_CLASSIFY_URL;

function AudioRecorder() {
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("");

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const reader = new FileReader();

        reader.onloadend = async () => {
          const base64Audio = reader.result.split(',')[1];

          setStatus("Sending audio...");
          const res = await fetch(CLASSIFY_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audio: base64Audio }),
          });

          const data = await res.json();
          setStatus(`Prediction: ${data.label || "Error"}`);
        };

        reader.readAsDataURL(audioBlob);
      };

      mediaRecorderRef.current.start();
      setStatus("Recording...");
      setTimeout(() => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }, 2000);

      setIsRecording(true);
    } catch (err) {
      console.error("Mic access error:", err);
      setStatus("Mic access denied.");
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        {isRecording ? "Recording..." : "Record & Classify"}
      </button>
      <p>{status}</p>
    </div>
  );
}

export default AudioRecorder;
