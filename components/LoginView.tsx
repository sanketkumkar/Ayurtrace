import React, { useState } from 'react';
import { UserRole } from '../types';
import { Leaf, Lock, ArrowRight } from 'lucide-react';
import { MOCK_USERS } from '../constants';

interface LoginViewProps {
  onLogin: (user: any) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.FARMER);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.role === selectedRole);
      if (user) {
        onLogin(user);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-emerald-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')]"></div>
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10">
        <div className="bg-emerald-800 p-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-700 rounded-full mb-4 shadow-inner">
            <Leaf className="h-10 w-10 text-emerald-100" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-1">AyurTrace</h1>
          <p className="text-emerald-200 text-sm">Blockchain Botanical Traceability</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Select Role</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(UserRole).filter(r => r !== UserRole.ADMIN).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`text-xs p-2 rounded border transition-colors ${
                      selectedRole === role 
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-800 font-bold' 
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {role.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter 'demo'"
                  className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
              </div>
              <p className="text-xs text-stone-400 mt-1">Hint: Any password works for demo</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-800 hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all"
            >
              {loading ? 'Authenticating...' : (
                <>
                  Access Portal <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-stone-500">
              Secured by Permissioned Ledger Technology
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;