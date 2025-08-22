import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, TrendingUp, Star, Zap } from 'lucide-react-native';
import { router } from 'expo-router';
import { PRODUCT_CATALOG } from '../data/products';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingCategories, setTrendingCategories] = useState([]);

  useEffect(() => {
    // Get featured products (highest priced items from different categories)
    const categories = [...new Set(PRODUCT_CATALOG.map(p => p.category))];
    const featured = categories.slice(0, 4).map(category => {
      const categoryProducts = PRODUCT_CATALOG.filter(p => p.category === category);
      return categoryProducts.reduce((prev, current) => 
        prev.price > current.price ? prev : current
      );
    });
    setFeaturedProducts(featured);

    // Get trending categories with counts
    const categoryCounts = categories.map(category => ({
      name: category,
      count: PRODUCT_CATALOG.filter(p => p.category === category).length,
      icon: getCategoryIcon(category),
    }));
    setTrendingCategories(categoryCounts);
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      'Healthtech and Wellness': '🏥',
      'Personal Care': '💄',
      'Entertainment': '🎮',
      'Kitchen Appliances': '🍳',
      'Home Improvement': '🏠',
      'Travel & Lifestyle': '✈️',
      'Smart Mobility': '🚗',
      'Security & Surveillance': '🔒',
    };
    return icons[category] || '📦';
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>AI Product Advisor</Text>
          <Text style={styles.headerSubtitle}>
            Discover products that match your needs perfectly
          </Text>
          
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => router.push('/search')}
          >
            <Search size={20} color="#6366f1" />
            <Text style={styles.searchButtonText}>
              Describe what you're looking for...
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#10b981" />
            <Text style={styles.statNumber}>{PRODUCT_CATALOG.length}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <Star size={24} color="#f59e0b" />
            <Text style={styles.statNumber}>{trendingCategories.length}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statCard}>
            <Zap size={24} color="#8b5cf6" />
            <Text style={styles.statNumber}>AI</Text>
            <Text style={styles.statLabel}>Powered</Text>
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredProducts.map((product, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.productCard}
                onPress={() => router.push(`/product/${product.id}`)}
              >
                <View style={styles.productImageContainer}>
                  <Image
                    source={{ uri: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg' }}
                    style={styles.productImage}
                  />
                  <View style={styles.priceTag}>
                    <Text style={styles.priceText}>{formatPrice(product.price)}</Text>
                  </View>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productBrand}>{product.brand}</Text>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.product_name}
                  </Text>
                  <Text style={styles.productCategory}>{product.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <View style={styles.categoriesGrid}>
            {trendingCategories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryCard}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName} numberOfLines={2}>
                  {category.name}
                </Text>
                <Text style={styles.categoryCount}>
                  {category.count} products
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Example Queries */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Try These Searches</Text>
          <View style={styles.exampleQueries}>
            {[
              "I need a device to help with back pain",
              "Looking for smart home security solutions",
              "Want entertainment gadgets for kids",
              "Need kitchen appliances for healthy cooking"
            ].map((query, index) => (
              <TouchableOpacity
                key={index}
                style={styles.exampleQuery}
                onPress={() => router.push(`/search?query=${encodeURIComponent(query)}`)}
              >
                <Text style={styles.exampleQueryText}>{query}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    marginBottom: 24,
  },
  searchButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  searchButtonText: {
    color: '#6b7280',
    fontSize: 16,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  productCard: {
    width: width * 0.7,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  priceTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#1f2937',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 16,
  },
  productBrand: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 4,
    lineHeight: 20,
  },
  productCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 56) / 2,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  exampleQueries: {
    gap: 12,
  },
  exampleQuery: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  exampleQueryText: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
  },
});