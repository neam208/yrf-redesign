# Race-day link release

The homepage and race-results page load `race-day-links.json` with browser caching disabled. The config is checked once on page load, once a minute while the page is visible, and whenever a visitor returns to an open tab.

Until a link is enabled, the existing registration and 2025-results content remains visible. No placeholder URL is published.

## Activate the links

From the repository root, run one command when one or both URLs arrive:

```bash
node scripts/set-race-day-links.mjs \
  --live-tracking "https://example.com/live" \
  --results "https://example.com/results"
```

The options can also be run separately. Validate the resulting config:

```bash
node scripts/set-race-day-links.mjs --check
git diff -- race-day-links.json
```

The live-tracking link replaces only the primary hero `Register Now` button on the homepage. Registration buttons in the header, mobile menu, footer, and other pages remain unchanged.

The results link updates the race-results hero, latest-results panel, current-year status, and 2026 results card.

## Required release sequence

1. Commit and push `race-day-links.json` to `race-day-2026`.
2. Deploy that commit to staging and verify both links on desktop and mobile.
3. Merge the verified commit to `main` and deploy it to production.
4. Clear the WordPress.com production cache after the production deployment completes.
5. Open clean `https://yrf.com.au/` and `https://yrf.com.au/race-results/` URLs in a private window and verify each button reaches the expected external page.
6. Check once on mobile data as a second cache/network path.

The cache clear remains mandatory. The no-cache config loader protects visitors who still have prepared homepage HTML in their browser, but it does not replace a production cache purge and clean-URL verification.
