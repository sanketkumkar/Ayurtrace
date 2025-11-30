import React, { useState, useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import CollectionForm from './components/CollectionForm';
import LabForm from './components/LabForm';
import ConsumerView from './components/ConsumerView';
import LedgerView from './components/LedgerView';
import LoginView from './components/LoginView';
import { UserRole, Block, TransactionData } from './types';
import { INITIAL_GENESIS_BLOCK } from './constants';
import { createBlock, validateTransaction } from './services/blockchainService';
import { AlertOctagon } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; role: UserRole } | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [chain, setChain] = useState<Block[]>([INITIAL_GENESIS_BLOCK]);
  const [isMining, setIsMining] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Keep a ref to the chain to avoid stale closures in setTimeout
  const chainRef = useRef<Block[]>(chain);

  useEffect(() => {
    chainRef.current = chain;
  }, [chain]);

  const handleLogin = (user: { id: string; name: string; role: UserRole }) => {
    setCurrentUser(user);
    // Reset view based on role
    setCurrentView(user.role === UserRole.CONSUMER ? 'consumer' : 'dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  // Handler to add transaction to blockchain
  const handleAddTransaction = async (data: TransactionData) => {
    setIsMining(true);
    setErrorMsg(null);

    // 1. Smart Contract Validation
    const validation = validateTransaction(data);
    if (!validation.valid) {
      setErrorMsg(validation.error || "Transaction invalid");
      setIsMining(false);
      return;
    }

    // 2. Simulate Network Latency & Consensus
    setTimeout(async () => {
      try {
        const currentChain = chainRef.current;
        const lastBlock = currentChain[currentChain.length - 1];
        const newBlock = await createBlock(lastBlock, data);
        
        setChain(prev => [...prev, newBlock]);
        
        // Auto switch view for demo flow (optional, but keeping alert for feedback)
        if (currentUser?.role === UserRole.LAB_TECHNICIAN) {
            alert("Quality Certificate issued!");
        }
      } catch (e) {
        console.error("Mining error:", e);
        setErrorMsg("Mining failed.");
      } finally {
        setIsMining(false);
      }
    }, 1500);
  };

  // Render content based on view/role
  const renderContent = () => {
    if (!currentUser) return null; // Should be handled by main return

    if (currentView === 'ledger') return <LedgerView chain={chain} />;
    
    // Explicit consumer view
    if (currentView === 'consumer') return <ConsumerView chain={chain} />;

    switch (currentUser.role) {
      case UserRole.FARMER:
        return (
          <div className="space-y-6">
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-4">
               <p className="text-emerald-700">Welcome, <strong>{currentUser.name}</strong>. Provide GPS-tagged harvest data to ensure fair trade verification.</p>
            </div>
            <CollectionForm user={currentUser} onSubmit={handleAddTransaction} isLoading={isMining} />
          </div>
        );
      case UserRole.LAB_TECHNICIAN:
        return (
             <div className="space-y-6">
                 <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                    <p className="text-blue-700">Lab Portal: <strong>{currentUser.name}</strong>. Verify moisture & DNA compliance for incoming batches.</p>
                 </div>
                 <LabForm user={currentUser} chain={chain} onSubmit={handleAddTransaction} isLoading={isMining} />
             </div>
        );
      case UserRole.CONSUMER:
        return <ConsumerView chain={chain} />;
      default:
        // Fallback for Processor/Admin in this demo
        return <ConsumerView chain={chain} />;
    }
  };

  // If not logged in, show Login View
  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-900">
      <Navigation 
        currentUser={currentUser}
        onLogout={handleLogout}
        setView={setCurrentView} 
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        
        {/* Error Toast */}
        {errorMsg && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center animate-bounce">
            <AlertOctagon className="w-5 h-5 mr-2" />
            <span className="block sm:inline">{errorMsg}</span>
            <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setErrorMsg(null)}>
              <span className="text-xl">&times;</span>
            </button>
          </div>
        )}

        {/* Dynamic Content */}
        {renderContent()}

      </main>

      <footer className="bg-stone-800 text-stone-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-serif italic mb-2">"Purity from the Roots"</p>
          <div className="text-xs space-y-1">
             <p>&copy; 2024 AyurTrace Network. Permissioned Ledger POC.</p>
             <p>Compliant with National Medicinal Plants Board Guidelines.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;