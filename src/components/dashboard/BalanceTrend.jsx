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
import { getTrendRangeLabel, getWeeklyTrendData } from "../../utils/finance";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="tooltip-surface">
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

export default function BalanceTrend() {
  const { transactions } = useApp();
  const data = getWeeklyTrendData(transactions);
  const rangeLabel = getTrendRangeLabel(transactions);

  return (
    <div className="surface-panel panel-stack h-full">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="section-title">Balance Trend</h2>
          <p className="section-subtitle">Income vs expenses grouped by week</p>
        </div>
        <span className="text-[12px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full font-poppins-medium">
          {rangeLabel}
        </span>
      </div>

      <div className="flex-1 min-h-[260px] min-w-0">
        {data.length === 0 ? (
          <div className="surface-panel-muted h-full min-h-[260px] flex items-center justify-center text-center px-6">
            <div>
              <p className="section-title">No trend data yet</p>
              <p className="section-subtitle">Add transactions to unlock your weekly balance trend.</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
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
        )}
      </div>
    </div>
  );
}
