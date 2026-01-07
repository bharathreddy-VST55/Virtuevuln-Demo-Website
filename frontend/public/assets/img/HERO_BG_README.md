# Hero Background Image

## Current Setup

The hero section background is configured to use `hero-bg.jpg` located in this directory.

## To Replace the Background Image

1. Place your Demon Slayer themed image in this directory (`frontend/public/assets/img/`)
2. Name it `hero-bg.jpg` (or update the CSS path in `frontend/public/assets/css/style.css`)
3. Recommended image specifications:
   - Format: JPG or PNG
   - Dimensions: 1920x1080 or larger (for high-resolution displays)
   - Aspect ratio: 16:9 (landscape)
   - File size: Optimize to keep under 500KB for faster loading

## CSS Location

The background image is configured in:
- File: `frontend/public/assets/css/style.css`
- Section: `#hero` (around line 445)

## Fallback

If the image doesn't load, a sky blue gradient will be displayed as a fallback.

