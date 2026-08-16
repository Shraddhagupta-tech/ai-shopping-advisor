import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Star, Award, ShieldCheck, HelpCircle, LucideIcon } from 'lucide-react';

interface BattleProduct {
  name: string;
  brand: string;
  price: number;
  rating: number;
  metrics: { name: string; score: number }[];
  advantage: string[];
  verdict: string;
}

interface BattlePreset {
  id: string;
  name: string;
  category: string;
  left: BattleProduct;
  right: BattleProduct;
  winner: 'left' | 'right';
  reasoning: string;
}

const PRESET_BATTLES: BattlePreset[] = [
  {
    id: 'battle-1',
    name: '💄 Matte Lipstick Showdown',
    category: 'Beauty',
    left: {
      name: 'Super Stay Matte Ink',
      brand: 'Maybelline',
      price: 699,
      rating: 4.6,
      metrics: [
        { name: 'Longevity (Hours)', score: 98 },
        { name: 'Transfer Resistance', score: 96 },
        { name: 'Comfort Factor', score: 80 },
        { name: 'Value For Money', score: 92 }
      ],
      advantage: ['Unbeatable 16-hour sweat-locked wear', '100% transfer and mask-proof', 'Vibrant solid color payoff'],
      verdict: 'Best for long office sessions and heavy dining events.'
    },
    right: {
      name: 'Matte Melt Liquid Lip',
      brand: 'Lakmé',
      price: 499,
      rating: 4.4,
      metrics: [
        { name: 'Longevity (Hours)', score: 78 },
        { name: 'Transfer Resistance', score: 84 },
        { name: 'Comfort Factor', score: 95 },
        { name: 'Value For Money', score: 88 }
      ],
      advantage: ['Extremely lightweight mousse feel', 'Does not flake or chap lips', 'Includes a double-curved applicator'],
      verdict: 'Best for daily active city transit and casual meetups.'
    },
    winner: 'left',
    reasoning: 'While Lakmé delivers superior comfort and feels slightly lighter on dry lips, the Maybelline Super Stay is the clear champion for longevity, lasting completely intact through humid conditions and heavy meals. If you prefer to set it and forget it, Maybelline takes the crown.'
  },
  {
    id: 'battle-2',
    name: '🧴 Invisible Daily Sunscreen Face Off',
    category: 'Skincare',
    left: {
      name: 'SPF 50 Invisible Sunscreen',
      brand: 'The Minimalist',
      price: 399,
      rating: 4.6,
      metrics: [
        { name: 'Broad Spectrum SPF', score: 98 },
        { name: 'Zero White Cast', score: 99 },
        { name: 'Absorb Time (Sec)', score: 92 },
        { name: 'Acne Safety Level', score: 95 }
      ],
      advantage: ['Absolutely 0% white residue', 'Transparent absorption', 'Hypoallergenic and fragrance-free formulation'],
      verdict: 'Perfect default protector for glowing humid summer days.'
    },
    right: {
      name: 'Hydro Radiance SPF 50',
      brand: 'Forest Essentials',
      price: 2400,
      rating: 4.8,
      metrics: [
        { name: 'Broad Spectrum SPF', score: 94 },
        { name: 'Zero White Cast', score: 85 },
        { name: 'Absorb Time (Sec)', score: 80 },
        { name: 'Acne Safety Level', score: 88 }
      ],
      advantage: ['Enriched with active saffron and Ayurvedic extracts', 'Plush royal glass packaging', 'Highly aromatic cooling sandalswood feel'],
      verdict: 'Best luxurious Ayurvedic botanical prep for dry mature faces.'
    },
    winner: 'left',
    reasoning: 'The Forest Essentials Soundarya Radiance SPF offers unmatched organic luxury, rich hydration and a divine aroma. However, for sheer sunscreen efficiency—incorporating zero white cast, fast absorption, medical safety, and pricing accessible to everyday shoppers—the Minimalist Sunscreen wins. It is highly practical and suited for highly active lifestyles.'
  },
  {
    id: 'battle-3',
    name: '🎧 True Wireless ANC Duel',
    category: 'Audio',
    left: {
      name: 'Aero Buds ANC',
      brand: 'boAt',
      price: 1999,
      rating: 4.4,
      metrics: [
        { name: 'Active Noise Cancellation', score: 82 },
        { name: 'Bass Depth', score: 95 },
        { name: 'Battery Capacity', score: 92 },
        { name: 'Comfort In-Ear', score: 85 }
      ],
      advantage: ['Deep punchy thudding bass signature', 'Aggressive pricing under ₹2000', 'IPX5 sweat-certified design'],
      verdict: 'Best for bass-lovers and high intensity fitness workouts.'
    },
    right: {
      name: 'Nord Buds 3 ANC',
      brand: 'OnePlus',
      price: 2999,
      rating: 4.5,
      metrics: [
        { name: 'Active Noise Cancellation', score: 90 },
        { name: 'Bass Depth', score: 84 },
        { name: 'Battery Capacity', score: 88 },
        { name: 'Comfort In-Ear', score: 94 }
      ],
      advantage: ['Sleek minimal premium design aesthetics', 'Incredible mic voice clear pickup', 'Up to 30dB digital cancellation'],
      verdict: 'Best for seamless multi-device work calls and commuting.'
    },
    winner: 'right',
    reasoning: 'The boAt buds represent a massive value-for-money power move for bass heads looking for heavy workout beats under ₹2000. However, the OnePlus Nord Buds taking the victory here due to their significantly crisper high-frequency clarity, superior 30dB ANC isolation, and more reliable dual-mic pickup for professional Zoom/Teams office communication.'
  }
];

