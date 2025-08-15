import React from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  Zap
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const metrics = [
    {
      title: 'Total Pipeline Value',
      value: '$1.2M',
      change: '+34.2%',
      trend: 'up',
      icon: DollarSign,
      gradient: 'from-emerald-400 to-green-600'
    },
    {
      title: 'Active Leads',
      value: '89',
      change: '+18.7%',
      trend: 'up',
      icon: Users,
      gradient: 'from-blue-400 to-indigo-600'
    },
    {
      title: 'Calls Scheduled',
      value: '23',
      change: '+12.5%',
      trend: 'up',
      icon: Calendar,
      gradient: 'from-purple-400 to-pink-600'
    },
    {
      title: 'Revenue This Month',
      value: '$45K',
      change: '+28.3%',
      trend: 'up',
      icon: DollarSign,
      gradient: 'from-orange-400 to-red-600'
    }
  ];

  const recentActivities = [
    {
      type: 'form',
      title: 'New Lead from Website',
      description: 'John Smith filled out coaching inquiry form',
      time: '12 minutes ago',
      status: 'new',
      avatar: 'JS'
    },
    {
      type: 'call',
      title: 'Strategy Call Completed',
      description: 'Elite coaching session with Maria Garcia',
      time: '1 hour ago',
      status: 'completed',
      avatar: 'MG'
    },
    {
      type: 'calendar',
      title: 'Call Scheduled via Cal.com',
      description: 'Discovery call with David Chen tomorrow 2PM',
      time: '2 hours ago',
      status: 'scheduled',
      avatar: 'DC'
    },
    {
      type: 'payment',
      title: 'Payment Received - $5K',
      description: 'Elite coaching program payment via Stripe',
      time: '4 hours ago',
      status: 'paid',
      avatar: 'EP'
    }
  ];

  const upcomingTasks = [
    { task: 'Call new website leads', priority: 'high', due: 'Today 2:00 PM' },
    { task: 'Send follow-up emails to prospects', priority: 'high', due: 'Today 4:00 PM' },
    { task: 'Review Cal.com bookings', priority: 'medium', due: 'Tomorrow' },
    { task: 'Create invoices for this week', priority: 'medium', due: 'Friday' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            ELITE BUSINESS
            <span className="block text-3xl bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
              COMMAND CENTER
            </span>
          </h1>
          <p className="text-gray-300 mt-2">Discipline, Leadership, and High-Performance Execution.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold">
            <Zap size={16} />
            ELITE ACTION
          </button>
          <button className="px-6 py-3 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors text-gray-300 hover:text-white font-medium">
            Export Data
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          
          return (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10" 
                   style={{ background: `linear-gradient(135deg, ${metric.gradient.split(' ')[1]}, ${metric.gradient.split(' ')[3]})` }} />
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-red-500/20 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.gradient}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    metric.trend === 'up' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    <TrendIcon size={12} />
                    {metric.change}
                  </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">ELITE ACTIVITY STREAM</h2>
              <p className="text-gray-400 text-sm mt-1">Real-time business updates</p>
            </div>
            <div className="divide-y divide-white/10">
              {recentActivities.map((activity, index) => {
                const getActivityIcon = () => {
                  switch (activity.type) {
                    case 'call': return Phone;
                    case 'form': return Users;
                    case 'calendar': return Calendar;
                    case 'payment': return DollarSign;
                    default: return MessageSquare;
                  }
                };
                
                const ActivityIcon = getActivityIcon();
                
                return (
                  <div key={index} className="p-6 hover:bg-white/5 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500/30 to-purple-500/30 rounded-xl flex items-center justify-center relative border border-red-500/40">
                        <span className="text-sm font-bold text-white">{activity.avatar}</span>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center shadow-sm border border-red-500/30">
                          <ActivityIcon size={12} className="text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-white">{activity.title}</h3>
                          <span className="text-xs text-gray-400">{activity.time}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{activity.description}</p>
                        <div className="mt-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            activity.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/40' :
                            activity.status === 'sent' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                            activity.status === 'scheduled' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' :
                            'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                          }`}>
                            {activity.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div>
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">MISSION OBJECTIVES</h2>
              <p className="text-gray-400 text-sm mt-1 font-semibold">CRUSH THESE TARGETS</p>
            </div>
            <div className="p-6 space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                    task.priority === 'high' ? 'bg-red-400' :
                    task.priority === 'medium' ? 'bg-yellow-400' :
                    'bg-green-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{task.task}</p>
                    <p className="text-xs text-gray-400 mt-1">{task.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;