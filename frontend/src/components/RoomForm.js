import React, { useState } from 'react';

export function CreateRoom({ onCreated }) {
  const [loading, setLoading] = useState(false);
  async function create() {
    setLoading(true);
    const res = await fetch(process.env.REACT_APP_VIDEO_API + '/rooms', {
      method:'POST', headers:{'Content-Type':'application/json'}
    });
    const data = await res.json();
    console.log(data);
    setLoading(false);
    onCreated(data);
  }
  return (
    <button onClick={create} disabled={loading}>
      {loading ? 'Creating…' : 'Create Room'}
    </button>
  );
}

export function JoinRoom({ onJoined }) {
  const [roomId,setRoomId] = useState('');
  const [password,setPassword] = useState('');
  const [loading,setLoading] = useState(false);

  async function join() {
    setLoading(true);
    const res = await fetch(
      `${process.env.REACT_APP_VIDEO_API}/rooms/${roomId}/join`,
      {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ roomId, password, userId: 'guest-'+Date.now() })
      }
    );
    const data = await res.json();
    setLoading(false);
    if (res.ok) onJoined(data);
    else alert(data.error);
  }

  return (
    <div>
      <input
        placeholder="Room ID"
        value={roomId}
        onChange={e=>setRoomId(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e=>setPassword(e.target.value)}
      />
      <button onClick={join} disabled={loading || !roomId || !password}>
        {loading ? 'Joining…' : 'Join Room'}
      </button>
    </div>
  );
}
