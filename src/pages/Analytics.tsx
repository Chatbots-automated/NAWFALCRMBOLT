import React from 'react';
import { BarChart, TrendingUp, DollarSign, Users, Calendar, Download, Filter, Eye } from 'lucide-react';

const Analytics: React.FC = () => {
  const kpiMetrics = [
    {
      title: 'Elite Revenue',
      value: '$1,247,500',
      change: '+45.2%',
      period: 'vs last month',
      icon: DollarSign,
      color: 'from-emerald-400 to-green-600'
    },
    {
      title: 'Elite Clients',
      value: '89',
      change: '+28.7%',
      period: 'vs last month',
      icon: Users,
      color: 'from-blue-400 to-indigo-600'
    },
    {
      title: 'Elite Conversion',
      value: '67.8%',
      change: '+12.4%',
      period: 'vs last month',
      icon: TrendingUp,
      color: 'from-purple-400 to-pink-600'
    },
    {
      title: 'Avg Program Value',
      value: '$35,750',
      change: '+18.3%',
      period: 'vs last month',
      icon: BarChart,
      color: 'from-orange-400 to-red-600'
    }
  ];

  const leadSources = [
    { source: 'Website Forms', leads: 45, percentage: 35, color: 'bg-blue-500' },
    { source: 'Elite Referrals', leads: 32, percentage: 25, color: 'bg-green-500' },
    { source: 'Cal.com Bookings', leads: 28, percentage: 22, color: 'bg-purple-500' },
    { source: 'Direct Outreach', leads: 23, percentage: 18, color: 'bg-orange-500' }
  ];

  const salesData = [
    { month: 'Jan', revenue: 125000, deals: 8 },
    { month: 'Feb', revenue: 145000, deals: 12 },
    { month: 'Mar', revenue: 135000, deals: 10 },
    { month: 'Apr', revenue: 175000, deals: 15 },
    { month: 'May', revenue: 165000, deals: 13 },
    { month: 'Jun', revenue: 195000, deals: 18 }
  ];

  const topPerformers = [
    { name: 'Elite Program A', deals: 23, revenue: '$575K', avatar: 'EP' },
    { name: 'Strategy Sessions', deals: 45, revenue: '$225K', avatar: 'SS' },
    { name: 'Leadership Intensive', deals: 12, revenue: '$180K', avatar: 'LI' },
    { name: 'Mastermind Access', deals: 8, revenue: '$200K', avatar: 'MA' }
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
            <button className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded-lg border border-red-500/40">This Month</button>
            <button className="px-3 py-1 text-sm border border-red-500/30 rounded-lg hover:bg-red-500/10 text-gray-300 hover:text-white">Last Month</button>
            <button className="px-3 py-1 text-sm border border-red-500/30 rounded-lg hover:bg-red-500/10 text-gray-300 hover:text-white">This Year</button>
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
                  <span className="text-sm font-medium text-green-400">{metric.change}</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">{metric.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                  <p className="text-xs text-gray-300 mt-1">{metric.period}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">ELITE REVENUE TREND</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10">
                  <Eye size={16} />
                </button>
                <select className="text-sm border border-red-500/30 rounded-lg px-3 py-1 bg-black/30 text-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option>Last 6 months</option>
                  <option>Last 12 months</option>
                  <option>This year</option>
                </select>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-end justify-between gap-4">
              {salesData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-white/10 rounded-t-lg relative overflow-hidden group">
                    <div 
                      className="bg-gradient-to-t from-red-500 to-purple-500 rounded-t-lg transition-all duration-500 hover:from-red-600 hover:to-purple-600"
                      style={{ height: `${(data.revenue / 200000) * 200}px` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium">${data.revenue / 1000}K</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">ELITE LEAD SOURCES</h2>
            <p className="text-gray-400 text-sm mt-1">Where your elite clients come from</p>
          </div>
          <div className="p-6 space-y-4">
            {leadSources.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{source.source}</span>
                  <span className="text-sm text-gray-400">{source.leads} leads</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${source.color}`}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400">{source.percentage}% of total</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">TOP ELITE PROGRAMS</h2>
          <p className="text-gray-400 text-sm mt-1">Your highest performing coaching programs</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topPerformers.map((performer, index) => (
              <div key={index} className="text-center p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3 border border-red-500/40">
                  {performer.avatar}
                </div>
                <h3 className="font-semibold text-white mb-1">{performer.name}</h3>
                <p className="text-2xl font-bold text-red-400 mb-1">{performer.deals}</p>
                <p className="text-sm text-gray-400">clients enrolled</p>
                <p className="text-lg font-semibold text-green-400 mt-2">{performer.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;