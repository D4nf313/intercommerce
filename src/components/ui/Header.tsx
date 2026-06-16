import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import CartDrawer from '../cart/CartDrawer';

const Header = () => {
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);

  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <>
      <style>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 900;
          background: #111111;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }
        .header__inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 16px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .header__logo {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1;
        }
        .header__logo:hover .header__logo-commerce { color: #cccccc; }
        .header__logo-inter { color: var(--color-primary); }
        .header__logo-commerce { color: var(--color-white); transition: color 0.15s; }
        .header__cart-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border: none;
          border-radius: 8px;
          background: var(--color-primary);
          color: var(--color-white);
          cursor: pointer;
          font-size: 20px;
          transition: background 0.15s;
        }
        .header__cart-btn:hover { background: var(--color-primary-dark); }
        .header__cart-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          border-radius: 999px;
          background: var(--color-secondary);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          pointer-events: none;
        }
      `}</style>

      <header className="header">
        <div className="header__inner">
          <button
            className="header__logo"
            onClick={() => navigate('/')}
            type="button"
            aria-label="Ir al catálogo"
          >
            <span className="header__logo-inter">Inter</span>
            <span className="header__logo-commerce">Commerce</span>
          </button>

          <button
            className="header__cart-btn"
            onClick={() => setShowCart(true)}
            type="button"
            aria-label={`Carrito, ${totalItems} ${totalItems === 1 ? 'producto' : 'productos'}`}
          >
            🛒
            {totalItems > 0 && (
              <span className="header__cart-badge" aria-hidden="true">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
};

export default Header;
