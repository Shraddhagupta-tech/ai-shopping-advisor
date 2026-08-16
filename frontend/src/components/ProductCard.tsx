import React from 'react';
import { motion } from 'motion/react';
import { Heart, Check, Plus, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isSaved: boolean;
  onSaveToggle: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  isCompared?: boolean;
  onCompareToggle?: (product: Product) => void;
  key?: React.Key;
}

export default function ProductCard({ 
  product, 
  isSaved, 
  onSaveToggle, 
  onViewDetails,
  isCompared = false,
  onCompareToggle
}: ProductCardProps) {
  // Format currency standard Indian style
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6 }}
      className="relative flex flex-col h-full bg-white border border-[#E8E3DC] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-zinc-200/40 transition-all group"
      id={`card-${product.id}`}
    >
      {/* Decorative Gold Match Core Overlay Tag */}
      <div className="absolute top-3 left-3 z-20 flex gap-1.5 items-center">
        <span className="px-2.5 py-1 rounded-full bg-zinc-950/90 text-[#D4AF37] font-mono text-[10px] font-bold tracking-tight shadow-md backdrop-blur-sm">
          {product.matchScore}% Match
        </span>
        {product.matchScore >= 95 && (
          <span className="px-2.5 py-1 rounded-full bg-[#B76E79] text-white font-mono text-[9px] font-extrabold tracking-wider uppercase shadow-md">
            ELITE PICK
          </span>
        )}
      </div>

      {/* Save Button (Wishlist Toggler with active/inactive feedback) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSaveToggle(product);
        }}
        className={`absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full transition-all ${
          isSaved
            ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-sm scale-110'
            : 'bg-white/80 text-zinc-500 hover:text-[#B76E79] hover:bg-white border border-[#E8E3DC] shadow-sm'
        }`}
        title={isSaved ? "Saved to Wishlist" : "Save to Wishlist"}
        id={`btn-wishlist-${product.id}`}
      >
        <Heart className={`h-4.5 w-4.5 ${isSaved ? 'fill-[#B76E79] stroke-[#B76E79]' : ''}`} />
      </button>

      {/* Image Gallery Mock / Cover Container */}
      <div 
        onClick={() => onViewDetails(product)}
        className="relative pt-[70%] w-full bg-zinc-50 overflow-hidden cursor-pointer group-hover:opacity-95 flex items-center justify-center border-b border-[#E8E3DC]"
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Graceful fallback to a premium, neutral Unsplash product illustration placeholder
              e.currentTarget.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600";
            }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-100 text-[#D4AF37] p-4 text-center">
            <span className="font-serif italic text-sm font-bold">{product.brand}</span>
            <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase mt-1">Exclusive Blend</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Content & Typography Specs */}
      <div className="p-5 flex-1 flex flex-col bg-white">
        <div className="mb-2">
          {product.discoveryLabel && (
            <div className="mb-1.5">
              <span className="px-2 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] font-sans text-[10px] font-bold tracking-wide uppercase">
                {product.discoveryLabel}
              </span>
            </div>
          )}
          <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] font-bold uppercase block">
            {product.brand} • {product.category}
          </span>
          <h3 
            onClick={() => onViewDetails(product)}
            className="text-base font-serif font-bold text-zinc-900 group-hover:text-[#B76E79] transition-colors cursor-pointer mt-0.5 line-clamp-1"
          >
            {product.name}
          </h3>
        </div>

        {/* Dynamic INR Pricing Display */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-bold font-mono text-zinc-950">
            {formatINR(product.price)}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">MRP</span>
        </div>

        {/* Short Dynamic Recommendation Reason */}
        <div className="p-3 bg-zinc-50/50 border border-[#E8E3DC] rounded-xl mb-4 text-xs text-zinc-700 leading-relaxed italic relative">
          <span className="font-semibold text-[#D4AF37] font-mono block not-italic text-[9px] uppercase tracking-wider mb-0.5">Luxora Advice</span>
          "{product.reason}"
        </div>

        {/* Pros & Cons Section */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-[10px] flex-1 bg-white">
          {/* Pros list */}
          <div className="space-y-1">
            <span className="font-mono text-zinc-405 uppercase tracking-wider font-bold block mb-1">PROS</span>
            {product.pros.slice(0, 2).map((pro, index) => (
              <div key={index} className="flex gap-1 text-zinc-600 leading-tight">
                <ThumbsUp className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{pro}</span>
              </div>
            ))}
          </div>

          {/* Cons list */}
          <div className="space-y-1">
            <span className="font-mono text-zinc-405 uppercase tracking-wider font-bold block mb-1">CONS</span>
            {product.cons.slice(0, 1).map((con, index) => (
              <div key={index} className="flex gap-1 text-zinc-500 leading-tight">
                <ThumbsDown className="h-3 w-3 text-amber-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{con}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-12 gap-2 pt-3 border-t border-[#E8E3DC] mt-auto">
          <button
            onClick={() => onViewDetails(product)}
            className="col-span-6 py-2.5 px-1.5 bg-gray-50 hover:bg-gray-150 text-black text-[11px] font-bold rounded-xl text-center tracking-wide transition-all active:scale-[0.98]"
            id={`btn-details-${product.id}`}
          >
            View Specs
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onCompareToggle) onCompareToggle(product);
            }}
            className={`col-span-6 py-2.5 px-1.5 text-[11px] font-bold rounded-xl text-center tracking-wide transition-all active:scale-[0.98] ${
              isCompared 
                ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30' 
                : 'bg-[#B76E79] text-white hover:bg-[#a35d68] shadow-sm'
            }`}
            id={`btn-card-compare-${product.id}`}
          >
            {isCompared ? 'Compared ✓' : 'Compare +'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
