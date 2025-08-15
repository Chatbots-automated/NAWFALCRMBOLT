import React from 'react';
import { BarChart, TrendingUp, DollarSign, Users, Calendar, Download } from 'lucide-react';

const Reports: React.FC = () => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$127,500',
      change: '+23%',
      period: 'vs last month',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'New Leads',
      value: '234',
      change: '+12%',
      period: 'vs last month',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Conversion Rate',
      value: '34.2%',
      change: '+5.4%',
      period: 'vs last month',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Meetings Booked',
      value: '89',
      change: '-2%',
      period: 'vs last month',
      icon: Calendar,
      color: 'orange'
    }
  ];

  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Download size={20} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[metric.color as keyof typeof colorClasses]}`}>
                  <Icon size={24} />
                </div>
                <span className={`text-sm font-medium ${
                  metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div>
                <h3 className="text-gray-600 text-sm font-medium">{metric.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <p className="text-xs text-gray-500 mt-1">{metric.period}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Trend</h2>
            <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>This year</option>
            </select>
          </div>
          <div className="flex justify-center items-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <BarChart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Revenue Chart</h3>
              <p className="mt-2 text-gray-500">Interactive chart component would go here</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Lead Sources</h2>
            <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>This month</option>
              <option>Last month</option>
              <option>This quarter</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {[
              { source: 'Website', leads: 45, percentage: 35 },
              { source: 'Referrals', leads: 32, percentage: 25 },
              { source: 'Social Media', leads: 28, percentage: 22 },
              { source: 'Cold Outreach', leads: 23, percentage: 18 }
            ].map((item) => (
              <div key={item.source} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{item.source}</span>
                    <span className="text-sm text-gray-600">{item.leads} leads</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;