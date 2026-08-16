import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Star, Sparkles, ExternalLink, ThumbsUp, ThumbsDown, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import PriceHistoryChart from './PriceHistoryChart';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  isSaved: boolean;
  onSaveToggle: (product: Product) => void;
  similarProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function ProductDetailsModal({
  product,
  onClose,
  isSaved,
  onSaveToggle,
  similarProducts,
  onSelectProduct
}: ProductDetailsModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Currency utility helper
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Static mock carousel galleries corresponding to high-quality categories
  const imageGalleryPool = [
    product.imageUrl,
    "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80", // Clock face / focus lifestyle
    "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80", // Neon background style
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"  // Elegant white gold accessory
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-zinc-950/45 backdrop-blur-sm" id="details-modal-overlay">
        {/* Modal Main Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          id="details-modal-box"
        >
          {/* Header Action Row */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[#E8E3DC] bg-[#FFFDF8]/90 backdrop-blur-md">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] font-bold uppercase block">PRODUCT BLUEPRINT DETAIL</span>
              <h2 className="text-sm font-bold text-[#1F1F1F] font-serif leading-none mt-1">
                {product.brand} {product.name}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSaveToggle(product)}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all border ${
                  isSaved
                    ? 'bg-rose-50 text-rose-600 border-rose-250'
                    : 'bg-white text-zinc-500 border-zinc-200 hover:text-rose-600'
                }`}
                title={isSaved ? "Saved" : "Save to wishlist"}
                id="modal-toggle-wishlist"
              >
                <Heart className={`h-4.5 w-4.5 ${isSaved ? 'fill-[#B76E79] stroke-[#B76E79]' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E8E3DC] bg-white text-zinc-500 hover:bg-zinc-50 transition-colors"
                id="modal-close-btn"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Modal Main Content Area */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start bg-white">
              
              {/* Left Column: Visual Gallery Grid */}
              <div className="md:col-span-5 space-y-4">
                <div className="relative pt-[90%] w-full rounded-2xl overflow-hidden bg-zinc-50 border border-[#E8E3DC]">
                  {imageGalleryPool[activeImageIndex] ? (
                    <img
                      src={imageGalleryPool[activeImageIndex]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600";
                      }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-100 text-[#D4AF37] p-4 text-center">
                      <span className="font-serif italic text-sm font-bold">{product.brand}</span>
                      <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase mt-1">Exclusive Blend</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-zinc-950/90 text-[#D4AF37] font-mono text-[9px] font-bold px-2.5 py-1 rounded">
                    IMAGE {activeImageIndex + 1} OF 4
                  </div>
                </div>

                {/* Gallery Thumbnail Row */}
                <div className="grid grid-cols-4 gap-2">
                  {imageGalleryPool.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative pt-[100%] rounded-lg overflow-hidden border ${
                        activeImageIndex === idx ? 'border-[#B76E79] ring-1 ring-[#B76E79]/50' : 'border-[#E8E3DC] hover:border-zinc-300'
                      }`}
                    >
                      {url ? (
                        <img
                          src={url}
                          alt="thumbnail"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=100";
                          }}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 text-zinc-400 text-[10px] font-mono">
                          N/A
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Score panel inside card column */}
                <div className="p-4 bg-zinc-50 rounded-2xl border border-[#E8E3DC] space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono text-zinc-500">
                    <span>MATCH CONFIDENCE</span>
                    <span className="text-zinc-900 font-bold block">{product.matchScore}% Precise</span>
                  </div>
                  {/* Custom progress visual */}
                  <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#B76E79] rounded-full"
                      style={{ width: `${product.matchScore}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-zinc-400 leading-tight block">
                    Assessed dynamically via Luxora natural parsing engine based on category, specifications, and rating threshold.
                  </span>
                </div>
              </div>

              {/* Right Column: Descriptions & Detailed Content */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-50 text-[#D4AF37] text-[10px] tracking-wider uppercase font-mono font-bold border border-[#E8E3DC]">
                      {product.category}
                    </span>
                    {product.discoveryLabel && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#B76E79]/10 text-[#B76E79] text-[10px] tracking-wider uppercase font-sans font-bold border border-[#B76E79]/20">
                        {product.discoveryLabel}
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-[#1F1F1F] text-xs font-medium font-mono">
                      <Star className="h-3 w-3 fill-[#D4AF37] stroke-[#D4AF37]" />
                      {product.rating} <span className="text-zinc-400">({product.reviewsCount} reviews)</span>
                    </div>
                  </div>

                  <h1 className="text-2xl font-serif font-black tracking-tight text-[#1F1F1F]">
                    {product.name}
                  </h1>
                  <span className="text-xs font-mono text-zinc-400 tracking-wider">BY {product.brand.toUpperCase()}</span>
                </div>

                {/* Price Display */}
                <div className="p-4 bg-[#FFFDF8] border border-[#E8E3DC] rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 tracking-wide uppercase block">ESTIMATED PRICE</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#1F1F1F] font-mono">
                      {formatINR(product.price)}
                    </span>
                  </div>
                  <a
                    href={product.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 bg-[#B76E79] hover:bg-[#a35d68] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
                    id="btn-buy-outlet"
                  >
                    <ShoppingBag className="h-4 w-4 text-white" />
                    Buy Now
                    <ExternalLink className="h-3 w-3 opacity-80" />
                  </a>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest font-bold">EXECUTIVE SUMMARY</span>
                  <p className="text-zinc-650 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Key specs mapping table */}
                <div className="space-y-3">
                  <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest font-bold block">TECHNICAL LAYOUT</span>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(product.specs || {}).map(([key, value]) => (
                      <div key={key} className="p-3 border border-[#E8E3DC] rounded-xl bg-zinc-50/50">
                        <span className="text-[9px] font-mono tracking-wider text-zinc-400 uppercase block">{key}</span>
                        <span className="text-xs font-medium text-zinc-800 font-sans block mt-1">{value}</span>
                      </div>
                    ))}
                    <div className="p-3 border border-[#E8E3DC] rounded-xl bg-zinc-50/50">
                      <span className="text-[9px] font-mono tracking-wider text-zinc-400 uppercase block">Shipping Coverage</span>
                      <span className="text-xs font-medium text-emerald-700 font-sans block mt-1">Free Delivery across India</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Key features bullet points */}
                <div className="space-y-2">
                  <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest font-bold block">FEATURES & UTILITIES</span>
                  <ul className="space-y-2 text-xs text-zinc-650 font-sans">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0"></span>
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Master Pros and Cons Block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E8E3DC]">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <ThumbsUp className="h-4 w-4 text-emerald-600" />
                      <span className="font-mono text-xs text-emerald-800 uppercase tracking-wider font-bold">Key Advantages</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-zinc-650">
                      {product.pros.map((p, idx) => (
                        <li key={idx} className="leading-tight flex gap-1 bg-emerald-50/40 p-2 border border-emerald-100/50 rounded-lg">
                          <span className="text-emerald-700 font-bold font-mono">✓</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <ThumbsDown className="h-4 w-4 text-[#D4AF37]" />
                      <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider font-bold">Minor Drawbacks</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-zinc-500">
                      {product.cons.map((c, idx) => (
                        <li key={idx} className="leading-tight flex gap-1 bg-zinc-50 border border-[#E8E3DC] p-2 rounded-lg">
                          <span className="text-[#D4AF37] font-medium font-mono">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price History Chart */}
                <PriceHistoryChart productName={product.name} currentPrice={product.price} />

                {/* AI Summary Diagnostic Box */}
                <div className="p-4 bg-zinc-950 text-zinc-150 rounded-2xl space-y-2.5 shadow-lg border border-[#D4AF37]/30">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                    <span className="text-[10px] tracking-widest font-mono text-[#D4AF37] uppercase font-bold">Luxora AI Personal Shopper Brief</span>
                  </div>
                  <p className="text-xs font-serif italic leading-relaxed text-zinc-300">
                    "We recommend this {product.brand} item as our top pick for Indian customers because of its optimized regional sizing and high reliability in demanding conditions. Perfect choice if you prioritize design aesthetic over standard bulk alternatives."
                  </p>
                </div>

                {/* Product Review Highlights */}
                {product.reviewHighlights && product.reviewHighlights.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest font-bold block">CUSTOMER ECHO QUOTES</span>
                    <div className="space-y-2">
                      {product.reviewHighlights.map((quote, idx) => (
                        <div key={idx} className="p-3 bg-zinc-50 rounded-xl text-[11px] leading-relaxed text-zinc-500 border border-[#E8E3DC] relative pl-8">
                          <span className="absolute left-3 top-3.5 text-2xl text-[#D4AF37] font-serif leading-none">“</span>
                          <span>{quote}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Similar Products Carousel */}
            {similarProducts.length > 0 && (
              <div className="pt-8 border-t border-[#E8E3DC] space-y-4">
                <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest font-bold block">LUXURIOUS ALTERNATIVES</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {similarProducts.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectProduct(item)}
                      className="flex gap-3 bg-white hover:bg-zinc-50 p-3 rounded-2xl border border-[#E8E3DC] hover:border-zinc-300 transition-all cursor-pointer group"
                    >
                      <div className="relative h-12 w-12 rounded-lg bg-zinc-100 overflow-hidden shrink-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=100";
                            }}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-zinc-100 text-zinc-400 text-[10px] font-mono">
                            N/A
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[8px] font-mono tracking-wider uppercase text-zinc-400 block leading-tight">{item.brand}</span>
                        <h4 className="text-xs font-serif font-bold text-zinc-900 group-hover:text-[#B76E79] transition-colors line-clamp-1">{item.name}</h4>
                        <span className="text-[10px] font-mono text-zinc-800 font-semibold block mt-0.5">{formatINR(item.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer protection warranty banner */}
            <div className="py-4 border-t border-zinc-100 flex items-center justify-center gap-2 text-[10px] text-zinc-400 font-mono tracking-wide">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              AUTHENTIC OUTLET LINKS • LOCALIZED IN INR AT SELLER RATES
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
