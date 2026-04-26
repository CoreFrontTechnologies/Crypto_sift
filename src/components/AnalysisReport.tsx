import { AnalysisResult, AnalysisSection, TeamMember, Investor, Competitor, TVLData, UsecaseInfo, UtilityInfo, RoadmapInfo } from '../types';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import TeamDossier from './TeamDossier';
import InvestorMap from './InvestorMap';
import VestingDashboard from './VestingDashboard';
import CompetitorMatrix from './CompetitorMatrix';
import UsecaseDossier from './UsecaseDossier';
import UtilityDossier from './UtilityDossier';
import RoadmapDossier from './RoadmapDossier';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  ArrowLeft, 
  Download, 
  Share2, 
  CheckCircle2, 
  Clock,
  Lock,
  Globe,
  BarChart3,
  Zap,
  Users,
  Wallet,
  ShieldAlert,
  Flame,
  Map
} from 'lucide-react';

interface AnalysisReportProps {
  result: AnalysisResult;
  onReset: () => void;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'SAFE': 
      return {
        border: 'border-emerald-500/20',
        borderHover: 'hover:border-emerald-500/40',
        bg: 'bg-emerald-500/5',
        text: 'text-emerald-500',
        textLight: 'text-emerald-400',
        dot: 'bg-emerald-500',
        badgeBorder: 'border-emerald-500/30'
      };
    case 'NEUTRAL':
      return {
        border: 'border-yellow-500/20',
        borderHover: 'hover:border-yellow-500/40',
        bg: 'bg-yellow-500/5',
        text: 'text-yellow-500',
        textLight: 'text-yellow-400',
        dot: 'bg-yellow-500',
        badgeBorder: 'border-yellow-500/30'
      };
    case 'DANGER':
      return {
        border: 'border-red-500/20',
        borderHover: 'hover:border-red-500/40',
        bg: 'bg-red-500/5',
        text: 'text-red-500',
        textLight: 'text-red-400',
        dot: 'bg-red-500',
        badgeBorder: 'border-red-500/30'
      };
    default:
      return {
        border: 'border-zinc-500/20',
        borderHover: 'hover:border-zinc-500/40',
        bg: 'bg-zinc-500/5',
        text: 'text-zinc-500',
        textLight: 'text-zinc-400',
        dot: 'bg-zinc-500',
        badgeBorder: 'border-zinc-500/30'
      };
  }
};

const getSectionIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('team')) return <Users size={20} />;
  if (t.includes('investor')) return <Globe size={20} />;
  if (t.includes('tokenomics')) return <Wallet size={20} />;
  if (t.includes('usecase') || t.includes('roadmap')) return <Map size={20} />;
  if (t.includes('risk') || t.includes('scam')) return <ShieldAlert size={20} />;
  return <BarChart3 size={20} />;
};

const getVerdictStyles = (verdict: string) => {
  const v = verdict.toUpperCase();
  if (v.includes('STRONGLY BUY')) return { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', icon: <TrendingUp size={24} /> };
  if (v.includes('BUY')) return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: <TrendingUp size={20} /> };
  if (v.includes('HOLD')) return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', icon: <Clock size={20} /> };
  if (v.includes('STRONGLY')) return { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', icon: <ShieldAlert size={24} /> };
  if (v.includes('AVOID') || v.includes('SELL')) return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: <TrendingDown size={20} /> };
  return { bg: 'bg-zinc-500/10', border: 'border-zinc-500/30', text: 'text-zinc-400', icon: <BarChart3 size={20} /> };
};

