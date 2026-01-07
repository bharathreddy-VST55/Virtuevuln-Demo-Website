# Anime GIF Placement Guide

## 📍 Where to Place Your Demon Slayer Anime GIFs

### 1. **Shop Hero Section (Main Shop Page)**
**Location:** `frontend/src/pages/shop/Shop.tsx` (around line 100-120)
**Current:** Placeholder div with instructions
**File Path:** `frontend/public/assets/img/shop/hero-anime.gif`

**How to add:**
Replace the placeholder div with:
```tsx
<img
  src="assets/img/shop/hero-anime.gif"
  alt="Demon Slayer Animation"
  style={{
    width: '100%',
    maxWidth: '600px',
    height: 'auto',
    borderRadius: '10px',
    border: '2px solid #87CEEB'
  }}
/>
```

---

### 2. **Home Page Hero Section**
**Location:** `frontend/src/pages/main/Hero.tsx`
**File Path:** `frontend/public/assets/img/hero-anime.gif`

**Recommended:** Add as a background or overlay on the hero section to make it more dynamic.

---

### 3. **Shop Item Cards (Product Images)**
**Location:** `frontend/src/pages/shop/ShopItem.tsx`
**File Path:** `frontend/public/assets/img/shop/items/[item-name].gif`

**How to add:**
You can replace static images with GIFs for animated product previews. Update the `image` property in `Shop.tsx` shopItems array.

---

### 4. **Category Section Backgrounds**
**Location:** `frontend/src/pages/shop/Shop.tsx` (filter section)
**File Path:** `frontend/public/assets/img/shop/category-bg.gif`

Add subtle animated backgrounds to category buttons for a more dynamic feel.

---

### 5. **Cart Animation**
**Location:** `frontend/src/pages/shop/Cart.tsx`
**File Path:** `frontend/public/assets/img/shop/cart-animation.gif`

Add a small animated icon when items are added to cart.

---

### 6. **Payment Success Animation**
**Location:** `frontend/src/pages/shop/PaymentModal.tsx`
**File Path:** `frontend/public/assets/img/shop/payment-success.gif`

Show an animated success message after payment completion.

---

## 🎬 Recommended GIF Specifications

- **Format:** GIF (animated)
- **Size:** 
  - Hero section: 1920x1080 or larger (can be optimized)
  - Product images: 400x300 to 600x450
  - Small animations: 200x200 or smaller
- **File Size:** Keep under 2MB for hero, under 500KB for smaller animations
- **Duration:** 3-5 seconds loop for hero, 1-2 seconds for small animations
- **Optimization:** Use tools like EZGIF or ImageOptim to reduce file size

---

## 📁 Folder Structure

```
frontend/public/assets/img/shop/
├── hero-anime.gif              ← Main shop hero animation
├── category-bg.gif             ← Category section background
├── cart-animation.gif          ← Cart icon animation
├── payment-success.gif         ← Payment success animation
└── items/
    ├── rengoku-katana.gif      ← Animated product previews
    ├── tanjiro-outfit.gif
    └── ... (other item GIFs)
```

---

## ✅ Next Steps

1. **Create the folder:** `frontend/public/assets/img/shop/`
2. **Place your GIFs** in the locations specified above
3. **Update the code** to use GIFs instead of placeholders (I can help with this)
4. **Test** that GIFs load and animate properly

---

## 💡 Pro Tips

- Use **subtle animations** for backgrounds (not too distracting)
- **Product GIFs** should show the item from multiple angles or highlight features
- **Hero GIFs** should be impressive but not overwhelming
- Consider **loading states** - show a placeholder while GIF loads
- **Optimize GIFs** to reduce page load time

