import React from 'react';
import { Info } from 'lucide-react';
const cards = new Array(6).fill(null);

export default function InfoSection() {
  return (
    <section className="p-8 bg-white">
      <h2 className="text-xl font-semibold mb-2">Make Something Up for this</h2>
      <p className="mb-8 text-gray-600">Something like about the developers or how the app works</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((_, i) => (
          <div key={i} className="border p-4 rounded shadow-sm">
            <Info className="w-6 h-6 mb-2 text-blue-500" />
            <h3 className="font-semibold mb-1">Title</h3>
            <p className="text-sm text-gray-600">
              Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
