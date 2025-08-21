import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Trash2 } from 'lucide-react-native';
import { ProductCard } from '../../components/ProductCard';
import { favoritesService } from '../services/favoritesService';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favs = await favoritesService.getFavorites();
    setFavorites(favs);
  };

  const removeFavorite = async (productId) => {
    await favoritesService.removeFavorite(productId);
    loadFavorites();
  };

  const clearAllFavorites = async () => {
    await favoritesService.clearFavorites();
    setFavorites([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Heart size={28} color="#ef4444" />
          <View style={styles.headerText}>
            <Text style={styles.title}>Favorites</Text>
            <Text style={styles.subtitle}>
              {favorites.length} saved {favorites.length === 1 ? 'product' : 'products'}
            </Text>
          </View>
        </View>
        
        {favorites.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAllFavorites}
          >
            <Trash2 size={20} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Heart size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySubtitle}>
              Start exploring products and add them to your favorites to see them here
            </Text>
          </View>
        ) : (
          <View style={styles.favoritesGrid}>
            {favorites.map((product, index) => (
              <ProductCard
                key={index}
                product={product}
                onPress={() => {/* Navigate to product detail */}}
                onFavoritePress={() => removeFavorite(product.id)}
                isFavorite={true}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  clearButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  favoritesGrid: {
    gap: 16,
  },
});