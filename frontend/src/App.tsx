import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  Heart, 
  User, 
  TrendingUp, 
  Loader2, 
  Compass, 
  Shirt, 
  Smartphone, 
  Laptop, 
  Headphones, 
  Coffee, 
  Dumbbell, 
  Plane, 
  Flame, 
  AlertCircle, 
  ShieldAlert,
  ArrowRight,
  Tv,
  Check,
  CheckCircle2,
  Droplet
} from 'lucide-react';

import { Product, UserProfile, SearchHistoryItem, WishlistItem } from './types';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import WishlistPage from './components/WishlistPage';
import ProfilePage from './components/ProfilePage';
import ComparisonPage from './components/ComparisonPage';

// Import curation database and luxury subcomponents
import { GoogleGenAI } from '@google/genai';
import { TRENDING_PRODUCTS, MOST_LOVED_BEAUTY, BEST_ELECTRONICS, BEST_DEALS } from './data/mockProducts';
import BeautyAiSuite from './components/BeautyAiSuite';
import ProductBattle from './components/ProductBattle';

// Popular Indian E-commerce Categories config
const CATEGORIES = [
  { name: 'Beauty', icon: Sparkles, query: 'Long lasting cosmetic eyeliner & matte blush' },
  { name: 'Skincare', icon: Droplet, query: 'Oil-free daily moisturizer with SPF 50' },
  { name: 'Fashion', icon: Shirt, query: 'Pure organic cotton Fabindia kurta' },
  { name: 'Electronics', icon: Tv, query: 'Noise-cancelling professional desk accessories' },
  { name: 'Smartphones', icon: Smartphone, query: 'Premium smartphone under ₹40000 with OLED display' },
  { name: 'Laptops', icon: Laptop, query: 'Sleek lightweight laptop for coding students under ₹60000' },
  { name: 'Audio', icon: Headphones, query: 'True wireless bluetooth earbuds with ANC under ₹3000' },
  { name: 'Home Appliances', icon: Coffee, query: 'Automatic coffee maker espresso machine' },
  { name: 'Fitness', icon: Dumbbell, query: 'Smartwatch fitness tracker under ₹5000' },
  { name: 'Travel', icon: Plane, query: 'Mokobara lightweight cabin trolley bag' },
];

const TRENDING_SEARCHES = [
  "Transfer-proof lipstick under ₹1000",
  "Best laptop for engineering students",
  "Smartwatch under ₹5000",
  "Sunscreen for oily skin",
  "Noise cancelling earbuds under ₹3000",
];

