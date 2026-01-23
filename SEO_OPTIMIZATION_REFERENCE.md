# SEO Optimization Reference - CBD Surgeons / surgeonsolution.io

> **Last Updated:** 2026-01-22
> **Operator:** Ryan Bolda, 130 Dickinson St, Mount Clemens, MI 48043

This document tracks all SEO optimizations for the Surgeons theme. Use this to verify settings haven't been reverted by Shopify or theme updates.

---

## BACKEND SEO (Meta Tags & Schema)

### Location: `snippets/meta-tags.liquid`
**Purpose:** Dynamic meta titles, descriptions, OG tags

**Key Settings:**
- Canonical URLs enforce `www.` prefix for surgeonsolution.io
- Robots: `index, follow, max-image-preview:large`
- Author: `CBD Surgeons & Surgeons, LLC`
- Publisher: `surgeonsolution.io`

### Location: `snippets/seo-keywords.liquid`
**Purpose:** Transactional keyword injection based on page type

**Keyword Categories:**
- Homepage: `buy CBD online, shop CBD products, order CBD, CBD for sale, premium CBD`
- Collections: Dynamic based on collection name + category-specific terms
- Products: Product-specific + tags + availability signals
- Local SEO: Mount Clemens, Michigan, Metro Detroit, Southeast Michigan

### Location: `layout/theme.liquid` (Schema Markup)

**Organization Schema (Line ~527):**
```json
{
  "@type": "Organization",
  "name": "CBD Surgeons",
  "legalName": "Surgeons, LLC",
  "url": "https://surgeonsolution.io",
  "telephone": "+1-586-246-5852",
  "email": "customer.relations@surgeonsolution.io",
  "address": {
    "streetAddress": "130 Dickinson St",
    "addressLocality": "Mount Clemens",
    "addressRegion": "MI",
    "postalCode": "48043"
  },
  "foundingDate": "2022-03-20"
}
```

**Product Schema includes:**
- Transactional description prefix: "Buy [product] online at CBD Surgeons"
- Shipping details (free shipping, 2-5 day delivery)
- Return policy (30-day free returns)
- Seller: CBD Surgeons
- **AggregateRating** (enables star snippets in Google search results)
- **BreadcrumbList** (enables breadcrumb rich snippets)

**Collection Schema includes:**
- CollectionPage type with ItemList
- BreadcrumbList for navigation
- Transactional naming: "Shop [Category] - Buy Online"

**Article Schema includes:**
- Article type with headline, description, image
- Author and publisher information
- datePublished and dateModified timestamps
- BreadcrumbList for navigation

---

## FRONTEND SEO (User-Visible Content)

### 1. Homepage H1
**Location:** `sections/seo-hero.liquid`

**Required Content:**
- H1 tag with transactional keywords
- Default: "Shop Premium CBD Products Online"
- Subheading with keywords
- Trust signals visible

**Verification:** Check homepage source for `<h1>` tag - should be ONLY ONE.

### 2. Product Page H1
**Location:** `snippets/product-blocks.liquid` (Line ~81)

**Change Made:**
```liquid
{%- comment -%} SEO: Product title MUST be H1 for proper page hierarchy {%- endcomment -%}
<h1 class="mty {{ section_prefix_class }}_heading ...">
  {{- product.title -}}
</h1>
```

**Was Previously:** `<h2>` (incorrect for SEO)

### 3. Visible Product Descriptions
**Location:** `snippets/product-blocks.liquid` (block type: `product_description`)

**Features:**
- Shows `product.description` visibly on page
- Optional "Read more" truncation
- Heading: "About This Product"
- `itemprop="description"` for schema

### 4. Trust Badges
**Location:** `snippets/product-blocks.liquid` (block type: `trust_badges`)

**Badges Available:**
- Lab Tested
- Fast Shipping
- Secure Checkout
- Satisfaction Guaranteed
- USA-Grown Hemp

### 5. Collection Descriptions
**Location:** `sections/main-products-grid.liquid` (Line ~1145)

**Verification:** Collection pages should show `collection.description` visibly.

### 6. Product Page Breadcrumbs
**Location:** `sections/main-product.liquid`

