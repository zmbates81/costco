# 🛒 Costco Shopper Analytics Dashboard

A sophisticated Business Intelligence dashboard for analyzing Costco shopping patterns, built with deep expertise in retail analytics and Costco's unique business model.

## 🎯 Features

### 📊 Overview Dashboard
- **Real-time KPIs**: Total spend, net spend after refunds, instant savings, and average transaction
- **Spending Trends**: Time-series analysis of shopping patterns
- **Category Breakdown**: Visual pie charts showing where your money goes
- **Payment Method Analytics**: Track which cards you're using most

### 📦 Product Insights
- **Top Products Analysis**: Discover your most-purchased items
- **Kirkland Signature vs Name Brands**: See how much you're saving with KS products
- **Purchase Frequency Tracking**: Identify repeat purchases
- **Refund Analysis**: Leverage Costco's legendary return policy insights

### 🏢 Warehouse Analytics
- **Multi-Location Tracking**: Compare performance across warehouses
- **Shopping Time Optimization**: Find the best times to visit based on your patterns
- **Warehouse Loyalty Metrics**: See your preferred locations
- **Geographic Insights**: City and state-level analysis

### 💳 Membership Value Analysis
- **Executive Membership ROI Calculator**: Know if the upgrade pays for itself
- **Costco Anywhere Visa Rewards Tracking**: 4% gas, 3% dining, 2% Costco calculation
- **Break-Even Analysis**: Exact spend needed to justify Executive membership
- **Stacked Rewards Optimization**: Combine Executive (2%) + Visa (2%) for 4% back

## 🏗️ Technical Architecture

### Built With Modern Stack
- **React 18** with TypeScript for type safety
- **Vite** for blazing-fast builds and HMR
- **Recharts** for beautiful, responsive data visualizations
- **TailwindCSS** for custom Costco-branded styling
- **date-fns** for robust date handling

### Analytics Engine
Custom-built `CostcoAnalytics` class with:
- Smart product categorization (15+ categories)
- Kirkland Signature detection algorithms
- Time-series aggregation and trending
- Membership value calculations
- Multi-warehouse comparative analysis

### Costco-Specific Intelligence
- **Product Categorization**: Understands Costco item numbering and descriptions
- **Kirkland Detection**: Identifies KS products for savings analysis
- **Warehouse Knowledge**: Columbus, Easton OH, NW Columbus locations
- **Membership Tiers**: Gold Star vs Executive analysis
- **Payment Methods**: Costco Visa card reward optimization

## 🚀 Live Demo

Visit: **https://zmbates81.github.io/costco/**

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Data Model

The dashboard processes Costco receipt data with the following structure:

```typescript
interface CostcoTransaction {
  warehouseName: string;
  transactionDateTime: string;
  transactionType: 'Sales' | 'Refund';
  total: number;
  itemArray: CostcoItem[];
  tenderArray: CostcoTender[];
  instantSavings: number;
  membershipNumber: string;
  // ... and 20+ more fields
}
```

## 🎨 Design Philosophy

### Costco Brand Colors
- **Costco Blue (#0073CF)**: Primary actions and metrics
- **Costco Red (#E31837)**: Savings and important callouts
- **Professional Gray Scale**: Clean, readable interface

### UX Principles
1. **Mobile-First Responsive**: Works on phone, tablet, and desktop
2. **Fast Load Times**: Optimized bundle with code splitting
3. **Intuitive Navigation**: Tab-based interface with clear hierarchy
4. **Actionable Insights**: Every metric drives a decision

## 🧠 Costco Expertise Highlights

### Executive Membership Intelligence
- Automatic ROI calculation based on actual spend
- Break-even analysis ($3,000 annual spend threshold)
- Risk-free guarantee reminder (Costco refunds difference if not worth it)
- Service benefits (insurance, travel, prescriptions)

### Shopping Optimization
- **Best Times**: Tuesday-Thursday 9-11 AM for fresh stock and no crowds
- **Gas Savings**: $0.20-0.30/gallon savings mentioned
- **Cross-Shopping Strategy**: Different warehouses have different buyers

### Product Knowledge
- Kirkland Signature pricing (typically 20% below name brands)
- Item number understanding (electronics, appliances ranges)
- Case pack information from descriptions (CS=15, SL120, etc.)
- Fresh meat department codes

## 📈 Key Insights Delivered

1. **Spending Trends**: Monthly aggregation with YoY comparisons
2. **Category Optimization**: Which departments dominate your budget
3. **Membership ROI**: Clear upgrade recommendation with math
4. **Payment Rewards**: Stack Executive + Visa for 4% back
5. **Shopping Habits**: Time-of-day and day-of-week patterns
6. **Product Loyalty**: Most-repurchased items for auto-reordering
7. **Return Patterns**: Refund analysis shows satisfaction trends

## 🔐 Privacy & Security

- All data processing happens client-side in the browser
- No data is sent to external servers
- JSON files are static assets served from GitHub Pages
- No cookies, tracking, or analytics

## 🚀 Deployment

Automated deployment via GitHub Actions:
- Push to branch triggers build
- TypeScript compilation and type checking
- Vite production build with optimizations
- Deploy to GitHub Pages automatically

## 📝 Future Enhancements

- [ ] Import from Costco's online receipt system
- [ ] Budget forecasting with ML predictions
- [ ] Price tracking over time
- [ ] Coupon book correlation analysis
- [ ] Social comparison (anonymized community benchmarks)
- [ ] Export to PDF reports
- [ ] Calendar integration for bulk shopping reminders

## 👨‍💻 Developer Notes

This dashboard was built to showcase:
- Modern React + TypeScript patterns
- Custom analytics engine design
- Domain expertise in retail BI
- Production-ready code quality
- Responsive, accessible UI/UX
- CI/CD best practices

## 📄 License

MIT License - feel free to fork and adapt for your own use!

---

Built with ❤️ and 20 years of Costco IT expertise
