import { useState, useEffect } from 'react';
import { AnalysisResult } from './types';
import { analyzeProjectAutomated } from './services/geminiService';
import AnalysisReport from './components/AnalysisReport';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  History as HistoryIcon, 
  Settings, 
  LayoutDashboard, 
  LogOut, 
  ArrowRight,
  Loader2,
  Cpu,
  Zap,
  Lock,
  Wallet,
  Activity,
  CreditCard,
  Trash2,
  CheckCircle2,
  Globe,
  Plus
} from 'lucide-react';

export default function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [query, setQuery] = useState('');
  const [activeView, setActiveView] = useState<'audit' | 'history' | 'settings' | 'billing'>('audit');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // Loading Timer Logic
  useEffect(() => {
    let interval: any;
    if (loading) {
      setTimer(60);
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const report = await analyzeProjectAutomated(query);
      setResult(report);
      setHistory(prev => {
        const updated = [report, ...prev].slice(0, 10);
        return updated;
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Audit failed. Check CA/Name and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setQuery('');
    setActiveView('audit');
  };

  const selectFromHistory = (item: AnalysisResult) => {
    setResult(item);
    setActiveView('audit');
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('cs_audit_history');
  };

  return (
    <div className="flex h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-emerald-500 overflow-hidden font-sans">
      
      {/* DECORATIVE ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent)]" />
        <div className="scanline" />
      </div>

      {/* STATIC SIDEBAR (ChatGPT/Claude Style) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>
      
      <aside className={`fixed lg:static inset-y-0 left-0 z-[60] w-[280px] bg-zinc-950 border-r border-zinc-900 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-[20px_0_40px_rgba(0,0,0,0.8)]' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-zinc-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                 CE
              </div>
              <div className="flex flex-col">
                 <span className="font-black text-white text-sm uppercase tracking-tighter leading-none">Crypto</span>
                 <span className="font-black text-emerald-500 text-sm uppercase tracking-tighter leading-none">Exposer</span>
              </div>
           </div>
           <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-zinc-500 hover:text-white transition-colors">
              <Plus size={24} className="rotate-45" />
           </button>
        </div>

        <div className="p-4 space-y-4 flex-1 flex flex-col overflow-hidden">
          {/* Global Counter (Restored) */}
          <div className="px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
             <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Global Scans</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             </div>
             <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-white tabular-nums">482,901</span>
                <span className="text-[10px] font-mono text-emerald-500/50">+12%</span>
             </div>
          </div>

          {/* New Scan Button */}
          <button 
            onClick={handleReset}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all group"
          >
            <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-zinc-950">
               <Plus size={16} />
            </div>
            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">New Audit</span>
          </button>

          {/* History / Recent (ChatGPT style) */}
          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-6 pt-4">
             <div className="space-y-1">
                <p className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Recent Dossiers</p>
                {history.length > 0 ? (
                  history.slice(0, 8).map((h, i) => (
                    <button
                      key={i}
                      onClick={() => selectFromHistory(h)}
                      className="w-full text-left truncate px-4 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg group flex items-center justify-between"
                    >
                      <span className="truncate">{h.tokenName}</span>
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-emerald-500" />
                    </button>
                  ))
                ) : (
                  <p className="px-4 text-[10px] text-zinc-700 font-mono italic">No recent activity detected.</p>
                )}
             </div>

             <nav className="space-y-1 pt-6 border-t border-zinc-900">
                {[
                  { id: 'audit', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
                  { id: 'history', label: 'Database', icon: <HistoryIcon size={18} /> },
                  { id: 'billing', label: 'Subscription', icon: <CreditCard size={18} /> },
                  { id: 'settings', label: 'Terminal', icon: <Settings size={18} /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id as any);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                      activeView === item.id 
                        ? 'bg-zinc-900 text-white shadow-sm' 
                        : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50'
                    }`}
                  >
                    <div className={activeView === item.id ? 'text-emerald-500' : 'text-zinc-700'}>
                      {item.icon}
                    </div>
                    {item.label}
                  </button>
                ))}
             </nav>
          </div>
        </div>

        {/* User / Bottom */}
        <div className="p-4 space-y-4 border-t border-zinc-900 bg-zinc-950">
           <div className="px-4 py-3 rounded-xl bg-zinc-900/30 border border-zinc-800/50 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                 <span>Scan Limit</span>
                 <span className="text-emerald-500">75%</span>
              </div>
              <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                 <div className="h-full w-3/4 bg-emerald-500" />
              </div>
           </div>
           
           <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 font-mono text-[10px]">
                 SY
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-xs font-bold text-white truncate">Sayyid Yahaya</p>
                 <p className="text-[10px] text-zinc-500 font-mono truncate">Administrator</p>
              </div>
              <LogOut size={16} className="text-zinc-700 cursor-pointer hover:text-white" />
           </div>
        </div>
      </aside>


      {/* MAIN VIEWPORT */}
      <main id="main-viewport" className="flex-1 flex flex-col h-full bg-zinc-950 overflow-y-auto relative scroll-smooth">
        <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-6 lg:px-8 shrink-0 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400"
              >
                <Activity size={20} />
              </button>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-zinc-950">
                    <ShieldCheck size={20} />
                 </div>
                 <h1 className="font-black text-lg text-white uppercase tracking-tighter">CRYPTO EXPOSER</h1>
              </div>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6 no-print">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">System Ready</span>
                 </div>
                 <div className="h-6 w-px bg-zinc-800" />
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Next Re-Scan</span>
                    <span className="text-[10px] font-mono text-emerald-500">00:54:12</span>
                 </div>
              </div>
           </div>
        </header>


        <div className="flex-1 p-4 lg:p-8 w-full mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            {activeView === 'audit' && (
              <motion.div
                key={result ? 'report' : 'search'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full"
              >
                {!result ? (
                  <div className="max-w-3xl mx-auto space-y-8 lg:space-y-12 mt-4 lg:mt-8">
                    <div className="space-y-4 text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]"
                      >
                        <Activity size={14} className="animate-pulse" />
                        Live Intelligence Active
                      </motion.div>
                      <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-white leading-[0.8] uppercase">
                        EXPOSE <br />
                        <span className="text-emerald-500">TRUTH.</span>
                      </h2>
                      <p className="text-zinc-500 text-sm sm:text-lg lg:text-xl font-medium max-w-xl mx-auto leading-relaxed">
                        Industry-grade forensic terminal for protocol intelligence. Unmasking the chain, one block at a time.
                      </p>
                    </div>



                    <div className="space-y-12">
                      <div className="relative max-w-2xl mx-auto group">
                        {/* Premium Glow effect */}
                        <div className="absolute -inset-4 bg-emerald-500/10 rounded-[3rem] blur-3xl opacity-0 group-focus-within:opacity-100 transition-all duration-1000" />
                        
                        <div className="relative flex flex-col md:flex-row items-stretch md:items-center bg-zinc-950/40 backdrop-blur-3xl border border-zinc-900 rounded-3xl md:rounded-[2.5rem] p-2 md:pl-8 md:pr-2 shadow-2xl group-focus-within:border-emerald-500/30 transition-all duration-500 overflow-hidden ring-1 ring-white/5">
                          <div className="hidden md:flex text-zinc-700 group-focus-within:text-emerald-500 transition-colors">
                            <Search size={24} />
                          </div>
                          
                          <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                            placeholder="Protocol Name or CA..."
                            className="w-full flex-1 bg-transparent border-none focus:ring-0 text-base md:text-lg lg:text-xl font-bold px-4 md:px-6 py-4 md:py-6 placeholder:text-zinc-800 text-white tracking-tight"
                          />
                          
                          <button
                            onClick={handleAnalyze}
                            disabled={loading || !query.trim()}
                            className="w-full md:w-auto h-14 md:h-20 px-12 rounded-[2rem] bg-emerald-500 text-zinc-950 font-black uppercase tracking-[0.2em] text-xs hover:bg-emerald-400 active:scale-95 disabled:opacity-30 disabled:hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 shrink-0 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                          >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                              <>
                                <span>Initiate Audit</span>
                                <ArrowRight size={16} />
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-10 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                        <div className="flex items-center gap-3">
                           <Activity size={18} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Real-time Liquidity</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <ShieldCheck size={18} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Team Provenance</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <LayoutDashboard size={18} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Capital Mapping</span>
                        </div>
                      </div>

                      <div className="p-8 rounded-[2rem] bg-zinc-900/30 border border-zinc-800/50 flex flex-col md:flex-row gap-6 relative overflow-hidden group">
                        <div className="absolute -right-8 -bottom-8 text-emerald-500/5 rotate-12 group-hover:scale-110 transition-transform duration-700">
                           <ShieldCheck size={160} />
                        </div>
                        <div className="shrink-0">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                             <Zap className="text-emerald-500" size={24} />
                          </div>
                        </div>
                        <div className="space-y-2 relative z-10">
                          <p className="text-zinc-200 text-lg font-black uppercase tracking-tight">
                             PRO TIP: ACCURACY MATTERS
                          </p>
                          <p className="text-zinc-500 text-sm leading-relaxed font-medium max-w-lg">
                             For deep-tier forensic results, always supply the <span className="text-emerald-400">Contract Address (CA)</span>. Our engine will bridge directly into the protocol's bytecode and relational data.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 pt-8">
                         <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest text-center">Live Forensic Stream</h3>
                         <div className="flex flex-wrap items-center justify-center gap-3">
                            {[
                               { name: 'PEPE', score: 42 },
                               { name: 'LINK', score: 88 },
                               { name: 'SOL', score: 76 },
                               { name: 'TRUMP', score: 12 },
                               { name: 'AVAX', score: 65 }
                            ].map((audit, i) => (
                               <div key={i} className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${audit.score > 70 ? 'bg-emerald-500' : audit.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                  <span className="text-[10px] font-black text-zinc-400">{audit.name}</span>
                                  <span className="text-[10px] font-mono text-zinc-600">{audit.score}%</span>
                               </div>
                            ))}
                         </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <AnalysisReport result={result} onReset={handleReset} />
                )}
              </motion.div>
            )}

            {activeView === 'history' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-end border-b border-zinc-900 pb-8">
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">Audit Records</h2>
                    <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.3em]">Query history for this terminal node</p>
                  </div>
                  <button 
                    onClick={clearHistory}
                    disabled={history.length === 0}
                    className="h-10 px-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center gap-2 disabled:opacity-0"
                  >
                    <Trash2 size={14} /> Wipe Data
                  </button>
                </div>

                {history.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((h, i) => (
                      <button
                        key={i}
                        onClick={() => selectFromHistory(h)}
                        className="card-glass p-6 text-left hover:border-emerald-500/40 transition-all group flex flex-col justify-between h-48"
                      >
                         <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:bg-zinc-700 transition-colors shrink-0">
                                <LayoutDashboard size={18} className="text-zinc-400" />
                              </div>
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                                h.verdict.toUpperCase().includes('BUY') 
                                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                  : h.verdict.toUpperCase().includes('AVOID') || h.verdict.toUpperCase().includes('SELL')
                                    ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                              } uppercase tracking-tighter`}>
                                {h.verdict}
                              </span>
                            </div>
                            <div>
                               <h3 className="font-black text-white text-lg tracking-tight truncate">{h.tokenName}</h3>
                               <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{h.ticker}</p>
                            </div>
                         </div>
                         <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                            <div className="flex items-center gap-2">
                               <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                               <span className="text-[9px] font-bold text-zinc-600 font-mono">SCORE: {h.scores.total}/100</span>
                            </div>
                            <ArrowRight size={14} className="text-zinc-700 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                         </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="h-96 flex flex-col items-center justify-center text-zinc-800 card-glass border-dashed bg-transparent">
                    <HistoryIcon size={64} className="mb-6 opacity-5" />
                    <p className="text-xs font-black uppercase tracking-widest opacity-20">No archived audit intelligence found.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeView === 'billing' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto py-12"
              >
                <div className="text-center space-y-4 mb-16">
                  <h2 className="text-4xl font-black tracking-tighter uppercase italic">Institutional Access</h2>
                  <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.3em]">Upgrade your terminal for unlimited forensic bandwidth</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="card-glass p-10 bg-zinc-900/40 border-zinc-800 space-y-8">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Free Terminal</span>
                      <h3 className="text-2xl font-black">STANDARD_SEC</h3>
                      <p className="text-5xl font-black tracking-tighter">$0 <span className="text-lg text-zinc-600 font-medium tracking-normal">/month</span></p>
                    </div>
                    <ul className="space-y-4 pt-8 border-t border-zinc-800">
                      {['3 Audit Scans / Day', 'Standard Web Search', 'Basic PDF Export', 'Public History'].map((feat, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs text-zinc-400">
                          <CheckCircle2 size={16} className="text-zinc-700" /> {feat}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full h-14 rounded-2xl bg-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-xs cursor-default">Current Plan</button>
                  </div>

                  <div className="card-glass p-10 bg-emerald-500/5 border-emerald-500/30 space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500 text-zinc-950 text-[10px] font-black uppercase tracking-widest rounded-bl-xl group-hover:bg-emerald-400 transition-colors">Recommended</div>
                    <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/10 blur-[64px] rounded-full" />
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Elite Terminal</span>
                      <h3 className="text-2xl font-black">OPERATOR_NODE</h3>
                      <p className="text-5xl font-black tracking-tighter text-emerald-400">$49 <span className="text-lg text-emerald-900 font-medium tracking-normal">/month</span></p>
                    </div>
                    <ul className="space-y-4 pt-8 border-t border-emerald-500/10">
                      {['Unlimited Audit Scans', 'Deep-Tier Forensic Search', 'Branded Institutional PDF', 'Private Local History', 'Priority Neural Compute'].map((feat, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs text-zinc-300">
                          <CheckCircle2 size={16} className="text-emerald-500" /> {feat}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full h-14 rounded-2xl bg-emerald-500 text-zinc-950 font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]">Upgrade Now</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'settings' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-2xl mx-auto space-y-12"
              >
                 <div className="border-b border-zinc-900 pb-8">
                    <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">Config_Terminal</h2>
                    <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.3em]">System-level environment setup</p>
                 </div>

                 <div className="space-y-8">
                    <div className="space-y-6">
                       <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">API Configuration</h3>
                       <div className="space-y-4">
                          <div className="flex items-center justify-between p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                             <div className="space-y-1">
                                <p className="text-sm font-bold text-white uppercase tracking-tight">Gemini Forensic Key</p>
                                <p className="text-[10px] text-zinc-500 font-mono">••••••••••••••••••••••••</p>
                             </div>
                             <button className="px-4 py-2 rounded-lg bg-zinc-800 text-[10px] font-black text-zinc-300 uppercase tracking-widest hover:bg-zinc-700 transition-all">Revoke</button>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Interface Preferences</h3>
                       <div className="space-y-4">
                          <div className="flex items-center justify-between p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                             <div className="space-y-1">
                                <p className="text-sm font-bold text-white uppercase tracking-tight">Audio Feedback</p>
                                <p className="text-[10px] text-zinc-500">Enable system sound effects during forensic scans</p>
                             </div>
                             <div className="w-12 h-6 rounded-full bg-emerald-500 p-1 cursor-pointer">
                                <div className="w-4 h-4 rounded-full bg-zinc-950 ml-auto" />
                             </div>
                          </div>
                          <div className="flex items-center justify-between p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                             <div className="space-y-1">
                                <p className="text-sm font-bold text-white uppercase tracking-tight">Deep Scan Mode</p>
                                <p className="text-[10px] text-zinc-500">Automatically supply CA for all protocol names</p>
                             </div>
                             <div className="w-12 h-6 rounded-full bg-zinc-800 p-1 cursor-pointer">
                                <div className="w-4 h-4 rounded-full bg-zinc-950" />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ANALYSIS TERMINAL FEED */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl">
          <div className="flex flex-col items-center gap-12 max-w-sm w-full">
             <div className="relative">
                {/* Advanced Tech Rings */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-12 border border-emerald-500/10 rounded-full" 
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-8 border border-white/5 rounded-full border-dashed" 
                />
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -inset-2 bg-emerald-500/5 blur-xl rounded-full" 
                />
                
                <div className="w-40 h-40 rounded-[2.5rem] bg-zinc-950 border border-zinc-900 flex flex-col items-center justify-center shadow-2xl relative z-10 overflow-hidden group">
                   <div className="absolute inset-0 bg-grid opacity-20" />
                   <span className="text-4xl font-black text-white tabular-nums tracking-tighter relative z-10">
                     {timer}
                   </span>
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest relative z-10 opacity-60">Seconds Left</span>
                   
                   {/* Scanning Bar */}
                   <motion.div 
                     animate={{ top: ['0%', '100%', '0%'] }}
                     transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                     className="absolute left-0 right-0 h-1/2 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent pointer-events-none"
                   />
                </div>
             </div>
             
             <div className="text-center space-y-6 w-full">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em]">Neural Audit in Progress</p>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em]">Executing Multi-Chain Verification...</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                   {[
                     { label: 'Blockchain Forensics', status: timer > 45 ? 'INITIATING' : 'COMPLETE' },
                     { label: 'Social Engineering Audit', status: timer > 30 ? (timer > 45 ? 'WAITING' : 'ANALYZING') : 'COMPLETE' },
                     { label: 'Liquidity Depth Test', status: timer > 15 ? (timer > 30 ? 'WAITING' : 'CALCULATING') : 'COMPLETE' },
                     { label: 'Final Risk Verdict', status: timer > 5 ? 'STABILIZING' : 'SYNTHESIZING' }
                   ].map((step, i) => (
                     <div key={i} className="flex justify-between items-center px-4 py-3 rounded-xl bg-white/5 border border-white/5 font-mono">
                        <span className="text-[9px] text-zinc-400 uppercase">{step.label}</span>
                        <span className={`text-[9px] font-black ${step.status === 'COMPLETE' ? 'text-emerald-500' : 'text-zinc-600'} flex items-center gap-2`}>
                           {step.status === 'COMPLETE' && <CheckCircle2 size={10} />}
                           {step.status}
                        </span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* SCROLL TO TOP BUTTON */}
      <button 
        onClick={() => document.getElementById('main-viewport')?.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] z-[40] transition-all hover:scale-110 active:scale-95"
      >
        <ArrowRight size={20} className="-rotate-90" />
      </button>
    </div>
  );
}
