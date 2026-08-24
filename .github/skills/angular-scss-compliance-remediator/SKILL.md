---
name: angular-scss-compliance-remediator
description: "Use when executing a complete refactoring pass from angular-scss-compliance-auditor findings, converting Angular code to standalone and signal-based patterns, migrating templates to modern control flow, centralizing SCSS and configuration tokens, fixing accessibility, and validating the full build."
---

# Angular and SCSS Compliance Remediator

Act as a Principal Frontend Engineer and Lead Code Reviewer. This skill consumes findings from `angular-scss-compliance-auditor`, categorizes them, applies a complete but behavior-preserving refactor, and verifies the result. Work directly in the repository. Do not merely propose patches.

## Guardrails

- Inspect the current worktree before editing. Preserve unrelated user changes and never modify `node_modules`, `dist`, `.angular`, or `test-results`.
- Do not use `any`, placeholder implementations, broad casts, or regex-only transformations that can change Angular template semantics.
- Keep public selectors, routes, labels, service contracts, and visible behavior stable unless a finding requires a deliberate change.
- Use `apply_patch` for source edits. Delete obsolete files only after their styles have been moved and the build confirms there are no references.
- Make one logical slice at a time. After the first substantive edit, run the narrowest focused validation before reading or changing an unrelated slice.
- A static audit finding is evidence, not proof. Confirm each match in context and record false positives or intentional exceptions.

## Step 1: Ingest and Categorize

Run the existing audit from the repository root:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .github/skills/angular-scss-compliance-auditor/audit.ps1
```

Capture the complete output and group every finding under these categories:

1. **Modern Angular architecture**: NgModules, missing standalone metadata, structural directives, legacy inputs/outputs, manual subscriptions, untyped values, and component stylesheet references.
2. **Global styles and Tailwind CSS compliance**: inline styles, component stylesheets, hardcoded colors, hardcoded pixel layout values, missing global style imports, and custom rules replaceable by Tailwind utilities.
3. **Tokens and site configuration**: brand names, emails, URLs, legal copy, copyright years, social links, and other repeated content outside `SITE_CONFIG`/`SiteConfigService`.
4. **Accessibility and semantic HTML**: missing image alt text, unlabeled controls, invalid ARIA, generic landmark containers, heading-order problems, keyboard-inaccessible interactions, and incorrect button/link semantics.

Before editing, state the number of findings per category and identify any audit false positives. Do not skip a category because the first report appears dominated by another category.

## Step 2: Refactor in Dependency Order

### 2.1 Architecture and shared tokens

- Confirm Angular bootstrap is standalone and remove actual NgModule declarations or imports. Do not remove ordinary `imports` arrays from standalone component metadata; those are valid and required.
- Define or extend interfaces for every shared data structure. Replace `any` with a specific type or `unknown` plus runtime narrowing.
- Extend `SiteConfig` for content that is currently duplicated or hardcoded. Expose values through `SiteConfigService` and inject it into consumers.
- Ensure the global stylesheet owns the cascade, imports Tailwind CSS using the repository's configured integration, and keeps reusable tokens/components in the established style structure. Preserve SCSS partials only where they remain part of the configured styling architecture.

### 2.2 Component and template migration

Process components one at a time, starting with shared layout components and then pages. For each component:

- Ensure the component is standalone and its `imports` list contains every template dependency.
- Convert `*ngIf` to `@if`/`@else`, `*ngFor` to `@for` with a stable `track` expression, and `*ngSwitch` to `@switch` with `@case` and `@default`. Preserve empty states and template variable scope.
- Replace `@Input()` with `input()` and `@Output()` with `output()`. Update all call sites and use signal reads correctly in templates and TypeScript.
- Replace local mutable state with `signal()` and derived state with `computed()` where this improves correctness. Keep RxJS for genuine streams and prefer `async` or a signal bridge over manual subscriptions.
- Remove `styleUrl`/`styleUrls` and set `styles: []` or omit the property. Move required rules into the correct `src/styles/components/` partial, then delete the obsolete component stylesheet only when no imports or references remain.
- Replace inline styles and static layout CSS with Tailwind utilities when they provide the same behavior. Keep custom CSS/SCSS only for rules Tailwind cannot express.
- Keep semantic structure intact: use `header`, `nav`, `main`, `footer`, `section`, `article`, and `form` appropriately. Add accurate `alt` text to meaningful images and `alt=""` to decorative images. Give every form control an associated label and every interactive control an accessible name.

Do not mechanically replace a directive or input declaration without checking its surrounding template and all references. Do not convert a subscription merely to silence the audit if it owns cleanup, error handling, or an external event boundary.

### 2.3 SCSS cleanup

- Move component rules into an appropriate global partial and add that partial through `@use` from the global entry point.
- Replace hardcoded color literals with Tailwind theme tokens or repository token variables. Replace repeated spacing and sizing values with Tailwind utilities or style tokens where semantics remain clear.
- Do not hide forbidden colors or dimensions in CSS custom properties, strings, or generated values. Preserve focus styles and responsive behavior while changing the cascade.
- Keep selectors scoped by component class or semantic region to prevent global leakage.

### 2.4 Content and accessibility cleanup

- Move only site-wide content into `SITE_CONFIG`; keep meaningful control labels, headings, and route-specific explanatory text local when centralizing them would reduce clarity.
- Preserve legal meaning and do not invent company claims, URLs, emails, dates, or accessibility labels. When a value is unknown, stop and report the required product decision rather than fabricating it.
- Replace clickable non-controls with real links or buttons. Ensure dialogs, menus, forms, and cookie controls remain keyboard-accessible and retain visible focus.

## Step 3: Focused Verification Loop

After each component or shared-style slice:

1. Rerun the relevant audit search or the full audit script.
2. Run the closest unit test file, if present.
3. Run `npm.cmd run build:app` after architecture or template changes.
4. Fix regressions in the same slice before moving on.

At the end, run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .github/skills/angular-scss-compliance-auditor/audit.ps1
npm.cmd run build:app
npm.cmd run test:a11y
```

The audit may still identify patterns that require human review, such as hardcoded copy that is intentionally page-specific. Explain every remaining finding. Do not claim zero violations if the audit exits nonzero.

## Required Completion Output

Provide a concise file-by-file change report first. For each affected file, include:

- the file path;
- the category of violation addressed;
- the behavior-preserving change made;
- the focused validation used.

Then provide complete, untruncated contents for every refactored source file that the user requests. Never use `...`, `// rest of file`, or omitted sections. For deleted files, state the destination of their migrated styles and why deletion is safe.

Finish with:

- initial finding counts by category;
- final audit result and remaining findings;
- Angular build result;
- unit and accessibility test results;
- explicit assumptions, unresolved product decisions, and intentional exceptions.

If a requested automatic change would require inventing content, changing a public API, or risking template behavior, make the safe code changes that are possible and identify the blocked decision precisely.
