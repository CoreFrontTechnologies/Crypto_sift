import React from 'react';
import { motion } from 'motion/react';
import { TeamMember } from '../types';
import { 
  Users, 
  ExternalLink, 
  Award, 
  Briefcase,
  UserCheck,
  Globe
} from 'lucide-react';

interface TeamDossierProps {
  team: TeamMember[];
}

const getSocialIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('linkedin')) return <ExternalLink size={14} />;
  if (p.includes('twitter') || p.includes('x')) return <Globe size={14} />;
  if (p.includes('github')) return <ExternalLink size={14} />;
  return <Globe size={14} />;
};

export default function TeamDossier({ team }: TeamDossierProps) {
  if (!team || team.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 px-2">
        <div className="h-px flex-1 bg-zinc-900" />
        <div className="flex flex-col items-center gap-1">
           <Users className="text-zinc-500" size={16} />
           <h3 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.4em]">Executive Leadership Dossier ({team.length} Personnel Detected)</h3>
        </div>
        <div className="h-px flex-1 bg-zinc-900" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="card-glass border-zinc-800 bg-zinc-900/40 overflow-hidden flex flex-col group hover:border-emerald-500/30 transition-all duration-500"
          >
            {/* Header / Trust Badge */}
            <div className="bg-zinc-800/20 border-b border-zinc-800 p-6 flex justify-between items-start">
               <div className="space-y-1">
                  <h4 className="text-lg font-black text-white leading-tight uppercase tracking-tighter">
                     {member.name}
                  </h4>
                  <p className="text-emerald-500 text-[10px] font-mono font-bold uppercase tracking-widest">
                     {member.role}
                  </p>
               </div>
               <div className="flex flex-col items-end">
                  <div className="text-[8px] font-mono text-zinc-500 uppercase mb-1">Trust Score</div>
                  <div className={`text-xl font-black ${member.trustScore > 80 ? 'text-emerald-500' : 'text-yellow-500'}`}>
                     {member.trustScore}/100
                  </div>
               </div>
            </div>

            {/* Main Content */}
            <div className="p-6 space-y-6 flex-1">
               <div className="space-y-2">
                  <p className="text-zinc-400 text-xs leading-relaxed italic">
                     "{member.bio}"
                  </p>
               </div>

               {/* Experience Section */}
               <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">
                     <div className="flex items-center gap-1.5">
                        <Briefcase size={12} className="text-zinc-600" />
                        <span>Institutional Pedigree</span>
                     </div>
                     <div className="flex items-center gap-1.5">
                        <Award size={12} className="text-emerald-600" />
                        <span className="text-zinc-300">{member.yearsExperience}+ Years Exp</span>
                     </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                     {member.pastWork.map((job, jidx) => (
                        <div key={jidx} className="px-2 py-1 bg-zinc-800/80 border border-zinc-700/50 rounded text-[9px] text-zinc-300 font-medium">
                           {job}
                        </div>
                     ))}
                  </div>
               </div>

               {/* Past Projects Section */}
               {member.pastProjects && member.pastProjects.length > 0 && (
                 <div className="space-y-3">
                   <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2 flex items-center gap-1.5">
                     <Globe size={12} className="text-zinc-600" />
                     <span>Project Track Record</span>
                   </div>
                   <div className="space-y-3">
                     {member.pastProjects.map((project, pidx) => (
                       <div key={pidx} className="bg-zinc-950/40 border border-zinc-800/50 rounded-lg p-3 space-y-2">
                         <div className="flex items-center justify-between">
                           <span className="text-[11px] font-bold text-white uppercase tracking-tight">{project.projectName}</span>
                           <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-black ${
                             project.outcome === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                             project.outcome === 'failure' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-500/10 text-zinc-500'
                           }`}>
                             {project.outcome}
                           </span>
                         </div>
                         <p className="text-[10px] text-zinc-500 leading-tight">
                           <span className="text-zinc-400 font-medium">{project.role}: </span>
                           {project.outcomeReason}
                         </p>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>

             {/* Social Footer */}
             <div className="bg-zinc-950/50 p-4 border-t border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      {member.socials.map((social, sidx) => (
                         <a 
                            key={sidx}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-500 transition-all"
                            title={social.platform}
                         >
                            {getSocialIcon(social.platform)}
                         </a>
                      ))}
                   </div>
                   <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-600 uppercase">
                      <UserCheck size={10} />
                      <span>Doxxed Status: Verified</span>
                   </div>
                </div>

                {member.sources && member.sources.length > 0 && (
                  <div className="pt-3 border-t border-zinc-800/50 flex flex-wrap gap-2">
                     {member.sources.map((src, i) => (
                        <a 
                          key={i} 
                          href={src.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-0.5 bg-zinc-900 rounded-md border border-zinc-800 text-[8px] text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          <ExternalLink size={8} />
                          {src.label}
                        </a>
                     ))}
                  </div>
                )}
             </div>
          </motion.div>
        ))}
      </div>

      {/* Aggregate Experience Summary */}
      <div className="card-glass p-8 bg-emerald-500/5 border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-8 group">
         <div className="space-y-2 text-center md:text-left">
            <h5 className="text-white font-bold text-sm uppercase tracking-widest">Collective Pedigree Breakdown</h5>
            <p className="text-zinc-500 text-xs">A breakdown of the core team's industry-spanning expertise across key verticals.</p>
         </div>
         
         <div className="flex gap-4 md:gap-12 flex-wrap justify-center">
            <div className="text-center group-hover:-translate-y-1 transition-transform">
               <span className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Audit Score</span>
               <span className="text-2xl font-black text-emerald-500 tabular-nums">
                  {Math.round(team.reduce((acc, m) => acc + m.trustScore, 0) / team.length)}/100
               </span>
            </div>
            <div className="w-px h-10 bg-zinc-800 hidden md:block" />
            <div className="text-center group-hover:-translate-y-1 transition-transform delay-75">
               <span className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Total Expertise</span>
               <span className="text-2xl font-black text-white tabular-nums">
                  {team.reduce((acc, m) => acc + m.yearsExperience, 0)}+ 
                  <span className="text-[10px] ml-1 text-zinc-500">Yrs</span>
               </span>
            </div>
            <div className="w-px h-10 bg-zinc-800 hidden md:block" />
            <div className="text-center group-hover:-translate-y-1 transition-transform delay-150">
               <span className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Core Vectors</span>
               <div className="flex items-center gap-1.5 justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-zinc-300">Engineering</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
