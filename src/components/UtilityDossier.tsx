import React from 'react';
import { motion } from 'motion/react';
import { UtilityInfo } from '../types';
import { 
  Key, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Coins,
  PackageCheck
} from 'lucide-react';

interface UtilityDossierProps {
  info: UtilityInfo;
}

export default function UtilityDossier({ info }: UtilityDossierProps) {
  if (!info) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 px-2">
        <div className="h-px flex-1 bg-zinc-900" />
        <div className="flex flex-col items-center gap-1">
           <Key className="text-zinc-500" size={16} />
           <h3 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.4em]">Utility & Value Accrual</h3>
        </div>
        <div className="h-px flex-1 bg-zinc-900" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Governance', value: info.governance },
          { label: 'Staking', value: info.staking },
          { label: 'Token Burn', value: info.burnMechanics },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-xl border flex items-center justify-between ${
              item.value 
                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' 
                : 'bg-red-500/5 border-red-500/20 text-red-500'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            {item.value ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-glass p-6 bg-zinc-900/40 space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">
            <PackageCheck size={12} className="text-zinc-600" />
            <span>Core Ecosystem Utilities</span>
          </div>
          <div className="space-y-3">
             {info.specificUtilities && info.specificUtilities.length > 0 ? (
               info.specificUtilities.map((util, i) => (
                 <div key={i} className="flex gap-3 items-start">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <p className="text-xs text-zinc-300 leading-relaxed">{util}</p>
                 </div>
               ))
             ) : (
               <p className="text-xs text-zinc-500 italic">No specific utilities identified.</p>
             )}
          </div>
        </div>

        <div className="card-glass p-6 bg-zinc-900/40 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">
              <Coins size={12} className="text-emerald-500" />
              <span>Value Accrual & Tokenomics Role</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              {info.valueAccrual}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
             <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-1">Ecosystem Role</span>
             <p className="text-xs text-zinc-400 italic leading-relaxed">"{info.ecosystemRole}"</p>
          </div>
        </div>
      </div>

      {info.sources && info.sources.length > 0 && (
        <div className="px-6 py-4 bg-zinc-900/20 border border-zinc-800 rounded-xl flex flex-wrap items-center gap-4">
           <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Sources:</span>
           {info.sources.map((src, i) => (
             <a 
               key={i} 
               href={src.url} 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-white transition-colors"
             >
               <ExternalLink size={10} />
               {src.label}
             </a>
           ))}
        </div>
      )}
    </div>
  );
}