export default function AnalysisReport({ result, onReset }: AnalysisReportProps) {
  const verdictStyles = getVerdictStyles(result.verdict);
  const isBullish = result.verdict.toUpperCase().includes('BUY');
  const isNeutral = result.verdict.toUpperCase().includes('HOLD');
  const isBearish = !isBullish && !isNeutral;

  const scoreColor = isBullish ? 'text-emerald-500' : isNeutral ? 'text-cyan-500' : 'text-red-500';
  const progressBg = isBullish ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : isNeutral ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';

  const handleDownload = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Institutional Audit: ${result.tokenName}`,
      text: `Crypto Exposer Audit Result for ${result.tokenName}\nVerdict: ${result.verdict}\nExposure Level: ${result.scores.total}/100\nSummary: ${result.summary}`,
      url: window.location.origin
    };

    try {
      if (typeof navigator.share === 'function') {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\nSource: ${shareData.url}`);
        alert('Audit summary copied to clipboard.');
      }
    } catch (err) {
      console.error('Share failed', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      {/* Action Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-8 no-print">
        <button 
          onClick={onReset}
          className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </button>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleDownload}
            className="flex-1 md:flex-none h-11 px-6 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
          >
            <Download size={14} /> Download PDF Audit
          </button>
          <button 
            onClick={handleShare}
            className="flex-1 md:flex-none h-11 px-6 rounded-xl bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <Share2 size={14} /> Share Intelligence
          </button>
        </div>
      </div>

      {/* Institutional Grade Header */}
      <div className="card-glass p-8 md:p-12 relative overflow-hidden ring-1 ring-emerald-500/10">
        <div className="absolute top-0 right-0 p-8 opacity-5 flex flex-col items-end print:hidden">
           <ShieldCheck size={120} />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-4">
             <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                AUDIT ID: {Math.random().toString(36).substring(7).toUpperCase()}
             </span>
             <span className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                <Clock size={12} /> {new Date().toLocaleDateString()}
             </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white">
                {result.tokenName}
              </h1>
              <p className="text-zinc-500 font-mono text-sm uppercase tracking-[0.2em]">{result.ticker} / ON-CHAIN VERIFIED</p>
            </div>

            <div className="flex items-center gap-6">
               <div className="text-right">
                  <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Exposure Level</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-black tabular-nums ${scoreColor}`}>
                       {result.scores.total}
                    </span>
                    <span className="text-zinc-600 text-xl font-bold">/100</span>
                  </div>
               </div>
               
               <div className={`h-20 w-1.5 rounded-full bg-zinc-800`}>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${result.scores.total}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`w-full rounded-full ${progressBg}`}
                  />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Verdict & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`col-span-1 p-8 rounded-2xl border flex flex-col justify-between h-full ${verdictStyles.bg} ${verdictStyles.border}`}>
           <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-zinc-950 text-zinc-400 text-[9px] font-mono px-2 py-0.5 rounded border border-zinc-700">FINAL RECOMMENDATION</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                 <div className={verdictStyles.text}>{verdictStyles.icon}</div>
                 <div className={`text-4xl font-black uppercase tracking-tighter ${verdictStyles.text}`}>
                    {result.verdict}
                 </div>
              </div>
              <div className="h-0.5 w-12 bg-current opacity-20 mb-6" />
           </div>
           
           <div className="space-y-4">
              <p className="text-zinc-300 text-sm leading-relaxed font-semibold italic">
                "{result.summary}"
              </p>
              <div className="text-xs text-zinc-500 border-t border-zinc-800/50 pt-4">
                 <span className="block font-bold mb-1 opacity-50 uppercase tracking-tighter">Strategic Advice:</span>
                 {result.verdictExplanation}
              </div>
           </div>
        </div>

        <div className="col-span-1 md:col-span-2 card-glass p-8 bg-zinc-900/30 flex flex-col h-full">
           <div className="flex items-center gap-3 mb-8">
              <BarChart3 className="text-zinc-500" size={20} />
              <h3 className="font-bold uppercase tracking-wider text-sm">Security Vectors</h3>
           </div>
           <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8 flex-1">
              {[
                { label: 'Tokenomics', score: result.scores.tokenomics },
                { label: 'Team', score: result.scores.team },
                { label: 'Usecase', score: result.scores.technologyUsecase },
                { label: 'Investors', score: result.scores.investors },
                { label: 'Competitors', score: result.scores.competitors },
                { label: 'Utility', score: result.scores.utility },
                { label: 'TVL & Vesting', score: result.scores.tvl },
                { label: 'Community', score: result.scores.community },
              ].map((v, i) => (
                <div key={i} className="space-y-3 relative group">
                   <div className="flex justify-between items-center px-0.5">
                      <div className="flex items-center gap-1.5 focus:outline-none">
                        <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">{v.label}</span>
                      </div>
                      <span className="text-xs font-bold text-zinc-300">{v.score}/100</span>
                   </div>
                   <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${v.score}%` }}
                        className="h-full bg-zinc-700 rounded-full transition-all duration-1000 ease-out"
                      />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Tokenomics Dashboard */}
      {result.tokenomicsData && (
        <div className="card-glass overflow-hidden bg-zinc-900/40 border-emerald-500/10">
           <div className="bg-zinc-800/30 border-b border-zinc-800 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Wallet className="text-emerald-500" size={18} />
                 <h3 className="font-bold uppercase tracking-widest text-xs">Tokenomics Dashboard</h3>
              </div>
           </div>
           <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-1">
                 <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Market Cap</span>
                 <p className="text-xl font-black text-white">{result.tokenomicsData.mcap || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                 <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Fully Diluted (FDV)</span>
                 <p className="text-xl font-black text-white">{result.tokenomicsData.fdv || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                 <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Circulating Supply</span>
                 <p className="text-xl font-black text-white">{result.tokenomicsData.circulatingSupply || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                 <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Total Supply</span>
                 <p className="text-xl font-black text-white">{result.tokenomicsData.totalSupply || 'N/A'}</p>
              </div>
           </div>
           
           {result.tokenomicsData.distribution && result.tokenomicsData.distribution.length > 0 && (
             <div className="px-8 pb-10 space-y-6">
                <div className="flex h-12 w-full rounded-xl overflow-hidden border border-zinc-800/50 bg-zinc-950 p-1 gap-1">
                   {result.tokenomicsData.distribution.map((item, i) => {
                      const colors = [
                         'bg-emerald-500', 'bg-cyan-500', 'bg-indigo-500', 
                         'bg-purple-500', 'bg-pink-500', 'bg-zinc-700'
                      ];
                      return (
                         <motion.div
                            key={i}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            className={`h-full ${colors[i % colors.length]} transition-all duration-1000 relative group`}
                         >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-[8px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                               {item.label}: {item.value}%
                            </div>
                         </motion.div>
                      );
                   })}
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                   {result.tokenomicsData.distribution.map((item, i) => {
                      const colors = [
                         'bg-emerald-500', 'bg-cyan-500', 'bg-indigo-500', 
                         'bg-purple-500', 'bg-pink-500', 'bg-zinc-700'
                      ];
                      return (
                         <div key={i} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${colors[i % colors.length]}`} />
                            <span className="text-[10px] font-mono text-zinc-500 uppercase">{item.label}</span>
                            <span className="text-[10px] font-bold text-zinc-300">{item.value}%</span>
                         </div>
                      );
                   })}
                </div>
             </div>
           )}

           {/* Burning Mechanism Forensic */}
           {result.tokenomicsData.burningMechanism && (
             <div className="px-8 pb-8 pt-6 border-t border-zinc-800/50 bg-orange-500/5">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                   <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-orange-500">
                         <Flame size={14} />
                         <span className="text-[10px] font-black uppercase tracking-widest">Burning Forensic</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-[11px] px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded-md font-mono uppercase font-black border border-orange-500/20">
                            {result.tokenomicsData.burningMechanism.type}
                         </span>
                         {result.tokenomicsData.burningMechanism.percentageBurned && (
                            <span className="text-[11px] text-orange-300 font-bold tabular-nums">
                               {result.tokenomicsData.burningMechanism.percentageBurned} Burned
                            </span>
                         )}
                      </div>
                   </div>
                   <div className="hidden md:block h-8 w-px bg-zinc-800" />
                   <p className="text-[11px] text-zinc-400 flex-1 leading-relaxed">
                      {result.tokenomicsData.burningMechanism.description}
                   </p>
                </div>
             </div>
           )}
        </div>
      )}

      {/* Usecase Dossier */}
      {result.usecaseInfo && (
        <UsecaseDossier info={result.usecaseInfo} />
      )}

      {/* Utility Dossier */}
      {result.utilityInfo && (
        <UtilityDossier info={result.utilityInfo} />
      )}

      {/* Roadmap Dossier */}
      {result.roadmapInfo && (
        <RoadmapDossier info={result.roadmapInfo} />
      )}

      {/* Team Dossier */}
      {result.team && result.team.length > 0 && (
        <TeamDossier team={result.team} />
      )}

      {/* Investor Map */}
      {result.investors && result.investors.length > 0 && (
        <InvestorMap investors={result.investors} />
      )}

      {/* TVL & Vesting Dashboard */}
      {result.tvlData && (
        <VestingDashboard data={result.tvlData} />
      )}

      {/* Competitor Matrix */}
      {result.competitors && result.competitors.length > 0 && (
        <CompetitorMatrix competitors={result.competitors} />
      )}

      {/* Forensic Breakdown Sections */}
      {result.sections && result.sections.length > 0 && (
        <div className="space-y-6">
           <div className="flex items-center gap-4 px-2">
              <div className="h-px flex-1 bg-zinc-900" />
              <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-[0.5em]">Forensic Breakdown</h3>
              <div className="h-px flex-1 bg-zinc-900" />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.sections.map((section, idx) => {
                 const styles = getStatusStyles(section.status);
                 return (
                    <motion.div 
                       key={idx}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: idx * 0.1 }}
                       className={`card-glass overflow-hidden ${styles.border} bg-zinc-900/40 group ${styles.borderHover} transition-all h-full flex flex-col`}
                    >
                       <div className={`${styles.bg} border-b border-zinc-800 px-6 py-4 flex items-center justify-between`}>
                          <div className="flex items-center gap-3">
                             <div className={styles.text}>
                                {getSectionIcon(section.title)}
                             </div>
                             <h4 className="font-bold uppercase tracking-widest text-[11px] text-white">
                                {section.title}
                             </h4>
                          </div>
                          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${styles.badgeBorder} bg-black/40`}>
                             <div className={`w-1.5 h-1.5 rounded-full ${styles.dot} ${section.status === 'DANGER' ? 'animate-pulse' : ''}`} />
                             <span className={`text-[8px] font-black tracking-tighter uppercase ${styles.textLight}`}>
                                {section.status}
                             </span>
                          </div>
                       </div>
                       <div className="p-6 md:p-8 prose prose-zinc prose-invert prose-emerald max-w-none flex-1 
                          prose-p:text-zinc-400 prose-p:text-sm prose-p:leading-relaxed prose-p:mb-4
                          prose-li:text-zinc-400 prose-li:text-sm prose-li:mb-1
                          prose-strong:text-zinc-200 prose-strong:font-bold
                       ">
                          <ReactMarkdown>{section.content}</ReactMarkdown>
                       </div>
                    </motion.div>
                 );
              })}
           </div>
        </div>
      )}

      {/* Legacy Markdown Report (Backup) */}
      {(!result.sections || result.sections.length === 0) && result.fullAnalysisText && (
        <div className="card-glass overflow-hidden bg-zinc-900/40">
           <div className="p-8 md:p-12 prose prose-zinc prose-invert prose-emerald max-w-none">
              <ReactMarkdown>{result.fullAnalysisText}</ReactMarkdown>
           </div>
        </div>
      )}

      {/* Trust Badges: Fixed Footer of Report */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print pb-20">
         <div className="card-glass p-6 flex items-center gap-4">
            <div className="bg-zinc-800/50 p-2.5 rounded-lg text-emerald-500">
               <CheckCircle2 size={20} />
            </div>
            <div>
               <p className="text-xs font-bold text-zinc-100 mb-0.5">Asset-Exposed</p>
               <p className="text-[10px] text-zinc-500 font-mono tracking-tighter uppercase font-bold text-center">DATA INTEGRITY SECURED</p>
            </div>
         </div>
         <div className="card-glass p-6 flex items-center gap-4">
            <div className="bg-zinc-800/50 p-2.5 rounded-lg text-emerald-500">
               <Lock size={20} />
            </div>
            <div>
               <p className="text-xs font-bold text-zinc-100 mb-0.5">Vector Cryptography</p>
               <p className="text-[10px] text-zinc-500 font-mono tracking-tighter uppercase font-bold text-center">PRIVATE TERMINAL REPORT</p>
            </div>
         </div>
         <div className="card-glass p-6 flex items-center gap-4 text-zinc-500">
            <div className="bg-zinc-800/50 p-2.5 rounded-lg">
               <Share2 size={20} />
            </div>
            <div>
               <p className="text-xs font-bold text-zinc-100 mb-0.5">Forensic Export</p>
               <p className="text-[10px] text-zinc-500 font-mono tracking-tighter uppercase font-bold text-center">MULTI-CHANNEL SHARE READY</p>
            </div>
         </div>
      </div>
    </div>
  );
}
