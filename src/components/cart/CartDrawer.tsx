import { useState } from 'react';
import { useCartStore } from '../../store/cartStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const [showConfirm, setShowConfirm] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleConfirmClose = () => {
    clearCart();
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
      <style>{`
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          z-index: 1000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }
        .drawer-overlay--open {
          opacity: 1;
          pointer-events: all;
        }
        .drawer-panel {
          position: fixed;
          top: 0;
          right: 0;
          height: 100%;
          width: 100%;
          max-width: 420px;
          background: #fff;
          z-index: 1001;
          display: flex;
          flex-direction: column;
          box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
          transform: translateX(100%);
          transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .drawer-panel--open {
          transform: translateX(0);
        }
        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          flex-shrink: 0;
        }
        .drawer-header__title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #111;
        }
        .drawer-header__close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          background: #f3f4f6;
          font-size: 18px;
          color: #374151;
          cursor: pointer;
          transition: background 0.15s;
        }
        .drawer-header__close:hover { background: #e5e7eb; }
        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .drawer-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #6b7280;
          font-size: 15px;
          text-align: center;
        }
        .drawer-empty__icon {
          font-size: 40px;
        }
        .drawer-empty__btn {
          padding: 9px 20px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background: #fff;
          color: #374151;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .drawer-empty__btn:hover { background: #f3f4f6; }
        .cart-item {
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 12px;
          align-items: start;
        }
        .cart-item__img {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: 6px;
          background: #f3f4f6;
        }
        .cart-item__details {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }
        .cart-item__title {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
          color: #111;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
        }
        .cart-item__price {
          font-size: 13px;
          color: #374151;
        }
        .cart-item__controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cart-item__qty-btn {
          width: 26px;
          height: 26px;
          border-radius: 4px;
          border: 1px solid var(--color-secondary);
          background: #f9fafb;
          font-size: 16px;
          font-weight: 700;
          color: var(--color-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }
        .cart-item__qty-btn:hover { background: #e8edf3; }
        .cart-item__qty {
          min-width: 20px;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          color: #111;
        }
        .cart-item__remove {
          margin-left: auto;
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 18px;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 4px;
          transition: color 0.15s, background 0.15s;
          line-height: 1;
        }
        .cart-item__remove:hover { color: #ef4444; background: #fef2f2; }
        .drawer-divider {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 0;
        }
        .drawer-footer {
          border-top: 1px solid #e5e7eb;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-shrink: 0;
        }
        .drawer-summary {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .drawer-summary__row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #6b7280;
        }
        .drawer-summary__row--total {
          font-size: 16px;
          font-weight: 700;
          color: #111;
          padding-top: 6px;
          border-top: 1px solid #e5e7eb;
          margin-top: 2px;
        }
        .drawer-footer__actions {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }
        .drawer-btn-clear {
          flex: 1;
          padding: 10px 0;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background: #fff;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: background 0.15s;
        }
        .drawer-btn-clear:hover { background: #f3f4f6; }
        .drawer-btn-checkout {
          flex: 2;
          padding: 10px 0;
          border-radius: 6px;
          border: none;
          background: var(--color-primary);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-white);
          cursor: pointer;
          transition: background 0.15s;
        }
        .drawer-btn-checkout:hover { background: var(--color-primary-dark); }
        .confirm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .confirm-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1101;
          background: #fff;
          border-radius: 16px;
          padding: 36px 28px;
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
        }
        .confirm-modal__icon {
          font-size: 52px;
          line-height: 1;
        }
        .confirm-modal__title {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #111;
        }
        .confirm-modal__summary {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
        }
        .confirm-modal__total {
          font-size: 22px;
          font-weight: 800;
          color: var(--color-primary);
        }
        .confirm-modal__btn {
          margin-top: 8px;
          width: 100%;
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
        .confirm-modal__btn:hover { background: var(--color-primary-dark); }
      `}</style>

      <div
        className={`drawer-overlay${isOpen ? ' drawer-overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`drawer-panel${isOpen ? ' drawer-panel--open' : ''}`}
        aria-label="Carrito de compras"
        role="dialog"
        aria-modal="true"
      >
        <div className="drawer-header">
          <h2 className="drawer-header__title">Carrito ({items.length})</h2>
          <button className="drawer-header__close" onClick={onClose} type="button" aria-label="Cerrar carrito">
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="drawer-body">
            <div className="drawer-empty">
              <span className="drawer-empty__icon">🛒</span>
              <p style={{ margin: 0 }}>Tu carrito está vacío</p>
              <button className="drawer-empty__btn" onClick={onClose} type="button">
                Ver productos
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="drawer-body">
              {items.map((item, index) => (
                <div key={item.id}>
                  <div className="cart-item">
                    <img
                      className="cart-item__img"
                      src={item.thumbnail}
                      alt={item.title}
                    />
                    <div className="cart-item__details">
                      <p className="cart-item__title">{item.title}</p>
                      <span className="cart-item__price">{fmt(item.price)} c/u</span>
                      <div className="cart-item__controls">
                        <button
                          className="cart-item__qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          type="button"
                          aria-label="Disminuir cantidad"
                        >
                          −
                        </button>
                        <span className="cart-item__qty">{item.quantity}</span>
                        <button
                          className="cart-item__qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          type="button"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                        <button
                          className="cart-item__remove"
                          onClick={() => removeItem(item.id)}
                          type="button"
                          aria-label={`Eliminar ${item.title}`}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                  {index < items.length - 1 && <hr className="drawer-divider" style={{ marginTop: 16 }} />}
                </div>
              ))}
            </div>

            <div className="drawer-footer">
              <div className="drawer-summary">
                <div className="drawer-summary__row">
                  <span>Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div className="drawer-summary__row">
                  <span>Impuestos (16%)</span>
                  <span>{fmt(tax)}</span>
                </div>
                <div className="drawer-summary__row drawer-summary__row--total">
                  <span>Total</span>
                  <span>{fmt(total)}</span>
                </div>
              </div>
              <div className="drawer-footer__actions">
                <button className="drawer-btn-clear" onClick={clearCart} type="button">
                  Vaciar carrito
                </button>
                <button
                  className="drawer-btn-checkout"
                  onClick={() => setShowConfirm(true)}
                  type="button"
                >
                  Finalizar compra
                </button>
              </div>
            </div>
          </>
        )}
      </aside>

      {showConfirm && (
        <>
          <div className="confirm-overlay" aria-hidden="true" />
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
          >
            <span className="confirm-modal__icon">✅</span>
            <h2 className="confirm-modal__title" id="confirm-title">
              ¡Pedido realizado con éxito!
            </h2>
            <p className="confirm-modal__summary">
              {totalUnits} {totalUnits === 1 ? 'producto' : 'productos'} en tu pedido
            </p>
            <p className="confirm-modal__total">{fmt(total)}</p>
            <button
              className="confirm-modal__btn"
              onClick={handleConfirmClose}
              type="button"
            >
              Cerrar
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default CartDrawer;
