import type { FC } from 'react';
import { useState, useEffect } from 'react';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import Cart from './Cart';
import PaymentModal from './PaymentModal';
import ShopItem from './ShopItem';

export interface ShopItemType {
  id: string;
  name: string;
  category: 'katana' | 'outfit' | 'accessory' | 'antique';
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
}

const shopItems: ShopItemType[] = [
  // Hashira Katanas
  {
    id: '1',
    name: 'Rengoku\'s Flame Katana',
    category: 'katana',
    price: 1299.99,
    image: 'assets/img/shop/rengoku-katana.jpg',
    description: 'Authentic replica of Kyojuro Rengoku\'s Flame Hashira katana. Forged with traditional techniques and featuring the flame pattern.',
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Giyu\'s Water Katana',
    category: 'katana',
    price: 1199.99,
    image: 'assets/img/shop/giyu-katana.jpg',
    description: 'Water Hashira Giyu Tomioka\'s signature katana. Perfect for water breathing techniques.',
    inStock: true,
    featured: true
  },
  {
    id: '3',
    name: 'Shinobu\'s Insect Katana',
    category: 'katana',
    price: 1099.99,
    image: 'assets/img/shop/shinobu-katana.jpg',
    description: 'Insect Hashira Shinobu Kocho\'s unique thin-bladed katana. Designed for precision strikes.',
    inStock: true
  },
  {
    id: '4',
    name: 'Tengen\'s Sound Katanas',
    category: 'katana',
    price: 1499.99,
    image: 'assets/img/shop/tengen-katanas.jpg',
    description: 'Sound Hashira Tengen Uzui\'s dual nichirin katanas. A set of two matching blades.',
    inStock: true,
    featured: true
  },
  {
    id: '5',
    name: 'Mitsuri\'s Love Katana',
    category: 'katana',
    price: 1249.99,
    image: 'assets/img/shop/mitsuri-katana.jpg',
    description: 'Love Hashira Mitsuri Kanroji\'s whip-like katana. Flexible and deadly.',
    inStock: true
  },
  {
    id: '6',
    name: 'Muichiro\'s Mist Katana',
    category: 'katana',
    price: 1149.99,
    image: 'assets/img/shop/muichiro-katana.jpg',
    description: 'Mist Hashira Muichiro Tokito\'s katana. Lightweight and swift.',
    inStock: true
  },
  {
    id: '7',
    name: 'Obanai\'s Serpent Katana',
    category: 'katana',
    price: 1199.99,
    image: 'assets/img/shop/obanai-katana.jpg',
    description: 'Serpent Hashira Obanai Iguro\'s curved katana. Designed for serpent breathing.',
    inStock: true
  },
  {
    id: '8',
    name: 'Sanemi\'s Wind Katana',
    category: 'katana',
    price: 1249.99,
    image: 'assets/img/shop/sanemi-katana.jpg',
    description: 'Wind Hashira Sanemi Shinazugawa\'s katana. Powerful and destructive.',
    inStock: true
  },
  {
    id: '9',
    name: 'Gyomei\'s Stone Weapon',
    category: 'katana',
    price: 1599.99,
    image: 'assets/img/shop/gyomei-weapon.jpg',
    description: 'Stone Hashira Gyomei Himejima\'s spiked flail and axe. The most powerful Hashira weapon.',
    inStock: true,
    featured: true
  },
  {
    id: '10',
    name: 'Tanjiro\'s Water Katana',
    category: 'katana',
    price: 999.99,
    image: 'assets/img/shop/tanjiro-katana.jpg',
    description: 'Tanjiro Kamado\'s first nichirin katana. Perfect for beginners in water breathing.',
    inStock: true,
    featured: true
  },
  // Outfits
  {
    id: '11',
    name: 'Tanjiro\'s Demon Slayer Uniform',
    category: 'outfit',
    price: 199.99,
    image: 'assets/img/shop/tanjiro-outfit.jpg',
    description: 'Complete Demon Slayer Corps uniform worn by Tanjiro. Includes haori, hakama, and accessories.',
    inStock: true,
    featured: true
  },
  {
    id: '12',
    name: 'Nezuko\'s Kimono Set',
    category: 'outfit',
    price: 179.99,
    image: 'assets/img/shop/nezuko-outfit.jpg',
    description: 'Nezuko Kamado\'s iconic pink kimono with bamboo muzzle. Authentic design.',
    inStock: true
  },
  {
    id: '13',
    name: 'Zenitsu\'s Thunder Outfit',
    category: 'outfit',
    price: 189.99,
    image: 'assets/img/shop/zenitsu-outfit.jpg',
    description: 'Zenitsu Agatsuma\'s yellow haori and Demon Slayer uniform. Complete set.',
    inStock: true
  },
  {
    id: '14',
    name: 'Inosuke\'s Boar Mask & Outfit',
    category: 'outfit',
    price: 219.99,
    image: 'assets/img/shop/inosuke-outfit.jpg',
    description: 'Inosuke Hashibira\'s wild boar mask and fur-lined haori. Fierce and unique.',
    inStock: true
  },
  {
    id: '15',
    name: 'Rengoku\'s Flame Hashira Outfit',
    category: 'outfit',
    price: 249.99,
    image: 'assets/img/shop/rengoku-outfit.jpg',
    description: 'Flame Hashira\'s complete uniform with flame-patterned haori. Premium quality.',
    inStock: true,
    featured: true
  },
  {
    id: '16',
    name: 'Shinobu\'s Insect Hashira Outfit',
    category: 'outfit',
    price: 229.99,
    image: 'assets/img/shop/shinobu-outfit.jpg',
    description: 'Insect Hashira\'s butterfly-patterned haori and uniform. Elegant and deadly.',
    inStock: true
  },
  // Accessories
  {
    id: '17',
    name: 'Tanjiro\'s Hanafuda Earrings',
    category: 'accessory',
    price: 49.99,
    image: 'assets/img/shop/tanjiro-earrings.jpg',
    description: 'Authentic replica of Tanjiro\'s hanafuda earrings. Handcrafted with attention to detail.',
    inStock: true,
    featured: true
  },
  {
    id: '18',
    name: 'Nezuko\'s Bamboo Muzzle',
    category: 'accessory',
    price: 29.99,
    image: 'assets/img/shop/nezuko-muzzle.jpg',
    description: 'Replica of Nezuko\'s bamboo muzzle. Safe and comfortable to wear.',
    inStock: true
  },
  {
    id: '19',
    name: 'Demon Slayer Corps Badge',
    category: 'accessory',
    price: 19.99,
    image: 'assets/img/shop/corps-badge.jpg',
    description: 'Official Demon Slayer Corps badge. Show your allegiance to the cause.',
    inStock: true
  },
  {
    id: '20',
    name: 'Hashira Rank Pin',
    category: 'accessory',
    price: 39.99,
    image: 'assets/img/shop/hashira-pin.jpg',
    description: 'Elite Hashira rank pin. For the most dedicated demon slayers.',
    inStock: true
  },
  {
    id: '21',
    name: 'Breathing Technique Scroll',
    category: 'accessory',
    price: 79.99,
    image: 'assets/img/shop/breathing-scroll.jpg',
    description: 'Ancient scroll detailing various breathing techniques. Decorative and educational.',
    inStock: true
  },
  // Antiques
  {
    id: '22',
    name: 'Ancient Nichirin Ore',
    category: 'antique',
    price: 2999.99,
    image: 'assets/img/shop/nichirin-ore.jpg',
    description: 'Rare piece of original nichirin ore. Used to forge the strongest katanas.',
    inStock: true,
    featured: true
  },
  {
    id: '23',
    name: 'Yoriichi\'s Katana Replica',
    category: 'antique',
    price: 4999.99,
    image: 'assets/img/shop/yoriichi-katana.jpg',
    description: 'Museum-quality replica of Yoriichi Tsugikuni\'s legendary katana. The most powerful blade.',
    inStock: false,
    featured: true
  },
  {
    id: '24',
    name: 'Muzan\'s Blood Vial',
    category: 'antique',
    price: 1999.99,
    image: 'assets/img/shop/muzan-blood.jpg',
    description: 'Ancient vial containing preserved demon blood. Handle with extreme caution.',
    inStock: true
  },
  {
    id: '25',
    name: 'Wisteria Family Crest',
    category: 'antique',
    price: 899.99,
    image: 'assets/img/shop/wisteria-crest.jpg',
    description: 'Original Wisteria family crest. Protects against demons.',
    inStock: true
  }
];

