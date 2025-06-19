import React from 'react';
import MicMonitor from './components/MicMonitor';
import ReadingHistory from './components/ReadingHistory';

function App() {
  const userId = "rayu";

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Silent Signal – Real-Time Noise Monitor</h1>
      <MicMonitor userId={userId} />
      <ReadingHistory userId={userId} />
    </div>
  );
}

export default App;
