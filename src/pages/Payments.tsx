import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Eye, Download, Send, TrendingUp, DollarSign, Clock, CheckCircle, AlertTriangle, Zap, RefreshCw, ExternalLink, User, Calendar, Package } from 'lucide-react';
import { stripeService, StripeTransaction, PaymentLink } from '../services/stripeService';

const Payments: React.FC = () => {
  const [transactions, setTransactions] = useState<StripeTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentLink, setSelectedPaymentLink] = useState<string>('all');
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    thisMonth: 0,
    avgTransaction: 0
  });
  const [revenueChart, setRevenueChart] = useState<{ labels: string[]; data: number[] }>({
    labels: [],
    data: []
  });

  useEffect(() => {
    fetchPaymentData();
    setPaymentLinks(stripeService.getPaymentLinks());
  }, []);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await stripeService.getAllTransactions();
      
      setTransactions(data.allTransactions);
      
      // Calculate this month's revenue
      const now = new Date();
      const thisMonth = data.allTransactions.filter(t => {
        const transactionDate = new Date(t.created_unix * 1000);
        return transactionDate.getMonth() === now.getMonth() && 
               transactionDate.getFullYear() === now.getFullYear();
      }).reduce((sum, t) => sum + t.amount_total, 0);
      
      const avgTransaction = data.totalTransactions > 0 ? data.totalRevenue / data.totalTransactions : 0;
      
      setStats({
        totalRevenue: data.totalRevenue,
        totalTransactions: data.totalTransactions,
        thisMonth,
        avgTransaction
      });
      
      // Generate revenue chart data
      const chartData = stripeService.getRevenueByPeriod(data.allTransactions, 'month');
      setRevenueChart(chartData);
      
    } catch (err) {
      console.error('Failed to fetch payment data:', err);
      setError('Failed to load payment data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = selectedPaymentLink === 'all' 
    ? transactions 
    : transactions.filter(t => {
        const link = paymentLinks.find(pl => pl.id === selectedPaymentLink);
        return link && t.lines.some(line => line.description?.includes(link.name.split(' ')[0]));
      });

  const revenueMetrics = [
    {
      title: 'Total Revenue',
      value: stripeService.formatCurrency(stats.totalRevenue),
      change: '+100%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-emerald-400 to-green-600',
      bgColor: 'bg-emerald-500/20',
      iconBg: 'bg-emerald-500'
    },
    {
      title: 'Total Transactions',
      value: stats.totalTransactions.toString(),
      change: `${stats.totalTransactions} sales`,
      trend: 'up',
      icon: CreditCard,
      color: 'from-blue-400 to-indigo-600',
      bgColor: 'bg-blue-500/20',
      iconBg: 'bg-blue-500'
    },
    {
      title: 'This Month',
      value: stripeService.formatCurrency(stats.thisMonth),
      change: 'Current month',
      trend: 'up',
      icon: Calendar,
      color: 'from-purple-400 to-pink-600',
      bgColor: 'bg-purple-500/20',
      iconBg: 'bg-purple-500'
    },
    {
      title: 'Avg Transaction',
      value: stripeService.formatCurrency(stats.avgTransaction),
      change: 'Per sale',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-orange-400 to-red-600',
      bgColor: 'bg-orange-500/20',
      iconBg: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            ELITE REVENUE
            <span className="block text-3xl bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
              COMMAND CENTER
            </span>
          </h1>
          <p className="text-gray-300 mt-2">Stripe payments, transactions, and elite financial tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPaymentLink}
            onChange={(e) => setSelectedPaymentLink(e.target.value)}
            className="px-4 py-2 bg-black/30 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 text-white"
          >
            <option value="all">All Products</option>
            {paymentLinks.map((link) => (
              <option key={link.id} value={link.id}>{link.name}</option>
            ))}
          </select>
          <button 
            onClick={fetchPaymentData}
            disabled={loading}
            className="px-6 py-3 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors text-gray-300 hover:text-white font-medium disabled:opacity-50"
          >
            <RefreshCw size={16} className={`inline mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold">
            <Plus size={16} />
            NEW PAYMENT LINK
          </button>
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

      {/* Revenue Chart */}
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">REVENUE TREND</h2>
          <p className="text-gray-400 text-sm mt-1">Monthly revenue performance</p>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-end justify-between gap-4">
            {revenueChart.data.length > 0 ? (
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
                <p className="text-gray-400">No revenue data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">STRIPE TRANSACTIONS</h2>
              <p className="text-gray-400 text-sm mt-1">Real-time payment data from Stripe</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/40 font-medium">
                Live Data
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
                onClick={fetchPaymentData}
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
              <p className="text-gray-400 mb-6">No payments have been processed yet</p>
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
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.session_id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full flex items-center justify-center border border-blue-500/40">
                          <User className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {transaction.customer_email || 'Anonymous'}
                          </p>
                          <p className="text-xs text-gray-400">
                            ID: {transaction.session_id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {transaction.lines.map((line, index) => (
                          <div key={index} className="mb-1">
                            <p className="text-sm font-medium text-white">
                              {line.description || 'Unknown Product'}
                            </p>
                            <p className="text-xs text-gray-400">
                              Qty: {line.quantity} × {stripeService.formatCurrency(line.amount_total / line.quantity, line.currency)}
                            </p>
                          </div>
                        ))}
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
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Payment Links Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-red-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Payment Links</h3>
              <p className="text-sm text-gray-400">Manage your Stripe payment links</p>
            </div>
          </div>
          <div className="space-y-3">
            {paymentLinks.map((link) => (
              <div key={link.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{link.name}</h4>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
                <p className="text-xs text-gray-400">{link.description}</p>
                <p className="text-xs text-gray-500 mt-1 font-mono break-all">{link.url}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-red-500/20">
          <h3 className="font-semibold text-white mb-4">Revenue Insights</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Conversion Rate</span>
                <span className="text-sm font-medium text-white">100%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Revenue Growth</span>
                <span className="text-sm font-medium text-white">+100%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Customer Satisfaction</span>
                <span className="text-sm font-medium text-white">98%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;