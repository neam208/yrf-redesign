# YRF Real URL Deployment Notes

This folder is prepared for deploying the redesign to the real staging URLs.

Deploy this folder to the server root:

```text
/
```

This makes pages available at URLs such as:

```text
/marathon/
/half-marathon/
/race-times/
/race-pack-collection/
/race-results/
```

The `/contact/` folder is intentionally excluded from this package.
Keep `/contact/` as the WordPress page so the Jetpack contact form continues to work.

Before pushing staging to production, test the real staging URLs and confirm the contact form still works.
