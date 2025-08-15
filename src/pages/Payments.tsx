import React from 'react';
import { CreditCard, Plus, Eye, Download, Send, TrendingUp, DollarSign, Clock, CheckCircle, AlertTriangle, Zap } from 'lucide-react';

const Payments: React.FC = () => {
  const invoices = [
    {
      id: 'INV-2024-001', 
      client: 'John Smith - Elite Coaching',
      amount: '$15,000',
      status: 'paid',
      dueDate: '2024-01-15',
      issueDate: '2024-01-01',
      paymentDate: '2024-01-12',
      program: 'Elite Transformation Program'
    },
    {
      id: 'INV-2024-002',
      client: 'Sarah Wilson - Strategy Program',
      amount: '$25,000',
      status: 'pending',
      dueDate: '2024-01-25',
      issueDate: '2024-01-10',
      paymentDate: null,
      program: 'Elite Strategy Sessions'
    },
    {
      id: 'INV-2024-003',
      client: 'Mike Davis - Elite Transformation',
      amount: '$50,000',
      status: 'overdue',
      dueDate: '2024-01-05',
      issueDate: '2023-12-20',
      paymentDate: null,
      program: 'Complete Elite Program'
    },
    {
      id: 'INV-2024-004',
      client: 'Lisa Brown - Leadership Program',
      amount: '$35,000',
      status: 'draft',
      dueDate: '2024-02-01',
      issueDate: '2024-01-15',
      paymentDate: null,
      program: 'Elite Leadership Intensive'
    }
  ];

  const statusConfig = {
    paid: { 
      color: 'bg-green-500/20 text-green-400 border-green-500/40', 
      icon: CheckCircle,
      bgColor: 'bg-green-500/10'
    },
    pending: { 
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40', 
      icon: Clock,
      bgColor: 'bg-yellow-500/10'
    },
    overdue: { 
      color: 'bg-red-500/20 text-red-400 border-red-500/40', 
      icon: AlertTriangle,
      bgColor: 'bg-red-500/10'
    },
    draft: { 
      color: 'bg-gray-500/20 text-gray-400 border-gray-500/40', 
      icon: Clock,
      bgColor: 'bg-gray-500/10'
    }
  };

  const revenueMetrics = [
    {
      title: 'Total Revenue',
      value: '$93,000',
      change: '+45.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-emerald-400 to-green-600',
      bgColor: 'bg-emerald-500/20',
      iconBg: 'bg-emerald-500'
    },
    {
      title: 'Pending Payments',
      value: '$23,000',
      change: '+12.8%',
      trend: 'up',
      icon: Clock,
      color: 'from-yellow-400 to-orange-600',
      bgColor: 'bg-yellow-500/20',
      iconBg: 'bg-yellow-500'
    },
    {
      title: 'Overdue Amount',
      value: '$8,000',
      change: '-8.5%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'from-red-400 to-pink-600',
      bgColor: 'bg-red-500/20',
      iconBg: 'bg-red-500'
    },
    {
      title: 'This Month',
      value: '$38,000',
      change: '+32.1%',
      trend: 'up',
      icon: CreditCard,
      color: 'from-blue-400 to-indigo-600',
      bgColor: 'bg-blue-500/20',
      iconBg: 'bg-blue-500'
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
          <p className="text-gray-300 mt-2">Stripe payments, invoicing, and elite financial tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors text-gray-300 hover:text-white font-medium">
            <Download size={16} className="inline mr-2" />
            Export Data
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold">
            <Plus size={16} />
            DEPLOY INVOICE
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
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    metric.trend === 'up' ? 'text-green-400 bg-green-500/20 border border-green-500/40' : 'text-red-400 bg-red-500/20 border border-red-500/40'
                  }`}>
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

      {/* Invoice Management */}
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">ELITE INVOICE MANAGEMENT</h2>
              <p className="text-gray-400 text-sm mt-1">Track and manage all your elite invoices</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded-lg border border-red-500/40 font-medium">All</button>
              <button className="px-3 py-1 text-sm border border-red-500/30 rounded-lg hover:bg-red-500/10 text-gray-300 hover:text-white transition-colors">Paid</button>
              <button className="px-3 py-1 text-sm border border-red-500/30 rounded-lg hover:bg-red-500/10 text-gray-300 hover:text-white transition-colors">Pending</button>
              <button className="px-3 py-1 text-sm border border-red-500/30 rounded-lg hover:bg-red-500/10 text-gray-300 hover:text-white transition-colors">Overdue</button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Invoice</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Due Date</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {invoices.map((invoice) => {
                const StatusIcon = statusConfig[invoice.status as keyof typeof statusConfig].icon;
                return (
                  <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">{invoice.id}</p>
                        <p className="text-xs text-gray-400">Issued: {invoice.issueDate}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">{invoice.client}</p>
                        <p className="text-xs text-gray-400">{invoice.program}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white">{invoice.amount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${statusConfig[invoice.status as keyof typeof statusConfig].color}`}>
                          <StatusIcon size={12} />
                          {invoice.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-white">{invoice.dueDate}</p>
                        {invoice.paymentDate && (
                          <p className="text-xs text-green-600">Paid: {invoice.paymentDate}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-400 rounded-lg hover:bg-green-500/10 transition-colors">
                          <Download size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-purple-400 rounded-lg hover:bg-purple-500/10 transition-colors">
                          <Send size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-red-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Elite Actions</h3>
              <p className="text-sm text-gray-400">Quick revenue tasks</p>
            </div>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors text-left text-gray-300">
              <Plus className="w-5 h-5" />
              <span className="font-medium">Create Elite Invoice</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-500/10 hover:text-blue-400 transition-colors text-left text-gray-300">
              <Send className="w-5 h-5" />
              <span className="font-medium">Send Payment Reminder</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-green-500/10 hover:text-green-400 transition-colors text-left text-gray-300">
              <Download className="w-5 h-5" />
              <span className="font-medium">Export Revenue Report</span>
            </button>
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-red-500/20">
          <h3 className="font-semibold text-white mb-4">Payment Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-500/20 rounded-lg border border-blue-500/40">
              <div className="p-2 bg-blue-600 rounded-lg">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Stripe</p>
                <p className="text-sm text-gray-300">Connected & Active</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-red-500/20">
          <h3 className="font-semibold text-white mb-4">Revenue Insights</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Elite Programs</span>
                <span className="text-sm font-medium text-white">85%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-500 to-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Strategy Sessions</span>
                <span className="text-sm font-medium text-white">65%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Leadership Programs</span>
                <span className="text-sm font-medium text-white">45%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;