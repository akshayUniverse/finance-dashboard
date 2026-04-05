import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { balanceTrend } from "../../data/mockData";

// Custom tooltip so it matches our dark theme
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#1F2937] border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold mb-2 text-gray-700 dark:text-gray-200">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: ₹{p.value.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
}

export default function BalanceTrend() {
  return (
    <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 flex flex-col gap-4 h-full">
      
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-semibold text-gray-800 dark:text-white font-poppins-semibold">
            Balance Trend
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Income vs Expenses overview
          </p>
        </div>
        <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full font-medium">
          Last 3 months
        </span>
      </div>

      {/* Chart — ResponsiveContainer fills whatever width the card gives it */}
      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={balanceTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
            <Area type="monotone" dataKey="income"   name="Income"   stroke="#6366f1" strokeWidth={2} fill="url(#incomeGrad)" />
            <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f59e0b" strokeWidth={2} fill="url(#expenseGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}