CRESSWELL FACILITY MANAGEMENT DASHBOARD

UPLOAD TO GITHUB PAGES
1. Extract this ZIP.
2. Upload all files directly into the root of your public GitHub repository.
3. In Settings > Pages, choose Deploy from a branch, main, /(root), then Save.

FEATURES
- Cresswell company logo and navy/red brand palette.
- Overview with portfolio expenditure bar chart.
- Portfolio performance table hidden until its button is clicked.
- Expense Comparison and individual property pages for the supplied September 2026 workbook.
- Upload Excel Workbook accepts .xlsx and .xls files using SheetJS.
- Uploaded workbook sheets are detected dynamically; hidden worksheets are excluded.
- Each visitor's upload is processed locally in that visitor's browser and does not overwrite another visitor's view or the published default workbook.

NOTES
- Excel upload requires an internet connection to load the SheetJS library from jsDelivr.
- Uploaded data is not sent to a server or shared with other visitors.
- The dashboard can display arbitrary visible worksheets; automatic chart selection uses column headings and numeric values, so workbooks with different layouts may need a more specific template for perfect KPI interpretation.
- The published default report remains the original September 2026 dataset.
