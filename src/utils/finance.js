const LOCALE = "en-IN";

function cleanText(value, maxLength = 120) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

function sortTransactionsByDate(items) {
  return [...items].sort((a, b) => a.date.localeCompare(b.date));
}

function toMonthLabel(monthKey) {
  return new Date(`${monthKey}-01T00:00:00`).toLocaleString(LOCALE, {
    month: "short",
    year: "numeric",
  });
}

export function formatCurrency(value) {
  return `\u20b9${Number(value || 0).toLocaleString(LOCALE)}`;
}

export function formatTransactionDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(LOCALE, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function normalizeTransaction(item) {
  if (!item) {
    return null;
  }

  const title = cleanText(item.title || item.description || item.note || "Untitled transaction", 80);
  const note = cleanText(item.note || "", 120);
  const counterparty = cleanText(item.counterparty || "", 80);

  return {
    ...item,
    amount: Number(item.amount || 0),
    category: cleanText(item.category || "Operations", 40),
    counterparty,
    date: item.date,
    description: title,
    id: item.id,
    note,
    title,
    type: item.type,
  };
}

export function normalizeTransactions(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map(normalizeTransaction)
    .filter(Boolean);
}

export function getTransactionPrimaryText(item) {
  return cleanText(item?.title || item?.description || item?.note || "Untitled transaction", 80);
}

export function getTransactionSecondaryText(item) {
  return cleanText(item?.note || item?.counterparty || "", 120);
}

export function getTransactionSearchText(item) {
  return [
    item?.title,
    item?.description,
    item?.note,
    item?.counterparty,
    item?.category,
    item?.type,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function getMonthlySeries(transactions) {
  const monthlyTotals = {};

  transactions.forEach((item) => {
    const month = item.date.slice(0, 7);

    if (!monthlyTotals[month]) {
      monthlyTotals[month] = { income: 0, expenses: 0 };
    }

    monthlyTotals[month][item.type === "income" ? "income" : "expenses"] += item.amount;
  });

  return Object.entries(monthlyTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, totals]) => ({
      month,
      label: toMonthLabel(month),
      income: totals.income,
      expenses: totals.expenses,
      balance: totals.income - totals.expenses,
    }));
}

export function getWeeklyTrendData(transactions) {
  if (transactions.length === 0) {
    return [];
  }

  const sorted = sortTransactionsByDate(transactions);
  const firstDate = new Date(`${sorted[0].date}T00:00:00`);
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const weeklyTotals = {};

  sorted.forEach((item) => {
    const currentDate = new Date(`${item.date}T00:00:00`);
    const weekIndex = Math.floor((currentDate - firstDate) / weekMs);
    const weekStart = new Date(firstDate.getTime() + weekIndex * weekMs);
    const weekKey = weekStart.toISOString().slice(0, 10);

    if (!weeklyTotals[weekKey]) {
      weeklyTotals[weekKey] = { income: 0, expenses: 0 };
    }

    weeklyTotals[weekKey][item.type === "income" ? "income" : "expenses"] += item.amount;
  });

  return Object.entries(weeklyTotals).map(([weekKey, totals]) => ({
    label: new Date(`${weekKey}T00:00:00`).toLocaleDateString(LOCALE, {
      day: "2-digit",
      month: "short",
    }),
    ...totals,
  }));
}

export function getSpendingBreakdown(transactions) {
  const totals = {};

  transactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      totals[item.category] = (totals[item.category] || 0) + item.amount;
    });

  return Object.entries(totals).map(([name, value]) => ({ name, value }));
}

function getChangeMeta(current, previous, options = {}) {
  const { inverse = false, label = "latest month trend" } = options;

  if (!Number.isFinite(previous) || previous === 0) {
    return {
      display: current > 0 ? "New" : "0%",
      positive: inverse ? current === 0 : current >= 0,
      label,
    };
  }

  const diff = ((current - previous) / Math.abs(previous)) * 100;

  return {
    display: `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`,
    positive: inverse ? diff <= 0 : diff >= 0,
    label,
  };
}

export function getSummaryMetrics(transactions) {
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const balance = income - expenses;
  const monthlySeries = getMonthlySeries(transactions);
  const latest = monthlySeries.at(-1) || {
    balance: 0,
    expenses: 0,
    income: 0,
    label: "No data yet",
  };
  const previous = monthlySeries.at(-2) || {
    balance: 0,
    expenses: 0,
    income: 0,
  };
  const savings = Math.max(latest.income - latest.expenses, 0);
  const previousSavings = Math.max(previous.income - previous.expenses, 0);

  return {
    balance,
    expenses,
    income,
    latestMonthLabel: latest.label,
    savings,
    changes: {
      balance: getChangeMeta(latest.balance, previous.balance),
      expenses: getChangeMeta(latest.expenses, previous.expenses, { inverse: true }),
      income: getChangeMeta(latest.income, previous.income),
      savings: getChangeMeta(savings, previousSavings),
    },
  };
}

export function getInsights(transactions) {
  const spendingBreakdown = getSpendingBreakdown(transactions).sort((a, b) => b.value - a.value);
  const monthlySeries = getMonthlySeries(transactions);
  const latest = monthlySeries.at(-1) || {
    expenses: 0,
    income: 0,
    label: "No data yet",
  };
  const previous = monthlySeries.at(-2) || {
    expenses: 0,
  };
  const expenseChange = previous.expenses > 0
    ? (((latest.expenses - previous.expenses) / previous.expenses) * 100).toFixed(1)
    : "0.0";
  const savingsRate = latest.income > 0
    ? (((latest.income - latest.expenses) / latest.income) * 100).toFixed(1)
    : "0.0";

  return {
    expenseChange,
    hasExpenses: spendingBreakdown.length > 0,
    lastMonthLabel: latest.label,
    lowestCategory: spendingBreakdown.at(-1) || { name: "None", value: 0 },
    savingsRate,
    topCategory: spendingBreakdown[0] || { name: "None", value: 0 },
  };
}

export function getTrendRangeLabel(transactions) {
  const monthlySeries = getMonthlySeries(transactions);

  if (monthlySeries.length === 0) {
    return "No data";
  }

  if (monthlySeries.length === 1) {
    return monthlySeries[0].label;
  }

  return `${monthlySeries[0].label} - ${monthlySeries.at(-1).label}`;
}
