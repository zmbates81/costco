import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ShoppingCart, TrendingUp, DollarSign, Package } from 'lucide-react';
import { MetricCard } from './MetricCard';
import type { CostcoTransaction } from '../types';
import { CostcoAnalytics } from '../analytics';

interface OverviewDashboardProps {
  transactions: CostcoTransaction[];
}

const COLORS = ['#0073CF', '#E31837', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4', '#84CC16'];

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ transactions }) => {
  const analytics = new CostcoAnalytics(transactions);
  const metrics = analytics.getOverviewMetrics();
  const categorySpend = analytics.getCategorySpend();
  const timeSeries = analytics.getTimeSeriesData();
  const paymentMethods = analytics.getPaymentMethodMetrics();

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Spend"
          value={metrics.totalSpent}
          subtitle={`${metrics.salesCount} transactions`}
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Net Spend"
          value={metrics.netSpend}
          subtitle={`After ${metrics.refundCount} refunds`}
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          title="Total Savings"
          value={metrics.totalSavings}
          subtitle="Instant savings applied"
          icon={Package}
          color="red"
        />
        <MetricCard
          title="Avg Transaction"
          value={metrics.avgTransaction}
          subtitle={`${metrics.avgBasketSize.toFixed(1)} items per trip`}
          icon={ShoppingCart}
          color="purple"
        />
      </div>

      {/* Shopping Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="metric-card">
          <p className="card-title">Shopping Activity</p>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Items</span>
              <span className="font-bold text-lg">{metrics.totalItems}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Unique Products</span>
              <span className="font-bold text-lg">{metrics.uniqueProducts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Basket Size</span>
              <span className="font-bold text-lg">{metrics.avgBasketSize.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <p className="card-title">Savings Performance</p>
          <div className="mt-4">
            <div className="text-3xl font-bold text-costco-red">
              ${metrics.totalSavings.toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {((metrics.totalSavings / metrics.totalSpent) * 100).toFixed(1)}% savings rate
            </p>
            <div className="mt-4 bg-gray-200 rounded-full h-3">
              <div
                className="progress-bar h-3"
                style={{ width: `${Math.min((metrics.totalSavings / metrics.totalSpent) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <p className="card-title">Transaction Split</p>
          <div className="space-y-3 mt-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600">Sales</span>
                <span className="font-bold text-green-600">{metrics.salesCount}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(metrics.salesCount / metrics.totalTransactions) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600">Refunds</span>
                <span className="font-bold text-red-600">{metrics.refundCount}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${(metrics.refundCount / metrics.totalTransactions) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Over Time */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Spending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => `$${value.toFixed(2)}`}
                labelStyle={{ color: '#000' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#0073CF"
                strokeWidth={2}
                name="Amount"
              />
              <Line
                type="monotone"
                dataKey="savings"
                stroke="#E31837"
                strokeWidth={2}
                name="Savings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categorySpend.slice(0, 8)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {categorySpend.slice(0, 8).map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentMethods}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="method" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="totalAmount" fill="#0073CF" name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories Table */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Categories by Spend</h3>
          <div className="overflow-auto max-h-[300px]">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spend
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categorySpend.map((cat, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{cat.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-right">{cat.count}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      ${cat.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-right">
                      {cat.percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
