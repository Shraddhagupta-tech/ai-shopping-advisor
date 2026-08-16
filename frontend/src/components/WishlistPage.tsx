import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Bell, AlertCircle, Trash2, TrendingDown, Tag, ShieldCheck } from 'lucide-react';
import { Product, WishlistItem } from '../types';

interface WishlistPageProps {
  savedProducts: Product[];
  wishlistMetadata: WishlistItem[];
  onRemoveSave: (product: Product) => void;
  onUpdateTargetPrice: (productId: string, targetPrice: number) => void;
  onViewProduct: (product: Product) => void;
}

export default function WishlistPage({
  savedProducts,
  wishlistMetadata,
  onRemoveSave,
  onUpdateTargetPrice,
  onViewProduct
}: WishlistPageProps) {
  const [successAlertId, setSuccessAlertId] = useState<string | null>(null);

  // Formatting INR Utility
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMetadata = (productId: string) => {
    return wishlistMetadata.find(item => item.productId === productId) || {
      priceAtSave: 999,
      currentPrice: 999,
      targetPrice: undefined
    };
  };

  const handleSetAlert = (productId: string, price: number) => {
    onUpdateTargetPrice(productId, price);
    setSuccessAlertId(productId);
    setTimeout(() => {
      setSuccessAlertId(null);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="wishlist-container">
      {/* Title block */}
      <div className="mb-8 border-b border-[#E8E3DC] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
        <div>
          <span className="text-[10px] tracking-widest font-mono text-[#D4AF37] font-bold uppercase block">YOUR EXCLUSIVE ATTACHMENTS</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1F1F] mt-1">
            Luxury Wishlist & Price Tracker
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            Monitor real-time product price configurations and customize alert triggers.
          </p>
        </div>
        <div className="flex gap-4 font-mono text-[11px] text-zinc-500 bg-white p-3 rounded-xl border border-[#E8E3DC]">
          <div>
            <span className="block text-[#1F1F1F] font-bold">{savedProducts.length} Items</span>
            <span className="text-[9px] uppercase font-bold text-zinc-400">TRACKED</span>
          </div>
          <div className="w-[1px] bg-[#E8E3DC]"></div>
          <div>
            <span className="block text-emerald-600 font-bold">
              {wishlistMetadata.filter(item => item.targetPrice && item.currentPrice <= item.targetPrice).length} Triggered
            </span>
            <span className="text-[9px] uppercase font-bold text-zinc-400">ACTIVE DISCOUNTS</span>
          </div>
        </div>
      </div>

      {savedProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 text-center max-w-md mx-auto"
        >
          <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4 text-[#D4AF37] border border-[#E8E3DC]">
            <Heart className="h-6 w-6 text-[#B76E79] fill-[#B76E79]/10" />
          </div>
          <h2 className="text-lg font-serif font-bold text-[#1F1F1F]">Your Wishlist is Empty</h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed">
            As you explore products with Luxora AI, click the heart icon on any recommendation card to track pricing.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {savedProducts.map((product) => {
              const meta = getMetadata(product.id);
              const isTriggered = meta.targetPrice && meta.currentPrice <= meta.targetPrice;
              const hasAlertSet = !!meta.targetPrice;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-[#E8E3DC] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                  id={`wishlist-card-${product.id}`}
                >
                  <div className="bg-white">
                    {/* Visual Card Cover */}
                    <div className="relative pt-[45%] bg-zinc-50 overflow-hidden cursor-pointer" onClick={() => onViewProduct(product)}>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600";
                          }}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-150 text-[#D4AF37] p-2 text-center">
                          <span className="font-serif italic text-xs font-bold">{product.brand}</span>
                          <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase mt-0.5">Exclusive Blend</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-neutral-900/10"></div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveSave(product);
                        }}
                        className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 text-zinc-400 hover:text-rose-600 hover:bg-white flex items-center justify-center shadow-sm"
                        title="Remove tracking"
                        id={`btn-remove-wishlist-${product.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Metadata Content */}
                    <div className="p-4 sm:p-5 bg-white">
                      <div>
                        <span className="text-[9px] font-mono tracking-wider font-bold text-[#D4AF37] uppercase">
                          {product.brand} • {product.category}
                        </span>
                        <h3 
                          onClick={() => onViewProduct(product)}
                          className="font-serif text-sm font-bold text-[#1F1F1F] line-clamp-1 hover:text-[#B76E79] transition-colors cursor-pointer mt-0.5"
                        >
                          {product.name}
                        </h3>
                      </div>

                      {/* Real-time price listing */}
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#E8E3DC] text-center font-mono">
                        <div className="text-left">
                          <span className="block text-[8px] text-zinc-400 uppercase font-bold">Price Added</span>
                          <span className="block text-xs font-semibold text-zinc-500 mt-1">
                            {formatINR(meta.priceAtSave)}
                          </span>
                        </div>
                        <div className="border-x border-[#E8E3DC] py-0.5">
                          <span className="block text-[8px] text-zinc-400 uppercase font-bold">Current</span>
                          <span className="block text-xs font-bold text-[#1F1F1F] mt-1">
                            {formatINR(meta.currentPrice)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[8px] text-zinc-400 uppercase font-bold">Status</span>
                          {isTriggered ? (
                            <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-extrabold mt-1 animate-pulse">
                              DROP MATCH
                            </span>
                          ) : (
                            <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-zinc-50 text-zinc-400 font-bold mt-1">
                              TRACKING
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Micro price change visual indicator */}
                      {meta.currentPrice < meta.priceAtSave && (
                        <div className="mt-3 p-2 bg-emerald-50 rounded-lg flex items-center justify-between text-[11px] text-emerald-800 font-sans border border-emerald-100">
                          <span className="flex items-center gap-1 font-medium">
                            <TrendingDown className="h-3.5 w-3.5 shrink-0" />
                            Retail price dropped by {Math.round(((meta.priceAtSave - meta.currentPrice) / meta.priceAtSave) * 100)}%!
                          </span>
                          <span className="font-mono text-[10px] font-bold">-{formatINR(meta.priceAtSave - meta.currentPrice)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interactive Alert Trigger Config Pane */}
                  <div className="px-5 pb-5 pt-1 border-t border-[#E8E3DC] bg-[#FFFDF8]">
                    <span className="text-[9px] font-mono font-bold tracking-wider text-zinc-450 uppercase block mb-2.5 flex items-center gap-1">
                      <Bell className="h-3.5 w-3.5 text-[#D4AF37]" />
                      PRICE DROP ALERT LIMIT SETTING
                    </span>

                    <div className="space-y-2 bg-[#FFFDF8]">
                       <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-2.5 top-[11px] text-[10px] font-mono text-zinc-400">₹</span>
                          <input
                            type="number"
                            placeholder="e.g. 5000"
                            defaultValue={meta.targetPrice || Math.floor(meta.currentPrice * 0.95)}
                            id={`input-alert-${product.id}`}
                            className="w-full pl-6 pr-2 py-1.5 bg-white border border-[#E8E3DC] rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#B76E79]"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const inputEl = document.getElementById(`input-alert-${product.id}`) as HTMLInputElement;
                            if (inputEl && inputEl.value) {
                              handleSetAlert(product.id, parseInt(inputEl.value, 10));
                            }
                          }}
                          className="px-3 py-1.5 bg-[#B76E79] text-white rounded-xl text-xs font-semibold hover:bg-[#a35d68] transition-colors shrink-0"
                          id={`btn-set-alert-${product.id}`}
                        >
                          Set Target
                        </button>
                      </div>

                      {hasAlertSet && (
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                          <span className="flex items-center gap-1 text-[11px]">
                            <Tag className="h-3 w-3 text-[#D4AF37]" />
                            Target limit is {formatINR(meta.targetPrice || 0)}
                          </span>
                          {isTriggered ? (
                            <span className="text-emerald-600 font-extrabold">✓ Achieved!</span>
                          ) : (
                            <span>Waiting...</span>
                          )}
                        </div>
                      )}

                      {successAlertId === product.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-sans font-bold flex items-center gap-1"
                        >
                          <ShieldCheck className="h-3 w-3 text-emerald-600 shrink-0" />
                          Price alert configured! We will simulated drop matching...
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
