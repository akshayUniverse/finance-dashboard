import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useApp } from "../../context/AppContext";
import { categoryColors } from "../../data/mockData";
import { getSpendingBreakdown } from "../../utils/finance";

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
  const data = getSpendingBreakdown(transactions);

  return (
    <div className="surface-panel flex flex-col gap-4 h-full">
      <div>
        <h2 className="section-title">Spending Breakdown</h2>
        <p className="section-subtitle">By category</p>
      </div>

      <div className="flex-1 min-h-[180px]">
        {data.length === 0 ? (
          <div className="surface-panel-muted h-full min-h-[180px] flex items-center justify-center text-center px-6">
            <div>
              <p className="section-title">No expense categories yet</p>
              <p className="section-subtitle">Expense entries will appear here as a visual breakdown.</p>
            </div>
          </div>
        ) : (
        
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
          
        )}
      </div>
    </div>
  );
}
