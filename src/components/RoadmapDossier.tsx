import React from 'react';
import { motion } from 'motion/react';
import { RoadmapInfo } from '../types';
import { 
  Map, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  History,
  ExternalLink
} from 'lucide-react';

interface RoadmapDossierProps {
  info: RoadmapInfo;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-emerald-500';
    case 'ongoing': return 'text-blue-500';
    case 'missed': return 'text-red-500';
    case 'future': return 'text-zinc-500';
    default: return 'text-zinc-500';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle2 size={14} />;
    case 'ongoing': return <Clock size={14} className="animate-spin-slow" />;
    case 'missed': return <AlertCircle size={14} />;
    case 'future': return <History size={14} />;
    default: return null;
  }
};

export default function RoadmapDossier({ info }: RoadmapDossierProps) {
  if (!info) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 px-2">
        <div className="h-px flex-1 bg-zinc-900" />
        <div className="flex flex-col items-center gap-1">
           <Map className="text-zinc-500" size={16} />
           <h3 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.4em]">Roadmap & Execution Audit</h3>
        </div>
        <div className="h-px flex-1 bg-zinc-900" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
           <div className={`p-6 rounded-2xl border flex flex-col justify-between h-full bg-zinc-900/40 border-zinc-800`}>
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">
                    <History size={12} className="text-zinc-600" />
                    <span>Execution Integrity</span>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block">Status</span>
                    <div className="text-xl font-black text-white uppercase tracking-tighter">
                       {info.followingProgress}
                    </div>
                 </div>
                 <p className="text-xs text-zinc-400 leading-relaxed italic">
                    "{info.details}"
                 </p>
              </div>
           </div>
        </div>

        <div className="lg:col-span-2 card-glass p-6 bg-zinc-900/30">
           <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-4 mb-6">
              <CheckCircle2 size={12} className="text-zinc-600" />
              <span>Key Milestones Audit</span>
           </div>
           
           <div className="space-y-6">
              {info.milestones && info.milestones.length > 0 ? (
                info.milestones.map((milestone, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className={`mt-1 ${getStatusColor(milestone.status)}`}>
                       {getStatusIcon(milestone.status)}
                    </div>
                    <div className="space-y-1">
                       <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-200">{milestone.milestone}</span>
                          {milestone.date && (
                             <span className="text-[9px] font-mono text-zinc-600 px-1.5 py-0.5 bg-zinc-800 rounded">{milestone.date}</span>
                          )}
                       </div>
                       <span className={`text-[8px] font-mono uppercase font-black px-1.5 py-0.5 rounded-full border bg-black/40 ${getStatusColor(milestone.status)} border-current opacity-60`}>
                          {milestone.status}
                       </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex items-center justify-center h-20 text-zinc-600 text-xs italic">
                   No specific milestones found in current forensic audit.
                </div>
              )}
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
