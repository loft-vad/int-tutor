# UI wiring gotchas that type-checking cannot catch

## `next/font` variables declare, they do not apply

```tsx
<body className={`${geistSans.variable} ...`}>   // declares --font-geist-sans
```

`geistSans.variable` only puts the CSS custom property in scope. **Nothing
applies it.** With no `font-family` rule anywhere, the whole app rendered in the
browser default serif — `getComputedStyle(document.body).fontFamily` returned
literally `Times`, while the webfont downloaded fine (HTTP 200, listed in
`document.fonts`) and went unused.

`globals.css` now sets the family explicitly on `html, body`. Do not remove it
and assume Tailwind's preflight covers it.

The font stack deliberately contains **no `system-ui`**: the bundled Geist face
ships with the app, so it renders identically on every OS. Named fallbacks
(Arial, Helvetica) apply only if the webfont fails.

Check it with:
```bash
$B js "getComputedStyle(document.body).fontFamily"
$B js "document.fonts.check('16px ' + getComputedStyle(document.body).fontFamily.split(',')[0])"
```
The second one matters — the first can name a font that is not actually rendering.

## A page that exists is not a page you can reach

`/settings` shipped with no link to it anywhere. The bottom nav has five items
(Home · Cards · Quiz · Code · Stats) and no Settings, and the dashboard is the one
page that does not use `TopBar`. The route worked, was prerendered, and returned
200 — and no user could ever open it, which also made the whole cross-device sync
feature unreachable.

A gear link now lives in the dashboard hero (top-right, 40×40). It stays out of
the bottom nav because six items at 375px squeezes each to ~62px.

**When adding a route, add its entry point in the same change.** "Is it linked?"
is not something the build, the type checker, or the content validator asks.

Related: [[verification-discipline]]
