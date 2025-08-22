import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  ShoppingCart,
  Info,
  Award,
  Zap
} from 'lucide-react-native';
import { PRODUCT_CATALOG, Product } from '../data/products';
import { favoritesService } from '../services/favoritesService';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (id) {
      const foundProduct = PRODUCT_CATALOG.find(p => p.id === parseInt(id as string));
      if (foundProduct) {
        setProduct(foundProduct);
        checkFavoriteStatus(foundProduct.id);
        loadRelatedProducts(foundProduct);
      }
    }
  }, [id]);

  const checkFavoriteStatus = async (productId: number) => {
    const favoriteStatus = await favoritesService.isFavorite(productId);
    setIsFavorite(favoriteStatus);
  };

  const loadRelatedProducts = (currentProduct: Product) => {
    const related = PRODUCT_CATALOG
      .filter(p => 
        p.category === currentProduct.category && 
        p.id !== currentProduct.id
      )
      .slice(0, 3);
    setRelatedProducts(related);
  };

  const handleFavoritePress = async () => {
    if (!product) return;

    if (isFavorite) {
      await favoritesService.removeFavorite(product.id);
      setIsFavorite(false);
    } else {
      await favoritesService.addFavorite(product);
      setIsFavorite(true);
    }
  };

  const handleShare = async () => {
    if (!product) return;

    try {
      await Share.share({
        message: `Check out this ${product.product_name} by ${product.brand}! ${product.description}`,
        title: product.product_name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const getProductImage = (category: string) => {
    const images = {
      'Healthtech and Wellness': 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg',
      'Personal Care': 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg',
      'Entertainment': 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      'Kitchen Appliances': 'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg',
      'Home Improvement': 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'Travel & Lifestyle': 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg',
      'Smart Mobility': 'https://images.pexels.com/photos/163016/crash-test-collision-60-km-h-distraction-163016.jpeg',
      'Security & Surveillance': 'https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg',
    };
    return images[category] || 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg';
  };

  const getFeatures = (product: Product) => {
    // Extract key features from description
    const features = [
      'Advanced Technology',
      'Easy to Use',
      'Durable Design',
      'Energy Efficient',
    ];
    return features;
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleShare}
            >
              <Share2 size={24} color="#1f2937" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleFavoritePress}
            >
              <Heart
                size={24}
                color={isFavorite ? "#ef4444" : "#1f2937"}
                fill={isFavorite ? "#ef4444" : "transparent"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: getProductImage(product.category) }}
            style={styles.productImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.imageOverlay}
          />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <View style={styles.brandContainer}>
              <Text style={styles.brand}>{product.brand}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{product.category}</Text>
              </View>
            </View>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
          </View>

          <Text style={styles.productName}>{product.product_name}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  color="#fbbf24"
                  fill="#fbbf24"
                />
              ))}
            </View>
            <Text style={styles.ratingText}>4.8 (124 reviews)</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={20} color="#6366f1" />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Key Features */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={20} color="#6366f1" />
            <Text style={styles.sectionTitle}>Key Features</Text>
          </View>
          <View style={styles.featuresContainer}>
            {getFeatures(product).map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Zap size={16} color="#10b981" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Related Products</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.relatedProducts}>
                {relatedProducts.map((relatedProduct) => (
                  <TouchableOpacity
                    key={relatedProduct.id}
                    style={styles.relatedProductCard}
                    onPress={() => router.push(`/product/${relatedProduct.id}`)}
                  >
                    <Image
                      source={{ uri: getProductImage(relatedProduct.category) }}
                      style={styles.relatedProductImage}
                    />
                    <Text style={styles.relatedProductName} numberOfLines={2}>
                      {relatedProduct.product_name}
                    </Text>
                    <Text style={styles.relatedProductPrice}>
                      {formatPrice(relatedProduct.price)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addToCartButton}>
          <ShoppingCart size={20} color="#ffffff" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 300,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  productInfo: {
    padding: 20,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  brandContainer: {
    flex: 1,
  },
  brand: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#ede9fe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '500',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    lineHeight: 30,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  featuresContainer: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
  },
  relatedProducts: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 4,
  },
  relatedProductCard: {
    width: 140,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  relatedProductImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  relatedProductName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    lineHeight: 18,
  },
  relatedProductPrice: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  addToCartButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  addToCartText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});