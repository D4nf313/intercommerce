import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach } from 'vitest';
import ProductCard from '../components/catalog/ProductCard';
import CartDrawer from '../components/cart/CartDrawer';
import { useCartStore } from '../store/cartStore';
import type { Product } from '../types/index';

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 100,
  description: 'A test product',
  discountPercentage: 0,
  rating: 4.5,
  stock: 10,
  brand: 'TestBrand',
  category: 'test-category',
  thumbnail: 'https://via.placeholder.com/150',
  images: ['https://via.placeholder.com/150'],
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
  return Wrapper;
};

describe('Cart integration', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('adds a product to the cart when clicking "Agregar al carrito"', () => {
    const Wrapper = createWrapper();
    const handleAddToCart = (product: Product) => {
      useCartStore.getState().addItem(product);
    };

    render(
      <Wrapper>
        <ProductCard product={mockProduct} onAddToCart={handleAddToCart} />
      </Wrapper>
    );

    const button = screen.getByRole('button', { name: /agregar al carrito/i });
    fireEvent.click(button);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(1);
    expect(items[0].quantity).toBe(1);
  });

  it('increments quantity when adding the same product twice', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().addItem(mockProduct);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it('renders CartDrawer with correct total after adding a product', () => {
    useCartStore.getState().addItem(mockProduct);

    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <CartDrawer isOpen={true} onClose={() => {}} />
      </Wrapper>
    );

    // price $100 + 16% tax = $116
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$100.00 c/u')).toBeInTheDocument();
    expect(screen.getByText('$116.00')).toBeInTheDocument();
  });

  it('removes an item from the cart', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().removeItem(1);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it('clears the cart', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().clearCart();

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });
});
