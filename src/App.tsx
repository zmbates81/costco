import React, { useState, useEffect } from 'react';
import { BarChart3, Package, Store, Award, Menu, X } from 'lucide-react';
import { OverviewDashboard } from './components/OverviewDashboard';
import { ProductInsights } from './components/ProductInsights';
import { WarehouseAnalytics } from './components/WarehouseAnalytics';
import { MembershipInsights } from './components/MembershipInsights';
import type { CostcoTransaction } from './types';

type TabId = 'overview' | 'products' | 'warehouses' | 'membership';

interface Tab {
  id: TabId;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'products', label: 'Product Insights', icon: Package },
  { id: 'warehouses', label: 'Warehouse Analytics', icon: Store },
  { id: 'membership', label: 'Membership Value', icon: Award },
];

function App() {
  const [transactions, setTransactions] = useState<CostcoTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/costco/costco-2025-12-04T19_32_52.614Z.json');
        if (!response.ok) {
          throw new Error('Failed to load transaction data');
        }
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-costco-blue mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your Costco shopping data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-costco-red rounded-lg flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Costco Shopper Analytics
                </h1>
                <p className="text-sm text-gray-600">
                  Powered by {transactions.length} transactions
                </p>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-2 mt-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gray-50 text-costco-blue border-b-2 border-costco-blue'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-3 font-semibold rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-costco-blue text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && <OverviewDashboard transactions={transactions} />}
        {activeTab === 'products' && <ProductInsights transactions={transactions} />}
        {activeTab === 'warehouses' && <WarehouseAnalytics transactions={transactions} />}
        {activeTab === 'membership' && <MembershipInsights transactions={transactions} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600">
                Costco Shopper Analytics Dashboard
              </p>
              <p className="text-xs text-gray-500">
                Advanced BI insights for smart shopping decisions
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Built with</span>
              <span className="text-costco-red">♥</span>
              <span>and 20 years of Costco IT expertise</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
