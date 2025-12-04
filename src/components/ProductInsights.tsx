import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Package, TrendingUp, Award, RotateCcw } from 'lucide-react';
import { MetricCard } from './MetricCard';
import type { CostcoTransaction } from '../types';
import { CostcoAnalytics } from '../analytics';

interface ProductInsightsProps {
  transactions: CostcoTransaction[];
}

const COLORS = ['#0073CF', '#E31837'];

export const ProductInsights: React.FC<ProductInsightsProps> = ({ transactions }) => {
  const analytics = new CostcoAnalytics(transactions);
  const topProducts = analytics.getTopProducts(15);
  const kirklandVsBrand = analytics.getKirklandVsBrand();
  const refundAnalysis = analytics.getRefundAnalysis();
  const [showCount, setShowCount] = useState(10);

  const kirklandData = [
    { name: 'Kirkland Signature', value: kirklandVsBrand.kirkland },
    { name: 'Name Brands', value: kirklandVsBrand.brand },
  ];

  return (
    <div className="space-y-6">
      {/* Product Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Kirkland Signature"
          value={kirklandVsBrand.kirkland}
          subtitle={`${kirklandVsBrand.kirklandPercentage.toFixed(1)}% of total spend`}
          icon={Award}
          color="blue"
        />
        <MetricCard
          title="Name Brands"
          value={kirklandVsBrand.brand}
          subtitle={`${(100 - kirklandVsBrand.kirklandPercentage).toFixed(1)}% of total spend`}
          icon={Package}
          color="red"
        />
        <MetricCard
          title="Top Product"
          value={topProducts[0]?.description || 'N/A'}
          subtitle={topProducts[0] ? `$${topProducts[0].totalSpent.toFixed(2)}` : ''}
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          title="Total Refunds"
          value={refundAnalysis.totalRefundAmount}
          subtitle={`${refundAnalysis.totalRefunds} transactions`}
          icon={RotateCcw}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="chart-container lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Top Products by Spend</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCount(10)}
                className={`px-3 py-1 rounded text-sm ${
                  showCount === 10 ? 'bg-costco-blue text-white' : 'bg-gray-200'
                }`}
              >
                Top 10
              </button>
              <button
                onClick={() => setShowCount(15)}
                className={`px-3 py-1 rounded text-sm ${
                  showCount === 15 ? 'bg-costco-blue text-white' : 'bg-gray-200'
                }`}
              >
                Top 15
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topProducts.slice(0, showCount)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="description"
                type="category"
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => `$${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Legend />
              <Bar dataKey="totalSpent" fill="#0073CF" name="Total Spend" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Kirkland vs Brand */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Kirkland vs Name Brands</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={kirklandData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {kirklandData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Value Play:</span> You're spending{' '}
              <span className="font-bold text-costco-blue">
                {kirklandVsBrand.kirklandPercentage.toFixed(1)}%
              </span>{' '}
              on Kirkland Signature products, known for their quality-to-price ratio. Costco
              typically prices KS items at 20% below comparable name brands.
            </p>
          </div>
        </div>

        {/* Product Details Table */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Purchase Details</h3>
          <div className="overflow-auto max-h-[300px]">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    Qty
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Avg
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.slice(0, 15).map((product, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        {product.isKirkland && (
                          <span className="badge badge-info text-xs">KS</span>
                        )}
                        <span className="font-medium text-gray-900">
                          {product.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-500 text-center">
                      {product.purchaseCount}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-500 text-right">
                      ${product.avgPrice.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-sm font-medium text-gray-900 text-right">
                      ${product.totalSpent.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Refund Analysis */}
      {refundAnalysis.refundedProducts.length > 0 && (
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Refund Analysis
            <span className="ml-2 text-sm font-normal text-gray-500">
              Leveraging Costco's legendary return policy
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-gray-700">Total Refunded</span>
                  <span className="font-bold text-lg text-costco-red">
                    ${refundAnalysis.totalRefundAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Number of Returns</span>
                  <span className="font-bold text-lg">{refundAnalysis.totalRefunds}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                Returned Products
              </h4>
              <div className="space-y-2">
                {refundAnalysis.refundedProducts.slice(0, 5).map((product, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{product.description}</span>
                    <span className="text-sm font-medium">${product.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