export const Shop: FC = () => {
  const [cart, setCart] = useState<Array<{ item: ShopItemType; quantity: number }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Items', icon: '⚔️' },
    { id: 'katana', name: 'Katanas', icon: '🗡️' },
    { id: 'outfit', name: 'Outfits', icon: '👘' },
    { id: 'accessory', name: 'Accessories', icon: '💎' },
    { id: 'antique', name: 'Antiques', icon: '🏺' }
  ];

  const addToCart = (item: ShopItemType) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.item.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.item.id === itemId ? { ...cartItem, quantity } : cartItem
      )
    );
  };

  // INTENTIONAL VULNERABILITY: Client-side pricing trust
  // Prices are calculated entirely on the client side and can be manipulated
  // An attacker can modify the price in browser DevTools or intercept and modify the request
  // Secure approach: Always validate prices on the backend, never trust client-submitted prices
  // Backend should fetch prices from database and calculate total server-side
  const getTotalPrice = () => {
    // INTENTIONAL: No server-side validation - prices come from client-side shopItems array
    // This can be exploited by modifying item.price in browser console or network request
    return cart.reduce((total, cartItem) => {
      // INTENTIONAL: Trusting client-provided price without validation
      // Secure: Backend should look up actual price from database using item.id
      const itemPrice = cartItem.item.price || 0;
      const quantity = cartItem.quantity || 0;
      return total + itemPrice * quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
  };

  const filteredItems = shopItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // INTENTIONAL VULNERABILITY: Missing server-side validation
  // Checkout only validates cart length on client side
  // No backend validation of prices, quantities, or item availability
  // Secure approach: Send cart to backend, validate all items exist, check stock, recalculate prices
  const handleCheckout = () => {
    if (cart.length === 0) return;

    // INTENTIONAL: No validation of:
    // - Item prices (can be modified client-side)
    // - Item availability/stock
    // - Quantity limits
    // - Item existence in database
    // Secure: All validation should happen on backend before processing payment

    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  return (
    <UserSidebarLayout>
      <div style={{ color: '#E0E0E0' }}>
        <h1 style={{ color: '#87CEEB', marginBottom: '30px', fontSize: '32px' }}>
          Shop
        </h1>
        <div style={{ marginBottom: '20px' }}>
          <a href="/dashboard" style={{ color: '#87CEEB', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>←</span> Back to Dashboard
          </a>
        </div>
        <main id="main" style={{ minHeight: '100vh', background: '#0B0B0C' }}>
          {/* Hero Section with GIF placeholder */}
          <section className="shop-hero" style={{
            background: 'linear-gradient(135deg, #1A1A1C 0%, #0B0B0C 100%)',
            padding: '40px 0',
            marginBottom: '40px',
            borderBottom: '2px solid #87CEEB'
          }}>
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <h1 style={{
                    color: '#87CEEB',
                    fontSize: '3.5rem',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    textShadow: '0 0 20px rgba(135, 206, 235, 0.5)'
                  }}>
                    Demon Slayer Shop
                  </h1>
                  <p style={{ color: '#D1D1D3', fontSize: '1.2rem', marginBottom: '30px' }}>
                    Equip yourself with authentic Demon Slayer gear. From Hashira katanas to character outfits,
                    find everything you need to join the Demon Slayer Corps.
                  </p>
                </div>
                <div className="col-lg-6 text-center">
                  {/* Placeholder for anime GIF - user will add here */}
                  <div style={{
                    background: '#1A1A1C',
                    border: '2px dashed #87CEEB',
                    borderRadius: '10px',
                    padding: '40px',
                    minHeight: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#87CEEB'
                  }}>
                    <div>
                      <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>🎬 Anime GIF Placeholder</p>
                      <p style={{ fontSize: '0.9rem', color: '#D1D1D3' }}>
                        Add your Demon Slayer GIF here:<br />
                        <code style={{ color: '#87CEEB' }}>assets/img/shop/hero-anime.gif</code>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Search and Filter Section */}
          <section className="shop-filters" style={{ padding: '20px 0', background: '#1A1A1C' }}>
            <div className="container">
              <div className="row align-items-center mb-4">
                <div className="col-lg-6">
                  <input
                    type="text"
                    placeholder="Search for katanas, outfits, accessories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      background: '#0B0B0C',
                      border: '2px solid #87CEEB',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div className="col-lg-6 text-right">
                  <button
                    onClick={() => setIsCartOpen(true)}
                    style={{
                      padding: '12px 30px',
                      background: 'linear-gradient(135deg, #87CEEB 0%, #5F9EA0 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#0B0B0C',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    🛒 Cart ({getCartItemCount()})
                    {getCartItemCount() > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#FF6B6B',
                        color: '#FFFFFF',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {getCartItemCount()}
                      </span>
                    )}
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        style={{
                          padding: '10px 25px',
                          background: selectedCategory === category.id
                            ? 'linear-gradient(135deg, #87CEEB 0%, #5F9EA0 100%)'
                            : '#1A1A1C',
                          border: `2px solid ${selectedCategory === category.id ? '#87CEEB' : '#D1D1D3'}`,
                          borderRadius: '25px',
                          color: selectedCategory === category.id ? '#0B0B0C' : '#D1D1D3',
                          fontWeight: selectedCategory === category.id ? 'bold' : 'normal',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: '1rem'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedCategory !== category.id) {
                            e.currentTarget.style.borderColor = '#87CEEB';
                            e.currentTarget.style.color = '#87CEEB';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedCategory !== category.id) {
                            e.currentTarget.style.borderColor = '#D1D1D3';
                            e.currentTarget.style.color = '#D1D1D3';
                          }
                        }}
                      >
                        {category.icon} {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Products Grid */}
          <section className="shop-products" style={{ padding: '40px 0' }}>
            <div className="container">
              <div className="row">
                {filteredItems.length === 0 ? (
                  <div className="col-12 text-center" style={{ color: '#D1D1D3', padding: '60px 0' }}>
                    <h3>No items found</h3>
                    <p>Try adjusting your search or filter</p>
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                      <ShopItem item={item} onAddToCart={addToCart} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </main>

        <Cart
          cart={cart}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onCheckout={handleCheckout}
          totalPrice={getTotalPrice()}
        />

        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          totalAmount={getTotalPrice()}
          cartItems={cart}
        />
      </div>
    </UserSidebarLayout>
  );
};

export default Shop;

