import React from 'react';
import { motion } from 'motion/react';
import { UsecaseInfo } from '../types';
import { 
  Puzzle, 
  Search,
  Github, 
  Zap, 
  ExternalLink,
  Target
} from 'lucide-react';

interface UsecaseDossierProps {
  info: UsecaseInfo;
}

export default function UsecaseDossier({ info }: UsecaseDossierProps) {
  if (!info) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 px-2">
        <div className="h-px flex-1 bg-zinc-900" />
        <div className="flex flex-col items-center gap-1">
           <Puzzle className="text-zinc-500" size={16} />
           <h3 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.4em]">Usecase Forensic</h3>
        </div>
        <div className="h-px flex-1 bg-zinc-900" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-glass p-6 bg-zinc-900/40 space-y-6"
        >
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">
                <Target size={12} className="text-zinc-600" />
                <span>Problem Statement</span>
             </div>
             <p className="text-xs text-zinc-400 leading-relaxed italic">
                "{info.realWorldProblem}"
             </p>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">
                <Search size={12} className="text-emerald-600" />
                <span>Forensic Breakdown</span>
             </div>
             <p className="text-xs text-zinc-300 leading-relaxed font-medium">
               {info.description}
             </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-glass p-6 bg-zinc-900/40 space-y-6"
        >
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
                 <div className="flex items-center gap-2">
                    <Github size={12} className="text-zinc-500" />
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Repo activity</span>
                 </div>
                 <div className="text-lg font-black text-white">{info.githubActivity}</div>
              </div>
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
                 <div className="flex items-center gap-2">
                    <Zap size={12} className="text-yellow-500" />
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Innovation</span>
                 </div>
                 <div className="text-lg font-black text-white">{info.innovationLevel}</div>
              </div>
           </div>

           <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 space-y-2">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Technical Moat</span>
              <p className="text-[11px] text-zinc-300 leading-relaxed font-medium">
                 {info.technicalMoat}
              </p>
           </div>
        </motion.div>
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
