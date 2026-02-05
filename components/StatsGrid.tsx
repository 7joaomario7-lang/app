
import React from 'react';
import { UserStats } from '../types';

interface StatsGridProps {
  stats: UserStats;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const isTurbo = stats.downloadSpeed > 40; // Simple heuristic for UI display

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="glass p-4 rounded-2xl relative overflow-hidden group">
        {isTurbo && <div className="absolute top-0 right-0 p-1 bg-orange-600 text-[8px] font-bold rounded-bl-lg">BOOSTED</div>}
        <div className="flex items-center gap-2 text-blue-400 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Download</span>
        </div>
        <div className="text-xl font-black jetbrains-mono flex items-baseline gap-1">
          {stats.downloadSpeed.toFixed(1)} 
          <span className="text-[10px] font-normal text-gray-400 uppercase">Mbps</span>
        </div>
      </div>

      <div className="glass p-4 rounded-2xl relative overflow-hidden">
        {isTurbo && <div className="absolute top-0 right-0 p-1 bg-orange-600 text-[8px] font-bold rounded-bl-lg">BOOSTED</div>}
        <div className="flex items-center gap-2 text-purple-400 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Upload</span>
        </div>
        <div className="text-xl font-black jetbrains-mono flex items-baseline gap-1">
          {stats.uploadSpeed.toFixed(1)} 
          <span className="text-[10px] font-normal text-gray-400 uppercase">Mbps</span>
        </div>
      </div>

      <div className="glass p-4 rounded-2xl col-span-2 flex justify-between items-center bg-blue-600/5 border-blue-500/20">
        <div>
          <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Tunnel Data Throughput</div>
          <div className="text-lg font-black jetbrains-mono text-blue-100">{stats.dataUsed.toFixed(2)} <span className="text-xs font-medium">MB</span></div>
        </div>
        <div className="h-1.5 w-32 bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full bg-blue-500 transition-all duration-1000 ${isTurbo ? 'animate-pulse bg-orange-500' : ''}`} style={{ width: `${Math.min(100, stats.dataUsed * 2)}%` }} />
        </div>
      </div>
    </div>
  );
};

export default StatsGrid;
