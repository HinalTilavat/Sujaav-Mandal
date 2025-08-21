import { useState, useEffect, useCallback } from 'react';
import { Product } from '../data/products';
import { favoritesService } from '../services/favoritesService';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      const favs = await favoritesService.getFavorites();
      setFavorites(favs);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addFavorite = useCallback(async (product: Product) => {
    try {
      await favoritesService.addFavorite(product);
      await loadFavorites();
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  }, [loadFavorites]);

  const removeFavorite = useCallback(async (productId: number) => {
    try {
      await favoritesService.removeFavorite(productId);
      await loadFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }, [loadFavorites]);

  const isFavorite = useCallback((productId: number) => {
    return favorites.some(fav => fav.id === productId);
  }, [favorites]);

  const clearFavorites = useCallback(async () => {
    try {
      await favoritesService.clearFavorites();
      setFavorites([]);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
    refreshFavorites: loadFavorites,
  };
}