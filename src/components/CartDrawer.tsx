import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, updateCartQuantity, removeFromCart, clearCart, cartTotal, checkoutCart } = useApp();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-drawer-backdrop" onClick={() => setIsCartOpen(false)} />
      <div className="cart-drawer">
        {/* Drawer Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '38px', 
              height: '38px', 
              borderRadius: 'var(--radius-md)', 
              background: 'rgba(16, 185, 129, 0.15)', 
              color: '#10b981', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Cafeteria Tray</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{cart.length} unique item{cart.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button 
            className="btn btn-secondary btn-icon btn-sm" 
            onClick={() => setIsCartOpen(false)}
            aria-label="Close tray"
            style={{ borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'var(--badge-bg)', 
                margin: '0 auto 1.25rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <ShoppingBag size={28} />
              </div>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Your tray is empty</h4>
              <p style={{ fontSize: '0.88rem' }}>Browse the campus cafeteria menu and add delicious meals!</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Selected Items</span>
                <button 
                  onClick={clearCart} 
                  style={{ fontSize: '0.82rem', color: 'var(--gub-rose)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
                >
                  <Trash2 size={14} /> Clear Tray
                </button>
              </div>

              {cart.map(({ item, quantity }) => (
                <div 
                  key={item.id} 
                  className="glass-card" 
                  style={{ padding: '0.85rem', display: 'flex', gap: '0.85rem', alignItems: 'center' }}
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--gub-green)', fontWeight: 700, marginTop: '0.2rem' }}>
                      Tk {item.price * quantity} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>(Tk {item.price} each)</span>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-input)', padding: '0.25rem 0.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <button 
                      onClick={() => updateCartQuantity(item.id, quantity - 1)}
                      style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', padding: '2px' }}
                      aria-label="Decrease"
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                      {quantity}
                    </span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, quantity + 1)}
                      style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', padding: '2px' }}
                      aria-label="Increase"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    style={{ color: 'var(--text-muted)', padding: '4px' }}
                    aria-label="Remove item"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Subtotal</span>
              <span style={{ fontSize: '1rem', fontWeight: 600 }}>Tk {cartTotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>Total (BDT)</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gub-green)' }}>Tk {cartTotal}</span>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.85rem' }}
              onClick={checkoutCart}
            >
              <Sparkles size={18} /> Confirm Order (Tk {cartTotal}) <ArrowRight size={18} />
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              Instant token generated for pickup at Counter 1
            </p>
          </div>
        )}
      </div>
    </>
  );
};
