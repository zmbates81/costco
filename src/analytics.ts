import { format, startOfMonth, eachMonthOfInterval, differenceInDays } from 'date-fns';
import type {
  CostcoTransaction,
  AnalyticsMetrics,
  WarehouseMetrics,
  ProductMetrics,
  CategorySpend,
  TimeSeriesData,
  ShoppingPattern,
  PaymentMethodMetrics,
  ExecutiveMembershipAnalysis,
} from './types';

export class CostcoAnalytics {
  private transactions: CostcoTransaction[];

  constructor(transactions: CostcoTransaction[]) {
    this.transactions = transactions;
  }

  getOverviewMetrics(): AnalyticsMetrics {
    const sales = this.transactions.filter(t => t.transactionType === 'Sales');
    const refunds = this.transactions.filter(t => t.transactionType === 'Refund');

    const totalSpent = sales.reduce((sum, t) => sum + t.total, 0);
    const totalRefunded = Math.abs(refunds.reduce((sum, t) => sum + t.total, 0));
    const totalSavings = this.transactions.reduce((sum, t) => sum + t.instantSavings, 0);

    const allItems = this.transactions.flatMap(t => t.itemArray);
    const uniqueProducts = new Set(allItems.map(i => i.itemNumber)).size;

    return {
      totalTransactions: this.transactions.length,
      salesCount: sales.length,
      refundCount: refunds.length,
      totalSpent,
      totalRefunded,
      netSpend: totalSpent - totalRefunded,
      totalSavings,
      avgTransaction: sales.length > 0 ? totalSpent / sales.length : 0,
      avgBasketSize: sales.length > 0 ? allItems.length / sales.length : 0,
      totalItems: allItems.length,
      uniqueProducts,
    };
  }

  getWarehouseMetrics(): WarehouseMetrics[] {
    const warehouseMap = new Map<string, WarehouseMetrics>();

    this.transactions
      .filter(t => t.transactionType === 'Sales')
      .forEach(t => {
        const key = t.warehouseName;
        if (!warehouseMap.has(key)) {
          warehouseMap.set(key, {
            name: t.warehouseName,
            visits: 0,
            totalSpent: 0,
            avgTransaction: 0,
            city: t.warehouseCity,
            state: t.warehouseState,
          });
        }
        const metrics = warehouseMap.get(key)!;
        metrics.visits += 1;
        metrics.totalSpent += t.total;
      });

    return Array.from(warehouseMap.values()).map(m => ({
      ...m,
      avgTransaction: m.totalSpent / m.visits,
    })).sort((a, b) => b.totalSpent - a.totalSpent);
  }

