# Cache Busting

Local images under `assets/` use a content-derived version query, for example:

```text
assets/sponsors/example-logo.png?v=12ab34cd56ef
```

When an asset changes, its version changes too, so browsers and the WordPress.com CDN request the new file instead of displaying a cached copy.

## Before deploying asset changes

Run:

```bash
node scripts/cache-bust-assets.mjs
node scripts/cache-bust-assets.mjs --check
```

Commit the resulting HTML changes with the updated asset.

If Node.js is not installed locally, ask Codex to run the updater and its verification before committing the asset change.

## HTML page updates

Asset versioning does not invalidate cached HTML at an unchanged public URL. After deploying urgent copy, links, live-tracking, or results changes, clear the WordPress.com site cache and verify the clean public URL in a private browser window.
