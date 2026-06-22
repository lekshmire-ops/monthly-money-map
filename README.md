# monthly-money-map
# Monthly Money Map

A static, local-first personal finance forecasting app for GitHub Pages or Cloudflare Pages.

It starts empty. You add your own:

- Accounts with actual and available balances
- FD details, maturity dates, and FD-backed OD details
- RDs with installments, top-ups, and revised maturities
- Investments and monthly contributions
- Credit cards with limit, used limit, statement date, and repayment date
- Loans / ODs
- Subscriptions
- Income, expenses, manual monthly items, and goals

The Monthly Tracker generates a month view from the setup data and clearly separates real cash, available cash, borrowed access, locked savings, upcoming bills, and safe-to-spend money.

## Google Sheets Sync

1. Create a Google Sheet.
2. Open Extensions -> Apps Script.
3. Paste the contents of `apps-script.gs`.
4. Deploy -> New deployment -> Web app.
5. Execute as: Me.
6. Who has access: Anyone.
7. Copy the web app URL.
8. Paste it into Settings inside the app.

Saves create two tabs:

- `Snapshots`: one full JSON snapshot per save.
- `Monthly Events`: generated ledger rows for the selected month.

## GitHub Pages

1. Put these files in a repository.
2. In GitHub, open Settings -> Pages.
3. Select the branch and folder containing `index.html`.
4. Open the published Pages URL.

## Cloudflare Pages

1. Cloudflare -> Workers & Pages -> Create -> Pages.
2. Connect the GitHub repository.
3. Build command: leave blank.
4. Build output directory: `/` if these files are at repo root, or this folder path if they are inside a subfolder.
5. Deploy.

The included `_headers` file adds basic security headers on Cloudflare Pages.

## Backup

Use the down-arrow button to export a JSON backup. Use the up-arrow button to import it later.
