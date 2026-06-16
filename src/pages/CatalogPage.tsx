import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts, useSearchProducts, useProductsByCategory, useCategories } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import FilterBar from '../components/catalog/FilterBar';
import ProductGrid from '../components/catalog/ProductGrid';
import Toast from '../components/ui/Toast';
import type { Product } from '../types/index';

const LIMIT = 12;

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [category, setCategory] = useState(searchParams.get('category') ?? '');
  const [page, setPage] = useState(Number(searchParams.get('page') ?? '1'));
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const addItem = useCartStore((s) => s.addItem);

  const skip = (page - 1) * LIMIT;

  const hasSearch = search.length > 0;
  const hasCategory = !hasSearch && category.length > 0;

  const productsQuery = useProducts(LIMIT, skip);
  const searchQuery = useSearchProducts(search, LIMIT, skip);
  const categoryQuery = useProductsByCategory(category, LIMIT, skip);
  const categoriesQuery = useCategories();

  const activeQuery = hasSearch ? searchQuery : hasCategory ? categoryQuery : productsQuery;
  const { data, isLoading, error } = activeQuery;

  // Sync state → URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (page > 1) params.page = String(page);
    setSearchParams(params, { replace: true });
  }, [search, category, page, setSearchParams]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value);
    setPage(1);
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    addItem(product);
    setToastMessage(`"${product.title}" agregado al carrito`);
    setShowToast(true);
  }, [addItem]);

  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <>
      <style>{`
        .catalog {
          max-width: 1400px;
          margin: 0 auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .catalog__header {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .catalog__title {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
          color: #111;
        }
        .catalog__total {
          font-size: 13px;
          color: #6b7280;
        }
        .catalog__error {
          text-align: center;
          padding: 48px 0;
          color: #ef4444;
          font-size: 15px;
        }
        .catalog__pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 8px 0;
        }
        .catalog__page-info {
          font-size: 14px;
          color: #374151;
        }
        .catalog__btn {
          padding: 8px 20px;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: #fff;
          color: #374151;
          cursor: pointer;
          transition: background 0.15s;
        }
        .catalog__btn:hover:not(:disabled) {
          background: #f3f4f6;
        }
        .catalog__btn:disabled {
          opacity: 0.4;
          cursor: default;
        }
      `}</style>

      <main className="catalog">
        <div className="catalog__header">
          <h1 className="catalog__title">Catálogo de productos</h1>
          <FilterBar
            search={search}
            onSearchChange={handleSearchChange}
            category={category}
            onCategoryChange={handleCategoryChange}
            categories={categoriesQuery.data ?? []}
          />
          {!isLoading && !error && (
            <p className="catalog__total">
              {total} {total === 1 ? 'resultado' : 'resultados'}
            </p>
          )}
        </div>

        {error ? (
          <p className="catalog__error">Error al cargar productos.</p>
        ) : (
          <ProductGrid
            products={data?.products ?? []}
            isLoading={isLoading}
            skeletonCount={LIMIT}
            onAddToCart={handleAddToCart}
          />
        )}

        {!isLoading && !error && totalPages > 1 && (
          <div className="catalog__pagination">
            <button
              className="catalog__btn"
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
              type="button"
            >
              Anterior
            </button>
            <span className="catalog__page-info">
              Página {page} de {totalPages}
            </span>
            <button
              className="catalog__btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              type="button"
            >
              Siguiente
            </button>
          </div>
        )}
      </main>

      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default CatalogPage;
