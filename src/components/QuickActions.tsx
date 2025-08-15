import React from 'react';
import { Plus, Mail, Phone, Calendar, FileText } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    { icon: Plus, label: 'Add Lead', color: 'blue' },
    { icon: Mail, label: 'Send Email', color: 'green' },
    { icon: Phone, label: 'Make Call', color: 'purple' },
    { icon: Calendar, label: 'Schedule Meeting', color: 'orange' },
    { icon: FileText, label: 'Create Quote', color: 'indigo' }
  ];

  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
    indigo: 'bg-indigo-600 hover:bg-indigo-700'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium transition-colors duration-200 ${
                colorClasses[action.color as keyof typeof colorClasses]
              }`}
            >
              <Icon size={20} />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;