import { TrendingUp, TrendingDown } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../utils/finance";

export default function SummaryCard({
  title,
  amount,
  change,
  changeLabel,
  icon,
  gradient,
  lightTone,
  iconTone,
  titleTone,
  amountTone,
  changeTone,
  positive,
}) {
  const { isDark } = useApp();

  return (
    <div
      className={`dashboard-card-size metric-card-stack relative overflow-hidden rounded-[14px] p-5 ${
        isDark ? `${gradient} metric-card-dark` : `${lightTone} metric-card-light`
      }`}
    >
      <div className="flex items-center justify-between">
        <div className={`icon-chip ${isDark ? "bg-white/20 text-white" : iconTone}`}>
          {icon}
        </div>
        <div
          className={`flex items-center gap-1 text-[12px] font-poppins-semibold px-2 py-1 rounded-full ${
            isDark
              ? positive
                ? "bg-green-400/20 text-green-200"
                : "bg-red-400/20 text-red-200"
              : positive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      </div>

      <div>
        <p className={`${isDark ? "text-white/70" : titleTone} text-[12px] font-poppins-medium mb-1`}>
          {title}
        </p>
        <p className={`${isDark ? "text-white" : amountTone} text-[24px] font-poppins-bold`}>
          {formatCurrency(amount)}
        </p>
      </div>

      <p className={`${isDark ? "text-white/60" : changeTone} text-[12px]`}>
        {changeLabel}
      </p>

      {isDark && (
        <>
          <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10" />
          <div className="absolute -right-2 -bottom-6 size-16 rounded-full bg-white/10" />
        </>
      )}
    </div>
  );
}
