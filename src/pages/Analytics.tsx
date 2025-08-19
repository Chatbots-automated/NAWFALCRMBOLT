import React, { useState, useEffect } from 'react';
import { BarChart, TrendingUp, DollarSign, Users, Calendar, Download, Filter, Eye, Target, Package, Mail, Phone, MessageSquare } from 'lucide-react';
import { stripeService, ProductSummary, StripeTransaction } from '../services/stripeService';
import { clientService } from '../services/clientService';
import { Client } from '../lib/supabase';

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'30days' | 'thisMonth' | 'thisYear' | 'all'>('all');
  
  // Stripe Data
  const [stripeData, setStripeData] = useState({
    products: [] as ProductSummary[],
    totalRevenue: 0,
    totalTransactions: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    revenueByMonth: { labels: [] as string[], data: [] as number[] }
  });
  
  // Supabase Data
  const [clientData, setClientData] = useState({
    clients: [] as Client[],
    totalClients: 0,
    leads: 0,
    activeClients: 0,
    inactiveClients: 0,
    lostClients: 0,
    recentlyAdded: 0,
    clientsByMonth: { labels: [] as string[], data: [] as number[] }
  });

  // Combined Analytics
  const [analytics, setAnalytics] = useState({
    conversionRate: 0,
    averageClientValue: 0,
    topPerformingProducts: [] as ProductSummary[],
    recentTransactions: [] as StripeTransaction[],
    clientGrowthRate: 0,
    revenueGrowthRate: 0
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build filters based on selected period
      let stripeFilters: any = {
        active: true,
        include_products: 1,
        include_prices: 1
      };

      switch (selectedPeriod) {
        case '30days':
          stripeFilters = { ...stripeFilters, ...stripeService.getLast30DaysFilter() };
          break;
        case 'thisMonth':
          stripeFilters = { ...stripeFilters, ...stripeService.getThisMonthFilter() };
          break;
        case 'thisYear':
          stripeFilters = { ...stripeFilters, ...stripeService.getThisYearFilter() };
          break;
      }

      // Fetch Stripe data
      const [catalogData, revenueChart] = await Promise.all([
        stripeService.getCatalogData(stripeFilters),
        stripeService.getRevenueByPeriod('month', stripeFilters)
      ]);

      const stripeMetrics = stripeService.getConversionMetrics(catalogData.products);
      const topProducts = stripeService.getTopProducts(catalogData.products, 5);
      const recentTransactions = stripeService.getRecentTransactions(catalogData.products, 10);

      setStripeData({
        products: catalogData.products,
        totalRevenue: stripeMetrics.totalRevenue,
        totalTransactions: stripeMetrics.totalOrders,
        totalCustomers: stripeMetrics.totalCustomers,
        averageOrderValue: stripeMetrics.averageOrderValue,
        revenueByMonth: revenueChart
      });

      // Fetch Supabase client data
      const { data: clients } = await clientService.getClients({ limit: 1000 });
      const clientStats = await clientService.getClientStats();

      // Calculate client growth by month
      const clientsByMonth = calculateClientGrowthByMonth(clients);

      setClientData({
        clients,
        totalClients: clientStats.total,
        leads: clientStats.leads,
        activeClients: clientStats.active,
        inactiveClients: clientStats.inactive,
        lostClients: clientStats.lost,
        recentlyAdded: clientStats.recentlyAdded,
        clientsByMonth
      });

      // Calculate combined analytics
      const conversionRate = clientStats.total > 0 ? (stripeMetrics.totalCustomers / clientStats.total) * 100 : 0;
      const averageClientValue = stripeMetrics.totalCustomers > 0 ? stripeMetrics.totalRevenue / stripeMetrics.totalCustomers : 0;
      
      // Calculate growth rates
      const clientGrowthRate = calculateGrowthRate(clientsByMonth.data);
      const revenueGrowthRate = calculateGrowthRate(revenueChart.data);

      setAnalytics({
        conversionRate,
        averageClientValue,
        topPerformingProducts: topProducts,
        recentTransactions,
        clientGrowthRate,
        revenueGrowthRate
      });

    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const calculateClientGrowthByMonth = (clients: Client[]) => {
    const monthlyData: { [key: string]: number } = {};
    
    clients.forEach(client => {
      const date = new Date(client.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    const sortedKeys = Object.keys(monthlyData).sort();
    return {
      labels: sortedKeys,
      data: sortedKeys.map(key => monthlyData[key])
    };
  };

  const calculateGrowthRate = (data: number[]): number => {
    if (data.length < 2) return 0;
    const current = data[data.length - 1] || 0;
    const previous = data[data.length - 2] || 0;
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const kpiMetrics = [
    {
      title: 'Total Revenue',
      value: loading ? '...' : stripeService.formatCurrency(stripeData.totalRevenue),
      change: `${analytics.revenueGrowthRate >= 0 ? '+' : ''}${analytics.revenueGrowthRate.toFixed(1)}%`,
      trend: analytics.revenueGrowthRate >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'from-emerald-400 to-green-600',
      subtitle: `${stripeData.totalTransactions} transactions`
    },
    {
      title: 'Elite Clients',
      value: loading ? '...' : clientData.totalClients.toString(),
      change: `${analytics.clientGrowthRate >= 0 ? '+' : ''}${analytics.clientGrowthRate.toFixed(1)}%`,
      trend: analytics.clientGrowthRate >= 0 ? 'up' : 'down',
      icon: Users,
      color: 'from-blue-400 to-indigo-600',
      subtitle: `${clientData.recentlyAdded} added this week`
    },
    {
      title: 'Conversion Rate',
      value: loading ? '...' : `${analytics.conversionRate.toFixed(1)}%`,
      change: 'Client to Customer',
      trend: 'up',
      icon: Target,
      color: 'from-purple-400 to-pink-600',
      subtitle: `${stripeData.totalCustomers} paying customers`
    },
    {
      title: 'Avg Client Value',
      value: loading ? '...' : stripeService.formatCurrency(analytics.averageClientValue),
      change: 'Per customer',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-orange-400 to-red-600',
      subtitle: `${stripeService.formatCurrency(stripeData.averageOrderValue)} avg order`
    }
  ];

  const clientStatusBreakdown = [
    { status: 'Leads', count: clientData.leads, percentage: clientData.totalClients > 0 ? (clientData.leads / clientData.totalClients) * 100 : 0, color: 'bg-blue-500' },
    { status: 'Active', count: clientData.activeClients, percentage: clientData.totalClients > 0 ? (clientData.activeClients / clientData.totalClients) * 100 : 0, color: 'bg-green-500' },
    { status: 'Inactive', count: clientData.inactiveClients, percentage: clientData.totalClients > 0 ? (clientData.inactiveClients / clientData.totalClients) * 100 : 0, color: 'bg-gray-500' },
    { status: 'Lost', count: clientData.lostClients, percentage: clientData.totalClients > 0 ? (clientData.lostClients / clientData.totalClients) * 100 : 0, color: 'bg-red-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            FILALI EMPIRE
            <span className="block text-4xl bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent font-black">
              BATTLE ANALYTICS
            </span>
          </h1>
          <p className="text-gray-300 mt-2 font-semibold">TACTICAL INTELLIGENCE. DOMINATE WITH DATA.</p>
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
          <button className="px-6 py-3 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors text-gray-300 hover:text-white font-medium">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold">
            <Download size={16} />
            ELITE REPORT
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10" 
                   style={{ background: `linear-gradient(135deg, ${metric.color.split(' ')[1]}, ${metric.color.split(' ')[3]})` }} />
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-red-500/20 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">{metric.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                  <p className="text-xs text-gray-300 mt-1">{metric.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Client Growth Chart */}
        <div className="lg:col-span-2 bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">REVENUE & CLIENT GROWTH</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Clients</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                <span className="ml-3 text-white font-medium">Loading analytics...</span>
              </div>
            ) : (
              <div className="h-64 flex items-end justify-between gap-2">
                {stripeData.revenueByMonth.labels.map((label, index) => {
                  const revenueValue = stripeData.revenueByMonth.data[index] || 0;
                  const clientValue = clientData.clientsByMonth.data[index] || 0;
                  
                  const maxRevenue = Math.max(...stripeData.revenueByMonth.data);
                  const maxClients = Math.max(...clientData.clientsByMonth.data);
                  
                  const revenueHeight = maxRevenue > 0 ? (revenueValue / maxRevenue) * 200 : 0;
                  const clientHeight = maxClients > 0 ? (clientValue / maxClients) * 200 : 0;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex gap-1 items-end">
                        <div className="flex-1 bg-white/10 rounded-t-lg relative overflow-hidden group">
                          <div 
                            className="bg-gradient-to-t from-red-500 to-red-600 rounded-t-lg transition-all duration-500"
                            style={{ height: `${revenueHeight}px` }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-medium">{stripeService.formatCurrency(revenueValue)}</span>
                          </div>
                        </div>
                        <div className="flex-1 bg-white/10 rounded-t-lg relative overflow-hidden group">
                          <div 
                            className="bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-500"
                            style={{ height: `${clientHeight}px` }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-medium">{clientValue}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 mt-2">{label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Client Status Breakdown */}
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">CLIENT PIPELINE</h2>
            <p className="text-gray-400 text-sm mt-1">Status breakdown</p>
          </div>
          <div className="p-6 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                <span className="ml-3 text-white text-sm">Loading...</span>
              </div>
            ) : (
              clientStatusBreakdown.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{item.status}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{item.count}</span>
                      <span className="text-xs text-gray-500">({item.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Products & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Products */}
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">TOP ELITE PRODUCTS</h2>
            <p className="text-gray-400 text-sm mt-1">Revenue leaders</p>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                <span className="ml-3 text-white text-sm">Loading products...</span>
              </div>
            ) : analytics.topPerformingProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No product sales yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.topPerformingProducts.map((product, index) => (
                  <div key={product.product_id} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm border border-red-500/40">
                      {product.product?.name ? product.product.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : (index + 1).toString()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm">{product.product?.name || `Product ${product.product_id.slice(-4)}`}</h4>
                      <p className="text-xs text-gray-400 mt-1">{product.totals.orders} sales • {product.totals.unique_buyers} customers</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">{stripeService.formatCurrency(product.totals.revenue)}</p>
                      <p className="text-xs text-gray-400">{stripeService.formatCurrency(product.totals.revenue / Math.max(product.totals.orders, 1))} avg</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Elite Activity */}
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">RECENT ELITE ACTIVITY</h2>
            <p className="text-gray-400 text-sm mt-1">Latest transactions</p>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                <span className="ml-3 text-white text-sm">Loading activity...</span>
              </div>
            ) : analytics.recentTransactions.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No recent transactions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.recentTransactions.map((transaction, index) => {
                  const product = stripeData.products.find(p => p.product_id === transaction.product_id);
                  return (
                    <div key={transaction.session_id} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full flex items-center justify-center border border-green-500/40">
                        <DollarSign className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm">
                          {product?.product?.name || transaction.description || 'Purchase'}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {transaction.customer_email || 'Anonymous'} • {stripeService.formatDate(transaction.created_unix)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">{stripeService.formatCurrency(transaction.amount_total)}</p>
                        <p className="text-xs text-gray-400">Qty: {transaction.quantity}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Business Intelligence Summary */}
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">ELITE BUSINESS INTELLIGENCE</h2>
          <p className="text-gray-400 text-sm mt-1">Key insights and recommendations</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/40">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Client Acquisition</h3>
              <p className="text-2xl font-bold text-blue-400 mb-2">{clientData.recentlyAdded}</p>
              <p className="text-sm text-gray-400">New clients this week</p>
              <p className="text-xs text-gray-500 mt-2">
                {analytics.clientGrowthRate >= 0 ? 'Growing' : 'Declining'} at {Math.abs(analytics.clientGrowthRate).toFixed(1)}% rate
              </p>
            </div>

            <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/40">
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Revenue Performance</h3>
              <p className="text-2xl font-bold text-green-400 mb-2">{loading ? '...' : stripeService.formatCurrency(stripeData.totalRevenue)}</p>
              <p className="text-sm text-gray-400">Total revenue generated</p>
              <p className="text-xs text-gray-500 mt-2">
                {analytics.revenueGrowthRate >= 0 ? 'Growing' : 'Declining'} at {Math.abs(analytics.revenueGrowthRate).toFixed(1)}% rate
              </p>
            </div>

            <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/40">
                <Target className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Conversion Efficiency</h3>
              <p className="text-2xl font-bold text-purple-400 mb-2">{analytics.conversionRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-400">Client to customer rate</p>
              <p className="text-xs text-gray-500 mt-2">
                {stripeData.totalCustomers} of {clientData.totalClients} clients converted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;