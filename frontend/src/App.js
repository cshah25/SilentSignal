// src/App.js
import React, { useState } from 'react';
import VideoCall from './components/VideoCall';

const API_BASE = process.env.REACT_APP_VIDEO_API;

export default function App() {
  const [roomData, setRoomData] = useState(null);   // host sees this
  const [joinData, setJoinData] = useState(null);   // both host & guest
  const [joinForm, setJoinForm] = useState({ roomId:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Host creates a room
  async function createRoom() {
    setError(''); setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/rooms`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body:'{}'
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error||res.statusText);
      setRoomData(json);
    } catch(e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Common joinRoom for BOTH host & guest:
  async function joinRoom(roomId, password, userId) {
    setError(''); setLoading(true);
    try {
      const res  = await fetch(
        `${API_BASE}/rooms/${roomId}/join`, {
          method:'POST',
          headers:{ 'Content-Type':'application/json' },
          body: JSON.stringify({ roomId, password, userId })
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error||res.statusText);

      // NOW we use the meeting object returned by the join endpoint!
      setJoinData({ meeting: json.meeting, attendee: json.attendee });
    } catch(e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Once joined, show the call
  if (joinData) {
    return (
      <div style={{ padding:20 }}>
        <h2>Video Call</h2>
        <VideoCall
          meeting={joinData.meeting}
          attendee={joinData.attendee}
        />
      </div>
    );
  }

  // Otherwise show Create + Join UI
  return (
    <div style={{ padding:20, maxWidth:400, margin:'auto' }}>
      <h1>Silent Signal Rooms</h1>

      <section style={{ marginBottom:30 }}>
        <h2>Host: Create Room</h2>
        <button onClick={createRoom} disabled={loading}>
          {loading ? 'Working…' : 'Create Room'}
        </button>
        {roomData && (
          <div style={{ marginTop:10 }}>
            <div>Room ID: <code>{roomData.roomId}</code></div>
            <div>Password: <code>{roomData.password}</code></div>
            <button
              onClick={() =>
                joinRoom(
                  roomData.roomId,
                  roomData.password,
                  `host-${Date.now()}`
                )
              }
              disabled={loading}
              style={{ marginTop:8 }}
            >
              Join as Host
            </button>
          </div>
        )}
      </section>

      <section>
        <h2>Guest: Join Room</h2>
        <input
          placeholder="Room ID"
          value={joinForm.roomId}
          onChange={e => setJoinForm({ ...joinForm, roomId: e.target.value })}
          style={{ width:'100%', padding:8, marginBottom:8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={joinForm.password}
          onChange={e => setJoinForm({ ...joinForm, password: e.target.value })}
          style={{ width:'100%', padding:8, marginBottom:8 }}
        />
        <button
          onClick={() =>
            joinRoom(
              joinForm.roomId,
              joinForm.password,
              `guest-${Date.now()}`
            )
          }
          disabled={loading || !joinForm.roomId || !joinForm.password}
          style={{ width:'100%' }}
        >
          {loading ? 'Joining…' : 'Join Room'}
        </button>
      </section>

      {error && <p style={{ color:'red', marginTop:20 }}>Error: {error}</p>}
    </div>
  );
}