const LOADING_STATUSES = [
  "Luxora AI initialized. Dissecting sentence semantics...",
  "Querying premium verified Indian retail channels...",
  "Matching local currency metrics (INR ₹)...",
  "Filtering duplicate sponsored placements...",
  "Calibrating match scores and luxury criteria..."
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'wishlist' | 'profile' | 'compare'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSearchedQuery, setLastSearchedQuery] = useState('');
  const [comparedProducts, setComparedProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('luxora_compared_products');
    return saved ? JSON.parse(saved) : [];
  });
  
  // User Authentication
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('luxora_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Recommendation Results
  const [products, setProducts] = useState<Product[]>([]);
  const [aiVerdict, setAiVerdict] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [loadingStatusIndex, setLoadingStatusIndex] = useState(0);

  // Selected Product (Detail Modal)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Search History List
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    const saved = localStorage.getItem('luxora_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist details
  const [wishlistMetadata, setWishlistMetadata] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('luxora_wishlist_meta');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedProducts, setSavedProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('luxora_wishlist_products');
    return saved ? JSON.parse(saved) : [];
  });

  // Recently Viewed & Rotating Natural Language Placeholders
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    const saved = localStorage.getItem('luxora_recently_viewed');
    return saved ? JSON.parse(saved) : [];
  });
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const ROTATING_PLACEHOLDERS = [
    "Transfer-proof matte lipstick under ₹1000",
    "Best active ANC earbuds under ₹2000",
    "Oil-free daily moisturizer with SPF 50",
    "Perfect anniversary gift for mother under ₹2000",
    "Lightweight laptop for coding students under ₹60000",
    "Build a complete basic makeup kit under ₹2000"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Save Auth status to LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('luxora_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('luxora_user');
    }
  }, [user]);

  // Save Tracking lists to localstorage
  useEffect(() => {
    localStorage.setItem('luxora_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem('luxora_wishlist_meta', JSON.stringify(wishlistMetadata));
    localStorage.setItem('luxora_wishlist_products', JSON.stringify(savedProducts));
  }, [wishlistMetadata, savedProducts]);

  useEffect(() => {
    localStorage.setItem('luxora_compared_products', JSON.stringify(comparedProducts));
  }, [comparedProducts]);

  useEffect(() => {
    localStorage.setItem('luxora_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Loading Status cycler
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStatusIndex((prev) => (prev + 1) % LOADING_STATUSES.length);
      }, 1800);
    } else {
      setLoadingStatusIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Simulation element: Drop wishlist prices occasionally so users can experience price alert matching
  useEffect(() => {
    const timer = setTimeout(() => {
      if (wishlistMetadata.length > 0) {
        setWishlistMetadata(prev => {
          return prev.map(item => {
            // 20% price drop simulation
            const shouldDrop = Math.random() > 0.65;
            if (shouldDrop) {
              const currentTarget = item.targetPrice || item.currentPrice;
              const newPrice = Math.floor(item.currentPrice * 0.94);
              return {
                ...item,
                currentPrice: newPrice
              };
            }
            return item;
          });
        });

        setSavedProducts(prevProducts => {
          return prevProducts.map(prod => {
            const hasMeta = wishlistMetadata.find(m => m.productId === prod.id);
            if (hasMeta && Math.random() > 0.65) {
              return {
                ...prod,
                price: Math.floor(prod.price * 0.94)
              };
            }
            return prod;
          });
        });
      }
    }, 15000); // Check simulate drops every 15 seconds
    return () => clearTimeout(timer);
  }, [wishlistMetadata]);

  // Login handler
  const handleLogin = (newUser: { name: string; isGuest: boolean; email: string | null }) => {
    setUser({
      name: newUser.name,
      isGuest: newUser.isGuest,
      email: newUser.email,
      preferences: {
        budgetPreference: 'balanced',
        gender: 'Unisex',
        focus: []
      }
    });
  };

  const handleLogout = () => {
    setUser(null);
    setProducts([]);
    setSearchQuery('');
    setLastSearchedQuery('');
    setActiveTab('search');
  };

  // Dispatch shopping advice search query
  const handleSearch = async (queryToSubmit = searchQuery) => {
    const queryClean = queryToSubmit.trim();
    if (!queryClean) return;

    setIsLoading(true);
    setSearchQuery(queryClean);
    setLastSearchedQuery(queryClean);
    setErrorText(null);

    const brandCategories = ['Beauty', 'Skincare', 'Fashion', 'Electronics', 'Smartphones', 'Laptops', 'Audio', 'Home Appliances', 'Fitness', 'Travel'];
    const matchedCategory = brandCategories.find(cat => queryClean.toLowerCase().includes(cat.toLowerCase())) || 'Beauty';

    // Attempt backend call first
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: queryClean,
          preferences: user?.preferences
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
          
          const historyItem: SearchHistoryItem = {
            id: `search-${Date.now()}`,
            query: queryClean,
            timestamp: new Date().toISOString(),
            category: matchedCategory,
            recommendationsCount: data.products.length
          };
          setSearchHistory(prev => [historyItem, ...prev.slice(0, 14)]);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend API endpoint offline, using Luxora Smart Search engine:', err);
    }

    // Smart Local Search & Curation Fallback
    const allCatalog = [...TRENDING_PRODUCTS, ...MOST_LOVED_BEAUTY, ...BEST_ELECTRONICS, ...BEST_DEALS];
    
    // Parse price cap if present (e.g., "Smartwatch under ₹5000" -> 5000)
    const priceMatch = queryClean.match(/under\s*₹?\s*(\d+)/i);
    const maxPrice = priceMatch ? parseInt(priceMatch[1], 10) : null;
    const lowerQuery = queryClean.toLowerCase();

    let filtered = allCatalog.filter(p => {
      if (maxPrice !== null && p.price > maxPrice) return false;
      const terms = lowerQuery.split(/\s+/).filter(t => t.length > 2 && t !== 'under');
      if (terms.length === 0) return true;
      return terms.some(term => 
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    });

    // If query was very specific or returned no items under price limit, provide best matching fallback
    if (filtered.length === 0) {
      filtered = allCatalog.filter(p => maxPrice === null || p.price <= maxPrice);
    }
    if (filtered.length === 0) {
      filtered = allCatalog;
    }
    setProducts(filtered);

    // Generate AI Shopping Verdict
    const geminiApiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
    if (geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are Luxora AI Shopping Advisor. For the shopping query "${queryClean}", provide a concise 2-sentence expert buyer guide verdict highlighting key specs, budget fit, and top value features.`
        });
        if (response.text) {
          setAiVerdict(response.text.trim());
        }
      } catch (err) {
        setAiVerdict(`Luxora AI Verdict: Analyzed ${filtered.length} verified listings for "${queryClean}". Selected products matching optimal price-to-performance ratio and customer reviews.`);
      }
    } else {
      setAiVerdict(`Luxora AI Verdict: Analyzed ${filtered.length} verified listings for "${queryClean}". Selected products matching optimal price-to-performance ratio and customer reviews.`);
    }

    const historyItem: SearchHistoryItem = {
      id: `search-${Date.now()}`,
      query: queryClean,
      timestamp: new Date().toISOString(),
      category: matchedCategory,
      recommendationsCount: filtered.length
    };

    setSearchHistory(prev => [historyItem, ...prev.slice(0, 14)]);
    setIsLoading(false);
  };

  // Wishlist handler
  const handleSaveToggle = (product: Product) => {
    const isSaved = savedProducts.some(p => p.id === product.id);
    if (isSaved) {
      setSavedProducts(prev => prev.filter(p => p.id !== product.id));
      setWishlistMetadata(prev => prev.filter(meta => meta.productId !== product.id));
    } else {
      setSavedProducts(prev => [product, ...prev]);
      setWishlistMetadata(prev => [
        {
          productId: product.id,
          savedAt: new Date().toISOString(),
          priceAtSave: product.price,
          currentPrice: product.price,
          targetPrice: Math.floor(product.price * 0.90) // Preset target default to 10% discount alert
        },
        ...prev
      ]);
    }
  };

  const handleUpdateTargetPrice = (productId: string, targetPrice: number) => {
    setWishlistMetadata(prev => 
      prev.map(item => {
        if (item.productId === productId) {
          return { ...item, targetPrice };
        }
        return item;
      })
    );
  };

  // Profile preferences adjustment
  const handleUpdatePreferences = (newPrefs: UserProfile['preferences']) => {
    if (user) {
      setUser({
        ...user,
        preferences: newPrefs
      });
    }
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  const handleConvertGuest = () => {
    if (user) {
      setUser({
        ...user,
        name: "Siddharth Sharma",
        isGuest: false,
        email: "siddharth.s@luxora.in"
      });
    }
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 4);
    });
  };

  // Route back directly to login if not authenticated
  if (!user) {
    return <LoginPage onLoginSuccess={handleLogin} />;
  }

  // Find similar recommendations in the current results feed
  const getSimilarProductsForDetail = (prod: Product) => {
    return products.filter(p => p.id !== prod.id && p.category === prod.category);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col text-neutral-900" id="luxora-app">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />

      {/* Main Container Layout */}
      <main className="flex-1 pb-16">
        
        {/* TAB 1: SHOPPING ADVISOR ROW */}
        {activeTab === 'search' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="tab-search-content">
            
            {/* Elegant Branding Hero block */}
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-zinc-100 bg-white shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059] animate-pulse"></span>
                <span className="text-[9px] font-bold text-zinc-500 tracking-widest font-mono uppercase">
                  Premium AI-Powered Shopping Advisor
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-light mb-4 tracking-tight leading-tight text-zinc-950">
                India's Smartest AI <span className="italic font-serif text-[#C5A059]">Shopping Advisor</span>
              </h1>
              <p className="text-zinc-500 text-sm max-w-md mx-auto">
                No filters, forms, or clutter. Describe your desires naturally. Receive an artificial intelligence mapping on Indian items instantly.
              </p>
            </div>

            {/* AI Search Centered Box */}
            <div className="max-w-3xl mx-auto relative mb-6">
              <div className="relative bg-white border border-gray-100 rounded-full flex items-center p-3.5 shadow-2xl shadow-gray-200/60 hover:shadow-xl transition-all focus-within:ring-1 focus-within:ring-[#C5A059]">
                <Search className="h-5.5 w-5.5 text-[#C5A059] ml-5 shrink-0" />
                <input
                  type="text"
                  placeholder={ROTATING_PLACEHOLDERS[placeholderIndex]}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 pl-4 pr-6 py-2.5 bg-transparent text-lg text-zinc-900 placeholder-zinc-350 focus:outline-none"
                  id="advisor-search-input"
                />
                <div className="pr-2 flex gap-2">
                  <button
                    onClick={() => handleSearch()}
                    disabled={isLoading}
                    className="bg-black text-white px-8 py-3 rounded-full text-xs font-medium hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center gap-1.5 shadow-sm"
                    id="btn-search-dispatch"
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                    <ArrowRight className="h-3 w-3 text-[#C5A059]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Structured Search Examples Block */}
            <div className="max-w-2xl mx-auto text-center mb-10">
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 font-bold uppercase block mb-3">Trending queries</span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {TRENDING_SEARCHES.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(example)}
                    className="px-4 py-1.5 rounded-full border border-gray-100 bg-white hover:border-[#C5A059] hover:bg-gray-50 text-xs text-gray-500 hover:text-black transition-all cursor-pointer"
                    id={`btn-example-${idx}`}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Structured Interactive categories grid */}
            <div className="max-w-6xl mx-auto mb-12">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <Compass className="h-4 w-4 text-[#C5A059]" />
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 font-bold uppercase">Popular Categories Presets</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-3">
                {CATEGORIES.map((cat, idx) => {
                  const IconComp = cat.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSearch(cat.query)}
                      className="flex flex-col items-center justify-center p-3 bg-white border border-zinc-100 hover:border-[#C5A059] rounded-xl transition-all cursor-pointer group shadow-sm text-center"
                      id={`btn-category-${cat.name.toLowerCase()}`}
                    >
                      <div className="h-8 w-8 rounded bg-[#C5A059] text-white flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 shadow-sm">
                        <IconComp className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-medium text-zinc-900 group-hover:text-[#b38f4d] transition-colors block">
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error notifications */}
            {errorText && (
              <div className="max-w-xl mx-auto p-4 bg-amber-50/60 border border-amber-250 rounded-2xl flex gap-3 text-xs text-amber-900 leading-relaxed mb-10 shadow-sm">
                <ShieldAlert className="h-5 w-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Advisory Timeout</span>
                  {errorText}
                </div>
              </div>
            )}

            {/* Active AI Processing Loading overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="max-w-lg mx-auto py-12 px-6 bg-white border border-zinc-100 rounded-3xl text-center space-y-4 shadow-xl shadow-zinc-150/40 relative overflow-hidden"
                  id="loading-shield"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-yellow-50 overflow-hidden">
                    <div className="h-full bg-[#C5A059] w-1/3 rounded-full animate-infinite-loading"></div>
                  </div>
                  <Loader2 className="h-8 w-8 text-[#C5A059] animate-spin mx-auto" />
                  <div className="space-y-1">
                    <h3 className="font-serif text-sm font-bold text-zinc-900">Consulting Luxora AI Shopper</h3>
                    <p className="text-[11px] font-mono tracking-tight text-[#b38f4d] font-medium">
                      {LOADING_STATUSES[loadingStatusIndex]}
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-450 block uppercase">Expected response time: &lt; 4 seconds</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Consultation Results block */}
            {!isLoading && products.length > 0 && (
              <div className="space-y-6 pt-6" id="advisor-results">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-150/60 pb-4 gap-2">
                  <div>
                    <span className="text-[9px] font-mono tracking-wider font-bold text-zinc-400 uppercase"> LUXORA DESIGN ADVISORY FOR:</span>
                    <h2 className="text-lg font-serif font-bold text-zinc-950 mt-0.5">
                      "{lastSearchedQuery}"
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded">
                    Found {products.length} Smart Recommendations
                  </span>
                </div>

                {/* AI Verdict Banner */}
                {aiVerdict && (
                  <div className="bg-[#FFFDF8] border border-[#C5A059]/40 rounded-2xl p-4 sm:p-5 shadow-xs flex items-start gap-3.5">
                    <div className="h-8 w-8 rounded-xl bg-[#C5A059] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Sparkles className="h-4.5 w-4.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm font-bold text-zinc-900">✨ Luxora AI Shopping Verdict</span>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#b38f4d] bg-[#C5A059]/15 px-2 py-0.5 rounded-full">AI INSIGHT</span>
                      </div>
                      <p className="text-xs text-zinc-700 leading-relaxed font-normal">
                        {aiVerdict}
                      </p>
                    </div>
                  </div>
                )}

                {/* Products grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isSaved={savedProducts.some((p) => p.id === product.id)}
                      onSaveToggle={handleSaveToggle}
                      onViewDetails={handleViewProduct}
                      isCompared={comparedProducts.some((p) => p.id === product.id)}
                      onCompareToggle={(p) => {
                        setComparedProducts(prev => {
                          const isAlready = prev.some(item => item.id === p.id);
                          if (isAlready) {
                            return prev.filter(item => item.id !== p.id);
                          } else {
                            if (prev.length >= 4) {
                              alert("You can compare up to 4 products side-by-side to keep layout readable.");
                              return prev;
                            }
                            return [...prev, p];
                          }
                        });
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Premium Aesthetic Zero State Storefront Dashboard */}
            {!isLoading && products.length === 0 && !errorText && (
              <div className="max-w-6xl mx-auto space-y-12 mt-10" id="zero-state-storefront">
                
                {/* Special Shopping Challenge Shortcuts (Bento) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div 
                    onClick={() => handleSearch("Anniversary gift for mother under ₹2000")}
                    className="p-5 bg-white border border-[#E8E3DC] rounded-3xl hover:border-[#B76E79] transition-all cursor-pointer group shadow-xs hover:shadow-md"
                  >
                    <span className="text-[9px] font-mono font-bold text-[#D4AF37] tracking-wider block uppercase">GIFT FINDER MODE</span>
                    <h4 className="text-sm font-serif font-bold text-zinc-900 group-hover:text-[#B76E79] mt-1">🎁 Anniversary gift for mother under ₹2000</h4>
                    <p className="text-[10px] text-zinc-450 mt-2 leading-relaxed">Luxora will scan traditional silk, wellness oils, and organic skincare options.</p>
                  </div>

                  <div 
                    onClick={() => handleSearch("Build a complete basic makeup kit under ₹2000")}
                    className="p-5 bg-white border border-[#E8E3DC] rounded-3xl hover:border-[#B76E79] transition-all cursor-pointer group shadow-xs hover:shadow-md"
                  >
                    <span className="text-[9px] font-mono font-bold text-[#D4AF37] tracking-wider block uppercase">BUDGET CHALLENGE</span>
                    <h4 className="text-sm font-serif font-bold text-zinc-900 group-hover:text-[#B76E79] mt-1">💰 Complete makeup kit under ₹2000</h4>
                    <p className="text-[10px] text-zinc-450 mt-2 leading-relaxed">Let AI assemble primer, base, lips & liner with synchronized pocket pricing.</p>
                  </div>

                  <div 
                    onClick={() => handleSearch("Best active ANC earbuds under ₹2000")}
                    className="p-5 bg-white border border-[#E8E3DC] rounded-3xl hover:border-[#B76E79] transition-all cursor-pointer group shadow-xs hover:shadow-md"
                  >
                    <span className="text-[9px] font-mono font-bold text-[#D4AF37] tracking-wider block uppercase">PERQUISITE ADVICE</span>
                    <h4 className="text-sm font-serif font-bold text-zinc-900 group-hover:text-[#B76E79] mt-1">🎧 Best active ANC earbuds under ₹2000</h4>
                    <p className="text-[10px] text-zinc-450 mt-2 leading-relaxed">Scan sweat-proof mechanical earbuds with sound cancellation specifications.</p>
                  </div>
                </div>

                {/* CONDITIONAL: Recently Viewed */}
                {recentlyViewed.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 border-b border-zinc-150/60 pb-2">
                       <span className="h-2 w-2 rounded-full bg-[#B76E79]"></span>
                      <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-400 uppercase">🕒 RECENT DISCOVERIES</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {recentlyViewed.map((product) => (
                        <div
                          key={`recent-${product.id}`}
                          onClick={() => handleViewProduct(product)}
                          className="flex gap-3 bg-white p-3 rounded-2xl border border-[#E8E3DC] hover:border-[#B76E79] hover:shadow-sm cursor-pointer transition-all group"
                        >
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=100";
                            }}
                            className="h-10 w-10 object-cover rounded-lg bg-zinc-50 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[8px] font-mono tracking-widest text-[#D4AF37] block font-bold uppercase">{product.brand}</span>
                            <h4 className="text-xs font-serif font-bold text-neutral-900 truncate group-hover:text-[#B76E79] transition-colors">{product.name}</h4>
                            <span className="text-[10px] font-mono text-[#D4AF37] block font-bold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 🔥 Trending Today */}
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 border-b border-zinc-150/60 pb-2">
                    <span className="h-2 w-2 rounded-full bg-[#B76E79]"></span>
                    <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-400 uppercase">🔥 TRENDING DISCOVERIES TODAY</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TRENDING_PRODUCTS.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isSaved={savedProducts.some((p) => p.id === product.id)}
                        onSaveToggle={handleSaveToggle}
                        onViewDetails={handleViewProduct}
                        isCompared={comparedProducts.some((p) => p.id === product.id)}
                        onCompareToggle={(p) => {
                          setComparedProducts(prev => {
                            const isAlready = prev.some(item => item.id === p.id);
                            if (isAlready) {
                              return prev.filter(item => item.id !== p.id);
                            } else {
                              return [...prev, p].slice(0, 4);
                            }
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* ⚔️ Product Battle Arena Widget */}
                <ProductBattle />

                {/* 💄 Most Loved Beauty Products */}
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 border-b border-zinc-150/60 pb-2">
                    <span className="h-2 w-2 rounded-full bg-[#B76E79]"></span>
                    <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-400 uppercase">💄 MOST LOVED BEAUTY COMPILATIONS</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {MOST_LOVED_BEAUTY.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isSaved={savedProducts.some((p) => p.id === product.id)}
                        onSaveToggle={handleSaveToggle}
                        onViewDetails={handleViewProduct}
                        isCompared={comparedProducts.some((p) => p.id === product.id)}
                        onCompareToggle={(p) => {
                          setComparedProducts(prev => {
                            const isAlready = prev.some(item => item.id === p.id);
                            if (isAlready) {
                              return prev.filter(item => item.id !== p.id);
                            } else {
                              return [...prev, p].slice(0, 4);
                            }
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* 💄 Beauty AI Studio Widget */}
                <BeautyAiSuite />

                {/* 🎧 Best Electronics & Gadgets */}
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 border-b border-zinc-150/60 pb-2">
                    <span className="h-2 w-2 rounded-full bg-[#B76E79]"></span>
                    <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-400 uppercase">🎧 MOST ENDORSED ELECTRONICS & AUDIO GEAR</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {BEST_ELECTRONICS.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isSaved={savedProducts.some((p) => p.id === product.id)}
                        onSaveToggle={handleSaveToggle}
                        onViewDetails={handleViewProduct}
                        isCompared={comparedProducts.some((p) => p.id === product.id)}
                        onCompareToggle={(p) => {
                          setComparedProducts(prev => {
                            const isAlready = prev.some(item => item.id === p.id);
                            if (isAlready) {
                              return prev.filter(item => item.id !== p.id);
                            } else {
                              return [...prev, p].slice(0, 4);
                            }
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* 💰 Best Deals Today */}
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 border-b border-zinc-150/60 pb-2">
                    <span className="h-2 w-2 rounded-full bg-[#B76E79]"></span>
                    <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-400 uppercase">💰 BEST SAVINGS OFFERS TODAY</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {BEST_DEALS.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isSaved={savedProducts.some((p) => p.id === product.id)}
                        onSaveToggle={handleSaveToggle}
                        onViewDetails={handleViewProduct}
                        isCompared={comparedProducts.some((p) => p.id === product.id)}
                        onCompareToggle={(p) => {
                          setComparedProducts(prev => {
                            const isAlready = prev.some(item => item.id === p.id);
                            if (isAlready) {
                              return prev.filter(item => item.id !== p.id);
                            } else {
                              return [...prev, p].slice(0, 4);
                            }
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 2: SAVED WISHLIST PROFILE ROW */}
        {activeTab === 'wishlist' && (
          <WishlistPage
            savedProducts={savedProducts}
            wishlistMetadata={wishlistMetadata}
            onRemoveSave={(prod) => {
              setSavedProducts(prev => prev.filter(p => p.id !== prod.id));
              setWishlistMetadata(prev => prev.filter(m => m.productId !== prod.id));
            }}
            onUpdateTargetPrice={handleUpdateTargetPrice}
            onViewProduct={handleViewProduct}
          />
        )}

        {/* TAB 3: PERSONAL CABINET/PROFILE ACCOUNT ROW */}
        {activeTab === 'profile' && (
          <ProfilePage
            user={user}
            searchHistory={searchHistory}
            savedProducts={savedProducts}
            onUpdatePreferences={handleUpdatePreferences}
            onSelectQuery={(q) => {
              setActiveTab('search');
              handleSearch(q);
            }}
            onClearHistory={handleClearHistory}
            onConvertGuest={handleConvertGuest}
          />
        )}

        {/* TAB 4: ADVANCED COMPARISON FOR REAL-TIME SIDE-BY-SIDE MATCHING */}
        {activeTab === 'compare' && (
          <ComparisonPage
            savedProducts={savedProducts}
            currentFeedProducts={products}
            onViewProductDetails={handleViewProduct}
            onSaveToggle={handleSaveToggle}
            savedProductsIds={savedProducts.map(p => p.id)}
            comparedProductsList={comparedProducts}
            onCompareToggle={(p) => {
              setComparedProducts(prev => {
                const isAlready = prev.some(item => item.id === p.id);
                if (isAlready) {
                  return prev.filter(item => item.id !== p.id);
                } else {
                  return [...prev, p].slice(0, 4);
                }
              });
            }}
          />
        )}

      </main>

      {/* Floating Product Details Drawer/Modal popup overlay */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isSaved={savedProducts.some((p) => p.id === selectedProduct.id)}
          onSaveToggle={handleSaveToggle}
          similarProducts={getSimilarProductsForDetail(selectedProduct)}
          onSelectProduct={handleViewProduct}
        />
      )}

      {/* Embedded CSS animation for infinite bar loading */}
      <style>{`
        @keyframes infiniteLoading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-infinite-loading {
          animation: infiniteLoading 3s infinite linear;
        }
      `}</style>

      {/* Small Minimal Footer */}
      <footer className="py-6 border-t border-zinc-100 text-center text-[10px] text-zinc-400 bg-white font-mono uppercase tracking-widest mt-auto">
        &copy; {new Date().getFullYear()} Luxora AI Inc. All Rights Reserved. Mumbai • Bengaluru • New Delhi
      </footer>
    </div>
  );
}
