import React from 'react';
import {
  Home,
  Users,
  MessageSquare,
  Calendar,
  Package,
  FileText,
  PieChart,
  Mail,
  Settings,
  Phone,
  CreditCard
} from 'lucide-react';

type Page = 'dashboard' | 'leads' | 'communications' | 'calendar' | 'products' | 'invoicing' | 'contracts' | 'reports' | 'marketing' | 'settings';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'dashboard' as Page, icon: Home, label: 'Dashboard' },
    { id: 'leads' as Page, icon: Users, label: 'Leads' },
    { id: 'communications' as Page, icon: MessageSquare, label: 'Communications' },
    { id: 'calendar' as Page, icon: Calendar, label: 'Calendar' },
    { id: 'products' as Page, icon: Package, label: 'Products' },
    { id: 'invoicing' as Page, icon: CreditCard, label: 'Invoicing' },
    { id: 'contracts' as Page, icon: FileText, label: 'Contracts' },
    { id: 'reports' as Page, icon: PieChart, label: 'Reports' },
    { id: 'marketing' as Page, icon: Mail, label: 'Marketing' },
    { id: 'settings' as Page, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="bg-gray-900 w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-white text-xl font-bold">CRM Pro</h1>
        <p className="text-gray-400 text-sm">Customer Management</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;