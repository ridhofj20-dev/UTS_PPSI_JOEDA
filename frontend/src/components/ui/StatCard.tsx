import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  isPositive?: boolean;
  icon?: string;
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  isPositive = true,
  icon,
  accentColor = "border-t-primary",
}) => {
  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-space-md shadow-sm border-t-4 ${accentColor} flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between">
        <span className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
          {title}
        </span>
        {icon && (
          <span className="material-symbols-outlined text-secondary text-xl">
            {icon}
          </span>
        )}
      </div>

      <div className="my-space-xs">
        <span className="font-metric-display text-3xl font-extrabold text-primary tracking-tight">
          {value}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-on-surface-variant">
        {subtitle && <span>{subtitle}</span>}
        {trend && (
          <span
            className={`font-semibold px-1.5 py-0.5 rounded text-[11px] ${
              isPositive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

