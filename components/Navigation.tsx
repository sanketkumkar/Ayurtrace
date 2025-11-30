import React from 'react';
import { UserRole } from '../types';
import { Leaf, User, LogOut, LayoutDashboard, ScrollText } from 'lucide-react';

interface NavigationProps {
  currentUser: { name: string; role: UserRole };
  onLogout: () => void;
  setView: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentUser, onLogout, setView }) => {
  return (
    <nav className="bg-emerald-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand */}
          <div className="flex items-center cursor-pointer" onClick={() => setView('dashboard')}>
            <Leaf className="h-8 w-8 text-emerald-400 mr-2" />
            <span className="font-serif text-xl font-bold tracking-wide">AyurTrace</span>
          </div>
          
          {/* Center Links (Desktop) */}
          <div className="hidden md:flex space-x-4">
             {currentUser.role !== UserRole.CONSUMER && (
                <button onClick={() => setView('dashboard')} className="flex items-center hover:bg-emerald-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                </button>
             )}
             <button onClick={() => setView('ledger')} className="flex items-center hover:bg-emerald-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <ScrollText className="w-4 h-4 mr-2" /> Blockchain Ledger
             </button>
             {currentUser.role !== UserRole.CONSUMER && (
                 <button onClick={() => setView('consumer')} className="flex items-center hover:bg-emerald-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                 Consumer View
                 </button>
             )}
          </div>

          {/* User Profile / Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-sm font-medium text-white">{currentUser.name}</span>
                <span className="text-xs text-emerald-300 font-mono">{currentUser.role.replace('_', ' ')}</span>
            </div>
            
            <button 
                onClick={onLogout}
                className="bg-emerald-800 hover:bg-red-900 p-2 rounded-full transition-colors group"
                title="Logout"
            >
                <LogOut className="h-4 w-4 text-emerald-200 group-hover:text-red-200" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;