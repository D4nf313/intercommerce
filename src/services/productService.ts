import axios from 'axios';
import type { Product, ProductsResponse } from '../types/index';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
});

export const getProducts = async (limit: number, skip: number): Promise<ProductsResponse> => {
  const { data } = await api.get<ProductsResponse>('/products', { params: { limit, skip } });
  return data;
};

export const searchProducts = async (query: string, limit: number, skip: number): Promise<ProductsResponse> => {
  const { data } = await api.get<ProductsResponse>('/products/search', { params: { q: query, limit, skip } });
  return data;
};

export const getProductsByCategory = async (category: string, limit: number, skip: number): Promise<ProductsResponse> => {
  const { data } = await api.get<ProductsResponse>(`/products/category/${category}`, { params: { limit, skip } });
  return data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
};

export const getCategories = async (): Promise<string[]> => {
  const { data } = await api.get<{ slug: string; name: string; url: string }[]>('/products/categories');
  return data.map((c) => c.slug);
};
