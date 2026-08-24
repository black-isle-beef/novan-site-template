---
name: angular-scss-compliance-auditor
description: "Use when auditing or refactoring this Angular repository for standalone components, signal-based reactivity, modern control flow, strict TypeScript, centralized SiteConfig content, Tailwind CSS utilities, global style architecture, color-token usage, semantic HTML, and accessibility compliance."
---

# Angular and SCSS Compliance Auditor

Act as a Principal Frontend Software Architect for this repository. This is an on-demand audit and remediation workflow. Inspect the current code before editing, preserve working behavior, and make the smallest coherent set of changes needed to satisfy the rules below.

## Operating Contract

1. Establish the repository root and read `package.json`, `angular.json`, `tsconfig*.json`, the central site configuration, and the affected tests before changing code.
2. Run the bundled audit script first:
   `powershell -ExecutionPolicy Bypass -File .github/skills/angular-scss-compliance-auditor/audit.ps1`
3. Treat every reported finding as actionable unless it is a documented, reviewed exception. Do not suppress a finding merely to make the build pass.
4. After each logical remediation slice, run the narrowest relevant check. Finish with:
   `npm.cmd run build:app`
   and, when the application can be served, `npm.cmd run test:a11y`.
5. Never rewrite generated output, `node_modules`, `dist`, or `test-results`. Do not alter unrelated user changes.
6. Report remaining findings, build failures, and test gaps explicitly.

## Mandatory Angular Rules

- Every component, directive, and pipe is standalone. Use `standalone: true` where the Angular version and decorator require it. Do not introduce or retain `NgModule` declarations, imports, providers, or bootstrap wiring.
- Templates use Angular built-in control flow: `@if`, `@for`, and `@switch` with `@case`/`@default`. Ban `*ngIf`, `*ngFor`, `*ngSwitch`, and equivalent structural-directive syntax. Preserve `track` expressions and empty states when converting loops.
- Prefer Signals for local and component state: `signal()`, `computed()`, `input()`, and `output()`. Do not add legacy `@Input()` or `@Output()`. Replace manual RxJS subscriptions when a signal-based or template-pipe solution is appropriate; retain RxJS where it represents a real asynchronous stream and explain the boundary.
- Keep file names predictable, such as `user.component.ts`, `.html`, and `.spec.ts`. Components must use `styles: []` or omit component styles. Do not create or retain per-component `.scss`/`.css` files; move required rules into the global style architecture.
- TypeScript is strict. Never use `any`, including `any[]`, explicit casts to `any`, or generic defaults that leak `any`. Define interfaces or type aliases for data structures, use strict null checks, narrow unknown values, and type service boundaries.

## Mandatory Styling Rules

- Custom styles live under `src/styles/` and are composed from `src/styles/styles.scss` using the repository's established `@use` hierarchy. Keep tokens in `abstracts/_variables.scss` and typography tokens in `abstracts/_typography.scss`; keep reusable component rules in `components/`.
- Do not add inline `style="..."` attributes or Angular `[style]`/`[style.foo]` bindings. Use semantic classes and global SCSS.
- Prefer Tailwind CSS utilities for layout, spacing, display, typography, color, and responsive behavior (`flex`, `gap-3`, `text-slate-600`, `py-4`, and similar). Add custom CSS only for behavior or visual rules Tailwind cannot express.
- Keep Tailwind configured through the repository's main stylesheet and theme configuration. Do not introduce arbitrary utility values when an existing theme token expresses the value.
- Custom SCSS/CSS must not contain hardcoded color values: no hex, `rgb()`, `rgba()`, `hsl()`, or `hsla()`. Reference Tailwind theme tokens or repository-defined token variables. Do not hide colors in CSS custom properties or quoted strings to evade this rule.
- Do not introduce a new component stylesheet as part of a fix. When moving styles, preserve selectors and verify the resulting cascade.

## Mandatory Maintainability and Accessibility Rules

- Do not hardcode brand names, contact emails, URLs, social links, legal text, or copyright dates in component templates. Add or extend typed values in `src/app/core/config/site-config.ts` and expose them through `SiteConfigService`; inject that service into consumers. Keep route paths and accessibility labels intentional rather than blindly dynamic.
- Use semantic landmarks and elements: `header`, `main`, `footer`, `nav`, `article`, `section`, `form`, and appropriate heading hierarchy. Do not replace semantic elements with generic `div` elements.
- Every meaningful image has an accurate `alt` attribute. Decorative images use `alt=""`. Dynamic image sources must also have a deliberate dynamic or empty alt value.
- Use valid ARIA attributes only when native HTML does not provide the semantics. Interactive controls must have accessible names, keyboard operation, visible focus, and correct button/link semantics.
- Preserve or improve existing keyboard and screen-reader behavior, including dialogs, navigation, forms, and cookie consent controls.

## Audit Procedure

Run the bundled script to produce a concise violation report. It scans tracked source files and excludes generated/dependency folders. Then inspect each hit in context and classify it as:

- **Mechanical:** safe text or file-location change that does not alter semantics.
- **Semantic:** requires understanding inputs, outputs, template context, change detection, accessibility, or styling cascade.
- **Intentional exception:** must be documented in the final report with a reason and owner.

Apply mechanical fixes only when the transformation is unambiguous. For semantic fixes:

1. Convert one component or template at a time.
2. Preserve public selectors, route behavior, and user-visible copy.
3. Replace legacy inputs/outputs with signal APIs and update all call sites.
4. Move component styles into the appropriate global SCSS partial and update `styles.scss` with `@use`.
5. Move content constants into the typed site configuration and inject `SiteConfigService`.
6. Add or update focused unit tests for changed behavior and accessibility expectations.
7. Re-run the audit after each slice, then build and run the accessibility suite.

## Required Checks

The audit must search for all of the following patterns in source files:

- `@NgModule`, `declarations:`, `imports:` in module definitions, and components missing standalone metadata.
- `*ngIf`, `*ngFor`, `*ngSwitch`, `@Input`, `@Output`, `: any`, `as any`, `Observable.subscribe(`, and manual subscriptions.
- Component `styleUrls`, `styleUrl`, `./*.scss`, `./*.css`, and any component stylesheet files.
- HTML `style=`, `[style`, hardcoded brand/email/URL/legal text, missing image `alt`, and suspicious non-semantic interactive elements.
- SCSS/CSS color literals and imports that bypass `src/styles/styles.scss`.

Do not use regex-only results as proof of correctness. Confirm false positives and inspect Angular template syntax. A clean report is necessary but not sufficient; compilation, tests, and accessibility checks are the final authority.

## Completion Report

End with:

- files changed and the rule each change addresses;
- audit command result;
- build result;
- accessibility/unit test result;
- unresolved findings or intentional exceptions;
- any follow-up that cannot be safely automated.
