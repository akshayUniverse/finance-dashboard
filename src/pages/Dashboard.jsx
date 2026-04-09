import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import BalanceTrend from "../components/dashboard/BalanceTrend";
import InsightsPanel from "../components/dashboard/InsightsPanel";
import SpendingChart from "../components/dashboard/SpendingChart";
import SummaryCard from "../components/dashboard/SummaryCard";
import TransactionsTable from "../components/dashboard/TransactionsTable";
import { useApp } from "../context/AppContext";
import { getSummaryMetrics } from "../utils/finance";

export default function Dashboard() {
  const { transactions } = useApp();
  const { income, expenses, balance, savings, changes, latestMonthLabel } = getSummaryMetrics(transactions);

  const cards = [
    {
      title: "Total Balance",
      amount: balance,
      change: changes.balance.display,
      changeLabel: changes.balance.label,
      icon: <Wallet size={20} />,
      gradient: "bg-gradient-to-br from-indigo-500 to-indigo-700",
      lightTone: "bg-indigo-50 border border-indigo-100",
      iconTone: "bg-indigo-100 text-indigo-600",
      titleTone: "text-indigo-900/70",
      amountTone: "text-indigo-950",
      changeTone: "text-indigo-700",
      positive: changes.balance.positive,
    },
    {
      title: "Total Income",
      amount: income,
      change: changes.income.display,
      changeLabel: changes.income.label,
      icon: <TrendingUp size={20} />,
      gradient: "bg-gradient-to-br from-emerald-400 to-emerald-600",
      lightTone: "bg-emerald-50 border border-emerald-100",
      iconTone: "bg-emerald-100 text-emerald-600",
      titleTone: "text-emerald-900/70",
      amountTone: "text-emerald-950",
      changeTone: "text-emerald-700",
      positive: changes.income.positive,
    },
    {
      title: "Total Expenses",
      amount: expenses,
      change: changes.expenses.display,
      changeLabel: changes.expenses.label,
      icon: <TrendingDown size={20} />,
      gradient: "bg-gradient-to-br from-amber-400 to-orange-500",
      lightTone: "bg-amber-50 border border-amber-100",
      iconTone: "bg-amber-100 text-amber-600",
      titleTone: "text-amber-900/70",
      amountTone: "text-amber-950",
      changeTone: "text-amber-700",
      positive: changes.expenses.positive,
    },
    {
      title: "Monthly Savings",
      amount: savings,
      change: changes.savings.display,
      changeLabel: latestMonthLabel,
      icon: <PiggyBank size={20} />,
      gradient: "bg-gradient-to-br from-purple-500 to-purple-700",
      lightTone: "bg-purple-50 border border-purple-100",
      iconTone: "bg-purple-100 text-purple-600",
      titleTone: "text-purple-900/70",
      amountTone: "text-purple-950",
      changeTone: "text-purple-700",
      positive: changes.savings.positive,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="page-title">
          {"Good morning, Akshay \u{1F44B}"}
        </h1>
        <p className="page-subtitle">
          Here's what's happening with your finances today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 min-h-[280px]">
          <BalanceTrend />
        </div>
        <div className="min-h-[280px]">
          <SpendingChart />
        </div>
      </div>

      <TransactionsTable />
      <InsightsPanel />
    </div>
  );
}
