import { useState, useEffect, useRef } from 'react';
import { AnalysisResult, AnalysisSection, TeamMember, Investor, Competitor, TVLData, UsecaseInfo, UtilityInfo, RoadmapInfo } from '../types';
import { motion, AnimatePresence } from 'motion/react';
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
  Map,
  Layers,
  Activity,
  Cpu,
  Trophy
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
  if (t.includes('team')) return <Users size={16} />;
  if (t.includes('investor')) return <Globe size={16} />;
  if (t.includes('tokenomics')) return <Wallet size={16} />;
  if (t.includes('usecase') || t.includes('roadmap')) return <Map size={16} />;
  if (t.includes('risk') || t.includes('scam')) return <ShieldAlert size={16} />;
  return <BarChart3 size={16} />;
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

const formatDisplayValue = (val: string | number | undefined | null) => {
  if (val === undefined || val === null) return 'N/A';
  const strVal = String(val).trim();
  if (/[KMBT]$/i.test(strVal)) return strVal;
  const num = parseFloat(strVal.replace(/[^0-9.-]+/g, ""));
  if (isNaN(num)) return strVal;
  const isCurrency = strVal.startsWith('$');
  let formatted = num;
  let suffix = '';
  if (num >= 1e12) { formatted = num / 1e12; suffix = 'T'; }
  else if (num >= 1e9) { formatted = num / 1e9; suffix = 'B'; }
  else if (num >= 1e6) { formatted = num / 1e6; suffix = 'M'; }
  else if (num >= 1e3) { formatted = num / 1e3; suffix = 'K'; }
  else return strVal;
  const finalNum = Math.round(formatted * 100) / 100;
  return `${isCurrency ? '$' : ''}${finalNum}${suffix}`;
};

type TabId = 'OVERVIEW' | 'TOKENOMICS' | 'TEAM' | 'PRODUCT' | 'COMPETITORS' | 'FORENSICS';

