import type { FC } from 'react';
import { ShopItemType } from './Shop';

interface CartItem {
  item: ShopItemType;
  quantity: number;
}

interface Props {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onCheckout: () => void;
  totalPrice: number;
}

const Cart: FC<Props> = ({
  cart,
  isOpen,
  onClose,
  onRemove,
  onUpdateQuantity,
  onCheckout,
  totalPrice
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 11, 12, 0.8)',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}
        onClick={onClose}
      />
      
      {/* Cart Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '400px',
          maxWidth: '90vw',
          height: '100vh',
          background: '#1A1A1C',
          borderLeft: '2px solid #87CEEB',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-5px 0 30px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '2px solid #D1D1D3',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h2 style={{ color: '#87CEEB', margin: 0, fontSize: '1.5rem' }}>
            🛒 Shopping Cart
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#D1D1D3',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '5px 10px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px'
          }}
        >
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#D1D1D3', padding: '40px 0' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Your cart is empty</p>
              <p style={{ fontSize: '0.9rem' }}>Add some Demon Slayer gear to get started!</p>
            </div>
          ) : (
            cart.map((cartItem) => (
              <div
                key={cartItem.item.id}
                style={{
                  background: '#0B0B0C',
                  border: '1px solid #D1D1D3',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '15px'
                }}
              >
                <div style={{ display: 'flex', gap: '15px' }}>
                  <img
                    src={cartItem.item.image}
                    alt={cartItem.item.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #D1D1D3'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/80/1A1A1C/87CEEB?text=Item';
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: '#87CEEB', margin: '0 0 5px 0', fontSize: '1rem' }}>
                      {cartItem.item.name}
                    </h4>
                    <p style={{ color: '#D1D1D3', margin: '0 0 10px 0', fontSize: '0.9rem' }}>
                      ${cartItem.item.price.toFixed(2)} each
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                        style={{
                          background: '#1A1A1C',
                          border: '1px solid #D1D1D3',
                          color: '#D1D1D3',
                          width: '30px',
                          height: '30px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '1.2rem'
                        }}
                      >
                        −
                      </button>
                      <span style={{ color: '#FFFFFF', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                        style={{
                          background: '#1A1A1C',
                          border: '1px solid #D1D1D3',
                          color: '#D1D1D3',
                          width: '30px',
                          height: '30px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '1.2rem'
                        }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => onRemove(cartItem.item.id)}
                        style={{
                          marginLeft: 'auto',
                          background: 'transparent',
                          border: 'none',
                          color: '#FF6B6B',
                          cursor: 'pointer',
                          fontSize: '1.2rem',
                          padding: '5px'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '20px',
              borderTop: '2px solid #D1D1D3',
              background: '#0B0B0C'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}
            >
              <span style={{ color: '#D1D1D3', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Total:
              </span>
              <span style={{ color: '#87CEEB', fontSize: '1.5rem', fontWeight: 'bold' }}>
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              style={{
                width: '100%',
                padding: '15px',
                background: 'linear-gradient(135deg, #87CEEB 0%, #5F9EA0 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#0B0B0C',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(135, 206, 235, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              💳 Proceed to Payment
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;

