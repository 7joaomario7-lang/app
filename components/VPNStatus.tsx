
import React from 'react';
import { ConnectionStatus, VPNServer } from '../types';

interface VPNStatusProps {
  status: ConnectionStatus;
  server: VPNServer;
  onToggle: () => void;
  timeFormatted: string;
  stability: number;
  activeUsersOnServer: number;
  downloadSpeed: number; // Added to show real-time count
}

const VPNStatus: React.FC<VPNStatusProps> = ({ 
  status, 
  server, 
  onToggle, 
  timeFormatted, 
  stability, 
  activeUsersOnServer,
  downloadSpeed 
}) => {
  const isConnected = status === ConnectionStatus.CONNECTED;
  const isConnecting = status === ConnectionStatus.CONNECTING;
  const isError = status === ConnectionStatus.ERROR;

  const getButtonLabel = () => {
    if (isConnecting) return 'SINCRONIZANDO';
    if (isConnected) return 'EM TRÂNSITO';
    if (isError) return 'TENTAR NOVAMENTE';
    return 'INICIAR TÚNEL';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8 space-y-6">
      <div className={`relative w-48 h-48 sm:w-64 sm:h-64 rounded-full flex items-center justify-center transition-all duration-700 ${
        isConnected ? 'bg-red-600/10 glow-red' : isError ? 'bg-yellow-500/10 glow-gold' : 'bg-white/5'
      }`}>
        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%" cy="50%" r="48%"
            className="fill-none stroke-white/5"
            strokeWidth="2"
          />
          {isConnected && (
            <circle
              cx="50%" cy="50%" r="48%"
              className="fill-none stroke-red-600 transition-all duration-300"
              strokeWidth="6"
              strokeDasharray="600"
              strokeDashoffset={600 - (600 * (downloadSpeed / 100))}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Outer Ring Decor */}
        {(isConnected || isError) && (
           <div className={`absolute inset-0 rounded-full border ${isError ? 'border-yellow-500/20' : 'border-red-500/20'} animate-ping opacity-20`} />
        )}

        <button
          onClick={onToggle}
          disabled={isConnecting}
          className={`z-10 w-36 h-36 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center transition-all transform active:scale-95 shadow-2xl relative overflow-hidden group ${
            isConnected 
              ? 'bg-gradient-to-br from-red-600 via-red-700 to-black'
              : isError
              ? 'bg-gradient-to-br from-yellow-500 via-yellow-600 to-black'
              : 'bg-gradient-to-br from-[#111] to-black border border-white/5'
          }`}
        >
          {isConnecting && (
             <div className="absolute inset-0 bg-white/5 animate-pulse" />
          )}
          
          <div className={`mb-1 transition-transform duration-500 ${isConnecting ? 'animate-bounce' : ''}`}>
             {isConnected ? (
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-white jetbrains-mono drop-shadow-lg">
                    {downloadSpeed.toFixed(1)}
                  </span>
                  <span className="text-[10px] font-black text-red-200 tracking-widest uppercase">Mbps</span>
                </div>
             ) : isError ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12 text-yellow-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
             ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12 text-gray-600">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                </svg>
             )}
          </div>
          
          <span className={`font-black text-[9px] tracking-[0.2em] uppercase mt-2 ${isConnected ? 'text-white/80' : isError ? 'text-black' : 'text-gray-500'}`}>
            {getButtonLabel()}
          </span>

          {isConnected && (
            <div className="absolute bottom-6 flex flex-col items-center">
                <span className="jetbrains-mono text-[10px] font-black text-white bg-black/40 px-2 py-0.5 rounded-md">
                    {timeFormatted}
                </span>
            </div>
          )}
        </button>
      </div>

      <div className="text-center px-4 w-full">
        <div className="flex items-center justify-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : isError ? 'bg-yellow-500 animate-pulse' : 'bg-gray-700'}`} />
            <h2 className={`text-lg font-black tracking-tight uppercase ${isConnected ? 'text-white' : isError ? 'text-yellow-500' : 'text-gray-500'}`}>
                {isConnecting ? 'Resolvendo DNS...' : isConnected ? 'Túnel AES-256 Ativo' : isError ? 'Falha na Conexão' : 'Aguardando Ativação'}
            </h2>
        </div>

        {isError && (
          <p className="text-yellow-200/70 text-xs font-medium mb-4 animate-fade-in">Verifique a sua SNI ou tente outro servidor.</p>
        )}

        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex flex-col items-start transition-all hover:bg-white/10">
                <span className="text-[7px] text-gray-500 font-black uppercase tracking-widest mb-1">Ponto de Saída</span>
                <div className="flex items-center gap-2">
                    <span className="text-xl leading-none">{server.flag}</span>
                    <span className="text-[10px] font-black text-white">{server.city}</span>
                </div>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex flex-col items-start transition-all hover:bg-white/10">
                <span className="text-[7px] text-gray-500 font-black uppercase tracking-widest mb-1">Qualidade do Nó</span>
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                    <span className="text-[10px] font-black text-white jetbrains-mono">{stability > 0 ? stability.toFixed(1) : 'N/A'}%</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VPNStatus;
