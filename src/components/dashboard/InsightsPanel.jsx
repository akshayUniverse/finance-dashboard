import { useApp } from "../../context/AppContext";
import { TrendingUp, TrendingDown, Award, AlertCircle, Lightbulb } from "lucide-react";
import { categoryColors } from "../../data/mockData";

function getInsights(transactions) {
  // --- Spending by category ---
  const categoryTotals = {};
  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const topCategory   = sortedCategories[0] || ["None", 0];
  const lowestCategory = sortedCategories[sortedCategories.length - 1] || ["None", 0];

  // --- Monthly totals ---
  const monthlyTotals = {};
  transactions.forEach(t => {
    const month = t.date.slice(0, 7); // "2024-01"
    if (!monthlyTotals[month]) monthlyTotals[month] = { income: 0, expenses: 0 };
    monthlyTotals[month][t.type === "income" ? "income" : "expenses"] += t.amount;
  });
  const months      = Object.keys(monthlyTotals).sort();
  const lastMonth   = months[months.length - 1];
  const prevMonth   = months[months.length - 2];
  const lastData    = monthlyTotals[lastMonth]  || { income: 0, expenses: 0 };
  const prevData    = monthlyTotals[prevMonth]  || { income: 0, expenses: 0 };
  const expenseChange = prevData.expenses > 0
    ? (((lastData.expenses - prevData.expenses) / prevData.expenses) * 100).toFixed(1)
    : 0;
  const savingsRate = lastData.income > 0
    ? (((lastData.income - lastData.expenses) / lastData.income) * 100).toFixed(1)
    : 0;

  return { topCategory, lowestCategory, expenseChange, savingsRate, lastMonth, prevMonth };
}

function InsightCard({ icon, label, value, sub, color }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-[#1F2937] rounded-xl">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        <p className="text-sm font-bold text-gray-800 dark:text-white mt-0.5 truncate">{value}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function InsightsPanel() {
  const { transactions } = useApp();
  const { topCategory, lowestCategory, expenseChange, savingsRate, lastMonth } = getInsights(transactions);

  const monthLabel = new Date(lastMonth + "-01").toLocaleString("en-IN", { month: "long", year: "numeric" });

  const insights = [
    {
      icon: <Award size={16} className="text-amber-600" />,
      label: "Top Spending Category",
      value: topCategory[0],
      sub: `₹${topCategory[1].toLocaleString("en-IN")} total spent`,
      color: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      icon: Number(expenseChange) > 0
        ? <TrendingUp size={16} className="text-red-500" />
        : <TrendingDown size={16} className="text-emerald-500" />,
      label: "Expense Change",
      value: `${expenseChange > 0 ? "+" : ""}${expenseChange}% vs prev month`,
      sub: `In ${monthLabel}`,
      color: Number(expenseChange) > 0
        ? "bg-red-100 dark:bg-red-900/30"
        : "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      icon: <Lightbulb size={16} className="text-indigo-500" />,
      label: "Savings Rate",
      value: `${savingsRate}% of income saved`,
      sub: `In ${monthLabel}`,
      color: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      icon: <AlertCircle size={16} className="text-purple-500" />,
      label: "Lowest Spending",
      value: lowestCategory[0],
      sub: `₹${lowestCategory[1].toLocaleString("en-IN")} total spent`,
      color: "bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 flex flex-col gap-4">
      <div>
        <h2 className="font-semibold text-gray-800 dark:text-white font-poppins-semibold">
          Insights
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Auto-calculated from your transactions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {insights.map(ins => (
          <InsightCard key={ins.label} {...ins} />
        ))}
      </div>
    </div>
  );
}