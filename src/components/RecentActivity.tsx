import React from 'react';
import { Mail, Phone, Calendar, FileText, DollarSign } from 'lucide-react';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'email',
      title: 'Email sent to John Doe',
      description: 'Follow-up email regarding proposal',
      time: '2 minutes ago',
      icon: Mail,
      color: 'blue'
    },
    {
      id: 2,
      type: 'call',
      title: 'Call with Sarah Johnson',
      description: 'Discussed pricing options',
      time: '15 minutes ago',
      icon: Phone,
      color: 'green'
    },
    {
      id: 3,
      type: 'meeting',
      title: 'Meeting scheduled',
      description: 'Product demo with ABC Corp',
      time: '1 hour ago',
      icon: Calendar,
      color: 'purple'
    },
    {
      id: 4,
      type: 'contract',
      title: 'Contract signed',
      description: 'XYZ Company - $15,000',
      time: '3 hours ago',
      icon: FileText,
      color: 'orange'
    },
    {
      id: 5,
      type: 'payment',
      title: 'Payment received',
      description: 'Invoice #1234 - $5,200',
      time: '5 hours ago',
      icon: DollarSign,
      color: 'green'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${colorClasses[activity.color as keyof typeof colorClasses]}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;