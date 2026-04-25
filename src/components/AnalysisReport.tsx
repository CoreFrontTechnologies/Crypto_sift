import { AnalysisResult } from '../types';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
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
  BarChart3
} from 'lucide-react';

interface AnalysisReportProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function AnalysisReport({ result, onReset }: AnalysisReportProps) {
  const isBullish = result.verdict.toLowerCase().includes('bullish');

  const handleDownload = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Institutional Audit: ${result.tokenName}`,
      text: `CryptoSift Audit Result for ${result.tokenName}\nVerdict: ${result.verdict}\nInstitutional Score: ${result.scores.total}/10\nSummary: ${result.summary}`,
      url: window.location.origin
    };

    try {
      if (typeof navigator.share === 'function') {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\nSource: ${shareData.url}`);
        alert('Audit summary and link copied to technical clipboard.');
      }
    } catch (err) {
      console.error('Share failed', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
            className="flex-1 md:flex-none button-secondary text-xs h-10 px-4"
          >
            <Download size={14} /> Download PDF Audit
          </button>
          <button 
            onClick={handleShare}
            className="flex-1 md:flex-none button-primary text-xs h-10 px-4"
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
        
        {/* Print Brand (Hidden in UI) */}
        <div className="hidden print:block mb-8 border-b-2 border-emerald-500 pb-4">
           <h2 className="text-2xl font-black text-zinc-950 uppercase">Sayyed-Sift Forensic Report</h2>
           <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.2em]">Institutional-Grade Token Intelligence</p>
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-4">
             <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                Audit ID: {Math.random().toString(36).substring(7).toUpperCase()}
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
                  <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Audit Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-black tabular-nums ${isBullish ? 'text-emerald-500' : 'text-red-500'}`}>
                       {result.scores.total}
                    </span>
                    <span className="text-zinc-600 text-xl font-bold">/10</span>
                  </div>
               </div>
               
               <div className={`h-20 w-1.5 rounded-full ${isBullish ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${result.scores.total * 10}%` }}
                    className={`w-full rounded-full ${isBullish ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}
                  />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Verdict & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`col-span-1 p-8 rounded-2xl border flex flex-col justify-between ${isBullish ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
           <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-zinc-950 text-zinc-400 text-[9px] font-mono px-2 py-0.5 rounded border border-zinc-700">FINAL RECOMMENDATION</span>
              </div>
              <div className={`text-4xl font-black mb-2 uppercase tracking-tighter ${isBullish ? 'text-emerald-400' : 'text-red-400'}`}>
                 {result.verdict}
              </div>
              <div className="h-0.5 w-12 bg-current opacity-20 mb-6" />
           </div>
           
           <div className="space-y-4">
              <p className="text-zinc-300 text-sm leading-relaxed font-semibold italic">
                "{result.summary}"
              </p>
              <div className="text-xs text-zinc-500 border-t border-zinc-800/50 pt-4">
                 <span className="block font-bold mb-1 opacity-50 uppercase tracking-tighter">Analyst Notes:</span>
                 {result.verdictExplanation}
              </div>
           </div>
        </div>

        <div className="col-span-1 lg:col-span-2 card-glass p-8 bg-zinc-900/30">
           <div className="flex items-center gap-3 mb-8">
              <BarChart3 className="text-zinc-500" size={20} />
              <h3 className="font-bold uppercase tracking-wider text-sm">Vector Analysis</h3>
           </div>
           <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8">
              {[
                { label: 'Tokenomics', score: result.scores.tokenomics },
                { label: 'Team Forensics', score: result.scores.team },
                { label: 'Technical Stack', score: result.scores.useCase },
                { label: 'Institutional', score: result.scores.investors },
                { label: 'Competitive', score: result.scores.competition },
                { label: 'Social Velocity', score: result.scores.sentiment },
              ].map((v, i) => (
                <div key={i} className="space-y-3">
                   <div className="flex justify-between items-center px-0.5">
                      <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">{v.label}</span>
                      <span className="text-xs font-bold text-zinc-300">{v.score}/10</span>
                   </div>
                   <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${v.score * 10}%` }}
                        className="h-full bg-zinc-700 rounded-full transition-all duration-1000 ease-out"
                      />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Comprehensive Forensic Report */}
      <div className="card-glass overflow-hidden bg-zinc-900/40">
         <div className="bg-zinc-800/30 border-b border-zinc-800 px-8 py-5 flex items-center justify-between no-print">
            <div className="flex items-center gap-3">
               <Globe className="text-emerald-500" size={18} />
               <h3 className="font-bold uppercase tracking-widest text-xs">Decentralized Intelligence Deep-Dive</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-600 uppercase">Neural-Extracted Insight</span>
         </div>
         <div className="p-8 md:p-12 prose prose-zinc prose-invert prose-emerald max-w-none 
           prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-headings:font-sans
           prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:text-base
           prose-hr:border-zinc-800
           prose-strong:text-emerald-500/90 prose-strong:font-bold
           prose-li:text-zinc-400
           prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800
         ">
            <ReactMarkdown>{result.fullAnalysisText}</ReactMarkdown>
         </div>
      </div>

      {/* Trust Badges: Fixed Footer of Report */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print pb-20">
         <div className="card-glass p-6 flex items-center gap-4">
            <div className="bg-zinc-800/50 p-2.5 rounded-lg text-emerald-500">
               <CheckCircle2 size={20} />
            </div>
            <div>
               <p className="text-xs font-bold text-zinc-100 mb-0.5">Asset-Verified</p>
               <p className="text-[10px] text-zinc-500 font-mono tracking-tighter">DATA INTEGRITY SECURED</p>
            </div>
         </div>
         <div className="card-glass p-6 flex items-center gap-4">
            <div className="bg-zinc-800/50 p-2.5 rounded-lg text-emerald-500">
               <Lock size={20} />
            </div>
            <div>
               <p className="text-xs font-bold text-zinc-100 mb-0.5">Vector Cryptography</p>
               <p className="text-[10px] text-zinc-500 font-mono tracking-tighter">PRIVATE TERMINAL REPORT</p>
            </div>
         </div>
         <div className="card-glass p-6 flex items-center gap-4 text-zinc-500">
            <div className="bg-zinc-800/50 p-2.5 rounded-lg">
               <Share2 size={20} />
            </div>
            <div>
               <p className="text-xs font-bold text-zinc-100 mb-0.5">Institutional Export</p>
               <p className="text-[10px] text-zinc-500 font-mono tracking-tighter">MULTI-CHANNEL SHARE READY</p>
            </div>
         </div>
      </div>
    </div>
  );
}
