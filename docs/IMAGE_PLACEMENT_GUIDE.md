# Image Placement Guide for Demon Slayer Characters

## 📍 Where to Place Your Character Images

Before making changes, please place your character images in the following locations:

### 1. **Hero Section Background Image**
**Location:** `frontend/public/assets/img/hero-bg.jpg`
- **Purpose:** Main hero section background (home page)
- **Current:** Uses existing `hero-bg.jpg` (will be replaced with your image)
- **Format:** JPG or PNG
- **Recommended Size:** 1920x1080 or larger (landscape orientation)
- **Note:** This is the main background image behind the "Demon Slayer: Kimetsu no Yaiba" text

---

### 2. **Character Gallery Images (Home Page)**
**Location:** `frontend/public/assets/img/`
- **File Names:** Based on character names from your images
- **Current Placeholders:**
  - `demon-slayer-1.jpg` → Replace with your **Tanjiro** image
  - `demon-slayer-2.jpg` → Replace with your **Nezuko** image
  - `demon-slayer-3.jpg` → Replace with your **Hashira** image
  - `demon-slayer-4.jpg` → Replace with your **Demons** image
  - `demon-slayer-5.jpg` → Replace with your **Rengoku** image
  - `demon-slayer-6.jpg` → Replace with your **Giyu** image
  - `demon-slayer-7.jpg` → Replace with your **Zenitsu** image
  - `demon-slayer-8.jpg` → Replace with your **Inosuke** image

**Instructions:**
- Name your images based on the character names in the filenames
- For example, if your image is named `Tanjiro-Kamado.jpg`, place it as `demon-slayer-1.jpg` (or I can update the code to use your exact filenames)
- **Recommended:** Horizontal/landscape images work best for the gallery
- **Format:** JPG or PNG

---

### 3. **Hashiras Page Images**
**Location:** `frontend/public/assets/img/hashiras/` (create this folder)
- **File Names:** Based on Hashira names from your images
- **Expected Characters:**
  - Rengoku (Flame Hashira)
  - Giyu (Water Hashira)
  - Shinobu (Insect Hashira)
  - Tengen (Sound Hashira)
  - Mitsuri (Love Hashira)
  - Obanai (Serpent Hashira)
  - Sanemi (Wind Hashira)
  - Gyomei (Stone Hashira)
  - Muichiro (Mist Hashira)

**Instructions:**
- Create folder: `frontend/public/assets/img/hashiras/`
- Name files based on character names (e.g., `rengoku.jpg`, `giyu.jpg`, etc.)
- I will update the code to automatically detect and display images based on filenames

---

### 4. **Demons Page Images**
**Location:** `frontend/public/assets/img/demons/` (create this folder)
- **File Names:** Based on Demon names from your images
- **Expected Characters:**
  - Muzan Kibutsuji
  - Upper Moons (Akaza, Doma, Kokushibo, etc.)
  - Lower Moons
  - Other demons

**Instructions:**
- Create folder: `frontend/public/assets/img/demons/`
- Name files based on demon names (e.g., `muzan.jpg`, `akaza.jpg`, etc.)
- I will update the code to automatically detect and display images based on filenames

---

### 5. **Characters Page (Tanjiro & Friends)**
**Location:** `frontend/public/assets/img/characters/` (create this folder)
- **File Names:** Based on character names
- **Expected Characters:**
  - Tanjiro Kamado
  - Nezuko Kamado
  - Zenitsu Agatsuma
  - Inosuke Hashibira
  - Kanao Tsuyuri
  - Genya Shinazugawa
  - Other supporting characters

**Instructions:**
- Create folder: `frontend/public/assets/img/characters/`
- Name files based on character names (e.g., `tanjiro.jpg`, `nezuko.jpg`, `zenitsu.jpg`, etc.)
- I will update the code to automatically detect and display images based on filenames

---

## 🔍 How I Will Use Your Images

Once you place the images, I will:

1. **Read the filenames** to extract character names
2. **Update the React components** to:
   - Display images dynamically based on filenames
   - Use character names from filenames for labels and descriptions
   - Create proper image galleries with character information

3. **Example:**
   - If you place `rengoku-flame-hashira.jpg` in `hashiras/` folder
   - I will extract "Rengoku" and "Flame Hashira" from the filename
   - Display it with proper labeling: "Rengoku - Flame Hashira"

---

## 📝 Current Image Structure

```
frontend/public/assets/img/
├── hero-bg.jpg                    ← Main hero background (REPLACE THIS)
├── hero-img.png                   ← Hero section character image (right side)
├── demon-slayer-1.jpg             ← Gallery image 1 (Tanjiro)
├── demon-slayer-2.jpg             ← Gallery image 2 (Nezuko)
├── demon-slayer-3.jpg             ← Gallery image 3 (Hashira)
├── demon-slayer-4.jpg             ← Gallery image 4 (Demons)
├── demon-slayer-5.jpg             ← Gallery image 5 (Rengoku)
├── demon-slayer-6.jpg             ← Gallery image 6 (Giyu)
├── demon-slayer-7.jpg             ← Gallery image 7 (Zenitsu)
├── demon-slayer-8.jpg             ← Gallery image 8 (Inosuke)
├── hashiras/                      ← CREATE THIS FOLDER
│   ├── rengoku.jpg
│   ├── giyu.jpg
│   ├── shinobu.jpg
│   └── ... (other Hashira images)
├── demons/                         ← CREATE THIS FOLDER
│   ├── muzan.jpg
│   ├── akaza.jpg
│   └── ... (other demon images)
└── characters/                     ← CREATE THIS FOLDER
    ├── tanjiro.jpg
    ├── nezuko.jpg
    ├── zenitsu.jpg
    └── ... (other character images)
```

---

## ✅ Next Steps

1. **Place your images** in the locations specified above
2. **Tell me when you're done**, and I will:
   - Update the code to use your image filenames
   - Extract character names from filenames
   - Display images with proper labels
   - Remove placeholder images

---

## 🎨 Image Recommendations

- **Format:** JPG (for photos) or PNG (for artwork with transparency)
- **Size:** 
  - Hero background: 1920x1080 or larger
  - Gallery images: 800x600 or larger (landscape)
  - Character images: 600x800 or larger (portrait or square)
- **File Size:** Optimize to keep under 500KB per image for faster loading
- **Naming:** Use descriptive names with character names (e.g., `tanjiro-kamado.jpg`, `rengoku-flame-hashira.jpg`)

