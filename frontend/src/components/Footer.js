import React from 'react';
import '../styles/landingPage.css'

export default function Footer() {
  return (
    <footer className="bg-gray-100 p-8 text-sm">
    <div class="footer-70">
      <div class="title-71">
        <div class="figma-72">
          <img src="/logo.png" class="icon-73" alt="icon" />
        </div>
      </div>
      <div class="text-link-list-74">
        <div class="title-75">
          <div class="text-strong-76">
            <p class="text-77"><span class="text-rgb-30-30-30">Use cases</span></p>
          </div>
        </div>
        <p class="text-78"><span class="text-rgb-117-117-117">A small paragraph of how this can be useful</span></p>
      </div>
      <div class="text-link-list-79">
        <div class="title-80">
          <div class="text-strong-81">
            <p class="text-82"><span class="text-rgb-30-30-30">Resources</span></p>
          </div>
        </div>
        <div class="text-link-list-item-83">
          <p class="text-84"><a href='https://github.com/cshah25/SilentSignal/' target="_blank" class="text-rgb-30-30-30">Github Page</a></p>
        </div>
        <div class="text-link-list-item-85">
          <p class="text-86"><a href='https://github.com/cshah25/SilentSignal/wiki' target="_blank" class="text-rgb-30-30-30">Support</a></p>
        </div>
        <div class="text-link-list-item-87">
          <p class="text-88"><a href='/developers' class="text-rgb-30-30-30">Developers</a></p>
        </div>
      </div>
    </div>
    </footer>
  );
}