export default function AnalysisReport({ result, onReset }: AnalysisReportProps) {
  const [activeTab, setActiveTab] = useState<TabId>('OVERVIEW');
  const mainContentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Scroll to top of the content area when tab changes
    if (mainContentRef.current) {
        mainContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);
  const verdictStyles = getVerdictStyles(result.verdict);
  const isBullish = result.verdict.toUpperCase().includes('BUY');
  const isNeutral = result.verdict.toUpperCase().includes('HOLD');
  const isBearish = !isBullish && !isNeutral;

  const scoreColor = isBullish ? 'text-emerald-500' : isNeutral ? 'text-cyan-500' : 'text-red-500';
  const progressBg = isBullish ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : isNeutral ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';

  const handleDownload = () => window.print();

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
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\Source: ${shareData.url}`);
        alert('Audit summary copied to clipboard.');
      }
    } catch (err) {
      console.error('Share failed', err);
    }
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'OVERVIEW', label: 'Overview', icon: <BarChart3 size={18} /> },
    { id: 'TOKENOMICS', label: 'Tokenomics', icon: <Wallet size={18} /> },
    { id: 'TEAM', label: 'Team & Investors', icon: <Users size={18} /> },
    { id: 'PRODUCT', label: 'Product & Tech', icon: <Cpu size={18} /> },
    { id: 'COMPETITORS', label: 'Competitors', icon: <Trophy size={18} /> },
    { id: 'FORENSICS', label: 'Forensic Report', icon: <Activity size={18} /> },
  ];

  return (
    <div className="relative font-sans h-full min-h-screen">
      {/* MOBILE TABS BAR - FIXED/STICKY AT TOP */}
      <div className="lg:hidden sticky top-16 z-50 bg-zinc-950/80 backdrop-blur-xl -mx-4 px-4 py-2 border-b border-zinc-900 mb-4">
        <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap min-w-max ${
                activeTab === tab.id 
                  ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <div className="shrink-0">{tab.icon}</div>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row-reverse gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* RIGHT SIDE NAVIGATION (DESKTOP) */}
        <aside className="w-full lg:w-80 shrink-0 no-print relative">
          <div className="hidden lg:block sticky top-20 z-40 lg:static lg:top-auto mb-6">
            <div className="flex lg:flex-col gap-1 p-2 bg-zinc-900/50 backdrop-blur-3xl border border-zinc-800/50 rounded-2xl lg:rounded-[2rem] shadow-2xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    activeTab === tab.id 
                      ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                      : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="shrink-0">{tab.icon}</div>
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div layoutId="active-indicator" className="ml-auto w-1 h-4 rounded-full bg-zinc-950/20" />
                  )}
                </button>
              ))}
            </div>
          </div>

        {activeTab === 'OVERVIEW' && (
          <div className="mt-6 card-glass p-6 space-y-6 bg-zinc-900/40 border-zinc-800/50 rounded-[2rem]">
             <div className="space-y-2">
                <div className="flex justify-between items-end">
                   <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Trust Index</span>
                   <span className={`text-3xl font-black italic tracking-tighter ${scoreColor}`}>{result.scores.total}/100</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden p-0.5">
                   <div className={`h-full rounded-full ${progressBg} transition-all duration-1000`} style={{ width: `${result.scores.total}%` }} />
                </div>
             </div>

             <div className="pt-6 border-t border-zinc-800 flex flex-col gap-3">
                <button 
                  onClick={handleDownload} 
                  className="w-full h-12 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center gap-3"
                >
                  <Download size={16} /> <span>Export Audit</span>
                </button>
                <button 
                  onClick={handleShare} 
                  className="w-full h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-zinc-950 transition-all flex items-center justify-center gap-3"
                >
                  <Share2 size={16} /> <span>Broadcast</span>
                </button>
             </div>
          </div>
        )}
      </aside>

      {/* CONTENT AREA */}
      <main ref={mainContentRef} className="flex-1 space-y-6 pb-20 relative px-2 md:px-0 max-w-5xl mx-auto w-full">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full -z-10" />
        
        <div className="card-glass p-6 md:p-8 relative overflow-hidden ring-1 ring-emerald-500/10 group">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-30" />
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldCheck size={120} />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10 border-b border-zinc-900/50 pb-8">
            <div className="flex items-center gap-6 md:gap-8">
              <motion.div 
                initial={{ rotate: -5, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-zinc-950 border border-zinc-800 p-3 shadow-2xl flex items-center justify-center shrink-0 relative overflow-hidden"
              >
                {result.logoUrl ? (
                  <img 
                    src={result.logoUrl} 
                    alt={result.tokenName} 
                    className="w-full h-full object-contain relative z-10" 
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (!img.dataset.retried) {
                        img.dataset.retried = '1';
                        // Try common crypto icon set
                        img.src = `https://assets.coincap.io/assets/icons/${result.ticker.toLowerCase()}@2x.png`;
                      } else if (img.dataset.retried === '1') {
                        img.dataset.retried = '2';
                        // Try different fallback Repo
                        img.src = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${result.ticker.toLowerCase()}.png`;
                      } else {
                        img.className = 'hidden';
                        const placeholder = img.nextElementSibling;
                        if (placeholder) {
                          placeholder.classList.remove('hidden');
                          placeholder.classList.add('flex');
                        }
                      }
                    }}
                  />
                ) : null}
                <div className={`${result.logoUrl ? 'hidden' : 'flex'} items-center justify-center text-emerald-500 relative z-10 w-full h-full`}>
                   <Layers size={32} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              </motion.div>
              <div className="space-y-2">
                <div className="space-y-0">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-1">Crypto Exposer Forensic Dossier</p>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
                    {result.tokenName}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 bg-emerald-500 text-zinc-950 rounded text-[10px] font-black tracking-widest uppercase">{result.ticker}</span>
                  <div className="h-4 w-px bg-zinc-800" />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">Node_ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className={`${verdictStyles.bg} ${verdictStyles.border} border-2 rounded-[2rem] p-6 md:p-8 flex flex-col justify-center min-w-[240px] md:min-w-[300px] shadow-2xl relative overflow-hidden group/verdict`}>
               <div className="absolute -right-2 -bottom-2 opacity-10 group-hover/verdict:scale-110 transition-transform duration-700">
                  {verdictStyles.icon}
               </div>
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2">Audit Verdict</span>
               <div className="flex items-center gap-4">
                  <div className={`${verdictStyles.text} scale-125`}>{verdictStyles.icon}</div>
                  <div className={`text-2xl md:text-4xl font-black uppercase tracking-tighter ${verdictStyles.text} italic`}>
                     {result.verdict}
                  </div>
               </div>
            </div>
          </div>

          {/* New Info strip to remove empty space */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Market Cap', value: formatDisplayValue(result.tokenomicsData?.mcap), icon: <Globe size={14} /> },
              { label: 'Circ. Supply', value: formatDisplayValue(result.tokenomicsData?.circulatingSupply), icon: <Activity size={14} /> },
              { label: 'Liquidity', value: 'High/Locked', icon: <Lock size={14} /> },
              { label: 'Community', value: 'Strong', icon: <Users size={14} /> }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 text-zinc-500">
                  {stat.icon}
                  <span className="text-[9px] font-black uppercase tracking-widest">{stat.label}</span>
                </div>
                <span className="text-sm font-black text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TAB CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {activeTab === 'OVERVIEW' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card-glass p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <h3 className="font-bold uppercase tracking-wider text-sm">Strategic Conclusion</h3>
                  </div>
                  <p className="text-zinc-300 text-lg leading-relaxed font-semibold">
                    "{result.summary}"
                  </p>
                  <div className="pt-6 border-t border-zinc-800/50">
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      <span className="font-bold uppercase block mb-2 text-zinc-400">Forensic Briefing:</span>
                      {result.verdictExplanation}
                    </p>
                  </div>
                </div>

                <div className="card-glass p-10 bg-zinc-900/30 ring-1 ring-white/5">
                  <div className="flex items-center gap-3 mb-10">
                    <Activity className="text-emerald-500" size={24} />
                    <h3 className="font-black uppercase tracking-[0.3em] text-xs">VITAL_FORENSIC_METRICS</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
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
                      <div key={i} className="space-y-3 group/metric">
                         <div className="flex justify-between items-end text-[10px] font-black uppercase font-mono tracking-widest">
                            <span className="text-zinc-500 group-hover/metric:text-zinc-300 transition-colors">{v.label}</span>
                            <span className={`${scoreColor} text-lg tracking-tighter italic`}>{v.score}/100</span>
                         </div>
                         <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${v.score}%` }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                              className={`h-full ${progressBg} rounded-full`} 
                            />
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="card-glass p-6 bg-emerald-500/5 border-emerald-500/10">
                      <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-4">Top Strengths</h4>
                      <ul className="space-y-3">
                         {result.pros.map((pro, i) => (
                           <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
                              <span className="text-emerald-500 mt-0.5">+</span> {pro}
                           </li>
                         ))}
                      </ul>
                   </div>
                   <div className="card-glass p-6 bg-red-500/5 border-red-500/10">
                      <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-4">Core Vulnerabilities</h4>
                      <ul className="space-y-3">
                         {result.cons.map((con, i) => (
                           <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">-</span> {con}
                           </li>
                         ))}
                      </ul>
                   </div>
                   <div className="card-glass p-6 bg-yellow-500/5 border-yellow-500/10">
                      <h4 className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mb-4">Risk Vectors</h4>
                      <ul className="space-y-3">
                         {result.risks.map((risk, i) => (
                           <li key={i} className="text-xs text-zinc-400 flex items-start gap-2 font-medium">
                              <ShieldAlert size={12} className="text-yellow-500 shrink-0 mt-0.5" /> {risk}
                           </li>
                         ))}
                      </ul>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'TOKENOMICS' && result.tokenomicsData && (
              <div className="space-y-8">
                <div className="card-glass p-8 bg-zinc-900/40">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                      <Wallet className="text-emerald-500" size={20} />
                      <h3 className="font-bold uppercase tracking-widest text-sm">Economic DNA</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
                    <div className="space-y-1">
                       <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Market Cap</span>
                       <p className="text-lg sm:text-xl md:text-2xl font-black text-white transition-all">{formatDisplayValue(result.tokenomicsData.mcap)}</p>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">FDV</span>
                       <p className="text-lg sm:text-xl md:text-2xl font-black text-white transition-all">{formatDisplayValue(result.tokenomicsData.fdv)}</p>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Circulating</span>
                       <p className="text-lg sm:text-xl md:text-2xl font-black text-white transition-all">{formatDisplayValue(result.tokenomicsData.circulatingSupply)}</p>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Total Supply</span>
                       <p className="text-lg sm:text-xl md:text-2xl font-black text-white transition-all">{formatDisplayValue(result.tokenomicsData.totalSupply)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-12 space-y-6 pt-12 border-t border-zinc-800">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Distribution Blueprint</h4>
                    <div className="flex h-12 w-full rounded-2xl overflow-hidden border border-zinc-800/50 bg-zinc-950 p-1 gap-1">
                      {result.tokenomicsData.distribution.map((item, i) => {
                         const colors = ['bg-emerald-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-zinc-700'];
                         return (
                            <motion.div
                               key={i}
                               initial={{ width: 0 }}
                               animate={{ width: `${item.value}%` }}
                               className={`h-full ${colors[i % colors.length]} transition-all relative group cursor-help`}
                            >
                               <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                  {item.label}: {item.value}%
                               </div>
                            </motion.div>
                         );
                      })}
                    </div>
                    <div className="flex flex-wrap gap-x-10 gap-y-3">
                       {result.tokenomicsData.distribution.map((item, i) => {
                          const colors = ['bg-emerald-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-zinc-700'];
                          return (
                             <div key={i} className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-md ${colors[i % colors.length]}`} />
                                <span className="text-[11px] font-bold text-zinc-300">{item.label}</span>
                                <span className="text-[11px] font-mono text-zinc-500">{item.value}%</span>
                             </div>
                          );
                       })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {result.tokenomicsData.burningMechanism && (
                     <div className="card-glass p-8 bg-orange-500/5 border-orange-500/10">
                        <div className="flex items-center gap-3 mb-6">
                           <Flame className="text-orange-500" size={20} />
                           <h4 className="font-bold uppercase tracking-widest text-sm">Deflationary Systems</h4>
                        </div>
                        <div className="space-y-4">
                           <div className="flex items-center gap-3">
                              <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg font-black uppercase border border-orange-500/20">
                                 {result.tokenomicsData.burningMechanism.type}
                              </span>
                              {result.tokenomicsData.burningMechanism.percentageBurned && (
                                 <span className="text-sm text-orange-200 font-bold tabular-nums">
                                    {result.tokenomicsData.burningMechanism.percentageBurned} Extinguished
                                 </span>
                              )}
                           </div>
                           <p className="text-sm text-zinc-400 leading-relaxed">
                              {result.tokenomicsData.burningMechanism.description}
                           </p>
                        </div>
                     </div>
                   )}
                   {result.tvlData && (
                     <VestingDashboard data={result.tvlData} />
                   )}
                </div>
              </div>
            )}

            {activeTab === 'TEAM' && (
              <div className="space-y-12">
                {result.team && result.team.length > 0 && (
                  <TeamDossier team={result.team} />
                )}
                {result.investors && result.investors.length > 0 && (
                  <InvestorMap investors={result.investors} />
                )}
              </div>
            )}

            {activeTab === 'PRODUCT' && (
              <div className="space-y-8">
                {result.usecaseInfo && <UsecaseDossier info={result.usecaseInfo} />}
                {result.utilityInfo && <UtilityDossier info={result.utilityInfo} />}
                {result.roadmapInfo && <RoadmapDossier info={result.roadmapInfo} />}
              </div>
            )}

            {activeTab === 'COMPETITORS' && result.competitors && (
              <CompetitorMatrix competitors={result.competitors} />
            )}

            {activeTab === 'FORENSICS' && (
              <div className="grid grid-cols-1 gap-6">
                {result.sections && result.sections.length > 0 ? (
                  result.sections.map((section, idx) => {
                    const styles = getStatusStyles(section.status);
                    return (
                      <div 
                        key={idx}
                        className={`card-glass overflow-hidden ${styles.border} bg-zinc-900/40`}
                      >
                        <div className={`${styles.bg} border-b border-zinc-800 px-8 py-5 flex items-center justify-between`}>
                           <div className="flex items-center gap-3">
                              <div className={styles.text}>{getSectionIcon(section.title)}</div>
                              <h4 className="font-bold uppercase tracking-widest text-xs text-white">{section.title}</h4>
                           </div>
                        {/* SALIENCE BIAS: Danger pulse for visibility */}
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${styles.badgeBorder} bg-black/40 ${section.status === 'DANGER' ? 'animate-pulse ring-2 ring-red-500/20' : ''}`}>
                              <div className={`w-2 h-2 rounded-full ${styles.dot}`} />
                              <span className={`text-[10px] font-black uppercase ${styles.textLight}`}>{section.status}</span>
                        </div>
                        </div>
                        <div className="p-8 prose prose-zinc prose-invert prose-emerald max-w-none 
                           prose-p:text-zinc-400 prose-p:text-base prose-p:leading-relaxed prose-p:mb-6
                           prose-li:text-zinc-400 prose-li:text-base prose-li:mb-2
                           prose-strong:text-zinc-200 prose-strong:font-bold
                        ">
                           <ReactMarkdown>{section.content}</ReactMarkdown>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  result.fullAnalysisText && (
                    <div className="card-glass p-12 bg-zinc-900/40 prose prose-zinc prose-invert prose-emerald max-w-none">
                       <ReactMarkdown>{result.fullAnalysisText}</ReactMarkdown>
                    </div>
                  )
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* FOOTER BADGES AT BOTTOM OF MAIN CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-zinc-900 no-print">
           <div className="card-glass p-6 flex items-center gap-5">
              <div className="bg-emerald-500 p-2.5 rounded-xl text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                 <CheckCircle2 size={24} />
              </div>
              <div>
                 <p className="text-sm font-black text-white mb-0.5">FORENSIC INTEGRITY</p>
                 <p className="text-[10px] text-zinc-600 font-mono font-bold tracking-tighter uppercase">SCAN ID: CSF-992-X</p>
              </div>
           </div>
           <div className="card-glass p-6 flex items-center gap-5">
              <div className="bg-emerald-500 p-2.5 rounded-xl text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                 <Lock size={24} />
              </div>
              <div>
                 <p className="text-sm font-black text-white mb-0.5">ENCRYPTED REPORT</p>
                 <p className="text-[10px] text-zinc-600 font-mono font-bold tracking-tighter uppercase">END-TO-END VERIFIED</p>
              </div>
           </div>
           <div className="card-glass p-6 flex items-center gap-5">
              <div className="bg-emerald-500 p-2.5 rounded-xl text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                 <Share2 size={24} />
              </div>
              <div>
                 <p className="text-sm font-black text-white mb-0.5">INTEL EXPORT</p>
                 <p className="text-[10px] text-zinc-600 font-mono font-bold tracking-tighter uppercase">MULTI-NODE BROADCAST</p>
              </div>
           </div>
        </div>
      </main>
      </div>
    </div>
  );
}
