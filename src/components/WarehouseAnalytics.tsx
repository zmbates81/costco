import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MapPin, Store, Clock, DollarSign } from 'lucide-react';
import { MetricCard } from './MetricCard';
import type { CostcoTransaction } from '../types';
import { CostcoAnalytics } from '../analytics';

interface WarehouseAnalyticsProps {
  transactions: CostcoTransaction[];
}

export const WarehouseAnalytics: React.FC<WarehouseAnalyticsProps> = ({ transactions }) => {
  const analytics = new CostcoAnalytics(transactions);
  const warehouses = analytics.getWarehouseMetrics();
  const shoppingPatterns = analytics.getShoppingPatterns();

  const primaryWarehouse = warehouses[0];
  const totalVisits = warehouses.reduce((sum, w) => sum + w.visits, 0);

  // Prepare data for time-of-day patterns
  const timeLabels: { [key: number]: string } = {
    9: '9-10 AM',
    10: '10-11 AM',
    11: '11-12 PM',
    12: '12-1 PM',
    13: '1-2 PM',
    14: '2-3 PM',
    15: '3-4 PM',
    16: '4-5 PM',
    17: '5-6 PM',
    18: '6-7 PM',
    19: '7-8 PM',
  };

  const patternData = shoppingPatterns.map(p => ({
    time: timeLabels[p.hour] || `${p.hour}:00`,
    visits: p.count,
    avgSpend: p.avgSpend,
  }));

  return (
    <div className="space-y-6">
      {/* Warehouse Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Primary Location"
          value={primaryWarehouse?.name || 'N/A'}
          subtitle={primaryWarehouse ? `${primaryWarehouse.city}, ${primaryWarehouse.state}` : ''}
          icon={Store}
          color="blue"
        />
        <MetricCard
          title="Total Visits"
          value={totalVisits}
          subtitle="Across all locations"
          icon={MapPin}
          color="green"
        />
        <MetricCard
          title="Locations Visited"
          value={warehouses.length}
          subtitle="Different warehouses"
          icon={MapPin}
          color="purple"
        />
        <MetricCard
          title="Avg per Visit"
          value={primaryWarehouse?.avgTransaction || 0}
          subtitle={`At ${primaryWarehouse?.name || 'primary'} location`}
          icon={DollarSign}
          color="red"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Warehouse Comparison */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Warehouse Performance Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={warehouses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#0073CF" />
              <YAxis yAxisId="right" orientation="right" stroke="#E31837" />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'totalSpent' || name === 'avgTransaction') {
                    return `$${value.toFixed(2)}`;
                  }
                  return value;
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="visits" fill="#0073CF" name="Visits" />
              <Bar yAxisId="right" dataKey="avgTransaction" fill="#E31837" name="Avg Spend" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Shopping Time Patterns */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Optimal Shopping Times
            <span className="ml-2 text-sm font-normal text-gray-500">
              When you typically shop
            </span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={patternData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="visits" fill="#0073CF" name="Number of Visits" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Warehouse Details Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Warehouse Details & Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City, State
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visits
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spend
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Transaction
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Share of Wallet
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {warehouses.map((warehouse, idx) => {
                const shareOfWallet =
                  (warehouse.totalSpent /
                    warehouses.reduce((sum, w) => sum + w.totalSpent, 0)) *
                  100;
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Store className="w-5 h-5 text-costco-blue mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {warehouse.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {warehouse.city}, {warehouse.state}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center">
                      {warehouse.visits}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                      ${warehouse.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">
                      ${warehouse.avgTransaction.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-costco-blue h-2 rounded-full"
                            style={{ width: `${shareOfWallet}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {shareOfWallet.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shopping Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <Clock className="inline w-5 h-5 mr-2" />
            Shopping Behavior Insights
          </h3>
          <div className="space-y-4">
            {shoppingPatterns.length > 0 && (
              <>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Peak Shopping Hour</p>
                  <p className="text-lg font-bold text-costco-blue">
                    {(() => {
                      const peak = shoppingPatterns.reduce((max, p) =>
                        p.count > max.count ? p : max
                      );
                      return timeLabels[peak.hour] || `${peak.hour}:00`;
                    })()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Most frequent shopping time
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Highest Spend Period
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {(() => {
                      const highest = shoppingPatterns.reduce((max, p) =>
                        p.avgSpend > max.avgSpend ? p : max
                      );
                      return timeLabels[highest.hour] || `${highest.hour}:00`;
                    })()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Time with largest basket sizes
                  </p>
                </div>
              </>
            )}

            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-1">Warehouse Loyalty</p>
              <p className="text-lg font-bold text-purple-600">
                {primaryWarehouse
                  ? `${((primaryWarehouse.visits / totalVisits) * 100).toFixed(1)}%`
                  : 'N/A'}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Of trips to {primaryWarehouse?.name}
              </p>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pro Tips</h3>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-sm font-semibold text-gray-700">Gas Savings Opportunity</p>
              <p className="text-xs text-gray-600 mt-1">
                Consolidate trips to your primary location to maximize gas savings. Costco gas
                is typically $0.20-0.30 cheaper per gallon than competitors.
              </p>
            </div>

            <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
              <p className="text-sm font-semibold text-gray-700">Weekday Morning Sweet Spot</p>
              <p className="text-xs text-gray-600 mt-1">
                Warehouses are least crowded Tuesday-Thursday 9-11 AM. Fresh items are
                well-stocked, checkout lines are short, and samples are out.
              </p>
            </div>

            <div className="p-3 bg-green-50 border-l-4 border-green-400">
              <p className="text-sm font-semibold text-gray-700">Cross-Shop Strategically</p>
              <p className="text-xs text-gray-600 mt-1">
                Different warehouses have different buyers. The Easton location often carries
                unique items not found at Columbus. Plan occasional visits for variety.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
