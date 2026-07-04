# YRF Website Redesign

This repo contains prototype HTML files for the Yeppoon Running Festival website redesign.

These files are **design prototypes**, not a finished WordPress theme. Each prototype is a complete standalone HTML page with embedded CSS so it can be opened or hosted independently while the design is being refined.

## Current Pages

| Page | Prototype |
| --- | --- |
| Homepage | `prototypes/homepage.html` |
| Marathon | `prototypes/marathon.html` |
| Race Results | `prototypes/race-results.html` |
| Visit Yeppoon | `prototypes/visit-yeppoon.html` |
| Race Times | `prototypes/race-times.html` |
| Race Pack Collection | `prototypes/race-pack-collection.html` |
| Merchandise | `prototypes/merchandise.html` |

## Recommended Workflow

1. Keep iterating designs in this repo.
2. Preview prototypes locally or through GitHub Pages.
3. When a page is approved, move only the needed HTML/CSS into WordPress or the staging deploy repo.
4. Test on staging.
5. Deploy to live only after mobile, links, dates, and registration calls-to-action are checked.

## WordPress Implementation Notes

For a DIY WordPress implementation:

- Put shared CSS into WordPress `Appearance > Customize > Additional CSS`.
- Put page-specific content into each page using a `Custom HTML` block.
- Do not paste the full prototype document into WordPress.
- Usually paste only the content inside the `<main>...</main>` element.
- Keep the live WordPress header/footer unless you intentionally rebuild them.

For a cleaner long-term build:

- Convert the shared visual system into theme CSS.
- Convert repeated page sections into WordPress blocks, patterns, or template parts.
- Keep page content editable in WordPress where possible.

## Important Content Notes

- Race Pack Collection has been corrected to show:
  - Rockhampton: Thursday 23 July, 4:30pm - 7:00pm
  - Yeppoon: Saturday 25 July, 12:30pm - 5:00pm
- Race Results includes live links for 2025 through 2017.
- Merchandise includes three priced apparel products and two extra merchandise cards.

## Staging

If using the existing staging repo `neam208/yrf`, keep this redesign repo separate until the pages are ready. Then copy final code into the staging/deploy repo on a new branch and test there.
