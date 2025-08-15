import React from 'react';
import { Mail, Send, Users, TrendingUp, Plus, Eye } from 'lucide-react';

const Marketing: React.FC = () => {
  const campaigns = [
    {
      id: 1,
      name: 'Product Launch Email',
      type: 'Email',
      status: 'active',
      sent: 1250,
      opened: 425,
      clicked: 89,
      date: '2024-01-10'
    },
    {
      id: 2,
      name: 'Follow-up Sequence',
      type: 'Email',
      status: 'draft',
      sent: 0,
      opened: 0,
      clicked: 0,
      date: '2024-01-15'
    },
    {
      id: 3,
      name: 'Weekly Newsletter',
      type: 'Email',
      status: 'scheduled',
      sent: 0,
      opened: 0,
      clicked: 0,
      date: '2024-01-20'
    }
  ];

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    scheduled: 'bg-blue-100 text-blue-800'
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketing Campaigns</h1>
          <p className="text-gray-600">Create and manage your marketing campaigns</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Total Campaigns</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
          <p className="text-sm text-blue-600 mt-1">1 active</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Send className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Emails Sent</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">1,250</p>
          <p className="text-sm text-green-600 mt-1">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Open Rate</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">34%</p>
          <p className="text-sm text-purple-600 mt-1">+5% vs last month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Click Rate</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">7.1%</p>
          <p className="text-sm text-orange-600 mt-1">+1.2% vs last month</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Campaigns</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Opened</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Clicked</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{campaign.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{campaign.type}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[campaign.status as keyof typeof statusColors]}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{campaign.sent}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{campaign.opened}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{campaign.clicked}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{campaign.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Marketing;