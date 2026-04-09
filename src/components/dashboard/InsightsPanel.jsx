import { TrendingUp, TrendingDown, Award, AlertCircle, Lightbulb } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { formatCurrency, getInsights } from "../../utils/finance";

function InsightCard({ icon, label, value, sub, color, tone, meta }) {
  return (
    <div className={`insight-card-shell panel-stack ${tone}`}>
      <div className="absolute -right-10 -top-10 size-28 rounded-full bg-white/35 dark:bg-white/5 blur-2xl" />

      <div className="insight-card-top">
        <div className="min-w-0">
          <p className="insight-kicker">Finance Signal</p>
          <p className="label-text mt-2">{label}</p>
        </div>
        <div className={`insight-icon-chip ${color}`}>
          {icon}
        </div>
      </div>

      <div className="min-w-0 flex-1 flex items-end">
        <p className="insight-value">{value}</p>
      </div>

      <div className="insight-foot">
        <p className="insight-note">{sub}</p>
        <span className="insight-meta-pill">{meta}</span>
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
      tone: "bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-[#1F2937]",
      meta: "Expense Mix",
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
      tone:
        Number(expenseChange) > 0
          ? "bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-[#1F2937]"
          : "bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-[#1F2937]",
      meta: "Month on Month",
    },
    {
      icon: <Lightbulb size={16} className="text-indigo-500" />,
      label: "Savings Rate",
      value: `${savingsRate}% of income saved`,
      sub: `In ${lastMonthLabel}`,
      color: "bg-indigo-100 dark:bg-indigo-900/30",
      tone: "bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-[#1F2937]",
      meta: "Efficiency",
    },
    {
      icon: <AlertCircle size={16} className="text-purple-500" />,
      label: "Lowest Spending",
      value: lowestCategory.name,
      sub: `${formatCurrency(lowestCategory.value)} total spent`,
      color: "bg-purple-100 dark:bg-purple-900/30",
      tone: "bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-[#1F2937]",
      meta: "Lean Spend",
    },
  ];

  return (
    <div className="surface-panel panel-stack">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="section-title">Insights</h2>
          <p className="section-subtitle">Auto-calculated from your transactions</p>
        </div>

        <div className="insight-meta-pill">
          {insights.length} live signals
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="surface-panel-muted min-h-[140px] flex items-center justify-center text-center px-6">
          <div>
            <p className="section-title">No insights available yet</p>
            <p className="section-subtitle">Once transactions are added, this panel will highlight patterns automatically.</p>
          </div>
        </div>
      ) : (
        <div className="dashboard-grid grid-cols-1 sm:grid-cols-2">
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
