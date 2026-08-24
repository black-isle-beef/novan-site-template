---
name: angular-page-generator
description: "Use when creating a new Angular page, route, or navigation entry in this repository. Generates a standalone page component with Tailwind CSS layout, breadcrumbs, SiteConfig references, lazy route metadata, SEO data, and header navigation registration."
argument-hint: "Page name and route path, for example: Services /services"
---

# Angular Page Generator

Create a complete, production-ready page for this Angular application. Follow the repository's established standalone-component, Tailwind CSS, global-style, configuration, and accessibility conventions.

## Inputs

Collect or infer these values before editing:

- **Page name:** Human-readable title, such as `Services`, `Pricing`, or `FAQ`.
- **Route path:** Absolute or relative route, such as `/services`, `/pricing`, or `/faq`.

Normalize the route path to a path segment for Angular routing. For example, `/services` becomes `services`. Clarify only when the page name, route path, or intended content cannot be inferred safely.

## Repository Inspection

Before editing, read these local sources and use their current patterns as the authority:

1. `src/app/app.routes.ts` for route structure and existing SEO metadata conventions.
2. A neighboring page component and template in `src/app/pages/` for page structure and import style.
3. `src/app/core/config/site-config.ts` and `site-config.service.ts` for dynamic brand, company, and contact data.
4. `src/app/layout/header/header.component.ts` and its template for the current navigation source of truth.
5. Relevant page and layout tests before changing shared behavior.

Do not assume `src/app/core/config/navigation.config.ts` exists. In the current application, primary links are defined by `navigationLinks` in `HeaderComponent`; update that source unless the repository has been deliberately refactored to a central navigation configuration.

## Implementation Requirements

### Page Component

1. Create `src/app/pages/<page-slug>/<page-slug>.component.ts` as a standalone component.
2. Use an inline `template` in the component. Do not create a component-level `.scss` or `.css` file; set `styles: []` or omit style metadata.
3. Inject `SiteConfigService` using `inject()` for company, brand, email, or other configured content. Never hardcode brand/company references, contact details, or social URLs.
4. Use modern Angular control flow (`@if`, `@for`, `@switch`) whenever conditional or repeated UI is needed. Do not introduce `*ngIf`, `*ngFor`, or `*ngSwitch`.
5. Use strict TypeScript types. Do not use `any`.

### Template and Accessibility

1. Build the page with semantic elements, using `<article>` or `<section>` as the outer page landmark and a coherent heading hierarchy.
2. Include a heading section containing the page title and a Tailwind-styled lead description appropriate to the requested topic.
3. Include an accessible breadcrumb `<nav aria-label="Breadcrumb">` linking to Home and indicating the current page with `aria-current="page"`.
4. Use Tailwind CSS utilities for layout, spacing, typography, color, and responsive behavior, including `mx-auto`, `max-w-*`, `grid`, `flex`, `gap-*`, `px-*`, `py-*`, and responsive prefixes such as `sm:`, `md:`, and `lg:`.
5. Add focused, topic-appropriate placeholder content rather than generic filler. Use semantic headings, paragraphs, lists, and calls to action as appropriate.
6. Avoid inline styles, per-component stylesheets, and unnecessary custom CSS. Add a global style rule only if Tailwind utilities cannot express a needed reusable presentation rule.
7. Use valid native HTML semantics before adding ARIA. Ensure links and controls have accessible names.

### Route Registration

Add a lazy-loaded route in `src/app/app.routes.ts`:

```typescript
{
  path: '<route-segment>',
  loadComponent: () =>
    import('./pages/<page-slug>/<page-slug>.component').then(
      (module) => module.<PageName>Component,
    ),
  title: '<Page Title>',
  data: {
    seo: {
      description: '<Clear, topic-specific page description.>',
      keywords: ['<relevant keyword>', '<relevant keyword>'],
    },
  },
},
```

Keep route ordering intentional: add the page before the wildcard redirect and preserve existing route behavior. Follow the actual SEO type and service contract if it differs from this example.

### Navigation Registration

Register the page in the primary header navigation source of truth. In the current codebase this is `navigationLinks` in `src/app/layout/header/header.component.ts`.

- Add a typed entry with the normalized path and visible label. Use the repository's configured icon library if the navigation model supports icons; do not make a specific icon library a requirement.
- Preserve intentional navigation ordering and active-link behavior.
- If a future `navigation.config.ts` owns the links instead, update `headerItems` or the equivalent central collection there rather than duplicating data.

### Tests and Validation

1. Add or update a focused component test covering page creation, title content, and dynamic `SiteConfigService` content where applicable.
2. Update header tests when changing navigation data, especially when link order or active behavior matters.
3. After the first edit, run the narrowest relevant test. Then run the affected page/header tests and finish with:

```powershell
npm.cmd run build:app
```

4. Run the repository's accessibility test when the environment supports it:

```powershell
npm.cmd run test:a11y
```

Do not modify generated output, `node_modules`, `dist`, or `test-results`. Preserve unrelated working-tree changes.

## Completion Report

State:

- page component, route, navigation, style, and test files changed;
- the route path and SEO metadata added;
- focused test, build, and accessibility results;
- any deliberate placeholder content or unverified external business detail.