**Settings (in Theme Editor → Product Page section):**
- `show_breadcrumb` - Enable/disable breadcrumb navigation
- `breadcrumb_color_scheme` - Color scheme for breadcrumb
- `breadcrumb_container_layout` - Container width
- `breadcrumb_corner_radius` - Border radius
- `breadcrumb_top_bdr` / `breadcrumb_bottom_bdr` - Border visibility

**What it provides:**
- Visual breadcrumb trail: Home > Collection > Product
- Paired with BreadcrumbList schema for rich snippets

### 7. FAQ Section with Schema
**Location:** `sections/faq-section.liquid`

**What it provides:**
- **Frontend (Visible):** Accordion-style FAQ that users can click to expand
- **Backend (Schema):** FAQPage structured data for Google rich results

**How to Use:**
1. Go to Theme Editor
2. Add section → "FAQ Section"
3. Add FAQ Item blocks with questions and answers
4. Google will show FAQ rich results in search listings

**Default FAQs included:**
- What is CBD?
- How do I choose the right CBD product?
- Is CBD legal?
- How long does shipping take?
- What is your return policy?

---

## THEME SETTINGS (settings_schema.json)

### SEO & Keywords Section

| Setting ID | Default Value | Purpose |
|------------|---------------|---------|
| `seo_enable_keywords` | `true` | Master toggle |
| `seo_brand_name` | `CBD Surgeons` | Brand for keywords |
| `seo_homepage_title_suffix` | `\| Buy Premium CBD Online \| Fast Shipping` | Title suffix |
| `seo_homepage_description` | `Shop premium CBD products...` | Meta description |
| `seo_collection_title_prefix` | `Shop` | Before collection name |
| `seo_collection_title_suffix` | `\| Buy Online - CBD Surgeons` | After collection name |
| `seo_product_title_suffix` | `\| CBD Surgeons` | Product title suffix |
| `seo_enable_local` | `true` | Local SEO toggle |
| `seo_local_city` | `Mount Clemens` | City targeting |
| `seo_local_state` | `Michigan` | State targeting |
| `seo_local_region` | `Metro Detroit, Southeast Michigan, Macomb County` | Region targeting |

---

## GOOGLE COMPLIANCE STATUS

### Schema Compliance (as of 2026-01-22)

| Schema Type | Status | Validation | Notes |
|-------------|--------|------------|-------|
| Organization | ✅ Compliant | Valid | All required fields present |
| LocalBusiness | ✅ Compliant | Valid | Geo coordinates, hours, contact |
| WebSite + SearchAction | ✅ Compliant | Valid | Sitelinks search box enabled |
| Product | ✅ Compliant | Valid | Price, availability, shipping, returns |
| Product > AggregateRating | ⚠️ Conditional | Valid | Only shows if real reviews exist |
| Product > BreadcrumbList | ✅ Compliant | Valid | Dynamic based on collection |
| CollectionPage | ✅ Compliant | Valid | ItemList with products |
| Collection > BreadcrumbList | ✅ Compliant | Valid | 3-level hierarchy |
| Article | ✅ Compliant | Valid | Author, publisher, dates |
| Article > BreadcrumbList | ✅ Compliant | Valid | Blog hierarchy |
| FAQPage | ✅ Compliant | Valid | Question/Answer pairs |

### Core Web Vitals Target

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| LCP (Largest Contentful Paint) | < 2.5s | Monitor | Preload + critical CSS implemented |
| INP (Interaction to Next Paint) | < 200ms | Monitor | Deferred scripts implemented |
| CLS (Cumulative Layout Shift) | < 0.1 | Monitor | Skeleton loaders + explicit dimensions |

### Google Policy Compliance

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| No fake reviews | ✅ Fixed | AggregateRating only shows with real metafield data |
| Real product identifiers | ✅ Compliant | GTIN from barcode, SKU as MPN |
| Accurate pricing | ✅ Compliant | Dynamic from Shopify |
| Accurate availability | ✅ Compliant | InStock/OutOfStock from inventory |
| No cloaking | ✅ Compliant | Same content for users and bots |
| Mobile-friendly | ✅ Compliant | Responsive design |
| HTTPS | ✅ Compliant | Shopify-enforced SSL |

### Testing URLs
- **Rich Results Test:** https://search.google.com/test/rich-results
- **Schema Validator:** https://validator.schema.org/
- **PageSpeed Insights:** https://pagespeed.web.dev/
- **Mobile-Friendly Test:** https://search.google.com/test/mobile-friendly

