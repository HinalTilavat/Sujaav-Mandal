import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Heart } from 'lucide-react-native';
import { Product } from '../app/data/products';
import { favoritesService } from '../app/services/favoritesService';

const { width } = Dimensions.get('window');

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

export function ProductCard({ 
  product, 
  onPress, 
  onFavoritePress,
  isFavorite: initialFavorite = false 
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  useEffect(() => {
    checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    const favoriteStatus = await favoritesService.isFavorite(product.id);
    setIsFavorite(favoriteStatus);
  };

  const handleFavoritePress = async () => {
    if (isFavorite) {
      await favoritesService.removeFavorite(product.id);
      setIsFavorite(false);
    } else {
      await favoritesService.addFavorite(product);
      setIsFavorite(true);
    }
    
    if (onFavoritePress) {
      onFavoritePress();
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

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: getProductImage(product.category) }}
          style={styles.image}
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
        >
          <Heart
            size={20}
            color={isFavorite ? "#ef4444" : "#9ca3af"}
            fill={isFavorite ? "#ef4444" : "transparent"}
          />
        </TouchableOpacity>
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>{formatPrice(product.price)}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>
          {product.product_name}
        </Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {product.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#1f2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  brand: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    lineHeight: 22,
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});