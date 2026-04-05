 import { TrendingUp, TrendingDown } from "lucide-react";

export default function SummaryCard({ title, amount, change, changeLabel, icon, gradient, positive }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 flex flex-col gap-3 ${gradient}`}>
      
      {/* Top row — icon + change badge */}
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
          positive 
            ? "bg-green-400/20 text-green-200" 
            : "bg-red-400/20 text-red-200"
        }`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      </div>

      {/* Amount */}
      <div>
        <p className="text-white/70 text-xs font-medium mb-1">{title}</p>
        <p className="text-white text-2xl font-bold font-poppins-bold">
          ₹{amount.toLocaleString("en-IN")}
        </p>
      </div>

      {/* Bottom label */}
      <p className="text-white/60 text-xs">{changeLabel}</p>

      {/* Decorative circle in background */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -right-2 -bottom-6 w-16 h-16 rounded-full bg-white/10" />
    </div>
  );
}