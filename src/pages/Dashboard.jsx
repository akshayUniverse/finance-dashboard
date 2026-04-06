import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import BalanceTrend from "../components/dashboard/BalanceTrend";
import InsightsPanel from "../components/dashboard/InsightsPanel";
import SpendingChart from "../components/dashboard/SpendingChart";
import SummaryCard from "../components/dashboard/SummaryCard";
import TransactionsTable from "../components/dashboard/TransactionsTable";
import { useApp } from "../context/AppContext";

function getTotals(items) {
  const income = items
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const expenses = items
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const balance = income - expenses;
  const savings = Math.round(balance * 0.6);

  return { income, expenses, balance, savings };
}

export default function Dashboard() {
  const { transactions } = useApp();
  const { income, expenses, balance, savings } = getTotals(transactions);

  const cards = [
    {
      title: "Total Balance",
      amount: balance,
      change: "+8.2%",
      changeLabel: "vs last month",
      icon: <Wallet size={20} />,
      gradient: "bg-gradient-to-br from-indigo-500 to-indigo-700",
      positive: true,
    },
    {
      title: "Total Income",
      amount: income,
      change: "+5.1%",
      changeLabel: "vs last month",
      icon: <TrendingUp size={20} />,
      gradient: "bg-gradient-to-br from-emerald-400 to-emerald-600",
      positive: true,
    },
    {
      title: "Total Expenses",
      amount: expenses,
      change: "+2.4%",
      changeLabel: "vs last month",
      icon: <TrendingDown size={20} />,
      gradient: "bg-gradient-to-br from-amber-400 to-orange-500",
      positive: false,
    },
    {
      title: "Savings",
      amount: savings,
      change: "+12%",
      changeLabel: "goal progress 60%",
      icon: <PiggyBank size={20} />,
      gradient: "bg-gradient-to-br from-purple-500 to-purple-700",
      positive: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white font-poppins-bold">
          {"Good morning, Akshay \u{1F44B}"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
