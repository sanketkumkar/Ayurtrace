import React from 'react';
import { Block, EventType } from '../types';
import { Shield, Database, Lock } from 'lucide-react';

const LedgerView: React.FC<{ chain: Block[] }> = ({ chain }) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-8">
         <div>
            <h2 className="text-2xl font-serif font-bold text-stone-800 flex items-center">
                <Database className="mr-2 text-emerald-700"/> Immutable Ledger
            </h2>
            <p className="text-stone-500 text-sm">Real-time view of the permissioned blockchain network.</p>
         </div>
         <div className="flex space-x-4 text-xs font-mono text-stone-400">
             <div className="flex items-center"><Shield className="w-3 h-3 mr-1"/> Consensus: RAFT</div>
             <div className="flex items-center"><Lock className="w-3 h-3 mr-1"/> Encryption: SHA-256</div>
         </div>
      </div>

      <div className="space-y-4">
        {chain.map((block) => (
          <div key={block.hash} className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden font-mono text-xs">
             <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 flex justify-between items-center">
                <span className="font-bold text-stone-700">BLOCK #{block.index}</span>
                <span className="text-stone-400">{block.timestamp}</span>
             </div>
             <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="text-stone-400 mb-1">DATA PAYLOAD</div>
                    <div className="text-emerald-800 bg-emerald-50 p-2 rounded break-all">
                        <span className="font-bold block mb-1">{block.data.resourceType.toUpperCase()}</span>
                        {block.data.resourceType === EventType.COLLECTION && (
                            <span>{(block.data as any).species} - {(block.data as any).quantityKg}kg</span>
                        )}
                        {block.data.resourceType === EventType.QUALITY_TEST && (
                            <span>Result: {(block.data as any).result} (Moisture: {(block.data as any).parameters.moistureContent}%)</span>
                        )}
                        <div className="mt-2 text-[10px] text-emerald-600">ID: {block.data.id}</div>
                    </div>
                </div>
                <div>
                    <div className="text-stone-400 mb-1">CRYPTOGRAPHY</div>
                    <div className="space-y-1">
                        <div className="flex">
                            <span className="w-20 text-stone-500">Prev Hash:</span>
                            <span className="truncate text-stone-800">{block.previousHash.substring(0, 20)}...</span>
                        </div>
                        <div className="flex">
                            <span className="w-20 text-stone-500">Cur Hash:</span>
                            <span className="truncate text-stone-800">{block.hash.substring(0, 20)}...</span>
                        </div>
                        <div className="flex">
                            <span className="w-20 text-stone-500">Signer:</span>
                            <span className="text-stone-800">{block.validatorSignature}</span>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LedgerView;
