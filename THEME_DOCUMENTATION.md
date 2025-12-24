# Surgeons Theme (B-ROLL v2.0.0) - Complete Documentation

**Last Updated:** December 8, 2025
**Theme Name:** B-ROLL
**Version:** 2.0.0
**Author:** SRGN NETWORKS
**Repository:** https://github.com/SurgeonsLLC/surgeons-theme
**Current Branch:** `feature/auth-redirect-404`

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Directory Structure](#directory-structure)
4. [Core Features](#core-features)
5. [Security Implementation](#security-implementation)
6. [External Integrations](#external-integrations)
7. [Theme Settings & Configuration](#theme-settings--configuration)
8. [Sections Reference](#sections-reference)
9. [Snippets Reference](#snippets-reference)
10. [Templates Reference](#templates-reference)
11. [JavaScript Components](#javascript-components)
12. [CSS Architecture](#css-architecture)
13. [Deployment Commands](#deployment-commands)
14. [Improvement Opportunities](#improvement-opportunities)
15. [Known Issues & TODOs](#known-issues--todos)
16. [Appendix](#appendix)

---

## Executive Summary

The Surgeons Theme is a custom Shopify theme built for **CBD Surgeons & Surgeons, LLC** (surgeonsolution.io). It's a mature, feature-rich e-commerce theme specifically designed for CBD/hemp product sales with the following key characteristics:

- **Age Verification Gate:** 21+ verification required for all visitors
- **AI-Powered Chat:** Surgeons.AI chatbot integration (BUD)
- **Security-First Design:** Domain allowlist, CSP headers, secure API calls
- **Sales Conversion Tools:** Exit-intent popups, trust badges, urgency indicators
- **Attribution Tracking:** First-touch and last-touch marketing attribution
- **Dynamic SEO:** AI-powered SEO injection system

**Completion Status:** ~90% complete

---

## Architecture Overview

### Technology Stack

| Component | Technology |
|-----------|------------|
| Platform | Shopify (Liquid templating) |
| Slider/Carousel | Splide.js |
| Image Lightbox | PhotoSwipe |
| Styling | CSS with CSS Custom Properties |
| JavaScript | Vanilla ES6+ with Web Components |
| Build Tools | None (native Shopify) |

### Design Patterns

1. **Web Components:** Custom elements like `<splide-slider>`, `<modal-component>`, `<shipping-bar>`
2. **Section Architecture:** Modular, reusable sections with JSON schema
3. **Snippet Composition:** Small, reusable Liquid partials
4. **CSS Variables:** Theme-wide customization through CSS custom properties
5. **Progressive Enhancement:** Graceful degradation with `<noscript>` fallbacks

---

## Directory Structure

```
surgeons-theme/
├── assets/                 # Static assets (CSS, JS, fonts)
│   ├── base.css           # Core styles (52KB)
│   ├── global.js          # Main JavaScript (101KB)
│   ├── main-cart.css      # Cart-specific styles (22KB)
│   ├── quick-view.css     # Quick view modal styles
│   ├── photoswipe.esm.js  # Image lightbox library
│   ├── splide.esm.js      # Carousel library
│   └── customer.js        # Customer account scripts
│
├── config/                 # Theme configuration
│   ├── settings_schema.json   # Theme settings definitions
│   └── settings_data.json     # Current settings values
│
├── layout/                 # Layout templates
│   ├── theme.liquid       # Main layout (security, integrations)
│   └── password.liquid    # Password page layout
│
├── locales/               # Internationalization
│   ├── en.default.json         # English translations
│   └── en.default.schema.json  # Schema translations
│
├── sections/              # Page sections (62 files)
│   ├── header.liquid      # Main navigation
│   ├── footer.liquid      # Site footer
│   ├── main-product.liquid    # Product page
│   ├── modal-cart-drawer.liquid # Cart drawer
│   ├── entry-gate.liquid  # Age verification
│   └── ... (57 more sections)
│
├── snippets/              # Reusable components (91 files)
│   ├── entry-gate.liquid  # Age verification modal
│   ├── cart-drawer.liquid # Cart drawer content
│   ├── product-blocks.liquid  # Product components
│   └── ... (88 more snippets)
│
├── templates/             # Page templates (40 files)
│   ├── index.json         # Homepage
│   ├── product.*.json     # Product variants
│   ├── collection.*.json  # Collection variants
│   ├── customers/         # Customer account pages
│   └── ... (30 more templates)
│
└── THEME_DOCUMENTATION.md # This file
```

---

## Core Features

### 1. Entry Gate System (Age Verification)

**Location:** `snippets/entry-gate.liquid`

The entry gate is a dual-purpose modal that:
1. Verifies visitor is 21+ years old
2. Promotes account creation with welcome discount

**Configuration (Theme Settings):**
| Setting | Default | Description |
|---------|---------|-------------|
| `ss_gate_enable` | true | Enable/disable gate |
| `ss_gate_cookie_days` | 30 | Remember choice duration |
| `ss_gate_title` | "Welcome to Surgeons..." | Modal title |
| `ss_gate_subtext` | "You must be 21+..." | Description text |
| `ss_gate_guest_text` | "Continue as Guest" | Guest button |
| `ss_gate_cta_text` | "Create Account & Save 10%" | CTA button |
| `ss_gate_discount_code` | "" | Optional discount code |

**Behavior:**
- Shows for non-logged-in users only
- Checkbox confirmation required to proceed
- Sets cookie `ss_gate` with configurable expiry
- Optional discount code deep-linking on account creation

### 2. Cart System

**Locations:**
- `snippets/cart-drawer.liquid` - Drawer content
- `sections/modal-cart-drawer.liquid` - Drawer wrapper
- `sections/cart-showcase.liquid` - Cart page

**Features:**
- Welcome message with discount code (WELCOME15)
- Free shipping progress bar ($74.99 threshold)
- Related products slideshow (from "topicals" collection)
- Order notes support
- Real-time cart updates via AJAX
- Cart-level discount display

**Current Configuration:**
```json
{
  "cart_view": "page",
  "free_shipping_amount": "$74.99",
  "cart_draw_welcome_message": "Use coupon code WELCOME15...",
  "cart_related_collection": "topicals",
  "cart_related_max_to_show": 3
}
```

### 3. Product System

**Templates:**
| Template | Use Case |
|----------|----------|
| `product.json` | Default product |
| `product.flower.json` | Hemp flower products |
| `product.gummies.json` | Edible gummies |
| `product.drinks.json` | THC/CBD beverages |
| `product.topicals.json` | Pain relief products |
| `product.pets.json` | Pet CBD products |
| `product.apparel-accessories.json` | Merch/apparel |
| `product.primary-sale.json` | Featured sale items |
| `product.secondary-sale.json` | Secondary sale items |
| `product.variable.json` | Multi-variant products |

**Product Features:**
- Variant swatches (colors, images, patterns)
- Quick view modal
- Stock status indicators
- Unit pricing display
- Custom badges
- WhatsApp inquiry button
- PhotoSwipe image gallery

### 4. BUD AI Chatbot

**Location:** `layout/theme.liquid` (lines 428-541)

**Endpoint:** `https://ai.surgeonsolutions.org/api/v1/bud/chat`

**Features:**
- GPT-powered conversational AI
- Exit-intent trigger
- Mobile-responsive design
- Conversation persistence
- Security-validated API calls

**Configuration:**
```javascript
const BUD_API_URL = 'https://ai.surgeonsolutions.org/api/v1/bud/chat';
// Website ID: surgeonsolution-io
```

### 5. Sales Conversion Features

**Location:** `layout/theme.liquid` (lines 543-640)

**Exit-Intent Popup:**
- Triggers on mouse-out (desktop) or 50% scroll + 30s (mobile)
- Displays WELCOME15 discount code
- Free shipping reminder ($74.99)
- Session-based (shows once per session)

**Urgency Indicators:**
- Low stock badges (1-5 items remaining)
- "Popular" badges on top 3 products
- Animated pulse effect

**Trust Badges:**
- Displayed on cart/checkout pages
- Security icons and messaging

---

## Security Implementation

### Content Security Policy (CSP)

**Location:** `layout/theme.liquid` (lines 9-42)

```
Content-Security-Policy:
  default-src 'self' https://*.shopify.com https://*.shopifycdn.com;
  script-src 'self' 'unsafe-inline' 'unsafe-eval' [allowed domains];
  style-src 'self' 'unsafe-inline' https://*.shopify.com https://fonts.googleapis.com;
  connect-src 'self' [allowed domains];
  frame-src 'self' https://*.shopify.com https://*.youtube.com https://*.vimeo.com;
```

### Domain Allowlist

**Location:** `layout/theme.liquid` (lines 44-103)

**JavaScript Object:** `window.SurgeonsSecurity`

**Allowed Domains:**
- `surgeonsolutions.org` (and subdomains)
- `ai.surgeonsolutions.org` (Chatbot API)
- `surgeonsolution.io` (and subdomains)
- `records.surgeonsolution.io` (Attribution)
- `accounts.surgeonsolution.io` (Auth)
- `cbdsurgeons.shop` (and subdomains)
- `onlythebestherbs.io` (and subdomains)
- `shopify.com` (and subdomains)
- `monorail-edge.shopifysvc.com`

**Security Methods:**
```javascript
window.SurgeonsSecurity.isAllowedDomain(url)  // Validate URL
window.SurgeonsSecurity.secureFetch(url, options)  // Secure fetch wrapper
window.SurgeonsSecurity.secureXHR(method, url, async)  // Secure XHR wrapper
```

---

## External Integrations

### 1. Surgeons Attribution Tracking

**Location:** `layout/theme.liquid` (lines 248-250)

**Purpose:** First-touch and last-touch marketing attribution

**Storage Keys:**
- `sg_attr_first_source` / `sg_attr_last_source`
- `sg_attr_first_medium` / `sg_attr_last_medium`
- `sg_attr_first_campaign` / `sg_attr_last_campaign`
- `surgeons_visitor_id`

**Behavior:**
- Captures UTM parameters on arrival
- Falls back to referrer detection (Facebook, Instagram, Google, Bing)
- Updates cart attributes on add-to-cart
- 30-minute session timeout for last-touch updates

### 2. Surgeons AI SEO Injection

**Location:** `layout/theme.liquid` (lines 251-357)

**Endpoint:** `https://ai.surgeonsolutions.org/api/v1/code-injections`

**Behavior:**
- Fetches deployed SEO injections on page load
- Injects into `<head>` with data attributes
- Sends telemetry beacon on success
- Website ID: `surgeonsolution-io`

### 3. Shopify Forms App

**Block ID:** `13768625480086291342`

**Used for:** Contact forms, lead capture

### 4. Smart SEO App

**Block ID:** `4976129024724438625`

**Status:** Currently disabled

**Features:** Broken link detection

---

## Theme Settings & Configuration

### Color Schemes

**Scheme 1 (Light - Default):**
- Background: #ffffff
- Text: #000000
- Primary Button: #000000 (black)
- Secondary Button: #111111

**Scheme 2 (Dark):**
- Background: #181818
- Text: #ffffff
- Primary Button: #ffffff (white)
- Secondary Button: #111111

**Custom Scheme (Red Accent):**
- Background: #e21111
- Text: #ffffff
- Used for promotional sections

### Layout Settings

| Setting | Value |
|---------|-------|
| Page Width | 1472px |
| Section Border Radius | 10px |
| Button Border Radius | 70px (pill) |
| Button Border Width | 1px |

### Typography

| Element | Font |
|---------|------|
| Body | Inter (400) |
| Headings | Syne (800) |
| Font Scale | 100% |

### Social Media Links

| Platform | Link |
|----------|------|
| Instagram | instagram.com/surgeonsolution.io |
| LinkedIn | linkedin.com/company/cbd-surgeons/ |
| Facebook | facebook.com/srgnNetworks |
| YouTube | youtube.com/@cbdsurgeonsonline |
| TikTok | tiktok.com/@surgeonsllc |
| Snapchat | snapchat.com/add/cbdsurgeons |

---

## Sections Reference

### Header Sections

| Section | File | Description |
|---------|------|-------------|
| Header | `header.liquid` | Main navigation, search, cart icon |
| Header Top Bar | `header-top-bar.liquid` | Announcement/promo bar |
| Bottom Bar | `bottom-bar.liquid` | Mobile bottom navigation |

### Product Sections

| Section | File | Description |
|---------|------|-------------|
| Main Product | `main-product.liquid` | Full product page |
| Featured Product | `featured-product.liquid` | Single product showcase |
| Product Organizer | `product-organizer.liquid` | Grid product display |
| Product Recommendation | `product-recommendation.liquid` | AI recommendations |
| Product Reels | `product-reels.liquid` | TikTok-style product videos |

### Collection Sections

| Section | File | Description |
|---------|------|-------------|
| Main Collections | `main-collections.liquid` | Collections list |
| Featured Collection | `featured-collection.liquid` | Highlighted collection |
| Collection List | `collection-list.liquid` | Multi-collection display |
| Collection Preview | `collection-preview.liquid` | Collection cards |

### Cart Sections

| Section | File | Description |
|---------|------|-------------|
| Cart Showcase | `cart-showcase.liquid` | Cart page content |
| Cart Head | `cart-head.liquid` | Cart page header |
| Modal Cart Drawer | `modal-cart-drawer.liquid` | Slide-out cart |

### Content Sections

| Section | File | Description |
|---------|------|-------------|
| Carousel Section | `carousel-section.liquid` | Hero carousel |
| Banners Content | `banners-content.liquid` | Promotional banners |
| Richtext | `richtext.liquid` | Text content blocks |
| Multicolumn | `multicolumn.liquid` | Multi-column layout |
| Multirow | `multirow.liquid` | Multi-row content |
| Image Gallery | `image-gallery.liquid` | Image grid/carousel |
| Featured Video | `featured-video.liquid` | Video embed |
| Featured Blog | `featured-blog.liquid` | Blog highlights |
| Collapsible with Media | `collapsible-with-media.liquid` | FAQ/accordion |

### Promotional Sections

| Section | File | Description |
|---------|------|-------------|
| Promotion Banner | `promotion-banner.liquid` | Grid promo banners |
| Scrolling Banner | `scrolling-banner.liquid` | Marquee text |
| Hotspot Banner | `hotspot-banner.liquid` | Interactive image hotspots |
| Newsletter Section | `newsletter-section.liquid` | Email signup |
| Newsletter Popup | `Newsletter-popup.liquid` | Popup signup |
| Promotion Products Popup | `promotion-products-popup.liquid` | Product popup |

### Overlay/Modal Sections

| Section | File | Description |
|---------|------|-------------|
| Age Verification Popup | `age-verification-popup.liquid` | 21+ verification |
| Modal Quick View | `modal-quick-view.liquid` | Product quick view |
| Modal Pickup Drawer | `modal-pickup-drawer.liquid` | Store pickup |
| Modal Facets | `modal-facets.liquid` | Filter modal |
| Store Locator Popup | `store-locator-popup.liquid` | Store finder |

### Customer Account Sections

| Section | File | Description |
|---------|------|-------------|
| Main Login | `main-login.liquid` | Login page |
| Main Register | `main-register.liquid` | Registration |
| Main Account | `main-account.liquid` | Account dashboard |
| Main Addresses | `main-addresses.liquid` | Address management |
| Main Order | `main-order.liquid` | Order details |
| Main Reset Password | `main-reset-password.liquid` | Password reset |
| Main Activate Account | `main-activate-account.liquid` | Account activation |

---

## Snippets Reference

### Core Snippets

| Snippet | Description |
|---------|-------------|
| `entry-gate.liquid` | Age verification modal |
| `cart-drawer.liquid` | Cart drawer content |
| `cart-bubble.liquid` | Cart item count badge |
| `cart-drawer-slideshow.liquid` | Related products in cart |
| `line-item-compact.liquid` | Cart line item display |
| `cart-text.liquid` | Cart empty/full messaging |

### Product Snippets

| Snippet | Description |
|---------|-------------|
| `product-blocks.liquid` | Product page blocks |
| `product-gallery.liquid` | Image gallery |
| `age-verifier-modal.liquid` | Age verification (legacy) |
| `before-after.liquid` | Before/after comparison |
| `countdown-timer.liquid` | Sale countdown |

### Navigation Snippets

| Snippet | Description |
|---------|-------------|
| `mega-menu.liquid` | Mega menu dropdown |
| `menu-dropdown.liquid` | Standard dropdown |
| `breadcrumb.liquid` | Breadcrumb navigation |
| `search-bar.liquid` | Search functionality |

### UI Components

| Snippet | Description |
|---------|-------------|
| `icons-data.liquid` | SVG icon library |
| `payment-icons.liquid` | Payment method icons |
| `placeholder-svgs.liquid` | Placeholder images |
| `theme-variables.liquid` | CSS variable definitions |
| `meta-tags.liquid` | SEO meta tags |

---

## Templates Reference

### Homepage

**File:** `templates/index.json`

**Sections Order:**
1. Featured Video (YouTube embed)
2. Image Gallery (marquee)
3. Richtext ("Where Nature Meets The Future")
4. Featured Collection (Gummies)
5. Carousel (product showcase)
6. Featured Blog
7. Multicolumn (RECORDS links)
8. Collection List
9. Scrolling Banner (cannabinoids)
10. Product Reels
11. Promotion Banner (grid)
12. Hotspot Banner (TikTok promo)

### Product Templates

| Template | Purpose |
|----------|---------|
| `product.json` | Default product layout |
| `product.flower.json` | Hemp flower products |
| `product.gummies.json` | Gummy/edible products |
| `product.drinks.json` | Beverage products |
| `product.topicals.json` | Topical/pain relief |
| `product.pets.json` | Pet products |
| `product.apparel-accessories.json` | Merchandise |
| `product.primary-sale.json` | Featured sale |
| `product.secondary-sale.json` | Secondary sale |
| `product.variable.json` | Multi-variant |

### Collection Templates

| Template | Purpose |
|----------|---------|
| `collection.json` | Default collection |
| `collection.flower-shop.json` | Flower products |
| `collection.gummy-express.json` | Gummy products |
| `collection.drinks.json` | Beverage products |
| `collection.topicals.json` | Topical products |
| `collection.topicals-2.json` | Topicals variant |
| `collection.apparel.json` | Apparel products |

### Page Templates

| Template | Purpose |
|----------|---------|
| `page.json` | Default page |
| `page.about.json` | About page |
| `page.contact.json` | Contact page |
| `page.faqs.json` | FAQ page |
| `page.locations.json` | Store locations |
| `page.collabs.json` | Collaborations |

### Blog Templates

| Template | Purpose |
|----------|---------|
| `blog.json` | Main blog |
| `blog.business-directory.json` | Business directory |
| `article.json` | Default article |
| `article.sell-*.json` | Seller info articles |
| `article.social-promote-sell.json` | Social selling |

---

## JavaScript Components

### Web Components

| Component | Element | Location |
|-----------|---------|----------|
| Splide Slider | `<splide-slider>` | `theme.liquid` |
| Modal Component | `<modal-component>` | `global.js` |
| Modal Popup | `<modal-component-popup>` | `global.js` |
| Modal Toggler | `<modal-component-toggler>` | `global.js` |
| Shipping Bar | `<shipping-bar>` | `global.js` |
| Predictive Dropdown | `<predictive-dropdown>` | `global.js` |
| Sticky Block | `<sticky-block>` | `global.js` |

### Global Functions

| Function | Purpose |
|----------|---------|
| `window.pauseElementBasedMedia()` | Pause videos on slide change |
| `window.SurgeonsSecurity.*` | Security validation methods |
| `window.SurgeonsAttribution.*` | Attribution tracking |

---

## CSS Architecture

### File Structure

| File | Size | Purpose |
|------|------|---------|
| `base.css` | 52KB | Core styles, resets, utilities |
| `main-cart.css` | 22KB | Cart page/drawer styles |
| `quick-view.css` | 16KB | Quick view modal |
| `component-facets.css` | 3KB | Filter/facet styles |
| `component-price-range.css` | 2KB | Price range slider |
| `photoswipe.css` | 7KB | Lightbox styles |
| `splide-core.css` | 2KB | Carousel base styles |
| `template-giftcard.css` | 2KB | Gift card page |
| `pickup-drawer.css` | 2KB | Pickup location drawer |

### CSS Custom Properties

**Theme Variables (from `theme-variables.liquid`):**
```css
:root {
  --cp-width-px: 1472px;
  --section-radius: 10px;
  --font-headings-family: 'Syne', sans-serif;
  --font-body-family: 'Inter', sans-serif;
  --fw-bold: 700;
  --fw-semi-bold: 600;
  --fw-medium: 500;
  --fw-normal: 400;
  --fw-light: 300;
}
```

---

## Deployment Commands

### For Ryan Bolda (Operator at 130 Dickinson St, Mount Clemens, MI 48043)

#### Development Setup

```bash
# Clone repository
git clone https://github.com/SurgeonsLLC/surgeons-theme.git
cd surgeons-theme

# Checkout current feature branch
git checkout feature/auth-redirect-404

# Start development server (requires Shopify CLI)
shopify theme dev --store=your-store.myshopify.com
```

#### Deployment Commands

```bash
# Push theme to Shopify (as unpublished)
shopify theme push --unpublished

# Push to specific theme
shopify theme push --theme-id=THEME_ID

# Push and publish immediately
shopify theme push --live

# Pull latest from Shopify
shopify theme pull --theme-id=THEME_ID
```

#### Git Workflow

```bash
# Check current status
git status

# Create new feature branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/new-feature

# Merge to main (after testing)
git checkout main
git merge feature/new-feature
git push origin main
```

#### API Endpoints to Monitor

| Service | URL | Purpose |
|---------|-----|---------|
| Chatbot | https://ai.surgeonsolutions.org/api/v1/bud/chat | BUD AI |
| SEO | https://ai.surgeonsolutions.org/api/v1/code-injections | SEO injection |
| Attribution | https://records.surgeonsolution.io | Tracking data |
| Auth | https://accounts.surgeonsolution.io | Authentication |

---

## Improvement Opportunities

### High Priority

#### 1. Performance Optimization
- **Current:** 101KB global.js, 52KB base.css loaded on all pages
- **Recommendation:**
  - Implement code splitting for route-specific JavaScript
  - Use critical CSS inline, defer non-critical
  - Lazy load Splide/PhotoSwipe only when needed
  - Estimated impact: 30-40% faster initial load

#### 2. SEO Enhancements
- **Current:** Basic meta tags, manual SEO
- **Recommendation:**
  - Implement JSON-LD structured data for products
  - Add FAQ schema to FAQs page
  - Implement LocalBusiness schema for locations
  - Add breadcrumb schema
  - Optimize image alt texts programmatically

#### 3. Accessibility Improvements
- **Current:** Basic accessibility, skip links present
- **Recommendation:**
  - Add ARIA labels to all interactive elements
  - Improve keyboard navigation in modals
  - Add focus indicators to all interactive elements
  - Test and fix screen reader compatibility
  - Add reduced-motion media queries

#### 4. Mobile Experience
- **Current:** Responsive, but desktop-first
- **Recommendation:**
  - Implement mobile-first redesign
  - Add touch gesture support to sliders
  - Optimize tap targets (minimum 44x44px)
  - Implement pull-to-refresh for collections
  - Add app-like navigation patterns

### Medium Priority

#### 5. Cart Abandonment Recovery
- **Current:** Exit-intent popup with discount
- **Recommendation:**
  - Implement cart abandonment email trigger
  - Add "save cart" functionality for logged-in users
  - Show cart contents in exit popup
  - Add SMS opt-in for cart reminders

#### 6. Product Discovery
- **Current:** Basic search, collection navigation
- **Recommendation:**
  - Implement AI-powered product recommendations
  - Add "customers also bought" section
  - Implement visual search (image-based)
  - Add quiz-based product finder
  - Improve search with synonyms and fuzzy matching

#### 7. Social Proof
- **Current:** Basic product display
- **Recommendation:**
  - Integrate product reviews (Judge.me, Stamped)
  - Add "recently purchased" notifications
  - Display social media follower counts
  - Add user-generated content gallery
  - Implement ratings on collection pages

#### 8. Conversion Rate Optimization
- **Current:** Basic product pages
- **Recommendation:**
  - Add A/B testing framework
  - Implement dynamic pricing display (was/now)
  - Add quantity discounts visibility
  - Show savings percentage prominently
  - Add "frequently bought together" bundles

### Low Priority (Future Enhancements)

#### 9. Personalization
- **Recommendation:**
  - Implement personalized homepage based on browsing history
  - Add "for you" product sections
  - Personalize email signup based on interests
  - Dynamic content based on referral source

#### 10. Internationalization
- **Current:** English only
- **Recommendation:**
  - Add Spanish language support
  - Implement currency conversion
  - Add region-specific content
  - Optimize for local SEO

#### 11. Advanced Analytics
- **Recommendation:**
  - Implement enhanced ecommerce tracking
  - Add heatmap integration (Hotjar)
  - Track user journey funnels
  - A/B test tracking integration

#### 12. Progressive Web App (PWA)
- **Recommendation:**
  - Add service worker for offline support
  - Implement push notifications
  - Add "Add to Home Screen" prompt
  - Cache critical assets

---

## Known Issues & TODOs

### Current Branch: `feature/auth-redirect-404`

#### In Progress
1. **Auth Redirect Logic** - 404 page should redirect to login for protected pages
2. **Exit-Intent Optimization** - Fine-tuning popup trigger timing

#### Known Issues
1. Smart SEO app is disabled (may need re-enabling)
2. Some product templates may need updating for new features
3. Mobile bottom bar may overlap with chatbot bubble

#### Technical Debt
1. Inline JavaScript in theme.liquid should be moved to separate files
2. CSS could benefit from a preprocessor (SCSS)
3. Some snippets have duplicate code that could be consolidated
4. Theme settings schema could use better organization

---

## Appendix

### File Counts

| Directory | Count |
|-----------|-------|
| Sections | 62 |
| Snippets | 91 |
| Templates | 40 |
| Assets | 16 |
| Config | 2 |
| Layout | 2 |
| Locales | 2 |
| **Total** | **215** |

### Asset Sizes

| Asset | Size |
|-------|------|
| global.js | 101KB |
| photoswipe.esm.js | 183KB |
| splide.esm.js | 97KB |
| photoswipe-lightbox.esm.js | 52KB |
| base.css | 53KB |
| main-cart.css | 22KB |
| quick-view.css | 16KB |

### Contact & Support

**Theme Author:** SRGN NETWORKS
**Business:** CBD Surgeons & Surgeons, LLC
**Website:** surgeonsolution.io
**Email:** customer.relations@surgeonsolution.io

---

*Document generated on December 8, 2025 by Claude Code*
