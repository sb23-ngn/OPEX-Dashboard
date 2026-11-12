OPEX DASHBOARD — TEAM B
Reporting period: September 2026

FILES
- index.html: Portfolio overview (first page)
- comparison.html: Summary (2), interpreted as Expense Comparison
- property-1.html through property-12.html: Separate pages for the 12 visible property worksheets
- app.js, styles.css, data.js: Shared dashboard logic, styling and visible worksheet data

PUBLISH WITH GITHUB PAGES
1. Create a new PUBLIC GitHub repository (e.g. team-b-opex-dashboard).
2. Upload every file in this folder to the repository root. Keep all files together.
3. Open Settings → Pages.
4. Under Build and deployment, choose Deploy from a branch.
5. Select branch main and folder / (root), then Save.
6. Wait for GitHub Pages to publish. Share the generated URL with anyone who needs access.

No login or password is included. Anyone with the link can view the published dashboard.
To update the dashboard later, replace data.js with a newly generated data.js from the latest workbook and commit the change. If the workbook structure changes, the page templates may also need updating.

NOTES
- Only worksheets marked visible in the supplied Excel workbook are included.
- Six hidden worksheets are excluded from both the website pages and its embedded data.
- The source workbook contains calculated values; the dashboard uses saved calculated values.
- Empty cells are shown as em dashes, not guessed.
- Figures are presented in Nigerian naira (NGN).
- Summary (2) includes category comparisons and location-level OPEX/NOM analysis.
