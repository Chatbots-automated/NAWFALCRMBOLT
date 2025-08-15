import React from 'react';
import { CreditCard, Plus, Eye, Download, Send } from 'lucide-react';

const Invoicing: React.FC = () => {
  const invoices = [
    {
      id: 'INV-001',
      client: 'Tech Corp',
      amount: '$25,000',
      status: 'paid',
      dueDate: '2024-01-15',
      issueDate: '2024-01-01'
    },
    {
      id: 'INV-002',
      client: 'Design Studio',
      amount: '$15,000',
      status: 'pending',
      dueDate: '2024-01-20',
      issueDate: '2024-01-05'
    },
    {
      id: 'INV-003',
      client: 'Startup Inc',
      amount: '$8,000',
      status: 'overdue',
      dueDate: '2024-01-10',
      issueDate: '2023-12-25'
    }
  ];

  const statusColors = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    overdue: 'bg-red-100 text-red-800'
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoicing & Payments</h1>
          <p className="text-gray-600">Manage invoices and track payments</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">$48,000</p>
          <p className="text-sm text-green-600 mt-1">+12% from last month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <CreditCard className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Pending</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">$15,000</p>
          <p className="text-sm text-gray-500 mt-1">1 invoice</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <CreditCard className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Overdue</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">$8,000</p>
          <p className="text-sm text-red-600 mt-1">Action required</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{invoice.client}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[invoice.status as keyof typeof statusColors]}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{invoice.dueDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50">
                        <Download size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50">
                        <Send size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoicing;