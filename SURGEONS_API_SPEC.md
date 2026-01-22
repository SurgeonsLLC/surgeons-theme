# Surgeons Solutions API Integration Specification

**Version:** 2.0.0
**Date:** 2026-01-16
**Organization:** CBD Surgeons & Surgeons, LLC
**Operator:** Ryan Bolda - 130 Dickinson St, Mount Clemens, MI 48043
**Frontend Domain:** surgeonsolution.io / www.surgeonsolution.io

---

## Overview

This document specifies the API contracts required between the Shopify storefront (surgeonsolution.io) and the Surgeons Solutions backend infrastructure (surgeonsolutions.org) to achieve A+ performance and security ratings.

---

## Infrastructure Domains

| Service | Domain | Purpose |
|---------|--------|---------|
| **AI Services** | `ai.surgeonsolutions.org` | Chatbot, SEO injection, telemetry |
| **Edge CDN** | `cdn.surgeonsolutions.org` | Asset optimization, image delivery |
| **Script Bundler** | `edge.surgeonsolutions.org` | Dynamic JS bundling, minification |
| **WAF** | `waf.surgeonsolutions.org` | Threat logging, security analytics |
| **Attribution** | `records.surgeonsolution.io` | Marketing attribution tracking |
| **Auth** | `accounts.surgeonsolution.io` | Customer authentication |

---

## 1. Edge CDN Service (`cdn.surgeonsolutions.org`)

### 1.1 Asset Optimization Endpoint

**Purpose:** Transform and optimize assets (images, fonts, etc.) via edge CDN.

