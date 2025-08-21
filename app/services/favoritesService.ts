import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../data/products';

const FAVORITES_KEY = 'favorites';

class FavoritesService {
  async getFavorites(): Promise<Product[]> {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
      return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  async addFavorite(product: Product): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const isAlreadyFavorite = favorites.some(fav => fav.id === product.id);
      
      if (!isAlreadyFavorite) {
        const updatedFavorites = [...favorites, product];
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  }

  async removeFavorite(productId: number): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== productId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  async isFavorite(productId: number): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(fav => fav.id === productId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }

  async clearFavorites(): Promise<void> {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  }
}

export const favoritesService = new FavoritesService();