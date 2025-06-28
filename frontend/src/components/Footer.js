import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 p-8 text-sm">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div>
          <p className="font-semibold mb-1">Use cases</p>
          <p>A small paragraph of how this can be useful</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Resources</p>
          <ul className="space-y-1">
            <li><a href="#" className="text-blue-600">Github Page</a></li>
            <li><a href="#" className="text-blue-600">Support</a></li>
            <li><a href="#" className="text-blue-600">Developers</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
