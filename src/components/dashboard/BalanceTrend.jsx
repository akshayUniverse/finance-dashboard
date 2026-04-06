import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useApp } from "../../context/AppContext";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-[#1F2937] border border-gray-200 dark:border-gray-700 rounded-[10px] p-3 shadow-lg text-[14px]">
      <p className="font-semibold mb-2 text-gray-700 dark:text-gray-200">{label}</p>
      {payload.map((item) => (
        <p key={item.name} style={{ color: item.color }} className="font-medium">
          {item.name}: {"\u20b9"}
          {item.value.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
}

function getTrendData(transactions) {
  if (transactions.length === 0) {
    return [];
  }

  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
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
    label: new Date(`${weekKey}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
    ...totals,
  }));
}

export default function BalanceTrend() {
  const { transactions } = useApp();
  const data = getTrendData(transactions);

  return (
    <div className="bg-white dark:bg-[#111827] rounded-[14px] p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-gray-800 dark:text-white font-poppins-semibold">
            Balance Trend
          </h2>
          <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
            Income vs Expenses overview
          </p>
        </div>
        <span className="text-[12px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full font-poppins-medium">
          Last 3 months
        </span>
      </div>

      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `\u20b9${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#incomeGrad)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#expenseGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
