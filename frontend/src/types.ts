export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number; // in INR
  matchScore: number; // 0-100
  reason: string; // Dynamic recommendation reason
  pros: string[];
  cons: string[];
  description: string;
  features: string[];
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  buyUrl: string;
  specs: Record<string, string>;
  similarProductIds?: string[];
  reviewHighlights?: string[];
  discoveryLabel?: string;
}

export interface UserProfile {
  email: string | null;
  name: string;
  isGuest: boolean;
  preferences: {
    budgetPreference: 'budget' | 'balanced' | 'premium' | 'unlimited';
    gender?: 'Unisex' | 'Men' | 'Women';
    focus?: string[];
  };
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  category?: string;
  recommendationsCount: number;
}

export interface WishlistItem {
  productId: string;
  savedAt: string;
  priceAtSave: number;
  currentPrice: number;
  targetPrice?: number;
}