  getTopProducts(limit: number = 20): ProductMetrics[] {
    const productMap = new Map<string, Omit<ProductMetrics, 'avgPrice'>>();

    this.transactions.forEach(t => {
      t.itemArray.forEach(item => {
        const key = item.itemNumber;
        if (!productMap.has(key)) {
          productMap.set(key, {
            itemNumber: item.itemNumber,
            description: item.itemDescription01,
            totalSpent: 0,
            purchaseCount: 0,
            isKirkland: this.isKirklandSignature(item.itemDescription01),
          });
        }
        const product = productMap.get(key)!;
        product.totalSpent += item.amount;
        product.purchaseCount += 1;
      });
    });

    return Array.from(productMap.values())
      .map(p => ({
        ...p,
        avgPrice: p.totalSpent / p.purchaseCount,
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  }

  getCategorySpend(): CategorySpend[] {
    const allItems = this.transactions.flatMap(t => t.itemArray);
    const totalSpend = allItems.reduce((sum, item) => sum + item.amount, 0);

    const categoryMap = new Map<string, { amount: number; count: number }>();

    allItems.forEach(item => {
      const category = this.categorizeProduct(item.itemDescription01, item.itemNumber);
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { amount: 0, count: 0 });
      }
      const cat = categoryMap.get(category)!;
      cat.amount += item.amount;
      cat.count += 1;
    });

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
        percentage: (data.amount / totalSpend) * 100,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  getTimeSeriesData(): TimeSeriesData[] {
    const sales = this.transactions.filter(t => t.transactionType === 'Sales');

    if (sales.length === 0) return [];

    const dates = sales.map(t => new Date(t.transactionDateTime));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

    const months = eachMonthOfInterval({ start: startOfMonth(minDate), end: maxDate });

    const monthlyData = new Map<string, { amount: number; count: number; savings: number }>();

    months.forEach(month => {
      monthlyData.set(format(month, 'yyyy-MM'), { amount: 0, count: 0, savings: 0 });
    });

    sales.forEach(t => {
      const monthKey = format(new Date(t.transactionDateTime), 'yyyy-MM');
      if (monthlyData.has(monthKey)) {
        const data = monthlyData.get(monthKey)!;
        data.amount += t.total;
        data.count += 1;
        data.savings += t.instantSavings;
      }
    });

    return Array.from(monthlyData.entries())
      .map(([date, data]) => ({
        date,
        amount: data.amount,
        transactionCount: data.count,
        savings: data.savings,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  getShoppingPatterns(): ShoppingPattern[] {
    const hourMap = new Map<number, { count: number; totalSpend: number }>();

    this.transactions
      .filter(t => t.transactionType === 'Sales')
      .forEach(t => {
        const hour = new Date(t.transactionDateTime).getHours();
        if (!hourMap.has(hour)) {
          hourMap.set(hour, { count: 0, totalSpend: 0 });
        }
        const data = hourMap.get(hour)!;
        data.count += 1;
        data.totalSpend += t.total;
      });

    return Array.from(hourMap.entries())
      .map(([hour, data]) => ({
        hour,
        count: data.count,
        avgSpend: data.totalSpend / data.count,
      }))
      .sort((a, b) => a.hour - b.hour);
  }

  getPaymentMethodMetrics(): PaymentMethodMetrics[] {
    const paymentMap = new Map<string, { count: number; totalAmount: number }>();
    const totalAmount = this.transactions
      .flatMap(t => t.tenderArray)
      .reduce((sum, tender) => sum + tender.amountTender, 0);

    this.transactions.forEach(t => {
      t.tenderArray.forEach(tender => {
        const method = tender.tenderDescription;
        if (!paymentMap.has(method)) {
          paymentMap.set(method, { count: 0, totalAmount: 0 });
        }
        const data = paymentMap.get(method)!;
        data.count += 1;
        data.totalAmount += tender.amountTender;
      });
    });

    return Array.from(paymentMap.entries())
      .map(([method, data]) => ({
        method,
        count: data.count,
        totalAmount: data.totalAmount,
        percentage: (data.totalAmount / totalAmount) * 100,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }

  getExecutiveMembershipAnalysis(): ExecutiveMembershipAnalysis {
    const sales = this.transactions.filter(t => t.transactionType === 'Sales');
    const totalSpend = sales.reduce((sum, t) => sum + t.total, 0);

    // Calculate date range for annualization
    const dates = sales.map(t => new Date(t.transactionDateTime));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const daysCovered = differenceInDays(maxDate, minDate) || 1;
    const annualizationFactor = 365 / daysCovered;

    const annualizedSpend = totalSpend * annualizationFactor;

    // Executive membership gives 2% back, costs $60 more than Gold Star
    const estimatedRebate = annualizedSpend * 0.02;
    const annualFee = 60; // Difference between Executive ($120) and Gold Star ($60)
    const netBenefit = estimatedRebate - annualFee;
    const breakEvenSpend = annualFee / 0.02; // $3,000

    return {
      totalSpend: annualizedSpend,
      estimatedRebate,
      annualFee,
      netBenefit,
      recommendUpgrade: estimatedRebate > annualFee,
      breakEvenSpend,
    };
  }

  getKirklandVsBrand(): { kirkland: number; brand: number; kirklandPercentage: number } {
    const allItems = this.transactions.flatMap(t => t.itemArray);
    let kirklandSpend = 0;
    let brandSpend = 0;

    allItems.forEach(item => {
      if (this.isKirklandSignature(item.itemDescription01)) {
        kirklandSpend += item.amount;
      } else {
        brandSpend += item.amount;
      }
    });

    const total = kirklandSpend + brandSpend;
    return {
      kirkland: kirklandSpend,
      brand: brandSpend,
      kirklandPercentage: total > 0 ? (kirklandSpend / total) * 100 : 0,
    };
  }

  getRefundAnalysis() {
    const refunds = this.transactions.filter(t => t.transactionType === 'Refund');
    const refundItems = refunds.flatMap(t => t.itemArray);

    const productRefunds = new Map<string, { description: string; count: number; amount: number }>();

    refundItems.forEach(item => {
      const key = item.itemNumber;
      if (!productRefunds.has(key)) {
        productRefunds.set(key, {
          description: item.itemDescription01,
          count: 0,
          amount: 0,
        });
      }
      const data = productRefunds.get(key)!;
      data.count += 1;
      data.amount += Math.abs(item.amount);
    });

    return {
      totalRefunds: refunds.length,
      totalRefundAmount: Math.abs(refunds.reduce((sum, t) => sum + t.total, 0)),
      refundedProducts: Array.from(productRefunds.values())
        .sort((a, b) => b.amount - a.amount),
    };
  }

  // Helper methods for categorization
  private isKirklandSignature(description: string): boolean {
    return description.toUpperCase().includes('KS ') ||
           description.toUpperCase().includes('KIRKLAND');
  }

  private categorizeProduct(description: string, _itemNumber: string): string {
    const desc = description.toUpperCase();

    // Electronics (item numbers typically in specific ranges at Costco)
    if (desc.includes('TV') || desc.includes('SONY') || desc.includes('LG') ||
        desc.includes('SAMSUNG') || desc.includes('PS5') || desc.includes('XBOX') ||
        desc.includes('LAPTOP') || desc.includes('IPAD') || desc.includes('MACBOOK')) {
      return 'Electronics';
    }

    // Appliances
    if (desc.includes('MWO') || desc.includes('MICROWAVE') || desc.includes('DISHWASHER') ||
        desc.includes('WASHER') || desc.includes('DRYER') || desc.includes('FRIDGE')) {
      return 'Appliances';
    }

    // Fresh/Refrigerated
    if (desc.includes('CHICKEN') || desc.includes('BEEF') || desc.includes('PORK') ||
        desc.includes('SALMON') || desc.includes('STEAK') || desc.includes('GRND') ||
        desc.includes('THIGHS') || desc.includes('BREAST')) {
      return 'Fresh Meat & Seafood';
    }

    // Produce
    if (desc.includes('ORGANIC') || desc.includes('BANANA') || desc.includes('APPLE') ||
        desc.includes('BERRY') || desc.includes('SALAD') || desc.includes('LETTUCE')) {
      return 'Produce';
    }

    // Bakery/Deli
    if (desc.includes('BREAD') || desc.includes('BAGEL') || desc.includes('MUFFIN') ||
        desc.includes('CAKE') || desc.includes('PIE') || desc.includes('CROISSANT')) {
      return 'Bakery';
    }

    // Dairy
    if (desc.includes('MILK') || desc.includes('CHEESE') || desc.includes('YOGURT') ||
        desc.includes('BUTTER') || desc.includes('CREAM') || desc.includes('ROMANO')) {
      return 'Dairy & Eggs';
    }

    // Beverages
    if (desc.includes('WATER') || desc.includes('JUICE') || desc.includes('SODA') ||
        desc.includes('COFFEE') || desc.includes('TEA') || desc.includes('POPPI') ||
        desc.includes('SPARKLING')) {
      return 'Beverages';
    }

    // Snacks
    if (desc.includes('CHIPS') || desc.includes('COOKIE') || desc.includes('CRACKER') ||
        desc.includes('NUTS') || desc.includes('CANDY') || desc.includes('POPCORN') ||
        desc.includes('THAT\'S IT')) {
      return 'Snacks';
    }

    // Health & Personal Care
    if (desc.includes('VITAMIN') || desc.includes('PROTEIN') || desc.includes('SUPPLEMENT') ||
        desc.includes('VITAL')) {
      return 'Health & Supplements';
    }

    // Household
    if (desc.includes('BATH') || desc.includes('TOWEL') || desc.includes('TISSUE') ||
        desc.includes('PAPER') || desc.includes('DETERGENT') || desc.includes('CLEAN')) {
      return 'Household Essentials';
    }

    // Frozen
    if (desc.includes('FROZEN') || desc.includes('ICE CREAM') || desc.includes('PIZZA')) {
      return 'Frozen Foods';
    }

    // Pantry
    if (desc.includes('RICE') || desc.includes('PASTA') || desc.includes('SAUCE') ||
        desc.includes('OIL') || desc.includes('FLOUR') || desc.includes('BRKFST')) {
      return 'Pantry & Dry Goods';
    }

    return 'Other';
  }
}
