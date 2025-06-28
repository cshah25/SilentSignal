import React from 'react';
import '../styles/landingPage.css';
export default function Header() {
  return (
    <header className="header-2">
      <div className="block-3">
        <div className="logo-4">
          <img
            src="/logo.png"
            alt="Silent Signal Logo"
            className="logo-image"
          />
        </div>
      </div>

      <nav className="navigation-pill-list-6">
        <a href="#dashboard" className="navigation-pill-7 text-8 text-rgb-30-30-30">
          Dashboard
        </a>
        <a href="#home" className="navigation-pill-9 text-10 text-rgb-30-30-30">
          Home Page
        </a>
        <a href="#about" className="navigation-pill-11 text-12 text-rgb-30-30-30">
          About Us
        </a>
      </nav>
    </header>
  );
}
