import React from 'react';
import { Sparkles, TrendingDown, Clock, ShieldCheck } from 'lucide-react';

interface PriceHistoryChartProps {
  productName: string;
  currentPrice: number;
}

export default function PriceHistoryChart({ productName, currentPrice }: PriceHistoryChartProps) {
  // Generate stable mock price history coordinates based on product name/price
  const lowestPrice = Math.floor(currentPrice * 0.88);
  const highestPrice = Math.floor(currentPrice * 1.12);
  const isGoodTimeToBuy = currentPrice <= Math.floor(lowestPrice * 1.10);

  // Sparkline coordinates for a beautiful wave
  // SVG size is 350 x 80
  const points = [
    { x: 10, y: 70, label: '3 months ago', price: Math.floor(currentPrice * 1.08) },
    { x: 70, y: 30, label: '2 months ago', price: Math.floor(currentPrice * 1.12) },
    { x: 140, y: 65, label: '1 month ago', price: Math.floor(currentPrice * 1.02) },
    { x: 210, y: 75, label: '15 days ago', price: Math.floor(currentPrice * 0.88) },
    { x: 280, y: 55, label: '7 days ago', price: Math.floor(currentPrice * 0.94) },
    { x: 340, y: 58, label: 'Today', price: currentPrice }
  ];

  const polylinePath = points.map(p => `${p.x},${p.y}`).join(' ');

  // SVG Area filling path (needs matching background gradient)
  const areaPath = `10,80 ${polylinePath} 340,80 Z`;

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-[#FFFDF8] border border-[#E8E3DC] rounded-2xl p-5 space-y-4" id="price-history-module">
      <div className="flex justify-between items-center pb-2.5 border-b border-[#E8E3DC]">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-[#B76E79]" />
          <span className="font-mono text-[10px] font-bold text-[#1F1F1F] tracking-wide uppercase">AI PRICE GRAPH MONITOR</span>
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
          isGoodTimeToBuy ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
        }`}>
          {isGoodTimeToBuy ? '⭐ HIGHLY RECOMMENDED TIME TO BUY' : '🕒 HOLDING STEADY'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-zinc-600 font-mono">
        <div className="p-2 border border-[#E8E3DC] rounded-xl bg-white">
          <span className="block text-[8px] text-zinc-400 uppercase font-medium">Lowest Historic</span>
          <span className="block text-xs font-bold text-emerald-600 mt-1">{formatINR(lowestPrice)}</span>
        </div>
        <div className="p-2 border border-[#E8E3DC] rounded-xl bg-white">
          <span className="block text-[8px] text-zinc-400 uppercase font-medium">Current MRP</span>
          <span className="block text-xs font-bold text-zinc-900 mt-1">{formatINR(currentPrice)}</span>
        </div>
        <div className="p-2 border border-[#E8E3DC] rounded-xl bg-white">
          <span className="block text-[8px] text-zinc-400 uppercase font-medium">Highest Peak</span>
          <span className="block text-xs font-bold text-rose-600 mt-1">{formatINR(highestPrice)}</span>
        </div>
      </div>

      {/* Sparkline Canvas block */}
      <div className="relative pt-4 pb-2 bg-[#FFFDF8] rounded-xl overflow-hidden flex flex-col items-center">
        <div className="w-full max-w-[360px] h-[90px] relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 350 80">
            {/* Grid references */}
            <line x1="10" y1="20" x2="340" y2="20" stroke="#E8E3DC" strokeDasharray="3,3" strokeWidth="0.5" />
            <line x1="10" y1="50" x2="340" y2="50" stroke="#E8E3DC" strokeDasharray="3,3" strokeWidth="0.5" />
            <line x1="10" y1="80" x2="340" y2="80" stroke="#E8E3DC" strokeWidth="0.5" />

            {/* Glowing trend Area fill */}
            <path d={areaPath} fill="url(#sparkline-grad)" opacity="0.3" />

            {/* Core Trend Line path */}
            <polyline
              fill="none"
              stroke="#B76E79"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylinePath}
            />

            {/* Glowing vertices circles */}
            {points.map((p, idx) => (
              <circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r={idx === points.length - 1 ? 4 : 2.5}
                className={idx === points.length - 1 ? "fill-[#B76E79] animate-pulse" : "fill-white stroke-[#B76E79] stroke-1.5"}
              />
            ))}

            {/* Definitions for beautiful gradient and glowing drop-shadows */}
            <defs>
              <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B76E79" />
                <stop offset="100%" stopColor="#FFFDF8" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Sparkline labels row */}
        <div className="w-full max-w-[360px] flex justify-between px-2 text-[8px] font-mono text-zinc-400 mt-1 uppercase">
          <span>{points[0].label} ({formatINR(points[0].price)})</span>
          <span>Today ({formatINR(currentPrice)})</span>
        </div>
      </div>

      <div className="p-3 bg-zinc-50 border border-[#E8E3DC] rounded-xl text-xs text-zinc-650 leading-relaxed font-sans">
        <div className="flex gap-1.5 items-start">
          <Sparkles className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <p>
            <strong className="text-zinc-900">Luxora Advisory: </strong>
            {isGoodTimeToBuy 
              ? "This product is listed close to its historical bottom! We recommend buying now before peak seasonal demand limits local stocks."
              : "This product is at normal average listing rates. You can buy safely or save it to your wishlist to trigger drop alerts as seller quotas change."}
          </p>
        </div>
      </div>
    </div>
  );
}
