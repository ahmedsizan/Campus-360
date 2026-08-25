import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodCategory, FoodItem } from '../types';
import { 
  Utensils, 
  Search, 
  ShoppingBag, 
  Star, 
  Plus, 
  Minus, 
  Check, 
  Leaf, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const Cafeteria: React.FC = () => {
  const { foodItems, addToCart, setIsCartOpen, cartCount, cartTotal } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<'all' | FoodCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);

  // Unit Selection Modal
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);

  const categories: { id: 'all' | FoodCategory; label: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch Specials' },
    { id: 'snacks', label: 'Snacks & Fast Food' },
    { id: 'beverage', label: 'Beverages & Desserts' },
  ];

  const filteredItems = foodItems.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = !vegetarianOnly || item.is_vegetarian;
    return matchesCat && matchesSearch && matchesVeg;
  });

  const handleOpenUnitModal = (item: FoodItem) => {
    setSelectedItem(item);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (selectedItem && quantity > 0) {
      addToCart(selectedItem, quantity);
      setSelectedItem(null);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header page-header-row">
        <div>
          <h1 className="page-title">Campus Cafeteria & Food Court</h1>
          <p className="page-subtitle">Freshly prepared university canteen meals with fast digital tray checkout</p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setIsCartOpen(true)}
          style={{ position: 'relative' }}
        >
          <ShoppingBag size={18} /> View Tray ({cartCount} items • Tk {cartTotal})
        </button>
      </div>

      {/* Filters and Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="filter-tabs" style={{ marginBottom: 0 }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', maxWidth: '420px' }}>
          <button
            onClick={() => setVegetarianOnly(!vegetarianOnly)}
            className={`btn ${vegetarianOnly ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: 'var(--radius-full)' }}
          >
            <Leaf size={14} color={vegetarianOnly ? '#fff' : '#10b981'} />
            Vegetarian
          </button>

          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px', height: '38px', fontSize: '0.88rem' }}
            />
          </div>
        </div>
      </div>

      {/* Food Grid */}
      {filteredItems.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Utensils size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No dishes matching criteria</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Try resetting your filters or search keywords.
          </p>
        </div>
      ) : (
        <div className="grid-cards">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="glass-card"
              style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              {/* Food Image */}
              <div style={{ position: 'relative', height: '190px', width: '100%' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(9, 13, 22, 0.85) 0%, transparent 60%)'
                }} />

                {/* Rating Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#fbbf24'
                }}>
                  <Star size={13} fill="#fbbf24" /> {item.rating}
                </div>

                {/* Category Pill */}
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', gap: '0.4rem' }}>
                  <span className="badge badge-slate" style={{ fontSize: '0.72rem', textTransform: 'capitalize' }}>
                    {item.category}
                  </span>
                  {item.is_vegetarian && (
                    <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                      <Leaf size={11} /> Veg
                    </span>
                  )}
                </div>
              </div>

              {/* Food Content */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    {item.name}
                  </h3>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Price</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gub-green)' }}>
                      Tk {item.price}
                    </span>
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleOpenUnitModal(item)}
                    style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
                  >
                    <Plus size={16} /> Select Unit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unit Selection Modal with Live Subtotal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Select Portions & Quantity"
        subtitle="Choose units to add to your campus cafeteria tray"
        maxWidth="460px"
      >
        {selectedItem && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '0.85rem', padding: '0.75rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                style={{ width: '54px', height: '54px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: '140px' }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, lineHeight: 1.3 }}>{selectedItem.name}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--gub-green)', fontWeight: 700, marginTop: '0.15rem' }}>
                  Tk {selectedItem.price} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>per unit</span>
                </div>
              </div>
            </div>

            {/* Quantity Stepper */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', margin: '0.85rem 0' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Quantity</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  style={{ width: '38px', height: '38px', borderRadius: '50%' }}
                >
                  <Minus size={18} />
                </button>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, minWidth: '38px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary btn-icon"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: '38px', height: '38px', borderRadius: '50%' }}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Live Subtotal Card */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '0.9rem', flexWrap: 'wrap', gap: '0.4rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Item Subtotal</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{quantity} unit(s) × Tk {selectedItem.price}</div>
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--gub-green)' }}>
                Tk {selectedItem.price * quantity}
              </div>
            </div>

            {/* Actions */}
            <div className="modal-actions-responsive" style={{ display: 'flex', gap: '0.65rem', marginTop: 'auto', paddingTop: '0.25rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-modal-action"
                style={{ flex: 1 }}
                onClick={() => setSelectedItem(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-modal-action"
                style={{ flex: 2 }}
                onClick={handleAddToCart}
              >
                <Check size={18} /> Add to Tray (Tk {selectedItem.price * quantity})
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
