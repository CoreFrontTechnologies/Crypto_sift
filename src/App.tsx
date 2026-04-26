import { useState, useEffect } from 'react';
import { AnalysisResult } from './types';
import { analyzeProjectAutomated } from './services/geminiService';
import AnalysisForm from './components/AnalysisForm';
import AnalysisReport from './components/AnalysisReport';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Info, History as HistoryIcon, LayoutDashboard, Trash2 } from 'lucide-react';

export default function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('cs_audit_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history on change
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('cs_audit_history', JSON.stringify(history));
    }
  }, [history]);

  const handleAnalyze = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const report = await analyzeProjectAutomated(query);
      setResult(report);
      setHistory(prev => {
        const updated = [report, ...prev].slice(0, 10);
        return updated;
      });
      setShowHistory(false);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('403') || err.message?.includes('permission')) {
        setError('PERMISSION DENIED: Google Search tool restricted. Check API key permissions.');
      } else {
        setError(err.message || 'Audit failed. Check CA/Name and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('cs_audit_history');
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  const selectFromHistory = (item: AnalysisResult) => {
    setResult(item);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col scroll-smooth">
      {/* Institutional Header */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50 flex items-center shrink-0">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
             <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20">
               <ShieldCheck className="text-zinc-950" size={18} />
             </div>
             <div className="flex flex-col">
                <span className="text-sm font-extrabold tracking-tight uppercase leading-none">Crypto Exposer</span>
                <span className="text-[10px] text-zinc-500 font-mono font-medium tracking-tighter uppercase">Forensic Analyst V5</span>
             </div>
          </button>
          
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showHistory ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'}`}
             >
                <HistoryIcon size={14} />
                <span className="hidden sm:inline">Audit Records</span>
             </button>
             <div className="h-4 w-px bg-zinc-800" />
             <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">Analytic Node Active</span>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <AnimatePresence mode="wait">
          {showHistory ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white mb-1 italic">Audit Records</h2>
                  <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Local terminal query history</p>
                </div>
                <button 
                  onClick={clearHistory}
                  disabled={history.length === 0}
                  className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-2 transition-colors disabled:opacity-0"
                >
                  <Trash2 size={14} /> Wipe Terminal Data
                </button>
              </div>

              {history.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {history.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => selectFromHistory(h)}
                      className="card-glass p-5 flex items-start gap-4 text-left hover:border-emerald-500/40 transition-all group"
                    >
                      <div className="bg-zinc-800 p-3 rounded-lg group-hover:bg-zinc-700 transition-colors">
                        <LayoutDashboard size={20} className="text-zinc-400" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-bold text-zinc-100 truncate">{h.tokenName}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${h.verdict.includes('BULLISH') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                            {h.verdict.split(' ')[0]}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 truncate mb-2">{h.summary}</p>
                        <div className="flex items-center gap-3 text-[10px] text-zinc-600 font-mono">
                          <span>SCORE: {h.scores.total}/10</span>
                          <span>•</span>
                          <span>CA-VERIFIED</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-zinc-600 card-glass border-dashed border-2 border-zinc-800">
                  <HistoryIcon size={40} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium">Terminal history is empty.</p>
                </div>
              )}
              
              <div className="flex justify-center">
                <button 
                  onClick={() => setShowHistory(false)}
                  className="button-secondary text-xs font-bold uppercase tracking-wider"
                >
                  Back to Research Terminal
                </button>
              </div>
            </motion.div>
          ) : !result ? (
            <motion.div
              key="analyze"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12 max-w-3xl mx-auto md:text-center"
            >
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
                  Next-Gen <span className="text-emerald-500">Crypto Exposer</span> Forensic AI.
                </h2>
                <div className="flex items-start md:items-center gap-4 p-5 card-glass border-emerald-500/20 bg-emerald-500/5 text-left md:text-center md:flex-col lg:flex-row lg:text-left">
                   <div className="mt-1 md:mt-0">
                      <Info className="text-emerald-500" size={20} />
                   </div>
                   <p className="text-zinc-300 text-sm leading-relaxed font-medium">
                      Enter a token name or contract address. Our AI engine conducts forensic research across on-chain data, leadership history, and market sentiment.
                   </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/5 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 font-medium text-sm">
                  <Info size={18} /> {error}
                </div>
              )}

              <AnalysisForm onAnalyze={handleAnalyze} isLoading={loading} />
            </motion.div>
          ) : (
            <motion.div
              key="report"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[70vh]"
            >
              <AnalysisReport result={result} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-zinc-900 py-8 shrink-0 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-zinc-600 font-mono uppercase tracking-[0.2em] font-medium">
          <div className="flex items-center gap-6">
             <span className="flex items-center gap-2"><div className="w-1 h-1 bg-zinc-700 rounded-full" /> SECURE-NODE-V5</span>
             <span className="flex items-center gap-2"><div className="w-1 h-1 bg-zinc-700 rounded-full" /> TERRA-W7-EU</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-emerald-500 transition-colors">Forensic Methodology</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Institutional Compliance</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">v5.0-ALPHA</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
