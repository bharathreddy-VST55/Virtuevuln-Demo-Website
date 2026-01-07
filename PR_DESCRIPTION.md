# Rebrand to Demon Slayers theme + docs + lab safety

## Summary

This PR rebrands the application from "Broken Crystals" to "Demon Slayers" theme and adds comprehensive documentation for security training purposes. All changes maintain the intentionally vulnerable functionality while improving documentation and adding themed content pages.

## Changes Made

### 🎨 Rebranding & Theme Updates
- ✅ Renamed project from `brokencrystals` to `demon-slayers` in package.json files
- ✅ Updated application title and branding throughout (Swagger, HTML, headers)
- ✅ Updated meta tags and page titles
- ✅ Updated navigation branding

### 📄 New Content Pages
- ✅ Added `/hashiras` page with Hashira character bios (6 entries)
- ✅ Added `/demons` page with demon threat descriptions (6 entries)
- ✅ Added `/characters/tanjiro` page with character profiles (5 entries)
- ✅ All pages include image placeholders with proper alt text
- ✅ Added navigation menu items for new pages

### 📚 Documentation
- ✅ Created `docs/ARCHITECTURE.md` - Complete tech stack, Docker architecture, container details
- ✅ Created `docs/SECURITY.md` - Vulnerability summary table, remediation guidance, secure code patterns
- ✅ Created `docs/REPRO_STEPS.md` - Safe lab testing procedures for each vulnerability (no exploit payloads)
- ✅ Created `docs/DB_DESIGN.md` - Current schema analysis and recommended secure redesign
- ✅ Updated `README.md` with safety warnings, quick start guide, and documentation links
- ✅ Created `CHANGELOG.md` documenting all changes

### 🔒 Safety & Lab Focus
- ✅ Added prominent safety warnings throughout documentation
- ✅ Emphasized lab-only usage in README
- ✅ All reproduction steps are safe and educational (no exploit payloads)
- ✅ Maintained all intentional vulnerabilities for training purposes

## Files Changed

### New Files
- `client/src/pages/hashiras/Hashiras.tsx`
- `client/src/pages/demons/Demons.tsx`
- `client/src/pages/characters/Characters.tsx`
- `docs/ARCHITECTURE.md`
- `docs/SECURITY.md`
- `docs/REPRO_STEPS.md`
- `docs/DB_DESIGN.md`
- `CHANGELOG.md`

### Modified Files
- `package.json` - Project name
- `client/package.json` - Project name
- `src/main.ts` - Swagger title/description
- `client/index.html` - Meta tags and title
- `client/src/pages/main/Header/Header.tsx` - Branding text
- `client/src/pages/main/Header/Nav.tsx` - Navigation menu
- `client/src/router/RoutePath.ts` - New routes
- `client/src/router/AppRoutes.tsx` - Route registration
- `README.md` - Safety warnings and documentation

## Top 5 Vulnerabilities Documented

1. **SQL Injection** - `/api/testimonials/count`, `/api/products/views`
2. **Broken JWT Authentication** - `/api/auth/login` (multiple bypass techniques)
3. **Cross-Site Scripting (XSS)** - Multiple endpoints (reflected, stored, DOM-based)
4. **Local File Inclusion (LFI)** - `/api/file`, `/api/file/raw`
5. **OS Command Injection** - `/api/spawn`, GraphQL `getCommandResult`

## Testing

- ✅ All new pages render correctly
- ✅ Routes are properly registered
- ✅ Navigation menu includes new pages
- ✅ No linting errors introduced
- ✅ Documentation is comprehensive and accurate

## Safety Notes

⚠️ **This repository intentionally contains insecure code for training purposes only.**
- All vulnerabilities remain for educational purposes
- Documentation provides safe testing procedures
- No exploit payloads included in reproduction steps
- Strong warnings added about lab-only usage

## Checklist

- [x] Project renamed and rebranded
- [x] New themed pages created
- [x] Routes and navigation updated
- [x] Architecture documentation created
- [x] Security documentation created
- [x] Reproduction steps documented (safe, no payloads)
- [x] Database design documented
- [x] README updated with safety warnings
- [x] CHANGELOG created
- [x] All commits made on feature branch
- [x] No linting errors
- [x] All intentional vulnerabilities preserved for training

## Next Steps

1. Review the PR
2. Test the new pages in a local environment
3. Verify documentation accuracy
4. Merge to main/stable branch
5. Add actual image assets for new pages (currently using placeholders)

## Reviewer Notes

- All intentional vulnerabilities are preserved for training purposes
- New pages follow existing React patterns and component structure
- Documentation follows security-focused best practices
- All reproduction steps are safe and educational (no exploit payloads)
- Image placeholders are provided; actual images should be added separately