```
GET https://cdn.surgeonsolutions.org/optimize/{encoded_url}?{params}
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `w` | integer | Target width in pixels |
| `h` | integer | Target height in pixels |
| `q` | integer | Quality (1-100, default: 80) |
| `f` | string | Output format: `auto`, `webp`, `avif`, `jpeg`, `png` |

**Example Request:**
```
GET https://cdn.surgeonsolutions.org/optimize/https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2Fimage.jpg?w=800&q=85&f=webp
```

**Expected Response:**
- Returns optimized binary image with appropriate `Content-Type` header
- Sets cache headers: `Cache-Control: public, max-age=31536000, immutable`
- Returns `304 Not Modified` if `If-None-Match` header matches

**Frontend Integration:**
```javascript
window.SurgeonsEdge.cdnUrl('https://cdn.shopify.com/image.jpg', {
  width: 800,
  quality: 85,
  format: 'webp'
});
// Returns: https://cdn.surgeonsolutions.org/optimize/https%3A%2F%2Fcdn.shopify.com%2Fimage.jpg?w=800&q=85&f=webp
```

---

## 2. Script Bundler Service (`edge.surgeonsolutions.org`)

### 2.1 Dynamic Bundle Endpoint

**Purpose:** Bundle and minify multiple JavaScript files on-demand for optimal delivery.

```
POST https://edge.surgeonsolutions.org/api/v1/bundle
Content-Type: application/json
```

**Request Body:**
```json
{
  "website_id": "surgeonsolution-io",
  "scripts": [
    "https://cdn.shopify.com/s/files/1/surgeons-theme/assets/global.js",
    "https://cdn.shopify.com/s/files/1/surgeons-theme/assets/splide.esm.js"
  ],
  "minify": true,
  "sourcemap": false
}
```

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `website_id` | string | Yes | Identifier for the website |
| `scripts` | string[] | Yes | Array of script URLs to bundle |
| `minify` | boolean | No | Enable minification (default: true) |
| `sourcemap` | boolean | No | Include sourcemaps (default: false) |

**Expected Response:**
```json
{
  "success": true,
  "bundleUrl": "https://edge.surgeonsolutions.org/bundles/abc123def456.js",
  "bundleHash": "abc123def456",
  "originalSize": 196191,
  "bundledSize": 89234,
  "savings": "54.5%",
  "expiresAt": "2026-01-17T00:00:00Z"
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether bundling succeeded |
| `bundleUrl` | string | URL to fetch the bundled script |
| `bundleHash` | string | Hash for cache invalidation |
| `originalSize` | integer | Combined size of original scripts (bytes) |
| `bundledSize` | integer | Size of bundled output (bytes) |
| `savings` | string | Percentage reduction |
| `expiresAt` | string | ISO 8601 expiration timestamp |

**Error Response:**
```json
{
  "success": false,
  "error": "INVALID_SCRIPT_URL",
  "message": "Script URL not in allowlist: https://malicious.com/bad.js"
}
```

**Frontend Integration:**
```javascript
window.SurgeonsEdge.loadOptimizedBundle([
  '{{ "global.js" | asset_url }}',
  '{{ "splide.esm.js" | asset_url }}'
], function() {
  console.log('Bundle loaded');
});
```

---

## 3. WAF Service (`waf.surgeonsolutions.org`)

### 3.1 Threat Reporting Endpoint

**Purpose:** Log detected security threats for analysis and alerting.

```
POST https://waf.surgeonsolutions.org/api/v1/threats
Content-Type: application/json
```

**Request Body:**
```json
{
  "website_id": "surgeonsolution-io",
  "timestamp": 1705363200000,
  "type": "FORM_INJECTION",
  "threats": ["SQL_INJECTION", "XSS"],
  "page": "/products/cbd-gummies",
  "form": "/cart/add",
  "userAgent": "Mozilla/5.0...",
  "referrer": "https://google.com",
  "ip": null
}
```

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `website_id` | string | Yes | Site identifier |
| `timestamp` | integer | Yes | Unix timestamp (ms) |
| `type` | string | Yes | Threat type: `FORM_INJECTION`, `URL_INJECTION`, `XSS_ATTEMPT` |
| `threats` | string[] | Yes | Detected threat categories |
| `page` | string | Yes | Page path where threat occurred |
| `form` | string | No | Form action URL (for form threats) |
| `query` | string | No | Query string (for URL threats) |
| `userAgent` | string | Yes | Browser user agent |
| `referrer` | string | No | Referrer URL |
| `ip` | string | No | Client IP (set server-side if available) |

**Threat Categories:**
| Category | Description |
|----------|-------------|
| `SQL_INJECTION` | SQL keywords or injection patterns detected |
| `XSS` | Script tags, event handlers, or javascript: URIs |
| `PATH_TRAVERSAL` | Directory traversal sequences (../) |
| `COMMAND_INJECTION` | Shell command patterns |
| `HEADER_INJECTION` | CRLF injection attempts |

**Expected Response:**
```json
{
  "received": true,
  "threatId": "thr_abc123",
  "action": "logged"
}
```

**Note:** This endpoint uses `navigator.sendBeacon()` for reliable delivery. Should accept both JSON and `application/x-www-form-urlencoded`.

---

## 4. AI Telemetry Service (`ai.surgeonsolutions.org`)

### 4.1 Performance Metrics Endpoint

**Purpose:** Collect Real User Monitoring (RUM) data for performance optimization.

```
POST https://ai.surgeonsolutions.org/api/v1/telemetry/performance
Content-Type: application/json
```

**Request Body:**
```json
{
  "website_id": "surgeonsolution-io",
  "page": "/products/cbd-oil",
  "timestamp": 1705363200000,
  "metrics": {
    "lcp": 1234,
    "fid": 45,
    "inp": 89,
    "cls": 0.05,
    "ttfb": 234,
    "domLoad": 1567,
    "windowLoad": 2345,
    "dns": 23,
    "tcp": 45,
    "ssl": 67,
    "jsBytes": 196191,
    "cssBytes": 52860,
    "imgBytes": 456789,
    "totalBytes": 705840
  },
  "userAgent": "Mozilla/5.0...",
  "connection": {
    "effectiveType": "4g",
    "downlink": 10,
    "rtt": 50
  }
}
```

**Metrics Fields:**
| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `lcp` | integer | ms | Largest Contentful Paint |
| `fid` | integer | ms | First Input Delay |
| `inp` | integer | ms | Interaction to Next Paint |
| `cls` | float | score | Cumulative Layout Shift (0-1) |
| `ttfb` | integer | ms | Time to First Byte |
| `domLoad` | integer | ms | DOM Content Loaded |
| `windowLoad` | integer | ms | Window Load event |
| `dns` | integer | ms | DNS lookup time |
| `tcp` | integer | ms | TCP connection time |
| `ssl` | integer | ms | SSL handshake time |
| `jsBytes` | integer | bytes | Total JavaScript transferred |
| `cssBytes` | integer | bytes | Total CSS transferred |
| `imgBytes` | integer | bytes | Total images transferred |
| `totalBytes` | integer | bytes | Total resources transferred |

**Connection Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `effectiveType` | string | `slow-2g`, `2g`, `3g`, `4g` |
| `downlink` | float | Mbps download speed |
| `rtt` | integer | Round-trip time in ms |

**Expected Response:**
```json
{
  "received": true
}
```

**Note:** Uses `navigator.sendBeacon()` on `visibilitychange` event.

### 4.2 Core Web Vitals Endpoint (Existing)

```
POST https://ai.surgeonsolutions.org/api/v1/telemetry/cwv
```

Same format as performance endpoint but with only CWV metrics.

---

## 5. Existing Endpoints (Already Implemented)

### 5.1 SEO Injection

```
GET https://ai.surgeonsolutions.org/api/v1/code-injections?website_id=surgeonsolution-io&status=deployed&page_url={url}
```

### 5.2 BUD Chatbot

```
POST https://ai.surgeonsolutions.org/api/v1/bud/chat
```

### 5.3 Chatbot Loader

```
GET https://ai.surgeonsolutions.org/api/chatbot/loader.js
```

---

## 6. CORS Configuration Required

All endpoints must allow requests from:
- `https://surgeonsolution.io`
- `https://www.surgeonsolution.io`
- `https://cbdsurgeons.myshopify.com` (development)

**Required CORS Headers:**
```
Access-Control-Allow-Origin: https://surgeonsolution.io
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

---

## 7. Rate Limiting Recommendations

| Endpoint | Recommended Limit |
|----------|-------------------|
| CDN Optimize | 1000 req/min per IP |
| Bundle API | 100 req/min per website_id |
| WAF Threats | 500 req/min per website_id |
| Telemetry | 1000 req/min per website_id |

---

## 8. Frontend JavaScript API Reference

The following global objects are exposed on the storefront:

```javascript
// Edge CDN
window.SurgeonsEdge.cdnUrl(url, options)        // Transform URL to CDN
window.SurgeonsEdge.preloadAsset(url, as)       // Preload asset via edge
window.SurgeonsEdge.loadOptimizedBundle(urls, callback)  // Load bundled scripts

// WAF
window.SurgeonsWAF.validateInput(input, options)  // Validate input
window.SurgeonsWAF.sanitize(input)                // Sanitize input
window.SurgeonsWAF.reportThreat(data)             // Report threat manually

// Security
window.SurgeonsSecurity.isAllowedDomain(url)      // Check domain allowlist
window.SurgeonsSecurity.secureFetch(url, options) // Fetch with validation
window.SurgeonsSecurity.sanitizeInput(input)      // Alias for WAF.sanitize

// Performance
window.SurgeonsPerf.metrics                       // Current metrics object
window.SurgeonsPerf.collectMetrics()              // Force metric collection
```

---

## 9. Implementation Checklist

### Backend Team (surgeonsolutions.org)

- [ ] Deploy `cdn.surgeonsolutions.org` with image optimization
- [ ] Deploy `edge.surgeonsolutions.org` with bundling API
- [ ] Deploy `waf.surgeonsolutions.org` with threat logging
- [ ] Update `ai.surgeonsolutions.org` with performance telemetry endpoint
- [ ] Configure CORS for all endpoints
- [ ] Set up SSL certificates for new subdomains
- [ ] Configure DNS records for new subdomains
- [ ] Set up rate limiting
- [ ] Create monitoring/alerting for threat reports

### Frontend Team (Already Complete)

- [x] Security Suite snippet created (`surgeons-security-suite.liquid`)
- [x] CSP updated with new domains
- [x] Domain allowlist updated
- [x] WAF client-side protection enabled
- [x] Performance monitoring enhanced
- [x] Documentation updated

---

## 10. Testing

### Debug Mode

Add `?debug=true` to any page URL to enable console logging for all Surgeons services.

### Verify Integration

```javascript
// In browser console with ?debug=true
console.log(window.SurgeonsEdge.version);      // Should show "2.0.0"
console.log(window.SurgeonsWAF.version);       // Should show "2.0.0"
console.log(window.SurgeonsPerf.metrics);      // Should show collected metrics
```

---

## 11. Deployment Commands

For **Ryan Bolda** (Operator):

```bash
# Development - Local preview
shopify theme dev --store=cbdsurgeons.myshopify.com

# Preview - Deploy to unpublished theme for testing
shopify theme push --unpublished

# Production - Deploy to live theme
shopify theme push --live

# Pull latest from Shopify
shopify theme pull --theme-id=THEME_ID
```

---

## Contact

**Organization:** CBD Surgeons & Surgeons, LLC
**Operator:** Ryan Bolda
**Address:** 130 Dickinson St, Mount Clemens, MI 48043
**Store:** surgeonsolution.io
**Backend:** surgeonsolutions.org
