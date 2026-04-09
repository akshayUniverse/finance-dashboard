import { TrendingUp, TrendingDown, Award, AlertCircle, Lightbulb } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { formatCurrency, getInsights } from "../../utils/finance";

function InsightCard({ icon, label, value, sub, color }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-[#1F2937] rounded-[10px]">
      <div className={`size-9 rounded-[10px] flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        <p className="text-[14px] font-poppins-bold text-gray-800 dark:text-white mt-0.5 truncate">{value}</p>
        {sub && <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function InsightsPanel() {
  const { transactions } = useApp();
  const { expenseChange, hasExpenses, lastMonthLabel, lowestCategory, savingsRate, topCategory } = getInsights(transactions);

  const insights = [
    {
      icon: <Award size={16} className="text-amber-600" />,
      label: "Top Spending Category",
      value: topCategory.name,
      sub: `${formatCurrency(topCategory.value)} total spent`,
      color: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      icon:
        Number(expenseChange) > 0 ? (
          <TrendingUp size={16} className="text-red-500" />
        ) : (
          <TrendingDown size={16} className="text-emerald-500" />
        ),
      label: "Expense Change",
      value: `${expenseChange > 0 ? "+" : ""}${expenseChange}% vs prev month`,
      sub: `In ${lastMonthLabel}`,
      color:
        Number(expenseChange) > 0
          ? "bg-red-100 dark:bg-red-900/30"
          : "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      icon: <Lightbulb size={16} className="text-indigo-500" />,
      label: "Savings Rate",
      value: `${savingsRate}% of income saved`,
      sub: `In ${lastMonthLabel}`,
      color: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      icon: <AlertCircle size={16} className="text-purple-500" />,
      label: "Lowest Spending",
      value: lowestCategory.name,
      sub: `${formatCurrency(lowestCategory.value)} total spent`,
      color: "bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  return (
    <div className="surface-panel flex flex-col gap-4">
      <div>
        <h2 className="section-title">Insights</h2>
        <p className="section-subtitle">Auto-calculated from your transactions</p>
      </div>

      {transactions.length === 0 ? (
        <div className="surface-panel-muted min-h-[140px] flex items-center justify-center text-center px-6">
          <div>
            <p className="section-title">No insights available yet</p>
            <p className="section-subtitle">Once transactions are added, this panel will highlight patterns automatically.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {insights.map((item) => (
            <InsightCard
              key={item.label}
              {...item}
              sub={!hasExpenses && item.label.includes("Spending") ? "No expense data yet" : item.sub}
              value={!hasExpenses && item.label.includes("Spending") ? "Waiting for data" : item.value}
            />
          ))}
        </div>
      )}
    </div>
  );
}
