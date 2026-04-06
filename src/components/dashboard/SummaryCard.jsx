import { TrendingUp, TrendingDown } from "lucide-react";

export default function SummaryCard({ title, amount, change, changeLabel, icon, gradient, positive }) {
  return (
    <div className={`relative overflow-hidden rounded-[14px] p-5 flex flex-col gap-3 ${gradient}`}>
      <div className="flex items-center justify-between">
        <div className="size-10 rounded-[10px] bg-white/20 flex items-center justify-center text-white">
          {icon}
        </div>
        <div
          className={`flex items-center gap-1 text-[12px] font-poppins-semibold px-2 py-1 rounded-full ${
            positive
              ? "bg-green-400/20 text-green-200"
              : "bg-red-400/20 text-red-200"
          }`}
        >
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      </div>

      <div>
        <p className="text-white/70 text-[12px] font-poppins-medium mb-1">{title}</p>
        <p className="text-white text-[24px] font-poppins-bold">
          {"\u20b9"}
          {amount.toLocaleString("en-IN")}
        </p>
      </div>

      <p className="text-white/60 text-[12px]">{changeLabel}</p>

      <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10" />
      <div className="absolute -right-2 -bottom-6 size-16 rounded-full bg-white/10" />
    </div>
  );
}
