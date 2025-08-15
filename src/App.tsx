import React, { useState } from 'react';
import Login from './components/Login';
import TopNavigation from './components/TopNavigation';
import SidePanel from './components/SidePanel';
import Dashboard from './pages/Dashboard';
import Communications from './pages/Communications';
import Calendar from './pages/Calendar';
import Products from './pages/Products';
import Payments from './pages/Payments';
import Contracts from './pages/Contracts';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Clients from './pages/Clients';

type Page = 'dashboard' | 'communications' | 'calendar' | 'products' | 'payments' | 'contracts' | 'analytics' | 'settings' | 'clients';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'communications':
        return <Communications />;
      case 'calendar':
        return <Calendar />;
      case 'products':
        return <Products />;
      case 'payments':
        return <Payments />;
      case 'contracts':
        return <Contracts />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'clients':
        return <Clients />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <TopNavigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        onMenuClick={() => setSidePanelOpen(true)}
      />
      
      <SidePanel 
        isOpen={sidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      <main className="pt-16">
        <div className="w-full px-6 py-8 text-white bg-gradient-to-br from-red-500/10 via-purple-500/10 to-blue-500/10 min-h-screen">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;