---

## CONTINUOUS IMPROVEMENT TRACKER

### Implemented (2026-01-22)
- [x] AggregateRating schema (conditional on real reviews)
- [x] Product BreadcrumbList schema
- [x] Article schema for blog posts
- [x] Article BreadcrumbList schema
- [x] Visual breadcrumbs on product pages
- [x] GTIN support in Product schema
- [x] Removed fake review data (compliance fix)

### Pending Implementation
- [ ] Install review app (Judge.me, Yotpo, or Loox) for real AggregateRating
- [ ] Add product barcodes in Shopify for GTIN data
- [ ] Implement HowTo schema for educational content
- [ ] Add VideoObject schema if product videos exist
- [ ] Create XML sitemap priority rules
- [ ] Implement hreflang if expanding internationally

### Monitoring Schedule
| Task | Frequency | Tool |
|------|-----------|------|
| Schema validation | Weekly | Rich Results Test |
| Core Web Vitals | Weekly | PageSpeed Insights |
| Search Console errors | Daily | Google Search Console |
| Keyword rankings | Weekly | Search Console Performance |
| Index coverage | Weekly | Search Console Coverage |
| Backlink profile | Monthly | Search Console Links |

---

## SEO CHECKLIST

### Weekly Verification:
- [ ] Homepage has exactly ONE `<h1>` tag
- [ ] Product pages use `<h1>` for product title
- [ ] Product descriptions are visible (not hidden in dropdowns)
- [ ] Collection descriptions are showing
- [ ] Trust badges display on product pages
- [ ] Schema markup validates (test at schema.org/validator)
- [ ] Product page breadcrumbs are visible
- [ ] Star ratings showing in Product schema

### Monthly Verification:
- [ ] Check Google Search Console for indexing issues
- [ ] Verify canonical URLs working correctly
- [ ] Test structured data in Google Rich Results Test
- [ ] Review keyword rankings in Search Console
- [ ] Check for star rating snippets in Google (may take 2-4 weeks to appear)
- [ ] Verify breadcrumb snippets showing in search results

### After Theme Updates:
1. Check `snippets/product-blocks.liquid` - verify H1 not reverted to H2
2. Check `snippets/meta-tags.liquid` - verify transactional title logic intact
3. Check `snippets/seo-keywords.liquid` - file still exists and rendering
4. Check `sections/seo-hero.liquid` - file still exists
5. Verify schema markup in `layout/theme.liquid`

---

## TRANSACTIONAL KEYWORDS REFERENCE

### Primary (Homepage):
```
buy CBD online
shop CBD products
order CBD gummies
purchase hemp products
CBD for sale
premium CBD online store
buy hemp flower
CBD edibles online
shop CBD topicals
```

### Product Categories:
```
buy CBD gummies online
order CBD flower
shop CBD topicals
purchase CBD drinks
CBD edibles for sale
hemp flower online
buy CBD oil
order hemp gummies
CBD cream for sale
```

### Local SEO:
```
CBD Mount Clemens
CBD Michigan
Metro Detroit CBD
Southeast Michigan CBD
Macomb County CBD
```

---

## FILE LOCATIONS QUICK REFERENCE

| Purpose | File Path |
|---------|-----------|
| Meta tags | `snippets/meta-tags.liquid` |
| Keywords injection | `snippets/seo-keywords.liquid` |
| Product blocks (H1, desc, badges) | `snippets/product-blocks.liquid` |
| Homepage H1 section | `sections/seo-hero.liquid` |
| FAQ section with schema | `sections/faq-section.liquid` |
| Main layout (schema) | `layout/theme.liquid` |
| Theme settings | `config/settings_schema.json` |
| Current settings | `config/settings_data.json` |

---

## DEPLOYMENT COMMANDS

```bash
# Development preview
shopify theme dev --store=954b07-26.myshopify.com

# Push to live
shopify theme push --store=954b07-26.myshopify.com --live --allow-live

# Push as preview (unpublished)
shopify theme push --store=954b07-26.myshopify.com --unpublished
```

---

**Document maintained by Claude Code for CBD Surgeons & Surgeons, LLC**
