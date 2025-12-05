export interface CostcoItem {
  itemNumber: string;
  itemDescription01: string;
  frenchItemDescription1: string | null;
  itemDescription02: string | null;
  frenchItemDescription2: string | null;
  itemIdentifier: string;
  unit: number;
  amount: number;
  taxFlag: string;
  merchantID: string | null;
  entryMethod: string | null;
}

export interface CostcoTender {
  tenderTypeCode: string;
  tenderDescription: string;
  amountTender: number;
  displayAccountNumber: string | null;
  sequenceNumber: string | null;
  approvalNumber: string | null;
  responseCode: string | null;
  transactionID: string | null;
  merchantID: string | null;
  entryMethod: string | null;
}

export interface CostcoTransaction {
  warehouseName: string;
  documentType: string;
  transactionDateTime: string;
  transactionDate: string;
  companyNumber: number;
  warehouseNumber: number;
  operatorNumber: number;
  warehouseShortName: string;
  registerNumber: number;
  transactionNumber: number;
  transactionType: 'Sales' | 'Refund';
  transactionBarcode: string;
  total: number;
  warehouseAddress1: string;
  warehouseAddress2: string | null;
  warehouseCity: string;
  warehouseState: string;
  warehouseCountry: string;
  warehousePostalCode: string;
  totalItemCount: number;
  subTotal: number;
  taxes: number;
  itemArray: CostcoItem[];
  tenderArray: CostcoTender[];
  couponArray: any[];
  subTaxes: any;
  instantSavings: number;
  membershipNumber: string;
}

export interface AnalyticsMetrics {
  totalTransactions: number;
  salesCount: number;
  refundCount: number;
  totalSpent: number;
  totalRefunded: number;
  netSpend: number;
  totalSavings: number;
  avgTransaction: number;
  avgBasketSize: number;
  totalItems: number;
  uniqueProducts: number;
}

export interface WarehouseMetrics {
  name: string;
  visits: number;
  totalSpent: number;
  avgTransaction: number;
  city: string;
  state: string;
}

export interface ProductMetrics {
  itemNumber: string;
  description: string;
  totalSpent: number;
  purchaseCount: number;
  avgPrice: number;
  isKirkland: boolean;
}

export interface CategorySpend {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface TimeSeriesData {
  date: string;
  amount: number;
  transactionCount: number;
  savings: number;
}

export interface ShoppingPattern {
  hour: number;
  count: number;
  avgSpend: number;
}

export interface PaymentMethodMetrics {
  method: string;
  count: number;
  totalAmount: number;
  percentage: number;
}

export interface ExecutiveMembershipAnalysis {
  totalSpend: number;
  estimatedRebate: number;
  annualFee: number;
  netBenefit: number;
  recommendUpgrade: boolean;
  breakEvenSpend: number;
}
