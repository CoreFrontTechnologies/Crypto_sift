import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Shield, Activity, Code, Cpu } from 'lucide-react';

interface AnalysisFormProps {
  onAnalyze: (query: string) => void;
  isLoading: boolean;
}

export default function AnalysisForm({ onAnalyze, isLoading }: AnalysisFormProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onAnalyze(query);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full space-y-8">
      <form onSubmit={handleSubmit} className="relative group">
        <div className={`relative flex items-center transition-all duration-300 ${isLoading ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="absolute left-6 text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
            <Search size={22} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            placeholder="Search Project or CA (0x...)"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-16 pr-44 py-7 text-lg font-medium text-white placeholder:text-zinc-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all shadow-2xl shadow-black/50"
          />
          <div className="absolute right-3">
             <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="button-primary text-sm px-8 py-3.5"
             >
                {isLoading ? (
                  <Activity className="animate-spin" size={18} />
                ) : (
                  'Run Audit'
                )}
             </button>
          </div>
        </div>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
        {[
          { icon: Shield, label: 'VC Forensics' },
          { icon: Activity, label: 'Live Liquidity' },
          { icon: Code, label: 'Stack Integrity' },
          { icon: Cpu, label: 'Compute Moat' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-zinc-500">
            <div className="p-1.5 rounded bg-zinc-900/50">
               <item.icon size={14} className="text-zinc-600" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] font-bold">{item.label}</span>
          </div>
        ))}
      </div>

      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center pt-8 space-y-6"
        >
          <div className="flex justify-center gap-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 1, 0.3],
                  backgroundColor: ['#10b981', '#06b6d4', '#10b981']
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2, 
                  delay: i * 0.3 
                }}
                className="w-2.5 h-2.5 rounded-full blur-[1px]"
              />
            ))}
          </div>
          <div className="space-y-1.5">
             <p className="text-xs font-mono text-emerald-500 uppercase tracking-[0.3em] font-black italic">Initiating Forensic Engine</p>
             <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">Synchronizing with Decentralized Intelligence Nodes...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
