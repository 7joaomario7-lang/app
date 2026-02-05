
import React, { useState } from 'react';
import { AD_PROVIDERS } from '../constants';

interface AdRewardProps {
  onReward: (type: 'credits' | 'turbo' | 'time') => void;
  turboActive: boolean;
}

const AdReward: React.FC<AdRewardProps> = ({ onReward, turboActive }) => {
  const [isWatching, setIsWatching] = useState(false);
  const [rewardType, setRewardType] = useState<'credits' | 'turbo' | 'time'>('credits');
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentAd, setCurrentAd] = useState(AD_PROVIDERS[0]);

  const startAd = (type: 'credits' | 'turbo' | 'time') => {
    const randomProvider = AD_PROVIDERS[Math.floor(Math.random() * AD_PROVIDERS.length)];
    setCurrentAd(randomProvider);

    setIsWatching(true);
    setRewardType(type);
    setTimeLeft(5);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsWatching(false);
          onReward(type);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="glass p-5 rounded-3xl flex flex-col items-center gap-3 relative overflow-hidden h-full justify-center border border-white/5">
      {isWatching && (
        <div className={`absolute inset-0 ${currentAd.color} flex flex-col items-center justify-center z-50 animate-fade-in text-center p-4`}>
            <div className={`w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-black mb-4 border-2 border-white/30 ${currentAd.textColor}`}>
                {currentAd.logo}
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${currentAd.textColor} opacity-70`}>Anúncio de {currentAd.name}</p>
            <div className={`font-bold text-xl mt-2 ${currentAd.textColor}`}>
                {rewardType === 'turbo' ? 'Turbinando Túnel...' : rewardType === 'time' ? 'Ganhando Tempo...' : 'Processando Recompensa...'}
            </div>
            <div className={`text-sm ${currentAd.textColor} opacity-80 mt-1 italic`}>Conclusão em {timeLeft}s</div>
            <div className="mt-4 w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-1000" style={{ width: `${(5 - timeLeft) * 20}%` }} />
            </div>
        </div>
      )}

      <div className="text-center mb-1 w-full flex justify-between items-center px-1">
        <h4 className="font-black text-yellow-500 text-[10px] flex items-center gap-2 uppercase tracking-widest">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
            <path d="M4.5 3.75a.75.75 0 00-1.5 0v16.5a.75.75 0 001.5 0V3.75zM19.5 3.75a.75.75 0 00-1.5 0v16.5a.75.75 0 001.5 0V3.75zM6.75 6a.75.75 0 01.75-.75h9a.75.75 0 01.75.75v12a.75.75 0 01-.75.75h-9a.75.75 0 01-.75-.75V6z" />
          </svg>
          CENTRO DE RECOMPENSAS
        </h4>
        <span className="text-[9px] font-bold text-gray-500">REDE ANGOLA</span>
      </div>

      <div className="flex flex-col w-full gap-2">
        <button 
          onClick={() => startAd('time')}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-black py-3 rounded-2xl transition-all shadow-lg active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          +1 HORA GRÁTIS (ANÚNCIO)
        </button>

        <div className="grid grid-cols-2 gap-2">
            <button 
                onClick={() => startAd('turbo')}
                disabled={turboActive}
                className={`flex items-center justify-center gap-2 font-black py-2.5 rounded-xl text-[10px] transition-all shadow-md ${
                    turboActive 
                    ? 'bg-red-600/20 text-red-500 border border-red-500/30 cursor-default' 
                    : 'bg-red-600 hover:bg-red-700 text-white active:scale-95'
                }`}
            >
                {turboActive ? 'TURBO ON' : 'TURBO AD'}
            </button>

            <button 
                onClick={() => startAd('credits')}
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-yellow-500 font-black py-2.5 rounded-xl text-[10px] transition-all border border-yellow-500/20 active:scale-95"
            >
                +10 CRÉDITOS
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdReward;
