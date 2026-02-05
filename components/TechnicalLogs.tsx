
import React from 'react';
import { ConnectionLog } from '../types';

interface TechnicalLogsProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ConnectionLog[];
}

const TechnicalLogs: React.FC<TechnicalLogsProps> = ({ isOpen, onClose, logs }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-slide-up">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-900">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="jetbrains-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">Core Engine Logs</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="h-96 overflow-y-auto p-4 bg-black/50 custom-scrollbar flex flex-col-reverse gap-1 jetbrains-mono">
          {logs.length === 0 ? (
            <div className="h-full flex items-center justify-center opacity-20 text-[10px] uppercase font-bold tracking-[0.3em]">
               Waiting for events...
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex gap-3 text-[10px] leading-relaxed">
                <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
                <span className={`
                  ${log.type === 'success' ? 'text-green-500' : 
                    log.type === 'error' ? 'text-red-500' : 
                    log.type === 'warning' ? 'text-yellow-500' : 
                    'text-blue-400'}
                `}>
                  {log.type === 'success' ? '✓' : log.type === 'error' ? '✗' : '•'} {log.message}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-zinc-900 border-t border-white/10 flex justify-between items-center">
            <div className="flex gap-4">
                <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">Stack</span>
                    <span className="text-[10px] font-black text-white">XRAY/V2RAY</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">Cipher</span>
                    <span className="text-[10px] font-black text-white">CHACHA20</span>
                </div>
            </div>
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black text-white uppercase transition-all"
            >
                Confirmar Logs
            </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicalLogs;
