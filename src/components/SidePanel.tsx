import React from 'react';
import {
  X,
  Zap,
  BarChart3,
  MessageCircle,
  Calendar,
  Package,
  CreditCard,
  FileText,
  TrendingUp,
  Settings,
  Plus,
  Users as UsersIcon,
  Phone,
  Mail,
  Users
} from 'lucide-react';

type Page = 'dashboard' | 'communications' | 'calendar' | 'products' | 'payments' | 'contracts' | 'analytics' | 'settings' | 'clients';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, currentPage, onPageChange }) => {
  const navItems = [
    { id: 'dashboard' as Page, icon: Zap, label: 'Command Center', color: 'from-blue-500 to-purple-500' },
    { id: 'communications' as Page, icon: MessageCircle, label: 'Communications', color: 'from-orange-500 to-red-500' },
    { id: 'calendar' as Page, icon: Calendar, label: 'Calendar', color: 'from-purple-500 to-pink-500' },
    { id: 'clients' as Page, icon: Users, label: 'Elite Clients', color: 'from-green-500 to-teal-500' },
    { id: 'products' as Page, icon: Package, label: 'Product Catalog', color: 'from-indigo-500 to-blue-500' },
    { id: 'payments' as Page, icon: CreditCard, label: 'Revenue Hub', color: 'from-emerald-500 to-green-500' },
    { id: 'contracts' as Page, icon: FileText, label: 'Deal Management', color: 'from-yellow-500 to-orange-500' },
    { id: 'analytics' as Page, icon: TrendingUp, label: 'Business Insights', color: 'from-cyan-500 to-blue-500' },
    { id: 'settings' as Page, icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-500' },
  ];

  const quickActions = [
    { icon: Plus, label: 'New Lead', action: () => {} },
    { icon: Phone, label: 'Make Call', action: () => {} },
    { icon: Mail, label: 'Send Email', action: () => {} },
    { icon: UsersIcon, label: 'Team Meeting', action: () => {} },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 left-0 h-full w-80 bg-gray-900 border-r border-red-500/20 shadow-2xl z-50 transform transition-transform duration-300">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-white">FILALI EMPIRE</h2>
                <p className="text-sm text-gray-400 font-semibold">CONQUER. DOMINATE. WIN.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-red-500/30 to-purple-500/30 text-white shadow-lg border border-red-500/40'
                    : 'hover:bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                <div className={`p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white/30' 
                    : 'bg-white/10 group-hover:bg-white/20'
                }`}>
                  <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                </div>
                <span className="font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/20">
          <div className="space-y-2">
            <p className="text-xs font-bold text-red-400 uppercase tracking-wide">ELITE ACTIONS</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/30 hover:text-red-300 transition-colors text-sm text-gray-300 border border-red-500/20"
                  >
                    <Icon size={14} />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidePanel;