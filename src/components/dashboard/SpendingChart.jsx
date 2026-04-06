import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useApp } from "../../context/AppContext";
import { categoryColors } from "../../data/mockData";

function getSpendingData(transactions) {
  const totals = {};

  transactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      totals[item.category] = (totals[item.category] || 0) + item.amount;
    });

  return Object.entries(totals).map(([name, value]) => ({ name, value }));
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-[#1F2937] border border-gray-200 dark:border-gray-700 rounded-[10px] p-3 shadow-lg text-[14px]">
      <p className="font-poppins-semibold text-gray-700 dark:text-gray-200">{payload[0].name}</p>
      <p style={{ color: payload[0].payload.fill }} className="font-medium">
        {"\u20b9"}
        {payload[0].value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

export default function SpendingChart() {
  const { transactions } = useApp();
  const data = getSpendingData(transactions);

  return (
    <div className="bg-white dark:bg-[#111827] rounded-[14px] p-5 flex flex-col gap-4 h-full">
      <div>
        <h2 className="text-gray-800 dark:text-white font-poppins-semibold">
          Spending Breakdown
        </h2>
        <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
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
                <Cell key={entry.name} fill={categoryColors[entry.name] || "#6366f1"} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
