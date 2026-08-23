# novan-site-template

Standalone Angular starter with Bootstrap layout components, routed pages, and a global SCSS theme.

## Setup

The project was scaffolded with the latest Angular CLI and uses npm. On Windows PowerShell, use `npm.cmd`:

```bash
npm.cmd install
npm.cmd start
```

Open `http://localhost:4200/` after the development server starts.

To create the same project from an empty directory:

```bash
npx.cmd @angular/cli@latest new novan-site-template --routing --style=scss --standalone --zoneless
cd novan-site-template
npm.cmd install bootstrap@latest bootstrap-icons@latest
npm.cmd start
```

## Routes

- `/` - Home
- `/about` - About
- `/contact` - Contact
- `/privacy` - Privacy Policy
- `/cookie-policy` - Cookie Policy

## Styling

All application styling lives in `src/styles/`. Bootstrap theme values are overridden in `_variables.scss`, and `styles.scss` imports Bootstrap, Bootstrap Icons, and global utilities. Layout and page components intentionally do not have component-level CSS or SCSS files.

Build the production bundle with:

```bash
npm.cmd run build
```

## Accessibility Testing

The build runs an automated axe-core scan against the production bundle in Chromium. It checks every application route for WCAG 2.2 AA violations and fails the build when any are found.

Install the Chromium browser once after installing dependencies:

```bash
npx.cmd playwright install chromium
```

To run only the accessibility suite:

```bash
npm.cmd run test:a11y
```
