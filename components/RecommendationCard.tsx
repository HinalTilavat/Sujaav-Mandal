import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Star, ThumbsUp, CircleAlert as AlertCircle } from 'lucide-react-native';
import { Recommendation } from '../app/services/geminiService';
import { router } from 'expo-router';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onPress: () => void;
}

export function RecommendationCard({ recommendation, onPress }: RecommendationCardProps) {
  const { product, matchScore, reasoning, pros, cons } = recommendation;

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
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
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => router.push(`/product/${product.id}`)}
    >
      {/* Match Score Badge */}
      <View style={[styles.matchBadge, { backgroundColor: getMatchColor(matchScore) }]}>
        <Star size={12} color="#ffffff" fill="#ffffff" />
        <Text style={styles.matchScore}>{matchScore}% Match</Text>
      </View>

      <View style={styles.content}>
        {/* Product Image */}
        <Image
          source={{ uri: getProductImage(product.category) }}
          style={styles.productImage}
        />

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
          </View>
          
          <Text style={styles.productName} numberOfLines={2}>
            {product.product_name}
          </Text>
          
          <Text style={styles.category}>{product.category}</Text>
        </View>
      </View>

      {/* AI Reasoning */}
      <View style={styles.reasoningContainer}>
        <Text style={styles.reasoningTitle}>Why this matches:</Text>
        <Text style={styles.reasoning} numberOfLines={3}>
          {reasoning}
        </Text>
      </View>

      {/* Pros and Cons */}
      <View style={styles.prosConsContainer}>
        {pros.length > 0 && (
          <View style={styles.prosContainer}>
            <View style={styles.prosHeader}>
              <ThumbsUp size={14} color="#10b981" />
              <Text style={styles.prosTitle}>Pros</Text>
            </View>
            {pros.slice(0, 2).map((pro, index) => (
              <Text key={index} style={styles.proText}>
                • {pro}
              </Text>
            ))}
          </View>
        )}

        {cons.length > 0 && (
          <View style={styles.consContainer}>
            <View style={styles.consHeader}>
              <AlertCircle size={14} color="#f59e0b" />
              <Text style={styles.consTitle}>Consider</Text>
            </View>
            {cons.slice(0, 1).map((con, index) => (
              <Text key={index} style={styles.conText}>
                • {con}
              </Text>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  matchBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    zIndex: 1,
  },
  matchScore: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    padding: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  brand: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    lineHeight: 20,
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#6b7280',
  },
  reasoningContainer: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  reasoningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  reasoning: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 18,
  },
  prosConsContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    gap: 16,
  },
  prosContainer: {
    flex: 1,
  },
  prosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  prosTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
    textTransform: 'uppercase',
  },
  proText: {
    fontSize: 12,
    color: '#059669',
    lineHeight: 16,
    marginBottom: 2,
  },
  consContainer: {
    flex: 1,
  },
  consHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  consTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f59e0b',
    textTransform: 'uppercase',
  },
  conText: {
    fontSize: 12,
    color: '#d97706',
    lineHeight: 16,
    marginBottom: 2,
  },
});