import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Eye, 
  Download, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  RefreshCw, 
  ExternalLink, 
  User, 
  Calendar, 
  Package,
  Filter,
  Search,
  BarChart3,
  Users,
  Target,
  ShoppingCart
} from 'lucide-react';
import { stripeService, ProductSummary, StripeTransaction, CatalogFilters } from '../services/stripeService';

const Payments: React.FC = () => {
  const [productSummaries, setProductSummaries] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'30days' | 'thisMonth' | 'thisYear' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    totalProducts: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    thisMonthRevenue: 0
  });
  const [revenueChart, setRevenueChart] = useState<{ labels: string[]; data: number[] }>({
    labels: [],
    data: []
  });

  useEffect(() => {
    fetchStripeData();
  }, [selectedPeriod, showActiveOnly]);

  const fetchStripeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build filters based on selected period
      let filters: CatalogFilters = {
        active: showActiveOnly,
        include_products: true,
        include_prices: true
      };

      switch (selectedPeriod) {
        case '30days':
          filters = { ...filters, ...stripeService.getLast30DaysFilter() };
          break;
        case 'thisMonth':
          filters = { ...filters, ...stripeService.getThisMonthFilter() };
          break;
        case 'thisYear':
          filters = { ...filters, ...stripeService.getThisYearFilter() };
          break;
        case 'all':
        default:
          // No date filters for 'all'
          break;
      }

      const catalogData = await stripeService.getCatalogData(filters);
      setProductSummaries(catalogData.products);
      
      // Calculate comprehensive stats
      const metrics = stripeService.getConversionMetrics(catalogData.products);
      
      // Calculate this month's revenue separately
      const thisMonthFilters = stripeService.getThisMonthFilter();
      const thisMonthData = await stripeService.getAllTransactions(thisMonthFilters);
      
      setStats({
        totalRevenue: metrics.totalRevenue,
        totalTransactions: metrics.totalOrders,
        totalProducts: catalogData.count_products,
        totalCustomers: metrics.totalCustomers,
        averageOrderValue: metrics.averageOrderValue,
        thisMonthRevenue: thisMonthData.totalRevenue
      });
      
      // Generate revenue chart data
      const chartData = await stripeService.getRevenueByPeriod('month', filters);
      setRevenueChart(chartData);
      
    } catch (err) {
      console.error('Failed to fetch Stripe data:', err);
      setError('Failed to load Stripe data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Filter products and transactions based on search and selection
  const getFilteredData = () => {
    let filteredProducts = productSummaries;
    
    // Filter by search query
    if (searchQuery) {
      filteredProducts = productSummaries.filter(product => 
        product.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.product?.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.transactions.some(t => 
          t.customer_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    
    // Filter by selected product
    if (selectedProduct !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.product_id === selectedProduct);
    }
    
    // Get all transactions from filtered products
    const allTransactions = filteredProducts.flatMap(p => p.transactions);
    
    return {
      products: filteredProducts,
      transactions: allTransactions.sort((a, b) => b.created_unix - a.created_unix)
    };
  };

  const { products: filteredProducts, transactions: filteredTransactions } = getFilteredData();

  const revenueMetrics = [
    {
      title: 'Total Revenue',
      value: stripeService.formatCurrency(stats.totalRevenue),
      change: `${stats.totalTransactions} sales`,
      trend: 'up',
      icon: DollarSign,
      color: 'from-emerald-400 to-green-600',
      bgColor: 'bg-emerald-500/20',
      iconBg: 'bg-emerald-500'
    },
    {
      title: 'Elite Products',
      value: stats.totalProducts.toString(),
      change: `${productSummaries.filter(p => p.totals.revenue > 0).length} selling`,
      trend: 'up',
      icon: Package,
      color: 'from-blue-400 to-indigo-600',
      bgColor: 'bg-blue-500/20',
      iconBg: 'bg-blue-500'
    },
    {
      title: 'Elite Customers',
      value: stats.totalCustomers.toString(),
      change: 'Unique buyers',
      trend: 'up',
      icon: Users,
      color: 'from-purple-400 to-pink-600',
      bgColor: 'bg-purple-500/20',
      iconBg: 'bg-purple-500'
    },
    {
      title: 'Avg Order Value',
      value: stripeService.formatCurrency(stats.averageOrderValue),
      change: 'Per transaction',
      trend: 'up',
      icon: Target,
      color: 'from-orange-400 to-red-600',
      bgColor: 'bg-orange-500/20',
      iconBg: 'bg-orange-500'
    }
  ];

  const topProducts = stripeService.getTopProducts(productSummaries, 4);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            FILALI EMPIRE
            <span className="block text-4xl bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent font-black">
              REVENUE COMMAND
            </span>
          </h1>
          <p className="text-gray-300 mt-2 font-semibold">DYNAMIC STRIPE INTEGRATION. REAL-TIME DOMINATION.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedPeriod('all')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedPeriod === 'all' 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                  : 'border border-red-500/30 hover:bg-red-500/10 text-gray-300 hover:text-white'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setSelectedPeriod('thisYear')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedPeriod === 'thisYear' 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                  : 'border border-red-500/30 hover:bg-red-500/10 text-gray-300 hover:text-white'
              }`}
            >
              This Year
            </button>
            <button
              onClick={() => setSelectedPeriod('thisMonth')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedPeriod === 'thisMonth' 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                  : 'border border-red-500/30 hover:bg-red-500/10 text-gray-300 hover:text-white'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setSelectedPeriod('30days')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedPeriod === '30days' 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                  : 'border border-red-500/30 hover:bg-red-500/10 text-gray-300 hover:text-white'
              }`}
            >
              Last 30 Days
            </button>
          </div>
          <button 
            onClick={fetchStripeData}
            disabled={loading}
            className="px-6 py-3 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors text-gray-300 hover:text-white font-medium disabled:opacity-50"
          >
            <RefreshCw size={16} className={`inline mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <a
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold"
          >
            <ExternalLink size={16} />
            STRIPE DASHBOARD
          </a>
        </div>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10" 
                   style={{ background: `linear-gradient(135deg, ${metric.color.split(' ')[1]}, ${metric.color.split(' ')[3]})` }} />
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-red-500/20 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${metric.iconBg}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-400">
                    {metric.change}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">{metric.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-red-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search products, customers, transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 bg-black/30 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-black/50 transition-all text-white placeholder-gray-400"
              />
            </div>
            
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-4 py-2 bg-black/30 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 text-white"
            >
              <option value="all">All Products</option>
              {productSummaries.map((product) => (
                <option key={product.product_id} value={product.product_id}>
                  {product.product?.name || product.product_id}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="rounded border-red-500/30 bg-black/30 text-red-500 focus:ring-red-500"
              />
              <span className="text-sm font-medium">Active Products Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">ELITE REVENUE TREND</h2>
              <p className="text-gray-400 text-sm mt-1">Monthly revenue performance across all products</p>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-red-400" />
              <span className="text-sm text-gray-300 font-medium">
                {selectedPeriod === 'all' ? 'All Time' : 
                 selectedPeriod === 'thisYear' ? 'This Year' :
                 selectedPeriod === 'thisMonth' ? 'This Month' : 'Last 30 Days'}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-end justify-between gap-4">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                <span className="ml-3 text-white font-medium">Loading revenue data...</span>
              </div>
            ) : revenueChart.data.length > 0 ? (
              revenueChart.data.map((value, index) => {
                const maxValue = Math.max(...revenueChart.data);
                const height = maxValue > 0 ? (value / maxValue) * 200 : 0;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-white/10 rounded-t-lg relative overflow-hidden group">
                      <div 
                        className="bg-gradient-to-t from-red-500 to-purple-500 rounded-t-lg transition-all duration-500 hover:from-red-600 hover:to-purple-600"
                        style={{ height: `${height}px` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-medium">{stripeService.formatCurrency(value)}</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400 mt-2">{revenueChart.labels[index]}</span>
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-400">No revenue data available for selected period</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">TOP ELITE PRODUCTS</h2>
          <p className="text-gray-400 text-sm mt-1">Your highest performing products</p>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
              <span className="ml-3 text-white font-medium">Loading products...</span>
            </div>
          ) : topProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Sales Data</h3>
              <p className="text-gray-400">No products have generated revenue yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topProducts.map((product, index) => (
                <div key={product.product_id} className="text-center p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3 border border-red-500/40">
                    {product.product?.name ? product.product.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : product.product_id.slice(-2).toUpperCase()}
                  </div>
                  <h3 className="font-semibold text-white mb-1 text-sm">{product.product?.name || `Product ${product.product_id.slice(-4)}`}</h3>
                  <p className="text-2xl font-bold text-red-400 mb-1">{product.totals.orders}</p>
                  <p className="text-sm text-gray-400">sales</p>
                  <p className="text-lg font-semibold text-green-400 mt-2">{stripeService.formatCurrency(product.totals.revenue)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">ELITE TRANSACTIONS</h2>
              <p className="text-gray-400 text-sm mt-1">Real-time payment data from Stripe catalog</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/40 font-medium">
                Live Data
              </span>
              <span className="text-sm text-gray-300">
                {filteredTransactions.length} transactions
              </span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-500 rounded-full animate-spin animate-reverse"></div>
              </div>
              <span className="ml-4 text-white font-semibold">Loading Stripe transactions...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/40">
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Failed to Load</h3>
              <p className="text-red-400 mb-6 font-medium">{error}</p>
              <button 
                onClick={fetchStripeData}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold">
                Retry Loading
              </button>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-500/40">
                <CreditCard className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Transactions Found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || selectedProduct !== 'all' 
                  ? 'No transactions match your current filters' 
                  : 'No payments have been processed yet'
                }
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredTransactions.map((transaction) => {
                  // Find the product data for this transaction
                  const productData = filteredProducts.find(p => p.product_id === transaction.product_id);
                  const productName = productData?.product?.name || transaction.description || `Product ${transaction.product_id.slice(-4)}`;
                  
                  return (
                    <tr key={transaction.session_id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full flex items-center justify-center border border-blue-500/40">
                            <User className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{transaction.customer_email || 'Anonymous'}</p>
                            <p className="text-xs text-gray-400">ID: {transaction.session_id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-white">{productName}</p>
                          <p className="text-xs text-gray-400">
                            Qty: {transaction.quantity} × {stripeService.formatCurrency(transaction.amount_total / transaction.quantity, transaction.currency)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-lg font-bold text-green-400">
                          {stripeService.formatCurrency(transaction.amount_total, transaction.currency)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-white">
                          {stripeService.formatDate(transaction.created_unix)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border bg-green-500/20 text-green-400 border-green-500/40">
                          <CheckCircle size={12} />
                          PAID
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-400 rounded-lg hover:bg-green-500/10 transition-colors">
                            <Download size={16} />
                          </button>
                          <a
                            href={`https://dashboard.stripe.com/payments/${transaction.payment_intent_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-purple-400 rounded-lg hover:bg-purple-500/10 transition-colors"
                          >
                            <ExternalLink size={16} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Product Performance Grid */}
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">PRODUCT PERFORMANCE</h2>
          <p className="text-gray-400 text-sm mt-1">Detailed breakdown by product</p>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
              <span className="ml-3 text-white font-medium">Loading product data...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Products Found</h3>
              <p className="text-gray-400">No products match your current filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.product_id} className="border border-white/10 rounded-xl p-6 hover:bg-white/5 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-red-500/30 to-purple-500/30 rounded-xl border border-red-500/40">
                        <Package className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{product.product?.name || 'Unknown Product'}</h3>
                        <p className="text-sm text-gray-400">{product.product?.description || 'No description'}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                          product.product?.active 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/40' 
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/40'
                        }`}>
                          {product.product?.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <p className="text-2xl font-bold text-white">{product.totals.orders}</p>
                      <p className="text-xs text-gray-400">Orders</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <p className="text-2xl font-bold text-green-400">{stripeService.formatCompactCurrency(product.totals.revenue)}</p>
                      <p className="text-xs text-gray-400">Revenue</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <p className="text-2xl font-bold text-purple-400">{product.totals.unique_buyers}</p>
                      <p className="text-xs text-gray-400">Customers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <ShoppingCart size={14} />
                      <span>{product.links.length} payment link{product.links.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedProduct(product.product_id)}
                        className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <a
                        href={`https://dashboard.stripe.com/products/${product.product_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-purple-400 rounded-lg hover:bg-purple-500/10 transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;