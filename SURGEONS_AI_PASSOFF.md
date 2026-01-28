# Surgeons Theme — AI Integration & Performance SSOT

**Organization:** CBD Surgeons & Surgeons, LLC / surgeonsolution.io
**Operator:** Ryan Bolda, 130 Dickinson St, Mount Clemens, MI 48043
**Date:** 2026-01-27
**Theme Version:** B-ROLL v2.0.0 (Dawn-based)

---

## Executive Summary

This document is the single source of truth (SSOT) for how the Shopify theme integrates with surgeons.ai infrastructure. It covers analytics tracking, CDN services, security layers, and performance optimizations.

---

## 1. Active Integrations

### 1.1 Surgeonify Behavioral Analytics

**Endpoint:** `https://ai.surgeonsolutions.org/api/v1/surgeonify/tracker.js`
**Status:** LIVE
**Location in theme:** `layout/theme.liquid` line 837

```html
<script src="https://ai.surgeonsolutions.org/api/v1/surgeonify/tracker.js" async defer></script>
```

**Events tracked:**
| Event | Trigger | Data |
|-------|---------|------|
| `page_view` | Every page load | URL, referrer, UTM params, visitor ID, session ID |
| `product_view` | Product page | Product ID, title, price, variant |
| `add_to_cart` | ATC button click | Product ID, quantity, variant ID |
| `checkout_start` | Checkout button | Cart contents, total value |
| `search` | Search submission | Search terms |

**Visitor identification:**
- Persistent `visitor_id` stored in localStorage
- Session-scoped `session_id` (30min timeout)
- UTM parameter capture and attribution

**Recommended action for surgeons.ai:**
- Surgeonify should become the single source of truth for all behavioral analytics
- Consolidate the inline `SurgeonsAttribution` code (theme.liquid lines ~730-820) into the surgeonify tracker to eliminate redundancy

---

### 1.2 SurgeonsEdge CDN

**Status:** DEFINED BUT NOT LIVE
**Config location:** `snippets/surgeons-security-suite.liquid` line 60

```javascript
var SURGEONS_CONFIG = {
  cdnBase: 'https://cdn.surgeonsolutions.org',
  edgeBase: 'https://edge.surgeonsolutions.org',
  wafBase: 'https://waf.surgeonsolutions.org',
  aiBase: 'https://ai.surgeonsolutions.org'
};
```

**JavaScript API:** `window.SurgeonsEdge.cdnUrl(originalUrl, options)`

**Liquid helper:** `snippets/surgeons-cdn-image.liquid`
```liquid
{%- render 'surgeons-cdn-image', src: image_url, width: 400, quality: 80 -%}
```
- Currently dormant (`cdn_live = false`)
- Supports: width, height, quality, auto-format (WebP/AVIF)

**To activate:**
1. Deploy the actual CDN endpoint
2. Update `SURGEONS_CONFIG.cdnBase` in `snippets/surgeons-security-suite.liquid`
3. Update `cdn_base` in `snippets/surgeons-cdn-image.liquid`
4. Set `cdn_live = true` in `snippets/surgeons-cdn-image.liquid`

