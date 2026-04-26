import React from 'react';
import { motion } from 'motion/react';
import { TVLData } from '../types';
import { 
  Lock, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle,
  Calendar,
  PieChart,
  Activity
} from 'lucide-react';

interface VestingDashboardProps {
  data: TVLData;
}

export default function VestingDashboard({ data }: VestingDashboardProps) {
  if (!data) return null;

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp size={16} className="text-emerald-500" />;
    if (trend === 'down') return <TrendingDown size={16} className="text-red-500" />;
    return <Minus size={16} className="text-zinc-500" />;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 px-2">
        <div className="h-px flex-1 bg-zinc-900" />
        <div className="flex flex-col items-center gap-1">
           <Lock className="text-zinc-500" size={16} />
           <h3 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.4em]">TVL & Liquidity Forensics</h3>
        </div>
        <div className="h-px flex-1 bg-zinc-900" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TVL Summary Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-glass p-6 bg-zinc-900/40 space-y-6"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Total Value Locked</span>
            <div className="flex items-center gap-3">
              <h4 className="text-3xl font-black text-white tabular-nums tracking-tighter">{data.currentValue}</h4>
              <div className="p-1 rounded bg-zinc-800">
                {getTrendIcon(data.trend)}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10 flex items-start gap-3">
            <AlertTriangle className="text-red-500 flex-shrink-0" size={16} />
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Inflation Warning</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">{data.unlockWarning}</p>
            </div>
          </div>
        </motion.div>

        {/* Vesting Table Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 card-glass bg-zinc-900/40 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-800/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-zinc-500" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Vesting & Release Roadmaps</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[9px] font-mono text-emerald-500 uppercase font-black">Audit Verified</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                  <th className="px-6 py-4 font-black">Stakeholder</th>
                  <th className="px-6 py-4 font-black text-center">Allocation</th>
                  <th className="px-6 py-4 font-black text-center">Cliff (Mo)</th>
                  <th className="px-6 py-4 font-black text-center">Duration (Mo)</th>
                  <th className="px-6 py-4 font-black">Frequency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {data.vestingSchedules.map((schedule, idx) => (
                  <tr key={idx} className="group hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-zinc-200 uppercase">{schedule.stakeholder}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-black text-emerald-400">{schedule.percentage}%</span>
                        <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500" 
                            style={{ width: `${schedule.percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className="text-[11px] font-mono text-zinc-400">{schedule.cliffMonths}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className="text-[11px] font-mono text-zinc-400">{schedule.vestingMonths}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-[10px] font-mono text-zinc-500 uppercase">{schedule.unlockFrequency}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
