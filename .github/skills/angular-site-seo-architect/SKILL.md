---
name: angular-site-seo-architect
description: "Use when implementing, auditing, or refactoring Angular SEO architecture, including SeoService, route metadata, canonical URLs, Open Graph, Twitter cards, robots directives, JSON-LD, sitemap.xml, robots.txt, index.html defaults, SSR safety, or technical SEO validation."
---

# Angular Sitewide SEO Architect

Act as a Principal Web Architect and Technical SEO Specialist for this Angular repository. Build SEO as a centralized, typed, route-driven system. Inspect the existing `SiteConfig`, routes, app shell, `index.html`, and tests before editing. Preserve application behavior and do not hardcode production domains, company names, contact details, or social URLs in page components.

## Required Architecture

Create `src/app/core/services/seo.service.ts` as a singleton service using Angular's `Title`, `Meta`, `DOCUMENT`, and `Injectable` APIs. Keep the public configuration type strict:

```typescript
export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
  canonicalUrl?: string;
  jsonLd?: Record<string, unknown>;
}
```

Do not use `any`. If an external JSON-LD shape needs more precision, add typed interfaces or use `Record<string, unknown>` and validate values at the boundary.

The service must:

- format the document title as `[Page Title] | [Company Name]`, using `SiteConfigService.companyName`;
- upsert `description`, `keywords`, and `robots` meta tags;
- upsert `og:title`, `og:description`, `og:image`, `og:url`, and `og:type`;
- upsert `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image`;
- create or update exactly one canonical `<link rel="canonical">` with an absolute URL;
- create or update exactly one managed `<script id="site-seo-jsonld" type="application/ld+json">` when JSON-LD is configured, and remove the managed script when it is not configured;
- avoid direct `window` or `document` globals so SSR and pre-rendering remain possible;
- resolve relative image and canonical paths against the configured production origin;
- safely serialize JSON-LD and never emit `undefined` or executable content into the script element.

Use a stable managed marker such as `id="site-seo-jsonld"` and `data-seo-managed="true"` so repeated navigations do not accumulate tags. `updateTag` is appropriate for named meta tags; use `document.head.querySelector` for the canonical and JSON-LD elements.

The service may subscribe to `Router.events` once in its constructor or expose an `apply(config, url)` method and let the root component handle navigation. A router event subscription is an acceptable RxJS boundary because `NavigationEnd` is a finite application event stream; do not create component-level subscriptions for SEO on every page.

## Central Configuration

Extend the typed `SiteConfig` in `src/app/core/config/site-config.ts` with the production origin and a default social image, for example:

```typescript
readonly siteUrl: string;
readonly defaultSeoImage: string;
```

Add values to `SITE_CONFIG` using the real deployed HTTPS origin supplied by the repository owner. Do not invent a production domain. Keep local development fallback behavior deterministic, but never publish `localhost` in `sitemap.xml` or production canonical metadata.

Expose these values through `SiteConfigService`. Route-specific descriptions and keywords belong in route data, not in page templates.

## Route-Driven Metadata

Define a typed route data contract and add explicit SEO data to every indexable core route in `src/app/app.routes.ts`. Keep the existing Angular `title` field for router title integration, and add `data.seo`:

```typescript
{
  path: 'about',
  component: AboutComponent,
  title: 'About',
  data: {
    seo: {
      description: 'Learn more about our mission, values, and team.',
      keywords: ['about us', 'company mission', 'team'],
      type: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage'
      }
    }
  }
}
```

Provide explicit metadata for `/`, `/about`, `/contact`, `/privacy`, and `/cookie-policy`. Privacy and cookie policy routes should set `noIndex: true` when the site's SEO policy requires them to remain out of search results; the sitemap must omit routes marked noindex. Do not assume that a route title alone supplies a description, canonical URL, robots directive, or social metadata.

Use a route data interface compatible with Angular's `Route.data` type, for example:

```typescript
export interface SeoRouteData {
  seo: SeoConfig;
}
```

