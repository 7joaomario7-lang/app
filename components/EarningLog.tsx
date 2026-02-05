
import React from 'react';
import { EarningEntry } from '../types';

interface EarningLogProps {
  isOpen: boolean;
  onClose: () => void;
  history: EarningEntry[];
}

const EarningLog: React.FC<EarningLogProps> = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null;

  const totalCredits = history
    .filter(e => e.type === 'credits')
    .reduce((acc, curr) => acc + (curr.amount as number), 0);

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#020617] h-full shadow-2xl flex flex-col animate-slide-left border-l border-white/10">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-800">
          <div>
            <h3 className="text-xl font-black tracking-tight text-white">Reward Registry</h3>
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-0.5">Earning History</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 bg-amber-500/5 border-b border-white/5 shrink-0">
          <div className="glass p-4 rounded-2xl flex items-center justify-between border-amber-500/20">
            <div>
              <div className="text-[9px] text-gray-500 uppercase font-black tracking-[0.2em] mb-1">Total Lifetime Credits</div>
              <div className="text-2xl font-black text-amber-500 jetbrains-mono">{totalCredits}</div>
            </div>
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-amber-500">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-bold uppercase tracking-widest">No Activity Yet</p>
              <p className="text-xs mt-2">Watch advertisements to earn credits and boost your connection.</p>
            </div>
          ) : (
            history.map((entry) => (
              <div key={entry.id} className="glass p-4 rounded-2xl flex items-center justify-between border-white/5 hover:border-white/10 transition-colors animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    entry.type === 'credits' ? 'bg-amber-500/10 text-amber-500' : 'bg-orange-600/10 text-orange-500'
                  }`}>
                    {entry.type === 'credits' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M1 4a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4zm12 4a3 3 0 11-6 0 3 3 0 016 0zM4 5a1 1 0 100 2 1 1 0 000-2zm12 0a1 1 0 100 2 1 1 0 000-2zM4 11a1 1 0 100 2 1 1 0 000-2zm12 0a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M13.5 4.938a7 7 0 11-9.006 1.737c.202-.257.59-.218.793.039.278.351.587.667.921.943.02.016.039.034.058.052a5.5 5.5 0 106.312-.522c.225-.213.603-.13.734.13.11.22.186.454.224.697.027.172-.081.336-.249.382a4.5 4.5 0 01-5.39-5.511c.019-.19.17-.33.361-.33a.53.53 0 01.195.037l.033.012a4.47 4.47 0 011.886 1.838c.18.314.514.306.671.05.614-.99.994-2.183.994-3.474 0-.332-.026-.65-.075-.962-.034-.211.205-.348.372-.22a7.001 7.001 0 012.315 4.07z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{entry.label}</div>
                    <div className="text-[10px] text-gray-500 jetbrains-mono">
                      {entry.timestamp.toLocaleDateString()} • {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-black jetbrains-mono ${
                  entry.type === 'credits' ? 'text-amber-500' : 'text-orange-500'
                }`}>
                  {entry.type === 'credits' ? `+${entry.amount}` : entry.amount}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-900/80 border-t border-white/5">
           <button 
             onClick={onClose}
             className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-black text-xs tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-blue-500/10"
           >
             RETURN TO DASHBOARD
           </button>
        </div>
      </div>
    </div>
  );
};

export default EarningLog;
