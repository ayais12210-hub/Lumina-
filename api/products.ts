import { MOCK_PRODUCTS } from '../constants';
import { ProductListingItem, ProductDetailViewModel, ProductStatus, ApiResponse } from '../types';

const SIMULATED_DELAY = 600;

export const productsApi = {
  getAll: async (category?: string): Promise<ApiResponse<ProductListingItem[]>> => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));

    let filtered = MOCK_PRODUCTS.filter(p => p.status === ProductStatus.ACTIVE);
    
    if (category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    const data: ProductListingItem[] = filtered.map(p => ({
      id: p.id,
      slug: p.id, // Using ID as slug for mock simplicity
      title: p.title,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      thumbnail: p.images[0],
      hoverImage: p.images[1], // Ensure mock data has 2nd image for effect
      isNew: !!p.isFeatured,
      isSoldOut: p.variants.every(v => v.inventory === 0),
      category: p.category
    }));

    return { success: true, data };
  },

  getById: async (id: string): Promise<ApiResponse<ProductDetailViewModel | null>> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    
    const product = MOCK_PRODUCTS.find(p => p.id === id);

    if (!product) {
      return { 
        success: false, 
        data: null, 
        error: { code: '404', message: 'Product not found' } 
      };
    }

    // Mock related products logic (same category, exclude current)
    const related = MOCK_PRODUCTS
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4)
      .map(p => ({
        id: p.id,
        slug: p.id,
        title: p.title,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        thumbnail: p.images[0],
        isNew: !!p.isFeatured,
        isSoldOut: p.variants.every(v => v.inventory === 0),
        category: p.category
      }));

    const detail: ProductDetailViewModel = {
      ...product,
      relatedProducts: related
    };

    return { success: true, data: detail };
  }
};