**Architecture note:**
Shopify images already come from Shopify's CDN. Routing them through a second CDN adds latency. SurgeonsEdge should focus on:
- Non-Shopify assets (custom uploads, external images)
- Providing AVIF format (Shopify doesn't support AVIF yet)
- Edge-side image optimization beyond what Shopify offers

---

### 1.3 Security Suite

**Location:** `snippets/surgeons-security-suite.liquid` (630 lines)
**Status:** ACTIVE

**Features:**
| Feature | Status | Description |
|---------|--------|-------------|
| Security headers | Active | X-Content-Type-Options, X-XSS-Protection, Referrer-Policy |
| WAF monitoring | Defined | Endpoint at `waf.surgeonsolutions.org` (not actively called) |
| Bot detection | Active | Inline in theme.liquid (~lines 750-780) |
| Performance monitoring | Active | `window.SurgeonsPerf` tracks LCP, FID, CLS |
| CSP | Active | Managed in theme.liquid meta tags |

---

## 2. Third-Party Analytics

### 2.1 Google Analytics 4

**Status:** Configured externally (Shopify admin or GTM)
**CSP allows:** `*.google-analytics.com`, `*.googletagmanager.com`

### 2.2 Facebook Pixel

**Status:** ACTIVE
**Pixel ID:** `561057779931363`
**Location:** `snippets/facebook-pixel.liquid` (rendered at theme.liquid line 838)
**Configuration:** Theme Settings > Social media > Facebook Pixel ID

**Events tracked:**
| Event | Page | Data |
|-------|------|------|
| PageView | All | Basic page view |
| ViewContent | Product | product title, variant ID, price, currency |
| Search | Search | search terms |
| AddToCart | Any (via fetch intercept) | variant ID, currency |

**Note:** Pixel is not yet connected to an ad account. Events are being collected and will have baseline data when ads are activated.

---

## 3. Performance Optimizations

### 3.1 JavaScript Bundle Split

**Completed:** 2026-01-27

| File | Size | Loads on |
|------|------|----------|
| `global.js` | ~65KB | All pages (core functionality) |
| `product.js` | ~15KB | Product pages, collection pages (for quick-view) |
| `collection.js` | ~12KB | Collection, search, list-collections pages |

**Conditional loading in theme.liquid:**
```liquid
<script src="{{ 'global.js' | asset_url }}" defer="defer"></script>
{% if template contains 'product' %}
  <script src="{{ 'product.js' | asset_url }}" defer></script>
{% endif %}
{% if template contains 'collection' or template contains 'search' or template == 'list-collections' %}
  <script src="{{ 'collection.js' | asset_url }}" defer></script>
  <script src="{{ 'product.js' | asset_url }}" defer></script>
{% endif %}
```

**Components in each bundle:**

**global.js (core):**
- Cart operations (lineItemUpdate, fetchAtc, sectionArrRender)
- Modal/dropdown base classes
- StickyBlock, ShippingBar, QuantityInput
- MarqueeComponent, AccordionWrapper, TabsetComponent
- PredictiveDropdown (header search)
- Viewport animations, utilities

**product.js:**
- VariantDropdown, VariantPill
- ProductModel (3D/AR)
- ShareComponent
- RecipientForm (gift cards)
- AtcBundleToggler, BundleCalculator
- HotspotSwitcher

**collection.js:**
- FacetsFilter, ModalFilterComponent
- PriceRange, SortDropdown
- FacetRemoveButton
- ProductRecommendations
- PredictiveComponent (full-page search)

### 3.2 Critical CSS

**Inline critical CSS:** ~6KB (theme.liquid lines 8-55)
**FOUC timeout:** 80ms (reduced from 150ms)

**Includes:**
- Body typography with CSS variables
- Heading styles (h1-h3)
- Link and focus-visible styles
- Container layout rules
- Complete button styles

**Main CSS loads:** Via print→all swap trick for non-blocking load

---

## 4. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐   │
│  │ Surgeonify  │   │  Facebook   │   │  Google Analytics   │   │
│  │  tracker.js │   │   Pixel     │   │       (GA4)         │   │
│  └──────┬──────┘   └──────┬──────┘   └──────────┬──────────┘   │
│         │                 │                      │               │
└─────────┼─────────────────┼──────────────────────┼───────────────┘
          │                 │                      │
          ▼                 ▼                      ▼
   ┌──────────────┐  ┌──────────────┐    ┌──────────────┐
   │  surgeons.ai │  │    Meta      │    │   Google     │
   │  analytics   │  │   Events     │    │  Analytics   │
   │   backend    │  │   Manager    │    │              │
   └──────────────┘  └──────────────┘    └──────────────┘
```

---

## 5. Pending / Blocked Items

| Item | Status | Blocker | Action Required |
|------|--------|---------|-----------------|
| SurgeonsEdge CDN | Dormant | Endpoint not deployed | Deploy CDN, provide URL, flip `cdn_live` flag |
| WAF integration | Defined | Endpoint not called | Wire up `waf.surgeonsolutions.org` if needed |
| Attribution consolidation | Recommended | None | Migrate inline SurgeonsAttribution into surgeonify |

---

## 6. API Contracts

### 6.1 Surgeonify Event Schema

**POST** `https://ai.surgeonsolutions.org/api/v1/surgeonify/events`

```json
{
  "event_type": "page_view | product_view | add_to_cart | checkout_start | search",
  "visitor_id": "uuid",
  "session_id": "uuid",
  "timestamp": "ISO8601",
  "url": "https://...",
  "referrer": "https://...",
  "utm": {
    "source": "...",
    "medium": "...",
    "campaign": "...",
    "term": "...",
    "content": "..."
  },
  "data": {
    // event-specific payload
  }
}
```

### 6.2 SurgeonsEdge CDN URL Format

**GET** `https://cdn.surgeonsolutions.org/optimize/{encoded_url}?w={width}&h={height}&q={quality}&f={format}`

| Param | Type | Description |
|-------|------|-------------|
| w | int | Width in pixels |
| h | int | Height in pixels |
| q | int | Quality 1-100 |
| f | string | Format: auto, webp, avif, jpg, png |

---

## 7. Deployment Commands

```bash
# Local development (hot reload)
shopify theme dev --store=cbdsurgeons.myshopify.com

# Push to unpublished preview theme (QA)
shopify theme push --unpublished

# Push to live production theme
shopify theme push --live
```

---

## 8. File Reference

| File | Purpose |
|------|---------|
| `layout/theme.liquid` | Main layout, all integrations rendered here |
| `snippets/surgeons-security-suite.liquid` | Security headers, CDN config, WAF, perf monitoring |
| `snippets/facebook-pixel.liquid` | Facebook Pixel integration |
| `snippets/surgeons-cdn-image.liquid` | Liquid helper for CDN image URLs |
| `assets/global.js` | Core JS (cart, modals, utilities) |
| `assets/product.js` | Product page components |
| `assets/collection.js` | Collection/search components |
| `config/settings_schema.json` | Theme settings including Facebook Pixel ID |

---

## 9. Contact

**Theme Development:** Claude Code (Anthropic)
**Business Contact:** Ryan Bolda, CBD Surgeons & Surgeons, LLC
**Infrastructure:** surgeons.ai / surgeonsolutions.org

---

*Last updated: 2026-01-27 by Claude Opus 4.5*
