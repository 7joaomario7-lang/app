
import React, { useState, useEffect } from 'react';
import { SNIConfig } from '../types';
import { SNI_CATEGORIES } from '../constants';
import { encryptHost } from '../utils';
import { notificationService } from '../services/notificationService';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  config: SNIConfig;
  onUpdate: (config: SNIConfig) => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, config, onUpdate }) => {
  const [hostError, setHostError] = useState<string | null>(null);
  const hostnameRegex = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,12}$/i;
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    validateHost(config.host);
  }, [config.host]);

  useEffect(() => {
    if (isOpen && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, [isOpen]);

  const handleRequestNotificationPermission = async () => {
    const permission = await notificationService.requestPermission();
    setNotificationPermission(permission);
  };

  const validateHost = (host: string) => {
    if (!host) {
      setHostError("Hostname vazio");
      return false;
    }
    if (!hostnameRegex.test(host)) {
      setHostError("Host inválido");
      return false;
    }
    setHostError(null);
    return true;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Estável': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Rápido': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Instável': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  }

  const connectionModes: { label: string; value: SNIConfig['protocol']; description: string }[] = [
    { label: 'WebSocket', value: 'WS', description: 'Ideal para estabilidade.' },
    { label: 'SSL/TLS (Direct)', value: 'TLS', description: 'Conexão direta, rápida.' },
    { label: 'SSH + Proxy', value: 'SSH+PROXY', description: 'Requer config. manual.' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass w-full max-w-lg rounded-3xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh] border-t border-white/10">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-white italic">Painel de Conexão Avançada</h3>
            <p className="text-[10px] text-green-500 font-black tracking-widest uppercase mt-1">SNI Inteligente Unitel</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0_0_24_24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Notificações Push</label>
            <div className="glass p-4 rounded-2xl flex items-center justify-between border border-white/10 bg-white/5">
              <p className="text-sm text-gray-300 max-w-[70%]">Receba alertas sobre recompensas e estado da conexão.</p>
              {notificationPermission === 'granted' && (
                <button disabled className="px-4 py-2 bg-green-500/20 text-green-400 text-[10px] font-black rounded-xl border border-green-500/30">
                  ATIVADAS
                </button>
              )}
              {notificationPermission === 'denied' && (
                <button disabled className="px-4 py-2 bg-red-500/20 text-red-400 text-[10px] font-black rounded-xl border border-red-500/30">
                  BLOQUEADAS
                </button>
              )}
              {notificationPermission === 'default' && (
                <button onClick={handleRequestNotificationPermission} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black rounded-xl transition-colors">
                  ATIVAR
                </button>
              )}
            </div>
            {notificationPermission === 'denied' && (
              <p className="text-center text-[10px] text-yellow-500/80 px-2">Você precisa permitir notificações nas configurações do seu navegador para reativar.</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Protocolo de Conexão</label>
            <div className="grid grid-cols-3 gap-2">
              {connectionModes.map(mode => (
                <button
                  key={mode.value}
                  onClick={() => onUpdate({ ...config, protocol: mode.value })}
                  className={`p-3 rounded-xl text-center transition-all border ${
                    config.protocol === mode.value
                      ? 'bg-red-600/20 border-red-500'
                      : 'bg-white/5 border-transparent hover:border-white/20'
                  }`}
                >
                  <span className="text-xs font-bold text-white block">{mode.label}</span>
                  <span className="text-[9px] text-gray-400 block mt-1">{mode.description}</span>
                </button>
              ))}
            </div>
          </div>

          {config.protocol === 'SSH+PROXY' && (
            <div className="animate-fade-in space-y-3 p-4 bg-red-900/20 border border-red-500/20 rounded-2xl">
              <label className="text-[10px] font-black text-red-400 uppercase tracking-wider">Configuração de Proxy Manual (Obrigatório)</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={config.proxyHost || ''}
                  onChange={(e) => onUpdate({ ...config, proxyHost: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 text-white font-mono col-span-2"
                  placeholder="Host do Proxy"
                />
                <input
                  type="number"
                  value={config.proxyPort || ''}
                  onChange={(e) => onUpdate({ ...config, proxyPort: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 text-white font-mono"
                  placeholder="Porta"
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">SNI / Bug Host Manual</label>
            <input
              type="text"
              value={config.host}
              onChange={(e) => onUpdate({ ...config, host: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm focus:outline-none transition-all jetbrains-mono text-white"
              placeholder="Ex: internet.unitel.co.ao"
            />
          </div>

          {Object.entries(SNI_CATEGORIES).map(([category, hosts]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{category}</h4>
              <div className="grid grid-cols-1 gap-2">
                {hosts.map(({ host, status }) => (
                  <button
                    key={host}
                    onClick={() => onUpdate({ ...config, host })}
                    className={`p-4 rounded-2xl flex items-center justify-between transition-all border ${
                      config.host === host
                        ? 'bg-red-600/20 border-red-500'
                        : 'bg-white/5 border-transparent hover:border-white/20'
                    }`}
                  >
                    <span className="text-sm font-bold text-white jetbrains-mono">{encryptHost(host)}</span>
                    <span className={`text-[8px] font-black px-2 py-1 rounded-full border ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}

        </div>

        <div className="p-6 bg-zinc-900">
          <button 
            onClick={onClose}
            className="w-full py-5 bg-red-600 hover:bg-red-700 rounded-2xl font-black text-xs tracking-[0.3em] uppercase transition-all shadow-xl"
          >
            Confirmar e Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
