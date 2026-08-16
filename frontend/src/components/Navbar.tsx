import React from 'react';
import { Sparkles, Heart, User, Search, Scale } from 'lucide-react';

interface NavbarProps {
  activeTab: 'search' | 'wishlist' | 'profile' | 'compare';
  setActiveTab: (tab: 'search' | 'wishlist' | 'profile' | 'compare') => void;
  user: { name: string; isGuest: boolean; email: string | null } | null;
  onLogout: () => void;
}

export default function Navbar({ activeTab, setActiveTab, user, onLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8E3DC] bg-[#FFFDF8]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveTab('search')}
          className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-90"
          id="nav-logo-btn"
        >
          <div className="w-8 h-8 bg-[#B76E79] rounded-sm flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xl font-serif">L</span>
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight text-[#1F1F1F] block leading-none">
              Luxora AI
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] block uppercase font-medium mt-0.5">
              PREMIUM ADVISOR
            </span>
          </div>
        </button>

        {/* Navigation Controls */}
        {user && (
          <div className="flex items-center gap-1 sm:gap-4">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium uppercase tracking-wider transition-all ${
                activeTab === 'search'
                  ? 'border-b-2 border-[#B76E79] text-[#1F1F1F] font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              id="tab-search-btn"
            >
              <Search className="h-3 w-3 text-[#D4AF37]" />
              <span className="hidden sm:inline">Advisor</span>
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium uppercase tracking-wider transition-all ${
                activeTab === 'compare'
                  ? 'border-b-2 border-[#B76E79] text-[#1F1F1F] font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              id="tab-compare-btn"
            >
              <Scale className="h-3 w-3 text-[#D4AF37]" />
              <span className="hidden sm:inline">Compare</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium uppercase tracking-wider transition-all ${
                activeTab === 'wishlist'
                  ? 'border-b-2 border-[#B76E79] text-[#1F1F1F] font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              id="tab-wishlist-btn"
            >
              <Heart className="h-3 w-3 text-[#D4AF37]" />
              <span className="hidden sm:inline">Wishlist</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium uppercase tracking-wider transition-all ${
                activeTab === 'profile'
                  ? 'border-b-2 border-[#B76E79] text-[#1F1F1F] font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              id="tab-profile-btn"
            >
              <User className="h-3 w-3 text-[#D4AF37]" />
              <span className="hidden sm:inline">Profile</span>
            </button>

            {/* Logout/User Pill */}
            <div className="h-4 w-[1px] bg-[#E8E3DC] mx-1 sm:mx-2 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <div className="hidden md:block text-right">
                <span className="text-[11px] font-medium text-[#1F1F1F] block leading-tight">
                  {user.name}
                </span>
                <span className="text-[9px] text-[#D4AF37] block font-mono font-medium">
                  {user.isGuest ? 'GUEST PROFILE' : 'GOLD MEMBER'}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-400 hover:text-[#B76E79] transition-colors px-2 py-1 rounded"
                id="logout-btn"
              >
                Exit
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
