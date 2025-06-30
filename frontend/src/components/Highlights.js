import React from 'react';
import '../styles/landingPage.css';

export default function Highlights() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-white">
      <div class="panel-image-double-20">
        <img src="images/loudest.png" class="image-21" alt="image" />
        <img src="images/quitests.png" class="image-22" alt="image" />
      </div>
    </section>
  );
}
