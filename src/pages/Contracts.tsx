import React from 'react';
import { FileText, Plus, Download, Edit, CheckCircle, Clock, AlertCircle, Users } from 'lucide-react';

const Contracts: React.FC = () => {
  const contracts = [
    {
      id: 1,
      title: 'Elite Transformation Program',
      client: 'John Smith - CEO',
      value: '$50,000',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      type: 'coaching',
      progress: 85,
      nextMilestone: 'Elite Review'
    },
    {
      id: 2,
      title: 'Elite Strategy Sessions',
      client: 'Sarah Wilson - Entrepreneur',
      value: '$25,000',
      status: 'pending',
      startDate: '2024-02-01',
      endDate: '2024-08-01',
      type: 'strategy',
      progress: 0,
      nextMilestone: 'Contract Signing'
    },
    {
      id: 3,
      title: 'Elite Leadership Intensive',
      client: 'Mike Davis - Veteran',
      value: '$15,000',
      status: 'completed',
      startDate: '2023-10-01',
      endDate: '2024-01-01',
      type: 'intensive',
      progress: 100,
      nextMilestone: 'Elite Graduation'
    },
    {
      id: 4,
      title: 'Elite Mastermind Access',
      client: 'Lisa Brown - Leader',
      value: '$25,000',
      status: 'draft',
      startDate: '2024-03-01',
      endDate: '2024-09-01',
      type: 'mastermind',
      progress: 0,
      nextMilestone: 'Legal Review'
    }
  ];

  const statusConfig = {
    active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    draft: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
  };

  const contractMetrics = [
    {
      title: 'Active Programs',
      value: '1',
      subtitle: '$50K value',
      icon: CheckCircle,
      color: 'from-green-400 to-emerald-600'
    },
    {
      title: 'Pending Enrollment',
      value: '1',
      subtitle: '$25K value',
      icon: Clock,
      color: 'from-yellow-400 to-orange-600'
    },
    {
      title: 'Total Program Value',
      value: '$115K',
      subtitle: 'This year',
      icon: FileText,
      color: 'from-blue-400 to-indigo-600'
    },
    {
      title: 'Elite Success Rate',
      value: '98%',
      subtitle: 'Client transformation',
      icon: Users,
      color: 'from-purple-400 to-pink-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            FILALI EMPIRE
            <span className="block text-4xl bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent font-black">
              BATTLE CONTRACTS
            </span>
          </h1>
          <p className="text-gray-300 mt-2 font-semibold">FORGE ALLIANCES. SECURE VICTORIES.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors text-gray-300 hover:text-white font-medium">
            <Download size={16} />
            Export All
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold">
            <Plus size={16} />
            NEW PROGRAM
          </button>
        </div>
      </div>

      {/* Contract Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contractMetrics.map((metric, index) => {
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
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">{metric.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                  <p className="text-sm text-gray-300 mt-1">{metric.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contracts List */}
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">ELITE PROGRAM PORTFOLIO</h2>
              <p className="text-gray-400 text-sm mt-1">Manage all your coaching agreements</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded-lg border border-red-500/40">All</button>
              <button className="px-3 py-1 text-sm border border-red-500/30 rounded-lg hover:bg-red-500/10 text-gray-300 hover:text-white">Active</button>
              <button className="px-3 py-1 text-sm border border-red-500/30 rounded-lg hover:bg-red-500/10 text-gray-300 hover:text-white">Pending</button>
              <button className="px-3 py-1 text-sm border border-red-500/30 rounded-lg hover:bg-red-500/10 text-gray-300 hover:text-white">Draft</button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-white/10">
          {contracts.map((contract) => {
            const StatusIcon = statusConfig[contract.status as keyof typeof statusConfig].icon;
            return (
              <div key={contract.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-gradient-to-br from-red-500/30 to-purple-500/30 rounded-xl border border-red-500/40">
                      <FileText className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{contract.title}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusConfig[contract.status as keyof typeof statusConfig].color}`}>
                          <StatusIcon size={12} />
                          {contract.status}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{contract.client}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <span>{contract.startDate} - {contract.endDate}</span>
                        <span className="capitalize">{contract.type}</span>
                        <span>Next: {contract.nextMilestone}</span>
                      </div>
                      {contract.progress > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-400">Progress</span>
                            <span className="font-medium text-white">{contract.progress}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-red-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${contract.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    <p className="text-2xl font-bold text-white mb-2">{contract.value}</p>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-400 rounded-lg hover:bg-green-500/10 transition-colors">
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Contracts;