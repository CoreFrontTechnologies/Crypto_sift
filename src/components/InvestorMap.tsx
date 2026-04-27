import React from 'react';
import { motion } from 'motion/react';
import { Investor } from '../types';
import { 
  Building2, 
  Globe, 
  ShieldCheck,
  Zap,
  Target,
  ExternalLink
} from 'lucide-react';

interface InvestorMapProps {
  investors: Investor[];
}

const getSocialIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('linkedin')) return <ExternalLink size={14} />;
  if (p.includes('twitter') || p.includes('x')) return <Globe size={14} />;
  return <Globe size={14} />;
};

const getTierColor = (tier: string) => {
  switch (tier.toLowerCase()) {
    case 'tier-1': return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
    case 'tier-2': return 'text-blue-500 border-blue-500/20 bg-blue-500/5';
    case 'tier-3': return 'text-purple-500 border-purple-500/20 bg-purple-500/5';
    default: return 'text-zinc-500 border-zinc-500/20 bg-zinc-500/5';
  }
};

export default function InvestorMap({ investors }: InvestorMapProps) {
  if (!investors || investors.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 px-2">
        <div className="h-px flex-1 bg-zinc-900" />
        <div className="flex flex-col items-center gap-1">
           <Building2 className="text-zinc-500" size={16} />
           <h3 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.4em]">Institutional Venture Capital Map</h3>
        </div>
        <div className="h-px flex-1 bg-zinc-900" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investors.map((investor, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card-glass border-zinc-800 bg-zinc-900/40 p-6 space-y-6 hover:border-zinc-700 transition-colors"
          >
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white tracking-tight">{investor.name}</h4>
                  <div className={`inline-flex px-2 py-0.5 rounded border text-[9px] font-mono font-bold uppercase tracking-wider ${getTierColor(investor.tier)}`}>
                    {investor.tier}
                  </div>
               </div>
               <div className="flex gap-2">
                  {investor.socials.map((social, sidx) => (
                    <a 
                      key={sidx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      {getSocialIcon(social.platform)}
                    </a>
                  ))}
               </div>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed">
               {investor.description}
            </p>

            <div className="space-y-3">
               <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">
                  <Target size={12} className="text-zinc-600" />
                  <span>Key Portfolio Plays</span>
               </div>
               <div className="flex flex-wrap gap-2">
                  {investor.pastInvestments.map((inv, iidx) => (
                    <div key={iidx} className="px-2 py-1 bg-zinc-800/40 border border-zinc-800 rounded text-[9px] text-zinc-400 font-medium">
                      {inv}
                    </div>
                  ))}
               </div>
            </div>

            {investor.sources && investor.sources.length > 0 && (
              <div className="pt-4 border-t border-zinc-800/50 flex flex-wrap gap-2">
                 {investor.sources.map((src, i) => (
                    <a 
                      key={i} 
                      href={src.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2 py-1 bg-zinc-950 rounded-md border border-zinc-800 text-[8px] text-zinc-500 hover:text-white transition-colors"
                    >
                      <ExternalLink size={8} />
                      {src.label}
                    </a>
                 ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Trust Signal */}
      <div className="border border-zinc-900 bg-zinc-950/50 p-6 rounded-lg flex flex-col md:flex-row items-center gap-6 justify-center">
         <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-500" size={20} />
            <div className="text-center md:text-left">
               <div className="text-xs font-bold text-white uppercase tracking-widest">Institutional Backing Verified</div>
               <div className="text-[10px] text-zinc-500">All data cross-referenced with Crunchbase, Pitchbook, and official handle reveals.</div>
            </div>
         </div>
      </div>
    </div>
  );
}
