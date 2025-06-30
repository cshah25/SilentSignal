import React from 'react';
import '../styles/landingPage.css'
import { Info } from 'lucide-react';
const cards = new Array(6).fill(null);

export default function InfoSection() {
  return (
    <section className="p-8 bg-white">
      <div class="card-grid-icon-23">
        <div class="text-content-heading-24">
          <p class="text-25"><span class="text-rgb-30-30-30">Make Something Up for this</span></p>
          <p class="text-26"><span class="text-rgb-117-117-117">Something like about the developers or details on how the
            app works</span></p>
        </div>
        <div class="cards-27">
          <div class="card-49">
            <div class="info-50">
              <Info />
            </div>
            <div class="body-52">
              <div class="text-53">
                <p class="text-54"><span class="text-rgb-30-30-30">Title</span></p>
                <p class="text-55"><span class="text-rgb-117-117-117">Body text for whatever you’d like to say. Add main
                  takeaway points, quotes, anecdotes, or even a very very short story. </span></p>
              </div>
            </div>
          </div>
          <div class="card-56">
            <div class="info-57">
              <Info />
            </div>
            <div class="body-59">
              <div class="text-60">
                <p class="text-61"><span class="text-rgb-30-30-30">Title</span></p>
                <p class="text-62"><span class="text-rgb-117-117-117">Body text for whatever you’d like to say. Add main
                  takeaway points, quotes, anecdotes, or even a very very short story. </span></p>
              </div>
            </div>
          </div>
          <div class="card-63">
            <div class="info-64">
              <Info />
            </div>
            <div class="body-66">
              <div class="text-67">
                <p class="text-68"><span class="text-rgb-30-30-30">Title</span></p>
                <p class="text-69"><span class="text-rgb-117-117-117">Body text for whatever you’d like to say. Add main
                  takeaway points, quotes, anecdotes, or even a very very short story. </span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
