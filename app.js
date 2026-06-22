const storageKey = "monthly-money-map-v2";
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const setupSections = [
  { key: "accounts", label: "Accounts", hint: "Savings, current, salary, and OD-linked accounts.", title: "name", fields: [
    f("name", "Account Name"), f("bank", "Bank Name"), s("type", "Account Type", ["Savings", "Current", "Salary", "OD-linked", "Other"]),
    n("actualBalance", "Actual Balance"), n("availableBalance", "Available Balance"), b("isOdLinked", "Is OD linked?"),
    n("odLimit", "OD Limit"), n("odUsed", "OD Used"), r("linkedFdId", "Linked FD", "fds"), b("salaryCredited", "Salary credited here?"),
    b("defaultExpense", "Default expense account?"), t("notes", "Notes")
  ] },
  { key: "income", label: "Income", hint: "Salary, dance fees, performances, freelance, or irregular inflows.", title: "name", fields: [
    f("name", "Income Name"), s("type", "Type", ["Salary", "Dance", "Performance", "Freelance", "Refund", "Other"]),
    n("amount", "Amount"), s("frequency", "Frequency", ["Monthly", "One-time", "Irregular"]),
    d("expectedDate", "Expected Date"), r("destinationAccountId", "Destination Account", "accounts"),
    b("confirmed", "Confirmed?"), b("received", "Received?"), t("notes", "Notes")
  ] },
  { key: "expenses", label: "Expenses", hint: "One-time and recurring planned expenses.", title: "name", fields: [
    f("name", "Expense Name"), s("category", "Category", ["Living", "Dance", "Wedding", "Travel", "Medical", "Shopping", "EMI", "Other"]),
    n("amount", "Amount"), d("date", "Date"), s("frequency", "Frequency", ["One-time", "Monthly", "Quarterly", "Yearly"]),
    s("paymentMode", "Payment Mode", ["Account", "Credit Card", "OD", "Cash"]), r("sourceId", "Source Account/Card", "paymentSources"),
    b("confirmed", "Confirmed?"), b("paid", "Paid?"), t("notes", "Notes")
  ] },
  { key: "fds", label: "FDs", hint: "Fixed deposits, maturities, and FD-backed overdrafts.", title: "name", fields: [
    f("name", "FD Name"), f("bank", "Bank"), n("principal", "Principal Amount"), n("currentValue", "Current Value"),
    n("interestRate", "Interest Rate %"), d("startDate", "Start Date"), d("maturityDate", "Maturity Date"), n("maturityAmount", "Maturity Amount"),
    b("autoRenew", "Auto-renew?"), b("linkedToOd", "Linked to OD?"), n("odLimit", "OD Limit Against FD"),
    r("odAccountId", "OD Account Credited To", "accounts"), n("odInterestRate", "OD Interest Rate %"), n("odUsed", "OD Used"),
    b("prematureBreak", "Premature Break Allowed?"), s("purpose", "Purpose Tag", ["Emergency", "Wedding", "Dance", "General", "Other"]), t("notes", "Notes")
  ] },
  { key: "rds", label: "RDs", hint: "Recurring deposits, installments, top-ups, and revised maturity estimates.", title: "name", fields: [
    f("name", "RD Name"), f("bank", "Bank"), n("monthlyInstallment", "Monthly Installment"), d("startDate", "Start Date"), d("endDate", "End Date"),
    n("plannedMaturity", "Planned Maturity Amount"), n("currentValue", "Current Value"), n("interestRate", "Interest Rate %"),
    n("installmentDay", "Installment Date each month"), r("sourceAccountId", "Source Account", "accounts"), b("allowsTopups", "Allows Top-ups?"),
    n("topupAmount", "Regular Top-up Amount"), n("topupDay", "Top-up Date each month"), n("revisedMaturity", "Revised Expected Maturity"),
    s("purpose", "Purpose Tag", ["Emergency", "Wedding", "Dance", "General", "Other"]), t("notes", "Notes")
  ] },
  { key: "investments", label: "Investments", hint: "Gold plans, SIPs, mutual funds, stocks, chits, or other assets.", title: "name", fields: [
    f("name", "Investment Name"), s("type", "Type", ["Gold Plan", "SIP", "Mutual Fund", "Stock", "Chit", "Other"]),
    n("currentValue", "Current Value"), n("monthlyContribution", "Monthly Contribution"), n("contributionDay", "Contribution Date each month"),
    r("sourceAccountId", "Source Account", "accounts"), d("startDate", "Start Date"), d("endDate", "End/Maturity Date"),
    n("expectedMaturity", "Expected Maturity Value"), b("mandatory", "Is contribution mandatory?"), b("canPause", "Can pause?"),
    s("purpose", "Purpose Tag", ["Wedding", "Long-term", "Dance", "General", "Other"]), t("notes", "Notes")
  ] },
  { key: "cards", label: "Credit Cards", hint: "Credit limits, used limits, statement dates, and repayment dates.", title: "name", fields: [
    f("name", "Card Name"), f("bank", "Bank"), n("creditLimit", "Credit Limit"), n("usedLimit", "Current Used Limit"),
    n("statementDay", "Statement Date each month"), n("dueDay", "Payment Due Date each month"), n("minimumDue", "Minimum Due"),
    n("fullDue", "Full Due"), r("repaymentAccountId", "Default Repayment Account", "accounts"), n("interestRate", "Interest Rate %"), t("notes", "Notes")
  ] },
  { key: "loans", label: "Loans / ODs", hint: "Personal loans, consumer loans, overdrafts, and other liabilities.", title: "name", fields: [
    f("name", "Loan or OD Name"), s("type", "Type", ["Personal Loan", "Consumer Loan", "OD", "Other"]),
    n("outstanding", "Outstanding Amount"), n("emi", "Monthly EMI / Payment"), n("paymentDay", "Payment Date each month"),
    r("sourceAccountId", "Payment Account", "accounts"), n("interestRate", "Interest Rate %"), d("endDate", "End Date"),
    b("active", "Active?"), t("notes", "Notes")
  ] },
  { key: "subscriptions", label: "Subscriptions", hint: "Recurring subscriptions paid by account or card.", title: "name", fields: [
    f("name", "Subscription Name"), s("category", "Category", ["Work", "Personal", "Entertainment", "Software", "Finance", "Other"]),
    n("amount", "Amount"), s("frequency", "Billing Frequency", ["Monthly", "Quarterly", "Yearly"]), n("billingDay", "Billing Date each month"),
    s("paymentMethod", "Payment Method", ["Account", "Credit Card"]), r("sourceId", "Account/Card", "paymentSources"),
    b("active", "Active?"), d("startDate", "Start Date"), d("endDate", "End Date"), t("notes", "Notes")
  ] },
  { key: "goals", label: "Goals", hint: "Wedding, emergency, travel, OD reduction, or other financial goals.", title: "name", fields: [
    f("name", "Goal Name"), n("targetAmount", "Target Amount"), d("targetDate", "Target Date"), n("currentSaved", "Current Saved"),
    f("linkedItems", "Linked Accounts/FDs/RDs"), s("priority", "Priority", ["High", "Medium", "Low"]), t("notes", "Notes")
  ] },
  { key: "manualEvents", label: "Manual Items", hint: "One-off overrides or events that should appear in a monthly ledger.", title: "name", fields: [
    f("name", "Event Name"), d("date", "Date"), s("type", "Type", ["Income", "Expense", "Debt", "Savings", "Transfer", "Adjustment"]),
    r("sourceId", "Account/Card", "paymentSources"), n("amount", "Amount"), s("direction", "Direction", ["Inflow", "Outflow"]),
    s("status", "Status", ["Planned", "Confirmed", "Paid", "Received", "Skipped", "Modified", "Forecast"]), t("notes", "Notes")
  ] }
];

const sectionMap = Object.fromEntries(setupSections.map((section) => [section.key, section]));
const tabs = [
  ["dashboard", "Dashboard"],
  ["monthly", "Monthly Tracker"],
  ["setup", "Setup"],
  ["settings", "Settings"]
];

const blankState = {
  settings: { buffer: 0, sheetUrl: "" },
  accounts: [], income: [], expenses: [], fds: [], rds: [], investments: [], cards: [], loans: [], subscriptions: [], goals: [], manualEvents: []
};

let state = loadState();
let activeTab = "dashboard";
let activeSetup = "accounts";
let editing = null;

function f(key, label) { return { key, label, type: "text" }; }
function n(key, label) { return { key, label, type: "number" }; }
function d(key, label) { return { key, label, type: "date" }; }
function b(key, label) { return { key, label, type: "checkbox" }; }
function t(key, label) { return { key, label, type: "textarea" }; }
function s(key, label, options) { return { key, label, type: "select", options }; }
function r(key, label, source) { return { key, label, type: "reference", source }; }

function loadState() {
  try {
    return { ...structuredClone(blankState), ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
