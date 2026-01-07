import type { FC } from 'react';
import { useState } from 'react';
import { ShopItemType } from './Shop';

interface CartItem {
  item: ShopItemType;
  quantity: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  cartItems: CartItem[];
}

type PaymentMethod = 'credit' | 'debit' | 'paypal' | 'crypto' | null;

const PaymentModal: FC<Props> = ({ isOpen, onClose, totalAmount, cartItems }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  if (!isOpen) return null;

  const paymentMethods = [
    { id: 'credit' as PaymentMethod, name: 'Credit Card', icon: '💳' },
    { id: 'debit' as PaymentMethod, name: 'Debit Card', icon: '💳' },
    { id: 'paypal' as PaymentMethod, name: 'PayPal', icon: '🅿️' },
    { id: 'crypto' as PaymentMethod, name: 'Cryptocurrency', icon: '₿' }
  ];

  // INTENTIONAL VULNERABILITY: Client-side payment processing trust
  // Payment amount is taken directly from client-calculated totalAmount
  // No server-side validation of prices, items, or payment amount
  // Secure approach: Backend should recalculate total from database prices before processing payment
  const handlePayment = () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }

    if (selectedMethod === 'credit' || selectedMethod === 'debit') {
      // INTENTIONAL VULNERABILITY: Poor validation - only checks if fields exist, not format
      // No validation of card number format, expiry date format, CVV format
      // Secure approach: Validate card number (Luhn algorithm), expiry date format, CVV length
      if (!cardNumber || !cardName || !expiry || !cvv) {
        alert('Please fill in all card details');
        return;
      }
    }

    // INTENTIONAL VULNERABILITY: Trusting client-provided totalAmount
    // totalAmount can be manipulated by modifying cart prices in browser DevTools
    // Secure approach: Send cart items to backend, backend looks up prices from database,
    // calculates total server-side, then processes payment with verified amount
    
    // INTENTIONAL: No actual payment processing - just simulates
    // In real app, this would send payment request to backend
    // Backend should validate: items exist, prices match database, stock available, total correct
    alert(`Payment of $${totalAmount.toFixed(2)} processed successfully using ${paymentMethods.find(m => m.id === selectedMethod)?.name}!`);
    onClose();
  };

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
          background: 'rgba(11, 11, 12, 0.9)',
          zIndex: 2000,
          backdropFilter: 'blur(10px)'
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '600px',
          background: '#1A1A1C',
          border: '2px solid #87CEEB',
          borderRadius: '15px',
          zIndex: 2001,
          boxShadow: '0 10px 50px rgba(135, 206, 235, 0.3)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '25px',
            borderBottom: '2px solid #D1D1D3',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #1A1A1C 0%, #0B0B0C 100%)'
          }}
        >
          <h2 style={{ color: '#87CEEB', margin: 0, fontSize: '1.8rem' }}>
            💳 Payment
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#D1D1D3',
              fontSize: '1.8rem',
              cursor: 'pointer',
              padding: '5px 10px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '25px' }}>
          {/* Order Summary */}
          <div
            style={{
              background: '#0B0B0C',
              border: '1px solid #D1D1D3',
              borderRadius: '10px',
              padding: '20px',
              marginBottom: '25px'
            }}
          >
            <h3 style={{ color: '#87CEEB', marginBottom: '15px', fontSize: '1.3rem' }}>
              Order Summary
            </h3>
            {cartItems.map((item) => (
              <div
                key={item.item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  color: '#D1D1D3'
                }}
              >
                <span>
                  {item.item.name} × {item.quantity}
                </span>
                <span>${(item.item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div
              style={{
                borderTop: '2px solid #D1D1D3',
                paddingTop: '15px',
                marginTop: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ color: '#87CEEB', fontSize: '1.3rem', fontWeight: 'bold' }}>
                Total:
              </span>
              <span style={{ color: '#87CEEB', fontSize: '1.5rem', fontWeight: 'bold' }}>
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Methods */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#87CEEB', marginBottom: '15px', fontSize: '1.3rem' }}>
              Select Payment Method
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  style={{
                    padding: '20px',
                    background: selectedMethod === method.id
                      ? 'linear-gradient(135deg, #87CEEB 0%, #5F9EA0 100%)'
                      : '#0B0B0C',
                    border: `2px solid ${selectedMethod === method.id ? '#87CEEB' : '#D1D1D3'}`,
                    borderRadius: '10px',
                    color: selectedMethod === method.id ? '#0B0B0C' : '#D1D1D3',
                    fontWeight: selectedMethod === method.id ? 'bold' : 'normal',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '5px' }}>{method.icon}</div>
                  <div>{method.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Card Details (if credit/debit selected) */}
          {(selectedMethod === 'credit' || selectedMethod === 'debit') && (
            <div
              style={{
                background: '#0B0B0C',
                border: '1px solid #D1D1D3',
                borderRadius: '10px',
                padding: '20px',
                marginBottom: '25px'
              }}
            >
              <h4 style={{ color: '#87CEEB', marginBottom: '15px' }}>Card Details</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  style={{
                    padding: '12px',
                    background: '#1A1A1C',
                    border: '1px solid #D1D1D3',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                  style={{
                    padding: '12px',
                    background: '#1A1A1C',
                    border: '1px solid #D1D1D3',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '1rem'
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    maxLength={5}
                    style={{
                      padding: '12px',
                      background: '#1A1A1C',
                      border: '1px solid #D1D1D3',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '1rem'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={4}
                    style={{
                      padding: '12px',
                      background: '#1A1A1C',
                      border: '1px solid #D1D1D3',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PayPal Message */}
          {selectedMethod === 'paypal' && (
            <div
              style={{
                background: '#0B0B0C',
                border: '1px solid #D1D1D3',
                borderRadius: '10px',
                padding: '20px',
                marginBottom: '25px',
                textAlign: 'center',
                color: '#D1D1D3'
              }}
            >
              You will be redirected to PayPal to complete your payment.
            </div>
          )}

          {/* Crypto Message */}
          {selectedMethod === 'crypto' && (
            <div
              style={{
                background: '#0B0B0C',
                border: '1px solid #D1D1D3',
                borderRadius: '10px',
                padding: '20px',
                marginBottom: '25px',
                textAlign: 'center',
                color: '#D1D1D3'
              }}
            >
              <p>Send payment to:</p>
              <code style={{ color: '#87CEEB', fontSize: '0.9rem' }}>
                bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
              </code>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handlePayment}
            disabled={!selectedMethod}
            style={{
              width: '100%',
              padding: '15px',
              background: selectedMethod
                ? 'linear-gradient(135deg, #87CEEB 0%, #5F9EA0 100%)'
                : '#666',
              border: 'none',
              borderRadius: '8px',
              color: selectedMethod ? '#0B0B0C' : '#999',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              cursor: selectedMethod ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (selectedMethod) {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(135, 206, 235, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMethod) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {selectedMethod ? '✅ Complete Payment' : 'Select Payment Method'}
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;

