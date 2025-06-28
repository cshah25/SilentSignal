import React from 'react';
import MicMonitor from './components/MicMonitor';
import ReadingHistory from './components/ReadingHistory';
import AudioRecorder from './components/AudioRecorder';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Highlights from './components/Highlights';
import InfoSection from './components/InfoSection';
import Footer from './components/Footer';

function App() {
  const userId = "rayu"; // You can make this dynamic later

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      {/* <h1 className="text-2xl font-bold mb-4">Silent Signal – Real-Time Noise Monitor</h1> */}
      <Header />
      <HeroSection />
      <Highlights />
      <InfoSection />
      <Footer />

      <MicMonitor userId={userId} />
      <ReadingHistory userId={userId} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Sound Type Classifier</h2>
        <AudioRecorder />
      </div>
    </div>
  );
}

export default App;
