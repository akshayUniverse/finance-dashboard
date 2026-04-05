import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { transactions, categoryColors } from "../../data/mockData";

// Calculate spending by category from real mock data
function getSpendingData() {
  const totals = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
  return Object.entries(totals).map(([name, value]) => ({ name, value }));
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#1F2937] border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-700 dark:text-gray-200">{payload[0].name}</p>
      <p style={{ color: payload[0].payload.fill }} className="font-medium">
        ₹{payload[0].value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

export default function SpendingChart() {
  const data = getSpendingData();

  return (
    <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 flex flex-col gap-4 h-full">
      <div>
        <h2 className="font-semibold text-gray-800 dark:text-white font-poppins-semibold">
          Spending Breakdown
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          By category
        </p>
      </div>

      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={categoryColors[entry.name] || "#6366f1"}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "11px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}