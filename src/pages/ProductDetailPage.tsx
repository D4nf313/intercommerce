import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductById } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import Toast from '../components/ui/Toast';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const { data: product, isLoading, error } = useProductById(Number(id));

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product);
    setShowToast(true);
  };

  const goToCatalog = () => navigate('/');

  if (isLoading) return <DetailSkeleton />;

  if (error || !product) {
    return (
      <>
        <style>{pageStyles}</style>
        <main className="detail">
          <div className="detail__error">
            <p>Error al cargar el producto.</p>
            <button className="detail__btn-back" onClick={goToCatalog} type="button">
              Volver al catálogo
            </button>
          </div>
        </main>
      </>
    );
  }

  const mainImage = selectedImage ?? product.images[0] ?? product.thumbnail;
  const hasGallery = product.images.length > 1;
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <>
      <style>{pageStyles}</style>

      <main className="detail">
        <button className="detail__btn-back" onClick={goToCatalog} type="button">
          ← Volver al catálogo
        </button>

        <div className="detail__layout">
          {/* Left: images */}
          <div className="detail__images">
            <img
              className="detail__main-img"
              src={mainImage}
              alt={product.title}
            />
            {hasGallery && (
              <div className="detail__thumbnails">
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.title} ${i + 1}`}
                    className={`detail__thumb${(selectedImage ?? product.images[0]) === img ? ' detail__thumb--active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: info */}
          <div className="detail__info">
            <span className="detail__badge">{product.category}</span>
            <h1 className="detail__title">{product.title}</h1>

            <div className="detail__pricing">
              <span className="detail__price">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                  product.discountPercentage > 0 ? discountedPrice : product.price
                )}
              </span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="detail__original-price">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
                  </span>
                  <span className="detail__discount">-{Math.round(product.discountPercentage)}%</span>
                </>
              )}
            </div>

            <div className="detail__meta">
              <span>⭐ {product.rating.toFixed(1)}</span>
              <span className={`detail__stock${product.stock < 10 ? ' detail__stock--low' : ''}`}>
                {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
              </span>
            </div>

            <p className="detail__description">{product.description}</p>

            <button
              className="detail__btn-cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              type="button"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </main>

      {showToast && (
        <Toast
          message={`"${product.title}" agregado al carrito`}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

const DetailSkeleton = () => (
  <>
    <style>{`
      ${pageStyles}
      @keyframes shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      .sk { border-radius: 6px; background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
    `}</style>
    <main className="detail">
      <div className="sk" style={{ height: 32, width: 160, marginBottom: 24 }} />
      <div className="detail__layout">
        <div className="detail__images">
          <div className="sk" style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 10 }} />
        </div>
        <div className="detail__info" style={{ gap: 16 }}>
          <div className="sk" style={{ height: 20, width: '30%' }} />
          <div className="sk" style={{ height: 32, width: '80%' }} />
          <div className="sk" style={{ height: 28, width: '40%' }} />
          <div className="sk" style={{ height: 16, width: '60%' }} />
          <div className="sk" style={{ height: 80, width: '100%' }} />
          <div className="sk" style={{ height: 44, width: '100%', borderRadius: 8 }} />
        </div>
      </div>
    </main>
  </>
);

const pageStyles = `
  .detail {
    max-width: 1100px;
    margin: 0 auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .detail__layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }
  @media (min-width: 768px) {
    .detail__layout {
      grid-template-columns: 1fr 1fr;
      align-items: start;
    }
  }
  .detail__images {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .detail__main-img {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 10px;
    background: #f3f4f6;
  }
  .detail__thumbnails {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .detail__thumb {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 6px;
    cursor: pointer;
    border: 2px solid transparent;
    opacity: 0.7;
    transition: opacity 0.15s, border-color 0.15s;
  }
  .detail__thumb:hover { opacity: 1; }
  .detail__thumb--active { border-color: #2563eb; opacity: 1; }
  .detail__info {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .detail__badge {
    align-self: flex-start;
    font-size: 11px;
    font-weight: 600;
    background: var(--color-secondary);
    color: var(--color-white);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 3px 10px;
    border-radius: 999px;
  }
  .detail__title {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: #111;
    line-height: 1.3;
  }
  .detail__pricing {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .detail__price {
    font-size: 26px;
    font-weight: 700;
    color: #111;
  }
  .detail__original-price {
    font-size: 16px;
    color: #9ca3af;
    text-decoration: line-through;
  }
  .detail__discount {
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    background: #ef4444;
    padding: 2px 7px;
    border-radius: 999px;
  }
  .detail__meta {
    display: flex;
    gap: 16px;
    font-size: 14px;
    color: #374151;
  }
  .detail__stock { color: #16a34a; }
  .detail__stock--low { color: #dc2626; }
  .detail__description {
    margin: 0;
    font-size: 14px;
    line-height: 1.7;
    color: #4b5563;
  }
  .detail__btn-cart {
    padding: 12px 0;
    border-radius: 8px;
    border: none;
    background: var(--color-primary);
    color: var(--color-white);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }
  .detail__btn-cart:hover:not(:disabled) { background: var(--color-primary-dark); }
  .detail__btn-cart:disabled { opacity: 0.5; cursor: default; }
  .detail__btn-back {
    align-self: flex-start;
    padding: 7px 14px;
    font-size: 13px;
    font-weight: 600;
    border: 1px solid var(--color-secondary);
    border-radius: 6px;
    background: #fff;
    color: var(--color-secondary);
    cursor: pointer;
    transition: background 0.15s;
  }
  .detail__btn-back:hover { background: #f0f4f8; }
  .detail__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 64px 0;
    color: #ef4444;
    font-size: 15px;
  }
`;

export default ProductDetailPage;
