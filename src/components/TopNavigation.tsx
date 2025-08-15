import React from 'react';
import {
  Menu,
  Search,
  Bell,
  User,
  Zap,
  BarChart3,
  MessageCircle,
  Calendar,
  Package,
  CreditCard,
  FileText,
  TrendingUp,
  Settings,
  Users
} from 'lucide-react';

type Page = 'dashboard' | 'communications' | 'calendar' | 'products' | 'payments' | 'contracts' | 'analytics' | 'settings' | 'clients';

interface TopNavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onMenuClick: () => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ currentPage, onPageChange, onMenuClick }) => {
  const navItems = [
    { id: 'dashboard' as Page, icon: Zap, label: 'Command' },
    { id: 'communications' as Page, icon: MessageCircle, label: 'Connect' },
    { id: 'calendar' as Page, icon: Calendar, label: 'Schedule' },
    { id: 'clients' as Page, icon: Users, label: 'Clients' },
    { id: 'products' as Page, icon: Package, label: 'Catalog' },
    { id: 'payments' as Page, icon: CreditCard, label: 'Revenue' },
    { id: 'contracts' as Page, icon: FileText, label: 'Deals' },
    { id: 'analytics' as Page, icon: TrendingUp, label: 'Insights' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-red-500/30">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors text-white"
            >
              <Menu size={20} className="text-white" />
            </button>
          </div>

          {/* Center navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.slice(0, 3).map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-red-500/20 to-purple-500/20 text-red-400 shadow-sm border border-red-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            {/* FILALI Logo */}
            <div className="mx-6 flex items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative bg-black/40 backdrop-blur-sm border border-red-500/30 rounded-2xl p-2 hover:border-red-500/50 transition-all duration-300">
                  <img 
                    src="https://filaligroup.com/sizenewfilali.png" 
                    alt="FILALI EMPIRE" 
                    className="h-8 w-auto filter brightness-110 hover:brightness-125 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
            
            {navItems.slice(3).map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-red-500/20 to-purple-500/20 text-red-400 shadow-sm border border-red-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Quick search..."
                className="pl-10 pr-4 py-2 w-64 bg-black/30 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-black/50 transition-all text-white placeholder-gray-400"
              />
            </div>
            
            <button className="relative p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
              <Bell size={20} className="text-gray-300" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            
            <button 
              onClick={() => onPageChange('settings')}
              className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;