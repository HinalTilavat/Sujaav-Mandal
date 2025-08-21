import { Product } from '../data/products';

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
}

export class SearchUtils {
  static filterProducts(products: Product[], filters: SearchFilters): Product[] {
    return products.filter(product => {
      if (filters.category && filters.category !== 'All' && product.category !== filters.category) {
        return false;
      }
      
      if (filters.minPrice && product.price < filters.minPrice) {
        return false;
      }
      
      if (filters.maxPrice && product.price > filters.maxPrice) {
        return false;
      }
      
      if (filters.brand && product.brand.toLowerCase() !== filters.brand.toLowerCase()) {
        return false;
      }
      
      return true;
    });
  }

  static searchProducts(products: Product[], query: string): Product[] {
    if (!query.trim()) return products;

    const searchTerms = query.toLowerCase().split(' ');
    
    return products.filter(product => {
      const searchableText = `
        ${product.product_name} 
        ${product.description} 
        ${product.brand} 
        ${product.category}
      `.toLowerCase();

      return searchTerms.some(term => searchableText.includes(term));
    });
  }

  static sortProducts(products: Product[], sortBy: 'price-asc' | 'price-desc' | 'name' | 'relevance'): Product[] {
    const sorted = [...products];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.product_name.localeCompare(b.product_name));
      case 'relevance':
      default:
        return sorted;
    }
  }

  static getUniqueCategories(products: Product[]): string[] {
    return [...new Set(products.map(p => p.category))].sort();
  }

  static getUniqueBrands(products: Product[]): string[] {
    return [...new Set(products.map(p => p.brand))].sort();
  }

  static getPriceRange(products: Product[]): { min: number; max: number } {
    const prices = products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }
}