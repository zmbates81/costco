import React from 'react';
import { TrendingUp, Award, DollarSign, Target, CreditCard, CheckCircle } from 'lucide-react';
import { MetricCard } from './MetricCard';
import type { CostcoTransaction } from '../types';
import { CostcoAnalytics } from '../analytics';

interface MembershipInsightsProps {
  transactions: CostcoTransaction[];
}

export const MembershipInsights: React.FC<MembershipInsightsProps> = ({ transactions }) => {
  const analytics = new CostcoAnalytics(transactions);
  const execAnalysis = analytics.getExecutiveMembershipAnalysis();
  const paymentMethods = analytics.getPaymentMethodMetrics();

  const costcoVisaMethod = paymentMethods.find(
    p => p.method.toUpperCase().includes('VISA') || p.method.toUpperCase().includes('COSTCO')
  );

  // Calculate Costco Anywhere Visa rewards (4% gas, 3% dining/travel, 2% Costco, 1% other)
  // Simplified calculation - assume all Costco purchases get 2%
  const estimatedVisaRewards = costcoVisaMethod ? costcoVisaMethod.totalAmount * 0.02 : 0;

  const totalAnnualBenefit = execAnalysis.estimatedRebate + estimatedVisaRewards;

  return (
    <div className="space-y-6">
      {/* Executive Membership Analysis */}
      <div className="chart-container bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-8 h-8 text-costco-blue" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Executive Membership Analysis</h2>
            <p className="text-sm text-gray-600">Maximize your Costco membership value</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Annualized Spend"
            value={execAnalysis.totalSpend}
            subtitle="Based on current patterns"
            icon={DollarSign}
            color="blue"
          />
          <MetricCard
            title="Estimated 2% Rebate"
            value={execAnalysis.estimatedRebate}
            subtitle="With Executive membership"
            icon={TrendingUp}
            color="green"
          />
          <MetricCard
            title="Net Benefit"
            value={execAnalysis.netBenefit}
            subtitle={`After $${execAnalysis.annualFee} upgrade fee`}
            icon={Target}
            color={execAnalysis.netBenefit > 0 ? 'green' : 'red'}
          />
          <MetricCard
            title="Break-Even Spend"
            value={execAnalysis.breakEvenSpend}
            subtitle="To justify upgrade"
            icon={CheckCircle}
            color="purple"
          />
        </div>
      </div>

      {/* Recommendation Card */}
      <div
        className={`chart-container ${
          execAnalysis.recommendUpgrade
            ? 'bg-green-50 border-2 border-green-300'
            : 'bg-yellow-50 border-2 border-yellow-300'
        }`}
      >
        <div className="flex items-start gap-4">
          {execAnalysis.recommendUpgrade ? (
            <CheckCircle className="w-12 h-12 text-green-600 flex-shrink-0" />
          ) : (
            <Target className="w-12 h-12 text-yellow-600 flex-shrink-0" />
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {execAnalysis.recommendUpgrade
                ? '✅ Executive Membership Recommended'
                : '📊 Monitor Your Spending'}
            </h3>
            <p className="text-gray-700 mb-4">
              {execAnalysis.recommendUpgrade ? (
                <>
                  Based on your annualized spending of{' '}
                  <span className="font-bold">${execAnalysis.totalSpend.toFixed(2)}</span>, you
                  would receive an estimated{' '}
                  <span className="font-bold text-green-600">
                    ${execAnalysis.estimatedRebate.toFixed(2)}
                  </span>{' '}
                  annual rebate with Executive membership. After the ${execAnalysis.annualFee}{' '}
                  upgrade fee, your net benefit would be{' '}
                  <span className="font-bold text-green-600">
                    ${execAnalysis.netBenefit.toFixed(2)}
                  </span>
                  .
                </>
              ) : (
                <>
                  Your current annualized spending of{' '}
                  <span className="font-bold">${execAnalysis.totalSpend.toFixed(2)}</span> is below
                  the break-even point of{' '}
                  <span className="font-bold">${execAnalysis.breakEvenSpend.toFixed(2)}</span>.
                  You'd need to increase your annual Costco spending by{' '}
                  <span className="font-bold text-yellow-600">
                    ${(execAnalysis.breakEvenSpend - execAnalysis.totalSpend).toFixed(2)}
                  </span>{' '}
                  to make Executive membership worthwhile.
                </>
              )}
            </p>

            <div className="bg-white rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-gray-800 mb-3">Executive Membership Benefits:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>2% annual reward</strong> on qualified Costco, Costco.com, and Costco
                    Travel purchases (up to $1,000)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Additional savings</strong> on Costco Services (auto, home insurance,
                    check printing)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Enhanced travel benefits</strong> with extra executive pricing on
                    select packages
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Rewards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method Breakdown
          </h3>
          <div className="space-y-4">
            {paymentMethods.map((method, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{method.method}</span>
                  <span className="text-sm font-bold text-gray-900">
                    ${method.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-costco-blue h-2 rounded-full"
                    style={{ width: `${method.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{method.count} transactions</span>
                  <span>{method.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container bg-gradient-to-br from-purple-50 to-pink-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            💳 Costco Anywhere Visa Rewards
          </h3>

          {costcoVisaMethod ? (
            <>
              <div className="space-y-4 mb-6">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Costco Purchases (2%)</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${estimatedVisaRewards.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Estimated annual rewards</p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Annual Benefits</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${totalAnnualBenefit.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Executive rebate + Visa rewards
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  Costco Anywhere Visa Rewards Structure:
                </h4>
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>Gas & EV Charging</span>
                    <span className="font-bold text-costco-blue">4%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>Restaurants & Travel</span>
                    <span className="font-bold text-costco-blue">3%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>Costco & Costco.com</span>
                    <span className="font-bold text-costco-blue">2%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>All Other Purchases</span>
                    <span className="font-bold text-costco-blue">1%</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg p-6 text-center">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Consider applying for the Costco Anywhere Visa to earn additional rewards on your
                purchases.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pro Tips */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          💡 Membership Optimization Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-costco-blue">
            <h4 className="font-semibold text-gray-800 mb-2">Maximize Your Rebate</h4>
            <p className="text-sm text-gray-700">
              Executive members earn 2% back (up to $1,000 annually). Consider consolidating
              household purchases and using Costco Services for insurance, prescriptions, and
              travel to maximize your rebate.
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h4 className="font-semibold text-gray-800 mb-2">Stack Your Savings</h4>
            <p className="text-sm text-gray-700">
              Combine Executive membership (2% rebate) + Costco Visa (2% at Costco) for an
              effective 4% back on all warehouse purchases. That's better than most premium credit
              cards!
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <h4 className="font-semibold text-gray-800 mb-2">Costco Services Hidden Gems</h4>
            <p className="text-sm text-gray-700">
              Executive members get extra discounts on auto/home insurance, identity protection,
              and merchant services. These services alone can justify the upgrade fee.
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
            <h4 className="font-semibold text-gray-800 mb-2">Annual Check-In Guarantee</h4>
            <p className="text-sm text-gray-700">
              Costco has a satisfaction guarantee on Executive membership. If your 2% reward doesn't
              cover the upgrade cost, they'll refund the difference. It's truly risk-free!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
