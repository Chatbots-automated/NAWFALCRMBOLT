import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, Mail, Phone, Save, Key, Globe, Smartphone } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'integrations' | 'billing' | 'security'>('profile');

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'integrations' as const, label: 'Integrations', icon: Shield },
    { id: 'security' as const, label: 'Security', icon: Key },
    { id: 'billing' as const, label: 'Billing', icon: CreditCard }
  ];

  const integrations = [
    {
      name: 'Stripe',
      description: 'Payment processing and invoicing',
      status: 'connected',
      icon: CreditCard,
      color: 'from-blue-500 to-purple-500'
    },
    {
      name: 'Email Provider',
      description: 'SMTP email service integration',
      status: 'disconnected',
      icon: Mail,
      color: 'from-green-500 to-teal-500'
    },
    {
      name: 'SMS Service',
      description: 'Text messaging and notifications',
      status: 'disconnected',
      icon: Smartphone,
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Calendar Sync',
      description: 'Google Calendar integration',
      status: 'connected',
      icon: Globe,
      color: 'from-purple-500 to-pink-500'
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
              COMMAND CONFIG
            </span>
          </h1>
          <p className="text-gray-300 mt-2 font-semibold">CONFIGURE YOUR EMPIRE. OPTIMIZE FOR DOMINATION.</p>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
        <div className="border-b border-white/10">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-400 bg-red-500/10'
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">ELITE PROFILE</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white"
                      defaultValue="Nawfal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white"
                      defaultValue="Filali Fikri"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white"
                      defaultValue="nawfal@filali.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white"
                      defaultValue="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white"
                      defaultValue="FILALI - Elite Coaching"
                    />
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold">
                <Save size={16} />
                SAVE ELITE PROFILE
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">ELITE NOTIFICATIONS</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">Elite Email Alerts</h4>
                      <p className="text-sm text-gray-400">Receive email updates about elite leads and activities</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">Elite SMS Alerts</h4>
                      <p className="text-sm text-gray-400">Get text messages for urgent elite updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">Elite Browser Alerts</h4>
                      <p className="text-sm text-gray-400">Show browser notifications for real-time elite updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">ELITE INTEGRATIONS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {integrations.map((integration, index) => {
                    const Icon = integration.icon;
                    return (
                      <div key={index} className="border border-white/10 rounded-xl p-6 hover:bg-white/5 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${integration.color}`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{integration.name}</h4>
                              <p className="text-sm text-gray-400">{integration.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            integration.status === 'connected' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/40' 
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/40'
                          }`}>
                            {integration.status}
                          </span>
                          <button className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            integration.status === 'connected'
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40'
                              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40'
                          }`}>
                            {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">ELITE SECURITY</h3>
                <div className="space-y-6">
                  <div className="p-4 border border-white/10 rounded-xl">
                    <h4 className="font-medium text-white mb-2">Elite Password</h4>
                    <p className="text-sm text-gray-400 mb-4">Update your password to keep your elite account secure</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="password"
                        placeholder="Current password"
                        className="px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-black/30 text-white placeholder-gray-500"
                      />
                      <input
                        type="password"
                        placeholder="New password"
                        className="px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-black/30 text-white placeholder-gray-500"
                      />
                    </div>
                    <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
                      UPDATE ELITE PASSWORD
                    </button>
                  </div>

                  <div className="p-4 border border-white/10 rounded-xl">
                    <h4 className="font-medium text-white mb-2">Elite Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-400 mb-4">Add an extra layer of elite security to your account</p>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                      ENABLE ELITE 2FA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">ELITE BILLING</h3>
                <div className="bg-gradient-to-r from-red-500/20 to-purple-500/20 border border-red-500/40 rounded-xl p-6 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-white">Elite CRM Plan</h4>
                      <p className="text-sm text-gray-300">$297/month - Next billing: Feb 1, 2024</p>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/25 transition-all font-semibold">
                      UPGRADE ELITE
                    </button>
                  </div>
                </div>
                
                <div className="border border-white/10 rounded-xl p-6">
                  <h4 className="font-semibold text-white mb-4">Elite Payment Method</h4>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                    <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/40">
                      <CreditCard className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">**** **** **** 1234</p>
                      <p className="text-sm text-gray-400">Expires 12/26</p>
                    </div>
                    <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                      UPDATE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;