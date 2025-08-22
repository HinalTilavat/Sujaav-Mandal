import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Mic, Sparkles, Filter } from 'lucide-react-native';
import { PRODUCT_CATALOG } from '../data/products';
import { ProductCard } from '../../components/ProductCard';
import { RecommendationCard } from '../../components/RecommendationCard';
import { geminiService } from '../services/geminiService';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  
  const inputRef = useRef(null);

  const categories = ['All', ...new Set(PRODUCT_CATALOG.map(p => p.category))];

  const handleSearch = async () => {
    if (!query.trim()) {
      Alert.alert('Please enter a search query');
      return;
    }

    setIsLoading(true);
    try {
      const results = await geminiService.getRecommendations(query, PRODUCT_CATALOG);
      setRecommendations(results);
    } catch (error) {
      Alert.alert('Error', 'Failed to get recommendations. Please try again.');
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = PRODUCT_CATALOG.filter(product => {
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
    const priceMatch = product.price >= priceRange.min && product.price <= priceRange.max;
    return categoryMatch && priceMatch;
  });

  const exampleQueries = [
    "I need a device to help with chronic back pain",
    "Looking for smart security for my apartment",
    "Want entertainment gadgets for my 8-year-old",
    "Need kitchen appliances for healthy meal prep",
    "Looking for mobility aids for elderly parent",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Product Search</Text>
        <Text style={styles.subtitle}>Describe what you need in natural language</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6b7280" />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Describe what you're looking for..."
            value={query}
            onChangeText={setQuery}
            multiline
            maxLength={500}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.micButton}>
            <Mic size={20} color="#6366f1" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.searchActionButton]}
            onPress={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Sparkles size={16} color="#ffffff" />
                <Text style={styles.searchActionText}>Get AI Recommendations</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.filterButton]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} color="#6366f1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryFilters}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryFilter,
                    selectedCategory === category && styles.categoryFilterActive
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryFilterText,
                    selectedCategory === category && styles.categoryFilterTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Recommendations</Text>
            {recommendations.map((rec, index) => (
              <RecommendationCard
                key={index}
                recommendation={rec}
              />
            ))}
          </View>
        )}

        {/* Example Queries */}
        {recommendations.length === 0 && !isLoading && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Try These Examples</Text>
            {exampleQueries.map((example, index) => (
              <TouchableOpacity
                key={index}
                style={styles.exampleQuery}
                onPress={() => setQuery(example)}
              >
                <Text style={styles.exampleQueryText}>{example}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Browse Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Browse Products {selectedCategory !== 'All' && `(${selectedCategory})`}
          </Text>
          <View style={styles.productsGrid}>
            {filteredProducts.slice(0, 10).map((product, index) => (
              <ProductCard
                key={index}
                product={product}
              />
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
    padding: 20,
    paddingTop: 10,
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
  searchContainer: {
    padding: 20,
    paddingTop: 0,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    minHeight: 24,
    maxHeight: 120,
  },
  micButton: {
    padding: 4,
  },
  searchActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchActionButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
  },
  searchActionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  filterButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  filtersContainer: {
    padding: 20,
    paddingTop: 0,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  categoryFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryFilterActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  categoryFilterText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  categoryFilterTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  exampleQuery: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  exampleQueryText: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
  },
  productsGrid: {
    gap: 12,
  },
});