import React from 'react';
import { motion } from 'motion/react';
import { Competitor } from '../types';
import { 
  Swords, 
  ChevronRight, 
  Target, 
  Zap,
  TrendingDown,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface CompetitorMatrixProps {
  competitors: Competitor[];
}

export default function CompetitorMatrix({ competitors }: CompetitorMatrixProps) {
  if (!competitors || competitors.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 px-2">
        <div className="h-px flex-1 bg-zinc-900" />
        <div className="flex flex-col items-center gap-1">
           <Swords className="text-zinc-500" size={16} />
           <h3 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.4em]">Competitor Threat Matrix</h3>
        </div>
        <div className="h-px flex-1 bg-zinc-900" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {competitors.map((comp, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card-glass border-zinc-800 bg-zinc-900/40 p-6 space-y-6 flex flex-col hover:border-red-500/20 transition-all group"
          >
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <div className="flex items-center gap-2">
                     <h4 className="text-lg font-black text-white">{comp.name}</h4>
                     <span className="text-[10px] font-mono text-zinc-500 uppercase font-black px-1.5 py-0.5 bg-zinc-800 rounded">
                        {comp.ticker}
                     </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <BarChart3 size={10} className="text-zinc-600" />
                     <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Share: {comp.marketShare}</span>
                  </div>
               </div>
               <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <ChevronRight size={14} className="text-zinc-700 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
               </div>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed flex-1">
               {comp.briefInfo}
            </p>

            <div className="space-y-3 pt-4 border-t border-zinc-800">
               <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-mono font-bold uppercase tracking-widest">
                  <TrendingUp size={12} />
                  <span>Our Advantage</span>
               </div>
               <p className="text-[11px] text-zinc-300 font-medium leading-relaxed bg-emerald-500/5 rounded p-2 border border-emerald-500/10">
                  {comp.advantage}
               </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