When a child route is active, merge the deepest active route's SEO data with safe site defaults. Apply SEO only after `NavigationEnd`, using the normalized browser URL and the route's configured metadata.

## Root Navigation Integration

Update `AppComponent` or the root routing strategy to initialize SEO exactly once and apply metadata on every successful navigation. The integration must:

1. inject `Router` and `SeoService`;
2. listen for `NavigationEnd`;
3. locate the deepest activated route with `data.seo`;
4. call the service with the route config and the final URL;
5. apply default home metadata on the initial navigation if no route data is found.

Keep this orchestration out of individual page components. Do not add duplicate SEO subscriptions in page components.

## JSON-LD Requirements

Use valid Schema.org objects appropriate to the page:

- home: `WebSite` and/or `Organization`;
- about: `AboutPage` and `Organization`;
- contact: `ContactPage`;
- privacy and cookie policy: `WebPage` with noindex where configured;
- breadcrumb navigation: `BreadcrumbList` when the page hierarchy is meaningful.

All JSON-LD URLs must be absolute and must come from `SiteConfigService.siteUrl` or a route-derived absolute URL. Serialize with `JSON.stringify` and verify that the generated script is valid JSON. Do not include secrets, tracking identifiers, or unverified business claims.

## Static SEO Assets

Create `public/sitemap.xml` with XML declaration and absolute HTTPS URLs for the indexable core routes. Use accurate `<lastmod>` dates only when the repository has a trustworthy source; otherwise omit `<lastmod>`. Include `<priority>` and `<changefreq>` only when they reflect a deliberate strategy. Never include noindex policy routes.

Use this structure, replacing the placeholder origin with the configured production origin:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://example.com/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

Include `/privacy` and `/cookie-policy` only if the site's explicit policy is to index them. The static sitemap must match route behavior and canonical policy.

Create `public/robots.txt`:

```text
User-agent: *
Allow: /
Sitemap: https://example.com/sitemap.xml
```

Replace the placeholder origin with the same configured production origin. Do not disallow CSS, JavaScript, or image assets required for rendering.

## Document Defaults

Update `src/index.html` with safe fallback values for users and crawlers before Angular bootstraps:

- `lang="en"` or the repository's actual primary language;
- charset and responsive viewport;
- default title and description sourced from approved site copy;
- fallback `robots` policy;
- Open Graph and Twitter defaults where useful;
- absolute or root-relative favicon and manifest references that exist in `public/`.

Runtime route metadata must overwrite these defaults. Avoid duplicate static tags that the service will manage unless the service deliberately updates them by the same `name` or `property` key.

## SSR and URL Safety

Use Angular's `DOCUMENT` token for all head access. Do not reference `window`, `document`, or `location` directly. For URL resolution, prefer the configured site origin; use `document.location.origin` only as a guarded runtime fallback and never as the only source for pre-rendered output. Confirm that the service can be instantiated without a browser global.

Keep canonical URLs normalized: HTTPS production origin, one trailing-slash policy, no hash fragments, and route paths derived from the final router URL. Preserve meaningful query parameters only when the canonical strategy explicitly requires them.

## Validation Workflow

After implementation:

1. Run TypeScript and Angular compilation with `npm.cmd run build:app`.
2. Start the app if needed and inspect every core route's `<title>`, description, robots, Open Graph, Twitter, canonical, and JSON-LD tags.
3. Confirm exactly one canonical link and at most one managed JSON-LD script after multiple navigations.
4. Parse `public/sitemap.xml` as XML and verify every URL is absolute, reachable in the route table, and consistent with noindex policy.
5. Verify `public/robots.txt` points to the same origin and sitemap path.
6. Run existing unit and accessibility tests, including `npm.cmd run test:a11y` when the server/test setup supports it.
7. Add focused tests for title formatting, noindex behavior, canonical replacement, JSON-LD replacement/removal, and SSR-safe service construction.

Report changed files, route coverage, production-origin assumptions, validation results, and any route intentionally excluded from indexing. Never claim SEO compliance based only on a source scan; verify the rendered head after navigation.
