import React from 'react';
import { motion } from 'motion/react';
import { Search, Heart, Sliders, History, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';
import { UserProfile, SearchHistoryItem, Product } from '../types';

interface ProfilePageProps {
  user: UserProfile;
  searchHistory: SearchHistoryItem[];
  savedProducts: Product[];
  onUpdatePreferences: (preferences: UserProfile['preferences']) => void;
  onSelectQuery: (query: string) => void;
  onClearHistory: () => void;
  onConvertGuest: () => void;
}

export default function ProfilePage({
  user,
  searchHistory,
  savedProducts,
  onUpdatePreferences,
  onSelectQuery,
  onClearHistory,
  onConvertGuest
}: ProfilePageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="profile-container">
      {/* Visual Title Header block */}
      <div className="mb-8 border-b border-zinc-100 pb-6">
        <span className="text-[10px] tracking-widest font-mono text-[#C5A059] font-bold uppercase block">YOUR ACCOUNT INSIGHTS</span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 mt-1">
          Luxora Personal Cabinet
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm mt-1">
          Modify your artificial intelligence advisor metrics and view search history loops.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Account Status Information */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-[#C5A059] text-white font-serif font-bold text-lg shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-zinc-900 leading-tight">
                  {user.name}
                </h3>
                <span className="text-[10px] font-mono text-zinc-400 font-bold tracking-wider block uppercase mt-0.5">
                  {user.isGuest ? 'Guest Profile' : 'Verified Gold Member'}
                </span>
              </div>
            </div>

            {/* If guest profile, allow converting */}
            {user.isGuest && (
              <div className="p-4 bg-zinc-50 border border-zinc-150 rounded-xl space-y-3">
                <span className="text-[10px] tracking-wide font-bold font-mono text-[#C5A059] uppercase block">Upgrade Membership</span>
                <p className="text-[11px] text-zinc-650 leading-relaxed">
                  Convert your transient guest profile into a full cloud account to sync your wishlists and searches across your laptop, tablet, and smartphone.
                </p>
                <button
                  onClick={onConvertGuest}
                  className="w-full py-2 bg-zinc-950 text-white rounded-lg text-[11px] font-bold tracking-wide hover:bg-[#b38f4d] flex items-center justify-center gap-1.5"
                  id="convert-membership-btn"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  Upgrade to Gold Member
                </button>
              </div>
            )}

            {/* Quick analytics card block */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-center text-zinc-650">
              <div className="p-3 border border-zinc-150 rounded-xl bg-zinc-50/50">
                <span className="block text-xl font-serif font-bold text-zinc-900">
                  {savedProducts.length}
                </span>
                <span className="block text-[8px] font-mono text-zinc-400 uppercase font-semibold mt-1">Saved Wishlist</span>
              </div>
              <div className="p-3 border border-zinc-150 rounded-xl bg-zinc-50/50">
                <span className="block text-xl font-serif font-bold text-zinc-900">
                  {searchHistory.length}
                </span>
                <span className="block text-[8px] font-mono text-zinc-400 uppercase font-semibold mt-1">Consultations</span>
              </div>
            </div>
          </div>

          {/* Secure details disclaimer */}
          <div className="p-4 rounded-xl border border-dashed border-zinc-200 text-zinc-400 font-mono text-[9px] leading-relaxed block shadow-sm">
            Luxora AI honors data secrecy and secure cookies. All guest sessions persist safely in high-performance local client environments.
          </div>
        </div>

        {/* Right column: Search History list and Preferences control panel */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* AI Preferences tuning control panel */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-zinc-100">
              <Sliders className="h-4.5 w-4.5 text-[#C5A059]" />
              <h3 className="font-serif text-base font-bold text-zinc-950">
                AI Personal Shopper Preferences Tuning
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Budget Profile Tuning */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase block">
                  Budget Threshold Setting List
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['budget', 'balanced', 'premium', 'unlimited'] as const).map((pref) => (
                    <button
                      key={pref}
                      onClick={() => onUpdatePreferences({ ...user.preferences, budgetPreference: pref })}
                      className={`py-2.5 px-3 rounded-xl border text-left text-xs font-semibold capitalize relative transition-all ${
                        user.preferences.budgetPreference === pref
                          ? 'border-[#C5A059] bg-[#FCFAF6] text-[#b38f4d] font-bold'
                          : 'border-zinc-150 bg-white text-zinc-650 hover:bg-neutral-50'
                      }`}
                    >
                      {pref}
                      {user.preferences.budgetPreference === pref && (
                        <span className="absolute right-2.5 top-3 h-1.5 w-1.5 rounded-full bg-[#C5A059]"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Preference Tuning */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase block">
                  Curation Mode (Gender Focus)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Unisex', 'Men', 'Women'] as const).map((genderVal) => (
                    <button
                      key={genderVal}
                      onClick={() => onUpdatePreferences({ ...user.preferences, gender: genderVal })}
                      className={`py-2.5 px-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                        user.preferences.gender === genderVal
                          ? 'border-[#C5A059] bg-[#FCFAF6] text-[#b38f4d] font-bold'
                          : 'border-zinc-150 bg-white text-zinc-650 hover:bg-neutral-50'
                      }`}
                    >
                      {genderVal}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Search History */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <History className="h-4.5 w-4.5 text-[#C5A059]" />
                <h3 className="font-serif text-base font-bold text-zinc-950">
                  Search & Advice Queries History Log
                </h3>
              </div>
              {searchHistory.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-[10px] uppercase font-mono text-zinc-400 hover:text-rose-600 hover:font-bold transition-colors"
                  id="btn-clear-history"
                >
                  Clear History List
                </button>
              )}
            </div>

            {searchHistory.length === 0 ? (
              <div className="py-8 text-center text-zinc-400 text-xs">
                No past consultations recorded yet. Start describing products to populate this.
              </div>
            ) : (
              <div className="space-y-3.5">
                {searchHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-zinc-100 rounded-xl hover:bg-zinc-50/50 hover:border-zinc-200 transition-all gap-3"
                  >
                    <div>
                      <div className="flex gap-2 items-center text-left">
                        <span className="font-semibold text-xs text-neutral-900 group-hover:text-[#C5A059]">
                          "{item.query}"
                        </span>
                        {item.category && (
                          <span className="px-1.5 py-0.5 rounded bg-zinc-950 text-white font-mono text-[8px] uppercase tracking-wider">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <span className="block text-[9px] font-mono text-zinc-400 mt-1">
                        Consulted on {new Date(item.timestamp).toLocaleString('en-IN')} • Found {item.recommendationsCount} suggestions
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectQuery(item.query)}
                      className="px-3.5 py-1.5 bg-zinc-950 text-white text-[11px] font-bold rounded-lg hover:bg-zinc-900 active:scale-[0.96] transition-transform text-center shrink-0"
                      id={`btn-reconsult-${item.id}`}
                    >
                      Consult Again
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
