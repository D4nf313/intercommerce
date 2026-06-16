import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/index';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = memo(({ product, onAddToCart }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => navigate(`/product/${product.id}`);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div onClick={handleCardClick} style={css.card}>
      <img
        src={product.thumbnail}
        alt={product.title}
        style={css.image}
        loading="lazy"
      />

      <div style={css.body}>
        <span style={css.badge}>{product.category}</span>

        <p style={css.title}>{product.title}</p>

        <div style={css.meta}>
          <span style={css.price}>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
          </span>
          <span style={css.rating}>⭐ {product.rating.toFixed(1)}</span>
        </div>

        <button onClick={handleAddToCart} style={css.button}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;

const css: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '10px',
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    display: 'block',
  },
  body: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flexGrow: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '2px 8px',
    borderRadius: '999px',
    background: 'var(--color-secondary)',
    color: 'var(--color-white)',
  },
  title: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 600,
    color: '#111',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: 1.4,
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#1a1a1a',
  },
  rating: {
    fontSize: '13px',
    color: '#555',
  },
  button: {
    marginTop: 'auto',
    padding: '8px 0',
    borderRadius: '6px',
    border: 'none',
    background: 'var(--color-primary)',
    color: 'var(--color-white)',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