export default function ProductBattle() {
  const [selectedBattleId, setSelectedBattleId] = useState<string>('battle-1');
  const [isFighting, setIsFighting] = useState<boolean>(false);
  const [hasBattled, setHasBattled] = useState<boolean>(false);

  const activeBattle = PRESET_BATTLES.find(b => b.id === selectedBattleId) || PRESET_BATTLES[0];

  const handleSimulateBattle = () => {
    setIsFighting(true);
    setHasBattled(false);
    setTimeout(() => {
      setIsFighting(false);
      setHasBattled(true);
    }, 2800); // 2.8s battle animation
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white border border-[#E8E3DC] rounded-3xl p-6 sm:p-8 shadow-sm" id="battle-simulator">
      {/* Module Title */}
      <div className="flex justify-between items-center pb-4 border-b border-[#E8E3DC] mb-6">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#B76E79]/15 flex items-center justify-center text-[#B76E79]">
            <Swords className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1F1F1F]">⚔️ Product Battle Arena</h3>
            <p className="text-[10px] sm:text-xs text-zinc-400">Put premium favorites head-to-head. Let Luxora AI declare the champion.</p>
          </div>
        </div>
      </div>

      {/* Select active battle preset */}
      <div className="mb-6 bg-white">
        <label className="text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase block mb-2">Select Clash Candidates</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_BATTLES.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setSelectedBattleId(b.id);
                setHasBattled(false);
              }}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold tracking-wide transition-all ${
                selectedBattleId === b.id
                  ? 'border-[#B76E79] bg-[#FFFDF8] text-[#B76E79] font-bold shadow-xs'
                  : 'border-[#E8E3DC] bg-white text-zinc-500 hover:border-zinc-350 hover:bg-zinc-50'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Arena comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center mb-8 relative">
        {/* Left Competitor CARD */}
        <div className="md:col-span-5 border border-[#E8E3DC] rounded-2xl p-5 space-y-4 bg-[#FFFDF8] relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold block">{activeBattle.left.brand}</span>
              <h4 className="font-serif text-base font-bold text-[#1F1F1F] mt-0.5">{activeBattle.left.name}</h4>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold font-mono block text-neutral-900">{formatINR(activeBattle.left.price)}</span>
              <span className="text-[9px] font-mono text-zinc-400">MRP INDIANS</span>
            </div>
          </div>

          {/* Core metrics scales */}
          <div className="space-y-2.5">
            <span className="text-[9px] font-mono font-bold text-zinc-400 block uppercase">ATTRIBUTES SCALE</span>
            {activeBattle.left.metrics.map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[10px] font-medium text-zinc-700">
                  <span>{m.name}</span>
                  <span className="font-mono font-bold">{m.score}/100</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#B76E79] rounded-full" 
                    style={{ width: `${isFighting ? 0 : m.score}%`, transition: 'width 1.5s ease-out' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 pt-3 border-t border-[#E8E3DC]">
            <span className="text-[9px] font-mono font-bold text-zinc-400 block uppercase">Strategic Perks</span>
            <ul className="text-xs text-zinc-650 space-y-1">
              {activeBattle.left.advantage.map((adv, i) => (
                <li key={i} className="flex gap-1">
                  <span className="text-[#B76E79] font-bold">•</span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* VERSUS SIGN */}
        <div className="md:col-span-1 text-center flex flex-col justify-center items-center">
          <motion.div
            animate={isFighting ? { scale: [1, 1.3, 1], rotate: [0, 180, 360] } : {}}
            transition={{ repeat: isFighting ? Infinity : 0, duration: 1 }}
            className={`h-11 w-11 rounded-full flex items-center justify-center font-serif text-sm font-bold font-black tracking-tighter ${
              isFighting ? 'bg-[#B76E79] text-white' : 'bg-zinc-950 text-[#D4AF37] border border-[#D4AF37]/30 shadow-md'
            }`}
          >
            VS
          </motion.div>
        </div>

        {/* Right Competitor CARD */}
        <div className="md:col-span-5 border border-[#E8E3DC] rounded-2xl p-5 space-y-4 bg-[#FFFDF8] relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold block">{activeBattle.right.brand}</span>
              <h4 className="font-serif text-base font-bold text-[#1F1F1F] mt-0.5">{activeBattle.right.name}</h4>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold font-mono block text-neutral-900">{formatINR(activeBattle.right.price)}</span>
              <span className="text-[9px] font-mono text-zinc-400">MRP INDIANS</span>
            </div>
          </div>

          {/* Core metrics scales */}
          <div className="space-y-2.5">
            <span className="text-[9px] font-mono font-bold text-zinc-400 block uppercase">ATTRIBUTES SCALE</span>
            {activeBattle.right.metrics.map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[10px] font-medium text-zinc-700">
                  <span>{m.name}</span>
                  <span className="font-mono font-bold">{m.score}/100</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#D4AF37] rounded-full" 
                    style={{ width: `${isFighting ? 0 : m.score}%`, transition: 'width 1.5s ease-out' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 pt-3 border-t border-[#E8E3DC]">
            <span className="text-[9px] font-mono font-bold text-zinc-400 block uppercase">Strategic Perks</span>
            <ul className="text-xs text-zinc-650 space-y-1">
              {activeBattle.right.advantage.map((adv, i) => (
                <li key={i} className="flex gap-1">
                  <span className="text-[#D4AF37] font-bold">•</span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Simulation Trigger Button */}
      {!isFighting && !hasBattled && (
        <button
          onClick={handleSimulateBattle}
          className="w-full py-3.5 bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-900 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 border border-[#D4AF37]/25"
          id="btn-trigger-battle"
        >
          <Swords className="h-4.5 w-4.5 text-[#D4AF37]" />
          Commence Battle Analysis
        </button>
      )}

      {/* Fight Processing Loader State */}
      <AnimatePresence>
        {isFighting && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-8 text-center bg-[#FFFDF8] border border-[#E8E3DC] rounded-2xl relative overflow-hidden space-y-3"
            id="battle-fighting-curtain"
          >
            <div className="absolute top-0 left-0 h-1 bg-[#D4AF37]/10 w-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#B76E79] to-[#D4AF37] w-1/3 rounded-full animate-infinite-loading"></div>
            </div>
            <Swords className="h-7 w-7 text-[#B76E79] animate-bounce mx-auto" />
            <h4 className="font-serif text-sm font-bold text-zinc-900">Comparing ingredient layouts, price history tables & regional performance metrics...</h4>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Luxora Dynamic Core Sync Active</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Display result banner & verdict */}
      <AnimatePresence>
        {hasBattled && !isFighting && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-zinc-950 text-white rounded-2xl shadow-xl space-y-4 border border-[#D4AF37]/35 relative"
            id="battle-result"
          >
            <div className="absolute top-4 right-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase">
              BATTLE CONCLUDED
            </div>

            <div className="flex items-center gap-2">
              <Award className="h-5.5 w-5.5 text-[#D4AF37] shrink-0" />
              <div>
                <span className="text-[9px] tracking-widest font-mono text-[#D4AF37] uppercase font-bold block">AI RECOGNIZED WINNER</span>
                <h4 className="text-base font-serif font-black tracking-wide text-white">
                  {activeBattle.winner === 'left' 
                    ? `${activeBattle.left.brand} ${activeBattle.left.name}`
                    : `${activeBattle.right.brand} ${activeBattle.right.name}`
                  } 🏆
                </h4>
              </div>
            </div>

            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed italic">
              "{activeBattle.reasoning}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800 text-xs font-sans">
              <div className="space-y-1.5 p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="font-mono text-[9px] text-[#B76E79] uppercase font-bold block">Left Pick Verdict</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">{activeBattle.left.verdict}</p>
              </div>
              <div className="space-y-1.5 p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="font-mono text-[9px] text-[#D4AF37] uppercase font-bold block">Right Pick Verdict</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">{activeBattle.right.verdict}</p>
              </div>
            </div>

            <button
              onClick={() => setHasBattled(false)}
              className="mt-2 text-center w-full text-[10px] font-mono font-bold text-zinc-400 hover:text-white uppercase transition-colors"
            >
              Reset Battle Arena
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
