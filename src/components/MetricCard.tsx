import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'blue' | 'red' | 'green' | 'purple';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
}) => {
  const colorClasses = {
    blue: 'text-costco-blue',
    red: 'text-costco-red',
    green: 'text-green-600',
    purple: 'text-purple-600',
  };

  const iconBgClasses = {
    blue: 'bg-blue-100',
    red: 'bg-red-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
  };

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="card-title">{title}</p>
          <p className={`metric-value ${colorClasses[color]}`}>
            {typeof value === 'number' && title.toLowerCase().includes('$')
              ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : value}
          </p>
          {subtitle && <p className="metric-label">{subtitle}</p>}
          {trend && (
            <div className={`text-sm mt-2 ${trend.value >= 0 ? 'positive-change' : 'negative-change'}`}>
              <span className="font-semibold">
                {trend.value >= 0 ? '+' : ''}{trend.value.toFixed(1)}%
              </span>
              <span className="text-gray-500 ml-1">{trend.label}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${iconBgClasses[color]}`}>
            <Icon className={`w-6 h-6 ${colorClasses[color]}`} />
          </div>
        )}
      </div>
    </div>
  );
};
