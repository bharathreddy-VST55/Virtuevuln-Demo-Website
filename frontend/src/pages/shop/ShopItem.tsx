import type { FC } from 'react';
import { ShopItemType } from './Shop';

interface Props {
  item: ShopItemType;
  onAddToCart: (item: ShopItemType) => void;
}

const ShopItem: FC<Props> = ({ item, onAddToCart }) => {
  return (
    <div
      style={{
        background: '#1A1A1C',
        border: '2px solid #D1D1D3',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#87CEEB';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(135, 206, 235, 0.3)';
        e.currentTarget.style.transform = 'translateY(-5px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#D1D1D3';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {item.featured && (
        <div
          style={{
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
            color: '#0B0B0C',
            padding: '5px 15px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          ⭐ FEATURED
        </div>
      )}
      <div style={{ position: 'relative', paddingTop: '75%', background: '#0B0B0C' }}>
        <img
          src={item.image}
          alt={item.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x300/1A1A1C/87CEEB?text=' + encodeURIComponent(item.name);
          }}
        />
        {!item.inStock && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(255, 107, 107, 0.9)',
              color: '#FFFFFF',
              padding: '5px 15px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}
          >
            OUT OF STOCK
          </div>
        )}
      </div>
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h4
          style={{
            color: '#87CEEB',
            fontSize: '1.2rem',
            marginBottom: '10px',
            fontWeight: 'bold'
          }}
        >
          {item.name}
        </h4>
        <p
          style={{
            color: '#D1D1D3',
            fontSize: '0.9rem',
            marginBottom: '15px',
            flex: 1
          }}
        >
          {item.description}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <span
            style={{
              color: '#87CEEB',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}
          >
            ${item.price.toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart(item)}
            disabled={!item.inStock}
            style={{
              padding: '10px 20px',
              background: item.inStock
                ? 'linear-gradient(135deg, #87CEEB 0%, #5F9EA0 100%)'
                : '#666',
              border: 'none',
              borderRadius: '8px',
              color: item.inStock ? '#0B0B0C' : '#999',
              fontWeight: 'bold',
              cursor: item.inStock ? 'pointer' : 'not-allowed',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (item.inStock) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(135, 206, 235, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (item.inStock) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {item.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopItem;

