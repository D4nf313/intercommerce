import { useQuery } from '@tanstack/react-query';
import type { Product, ProductsResponse } from '../types/index';
import {
  getProducts,
  searchProducts,
  getProductsByCategory,
  getProductById,
  getCategories,
} from '../services/productService';

export const useProducts = (limit: number, skip: number) =>
  useQuery<ProductsResponse>({
    queryKey: ['products', limit, skip],
    queryFn: () => getProducts(limit, skip),
  });

export const useSearchProducts = (query: string, limit: number, skip: number) =>
  useQuery<ProductsResponse>({
    queryKey: ['products', 'search', query, limit, skip],
    queryFn: () => searchProducts(query, limit, skip),
    enabled: query.length > 0,
  });

export const useProductsByCategory = (category: string, limit: number, skip: number) =>
  useQuery<ProductsResponse>({
    queryKey: ['products', 'category', category, limit, skip],
    queryFn: () => getProductsByCategory(category, limit, skip),
    enabled: category.length > 0,
  });

export const useProductById = (id: number) =>
  useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
  });

export const useCategories = () =>
  useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 3_600_000,
  });
