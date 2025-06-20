import React, { useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import Logo from "../components/Logo";
import PaddingContainer from "../components/PaddingContainer";

export default function Header({ userID }) {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <PaddingContainer>
            <Logo />
          </PaddingContainer>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 focus:outline-none">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-gray-700">
          {["dashboard\n", "rooms\n", "leaderboard\n", "settings\n"].map((page) => (
            <a
              key={page}
              href={`/${page}`}
              className="block font-medium hover:text-blue-600 capitalize"
              onClick={() => setIsMenuOpen(false)} // Auto-close on click
            >
              {page}
            </a>
          ))}

          {/* Mobile user info + logout */}
          <div className="mt-4 border-t pt-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User size={16} />
              {userID}
            </div>
            <a href="/logout" className="block mt-2 text-sm text-gray-700 hover:text-red-500">
              <LogOut size={14} className="inline mr-1" />
              Logout
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
