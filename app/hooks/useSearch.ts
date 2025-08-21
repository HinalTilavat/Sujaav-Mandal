import { useState, useCallback } from 'react';
import { Product } from '../data/products';
import { geminiService, Recommendation } from '../services/geminiService';

export function useSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, products: Product[]) => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await geminiService.getRecommendations(query, products);
      setRecommendations(results);
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setRecommendations([]);
    setError(null);
  }, []);

  return {
    isLoading,
    recommendations,
    error,
    search,
    clearResults,
  };
}