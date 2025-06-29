import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './Pages/LandingPage';
import Dashboard from './Pages/Dashboard';
import AboutUs from './Pages/About';
function App() {
  const userId = "rayu"; // You can make this dynamic later

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
