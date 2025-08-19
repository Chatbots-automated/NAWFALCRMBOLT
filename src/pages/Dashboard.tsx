import React, { useState, useEffect } from 'react';
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
import { calendarService } from '../services/calendarService';
import { clientService } from '../services/clientService';
import { stripeService } from '../services/stripeService';
import { Client } from '../lib/supabase';

const Dashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPipeline: 0,
    activeLeads: 0,
    callsScheduled: 0,
    revenueThisMonth: 0,
    totalRevenue: 0,
    totalTransactions: 0,
    totalClients: 0,
    activeClients: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch clients data
      const { data: clientsData } = await clientService.getClients({ limit: 100 });
      setClients(clientsData);
      
      // Fetch calendar events
      const eventsData = await calendarService.getUpcomingEvents(30);
      setCalendarEvents(eventsData);
      
      // Fetch Stripe data
      let stripeData = { totalRevenue: 0, totalTransactions: 0, totalCustomers: 0 }
      try {
        const catalogData = await stripeService.getAllTransactions()
        stripeData = {
          totalRevenue: catalogData.totalRevenue,
          totalTransactions: catalogData.totalTransactions,
          totalCustomers: catalogData.totalCustomers
        }
      } catch (error) {
        console.error('Failed to fetch Stripe data:', error);
      }
      
      // Calculate this month's revenue from Stripe
      let thisMonthRevenue = 0
      try {
        const thisMonthFilters = stripeService.getThisMonthFilter()
        const thisMonthData = await stripeService.getAllTransactions(thisMonthFilters)
        thisMonthRevenue = thisMonthData.totalRevenue
      } catch (error) {
        console.error('Failed to fetch this month revenue:', error)
      }
      
      // Calculate stats
      const activeLeads = clientsData.filter(client => client.status === 'lead').length;
      const activeClients = clientsData.filter(client => client.status === 'active').length;
      const totalClients = clientsData.length;
      const callsScheduled = eventsData.length;
      
      // Calculate pipeline value (assuming average deal size)
      const averageDealSize = 25000; // $25K average for leads
      const totalPipeline = activeLeads * averageDealSize;
      
      setStats({
        totalPipeline,
        activeLeads,
        callsScheduled,
        revenueThisMonth: thisMonthRevenue,
        totalRevenue: stripeData.totalRevenue,
        totalTransactions: stripeData.totalTransactions,
        totalClients,
        activeClients
      });
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `$${amount}`;
    }
  };

  const metrics = [
    {
      title: 'Total Elite Clients',
      value: loading ? '...' : stats.totalClients.toString(),
      change: '+18.7%',
      trend: 'up',
      icon: Users,
      gradient: 'from-blue-400 to-indigo-600'
    },
    {
      title: 'Total Revenue',
      value: loading ? '...' : formatCurrency(stats.totalRevenue),
      change: `${stats.totalTransactions} sales`,
      trend: 'up',
      icon: DollarSign,
      gradient: 'from-emerald-400 to-green-600'
    },
    {
      title: 'Calls Scheduled',
      value: loading ? '...' : stats.callsScheduled.toString(),
      change: '+12.5%',
      trend: 'up',
      icon: Calendar,
      gradient: 'from-purple-400 to-pink-600'
    },
    {
      title: 'Monthly Revenue',
      value: loading ? '...' : formatCurrency(stats.revenueThisMonth),
      change: '+28.3%',
      trend: 'up',
      icon: Target,
      gradient: 'from-orange-400 to-red-600'
    }
  ];

  // Generate recent activities from real data
  const generateRecentActivities = () => {
    const activities = [];
    
    // Add recent clients as activities
    const recentClients = clients
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 2);
    
    recentClients.forEach(client => {
      const timeAgo = getTimeAgo(new Date(client.created_at));
      activities.push({
        type: 'form',
        title: 'New Elite Lead Added',
        description: `${client.full_name} ${client.company ? `from ${client.company}` : ''} joined the pipeline`,
        time: timeAgo,
        status: 'new',
        avatar: client.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)
      });
    });
    
    // Add calendar events as activities (both upcoming and recently created)
    const sortedEvents = calendarEvents
      .sort((a, b) => new Date(b.createdDateTime || b.start.dateTime).getTime() - new Date(a.createdDateTime || a.start.dateTime).getTime())
      .slice(0, 3);
    
    sortedEvents.forEach(event => {
      const eventDate = new Date(event.start.dateTime);
      const createdDate = new Date(event.createdDateTime || event.start.dateTime);
      const now = new Date();
      
      // Check if event was created recently (within last 24 hours)
      const isRecentlyCreated = (now.getTime() - createdDate.getTime()) < (24 * 60 * 60 * 1000);
      
      if (isRecentlyCreated) {
        // Show as recently created event
        const timeAgo = getTimeAgo(createdDate);
        activities.push({
          type: 'calendar',
          title: 'Elite Event Created',
          description: `${event.subject} scheduled for ${calendarService.formatEventDate(event)} at ${calendarService.formatEventTime(event).split(' - ')[0]}`,
          time: timeAgo,
          status: 'new',
          avatar: event.subject.split(' ').map((w: string) => w[0]).join('').slice(0, 2)
        });
      } else if (eventDate > now) {
        // Show as upcoming event
        const timeUntil = getTimeUntil(eventDate);
        activities.push({
          type: 'calendar',
          title: 'Elite Session Scheduled',
          description: `${event.subject} - ${calendarService.formatEventTime(event)}`,
          time: timeUntil,
          status: 'scheduled',
          avatar: event.subject.split(' ').map((w: string) => w[0]).join('').slice(0, 2)
        });
      }
    });
    
    // Add some system activities
    if (clients.length > 0) {
      activities.push({
        type: 'payment',
        title: 'Elite Network Updated',
        description: `${stats.totalClients} total clients, ${stats.activeClients} active elite members`,
        time: '1 hour ago',
        status: 'completed',
        avatar: 'EP'
      });
    }
    
    return activities.slice(0, 4);
  };
  
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };
  
  const getTimeUntil = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((date.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `in ${diffInMinutes} minutes`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `in ${days} day${days > 1 ? 's' : ''}`;
    }
  };
  
  const recentActivities = generateRecentActivities();

  // Generate upcoming tasks from real data
  const generateUpcomingTasks = () => {
    const tasks = [];
    
    // Add tasks based on new leads
    const newClients = clients.filter(client => {
      const createdDate = new Date(client.created_at);
      const daysSinceCreated = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceCreated <= 1;
    });
    
    if (newClients.length > 0) {
      tasks.push({
        task: `Follow up with ${newClients.length} new elite client${newClients.length > 1 ? 's' : ''}`,
        priority: 'high',
        due: 'Today'
      });
    }
    
    // Add tasks based on upcoming calendar events
    const todayEvents = calendarEvents.filter(event => {
      const eventDate = new Date(event.start.dateTime);
      const today = new Date();
      return eventDate.toDateString() === today.toDateString();
    });
    
    if (todayEvents.length > 0) {
      tasks.push({
        task: `Prepare for ${todayEvents.length} elite session${todayEvents.length > 1 ? 's' : ''} today`,
        priority: 'high',
        due: 'Today'
      });
    }
    
    // Add follow-up tasks for leads
    const followUpClients = clients.filter(client => {
      const createdDate = new Date(client.created_at);
      const daysSinceCreated = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceCreated > 3 && daysSinceCreated < 30;
    });
    
    if (followUpClients.length > 0) {
      tasks.push({
        task: `Check in with ${followUpClients.length} elite client${followUpClients.length > 1 ? 's' : ''}`,
        priority: 'medium',
        due: 'This week'
      });
    }
    
    // Add general tasks
    if (calendarEvents.length > 0) {
      tasks.push({
        task: 'Review upcoming elite sessions',
        priority: 'medium',
        due: 'Tomorrow'
      });
    }
    
    return tasks.slice(0, 4);
  };
  
  const upcomingTasks = generateUpcomingTasks();

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
              {loading ? (
                <div className="p-6 text-center">
                  <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-400">Loading elite activities...</p>
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">No recent activity</p>
                </div>
              ) : (
                recentActivities.map((activity, index) => {
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
                            activity.status === 'new' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                            'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                          }`}>
                            {activity.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
                })
              )}
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
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-400 text-sm">Loading missions...</p>
                </div>
              ) : upcomingTasks.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">All missions complete!</p>
                </div>
              ) : (
                upcomingTasks.map((task, index) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;