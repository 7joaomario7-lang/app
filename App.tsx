
import React, { useState, useEffect, useCallback } from 'react';
import { ConnectionStatus, VPNServer, UserStats, SNIConfig, EarningEntry, ConnectionLog } from './types';
import { MOCK_SERVERS } from './constants';
import VPNStatus from './components/VPNStatus';
import StatsGrid from './components/StatsGrid';
import ServerSelector from './components/ServerSelector';
import AdReward from './components/AdReward';
import Settings from './components/Settings';
import AIChatDrawer from './components/AIChatDrawer';
import EarningLog from './components/EarningLog';
import PartnerPortal from './components/PartnerPortal';
import TechnicalLogs from './components/TechnicalLogs';
import PlatformHub from './components/PlatformHub';
import AdminPanel from './components/AdminPanel';
import DeviceNetworkInfo from './components/DeviceNetworkInfo';
import { vpnAi } from './services/geminiService';
import { encryptHost } from './utils';
import { notificationService } from './services/notificationService';

const App: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [servers, setServers] = useState<VPNServer[]>(MOCK_SERVERS);
  const [selectedServer, setSelectedServer] = useState<VPNServer>(MOCK_SERVERS[0]);
  const [credits, setCredits] = useState(15);
  const [turboActive, setTurboActive] = useState(false);
  const [speedLimit, setSpeedLimit] = useState(70);
  const [timeRemaining, setTimeRemaining] = useState(3600); 
  const [activeUsers, setActiveUsers] = useState(12405);
  const [logs, setLogs] = useState<ConnectionLog[]>([]);
  const [earningHistory, setEarningHistory] = useState<EarningEntry[]>([]);
  const [stats, setStats] = useState<UserStats>({
    dataUsed: 0,
    downloadSpeed: 0,
    uploadSpeed: 0,
    credits: 15,
    timeRemaining: 3600,
    stabilityScore: 0
  });
  const [sniConfig, setSniConfig] = useState<SNIConfig>({
    host: 'internet.unitel.co.ao',
    protocol: 'WS',
    encryption: 'TLS',
    platformMode: 'Android',
    proxyHost: '',
    proxyPort: ''
  });
  
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isPartnerPortalOpen, setIsPartnerPortalOpen] = useState(false);
  const [isTechLogsOpen, setIsTechLogsOpen] = useState(false);
  const [isPlatformHubOpen, setIsPlatformHubOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDeviceInfoOpen, setIsDeviceInfoOpen] = useState(false);

  useEffect(() => {
    // Initial permission request is now handled in Settings
  }, []);

  useEffect(() => {
    const rewardInterval = setInterval(() => {
        notificationService.sendNotification('Nova Recompensa PM.TUNNEL', {
            body: 'Ganhe +1 HORA de conexão grátis assistindo a um anúncio!',
            tag: 'reward-offer'
        });
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(rewardInterval);
  }, []);

  const addLog = useCallback((message: string, type: ConnectionLog['type'] = 'info') => {
    const newLog: ConnectionLog = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setLogs(prev => [newLog, ...prev].slice(0, 30));
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1) * 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleConnection = () => {
    if (status === ConnectionStatus.DISCONNECTED || status === ConnectionStatus.ERROR) {
      if (timeRemaining <= 0) {
        addLog("Crédito de tempo esgotado. Assista um anúncio!", "error");
        setStatus(ConnectionStatus.ERROR);
        return;
      }

      if (sniConfig.protocol === 'SSH+PROXY' && (!sniConfig.proxyHost || !sniConfig.proxyPort)) {
        addLog("Host e Porta do proxy são obrigatórios para o modo SSH+PROXY.", "error");
        setStatus(ConnectionStatus.ERROR);
        return;
      }

      setStatus(ConnectionStatus.CONNECTING);
      let logMessage = `Conectando via ${sniConfig.protocol} com SNI: ${encryptHost(sniConfig.host)}`;
      if (sniConfig.protocol === 'SSH+PROXY') {
        logMessage = `Conectando via SSH+PROXY [${sniConfig.proxyHost}:${sniConfig.proxyPort}] com SNI: ${encryptHost(sniConfig.host)}`;
      }
      addLog(logMessage, 'info');
      
      setTimeout(() => {
        const isSuccess = Math.random() > 0.25; // 75% success rate
        if (isSuccess) {
          addLog(`VPN Ativa via ${selectedServer.city}`, 'success');
          setStatus(ConnectionStatus.CONNECTED);
        } else {
          addLog("Falha ao estabelecer túnel. Verifique SNI ou rede.", "error");
          setStatus(ConnectionStatus.ERROR);
          notificationService.sendNotification('Falha na Conexão', {
              body: `Não foi possível conectar ao servidor ${selectedServer.city}. Verifique o seu SNI.`,
              tag: 'connection-error'
          });
        }
      }, 1800);
    } else {
      setStatus(ConnectionStatus.DISCONNECTED);
      setStats(prev => ({ ...prev, downloadSpeed: 0, uploadSpeed: 0, stabilityScore: 0 }));
      addLog("Conexão encerrada pelo usuário.", "warning");
    }
  };

  useEffect(() => {
    let interval: any;
    if (status === ConnectionStatus.CONNECTED) {
      interval = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
        setStats(prev => {
          const baseMax = selectedServer.isPremium ? 95 : 35;
          const noise = (Math.random() * 15 - 7); 
          const target = Math.max(1.2, (baseMax + noise) * (speedLimit / 100) * (turboActive ? 2.8 : 1.0));
          return {
            ...prev,
            dataUsed: prev.dataUsed + (target / 1024 / 8),
            downloadSpeed: target,
            uploadSpeed: target * (0.25 + Math.random() * 0.1),
            stabilityScore: Math.min(100, 98 + Math.random() * 2)
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, turboActive, speedLimit, selectedServer]);

  useEffect(() => {
    const fetchAdvice = async () => {
        setIsAiLoading(true);
        const advice = await vpnAi.getVPNOptimizationAdvice(
            selectedServer.ping, 
            selectedServer.load, 
            `PLATFORM: Android`
        );
        setAiAdvice(advice);
        setIsAiLoading(false);
    };
    fetchAdvice();
  }, [selectedServer.id]);

  const handleReward = (type: 'credits' | 'turbo' | 'time') => {
    if (type === 'credits') setCredits(prev => prev + 10);
    else if (type === 'turbo') setTurboActive(true);
    else if (type === 'time') setTimeRemaining(prev => prev + 3600);
    addLog(`Recompensa aplicada com sucesso!`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 pt-6 pb-28 relative overflow-hidden flex flex-col items-center rocket-container">
      <header className="w-full max-w-lg flex justify-between items-start mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-2xl font-black border-2 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <span className="text-white">P</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter leading-none italic text-white uppercase">PM.TUNNEL</h1>
            <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1 text-green-500">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414L20.355 18.1734L18.941 19.5874L16.109 16.7554C15.013 17.5414 13.682 18.0004 12.25 18.0004C8.936 18.0004 6.25 15.3144 6.25 12.0004C6.25 8.6864 8.936 6.0004 12.25 6.0004C15.564 6.0004 18.25 8.6864 18.25 12.0004C18.25 13.4324 17.791 14.7634 17.005 15.8594L17.523 15.3414ZM12.25 16.0004C14.459 16.0004 16.25 14.2094 16.25 12.0004C16.25 9.7914 14.459 8.0004 12.25 8.0004C10.041 8.0004 8.25 9.7914 8.25 12.0004C8.25 14.2094 10.041 16.0004 12.25 16.0004Z"/></svg>
                    <span className="text-[7px] font-black uppercase tracking-widest">Android Only</span>
                </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
            <button 
                onClick={() => setIsPlatformHubOpen(true)}
                className="glass px-3 py-1.5 rounded-xl border-green-500/20 text-[8px] font-black text-green-500 uppercase tracking-widest hover:bg-green-500/5 transition-all flex items-center gap-2"
            >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Baixar APK
            </button>
            <button 
                onClick={() => setIsAdminOpen(true)}
                className="glass px-3 py-1.5 rounded-xl border-cyan-500/30 text-[8px] font-black text-cyan-500 uppercase tracking-widest hover:bg-cyan-500/10 transition-all"
            >
                Admin
            </button>
        </div>
      </header>

      <main className="w-full max-w-lg space-y-6 relative z-10 flex-1">
        <VPNStatus 
          status={status} 
          server={selectedServer} 
          onToggle={toggleConnection} 
          timeFormatted={formatTime(timeRemaining)}
          stability={stats.stabilityScore}
          activeUsersOnServer={Math.floor(activeUsers * (selectedServer.load / 100))}
          downloadSpeed={stats.downloadSpeed}
        />

        <div className={`bg-blue-600/5 p-4 rounded-2xl border border-blue-500/10 transition-all duration-300 min-h-[60px] flex items-start gap-3 ${isAiLoading ? 'opacity-50' : 'opacity-100'}`}>
             <div className="mt-1">
                {isAiLoading ? (
                    <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                )}
             </div>
             <p className="text-[11px] text-blue-100/80 leading-relaxed font-medium">
                {isAiLoading ? "Consultando VoltBot..." : aiAdvice || "Otimizando túnel para rede local..."}
             </p>
        </div>

        <StatsGrid stats={stats} />

        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => setIsServerModalOpen(true)}
            className="glass p-5 rounded-3xl flex items-center justify-between hover:bg-white/5 transition-all border-white/10 group"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl filter group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all">{selectedServer.flag}</span>
              <div className="text-left">
                <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Nó de Saída Business</div>
                <div className="font-bold text-lg text-white">{selectedServer.city}</div>
              </div>
            </div>
            <div className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-gray-400 group-hover:text-white border border-white/5 uppercase">Alterar</div>
          </button>

          <AdReward onReward={handleReward} turboActive={turboActive} />
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 px-6 py-4 flex justify-between items-center z-50">
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-gray-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 18H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 12h11.25" />
              </svg>
          </button>
          
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-14 h-14 bg-red-600 rounded-2xl -mt-10 flex items-center justify-center shadow-[0_10px_30px_rgba(220,38,38,0.4)] hover:scale-110 active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.012 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
            </svg>
          </button>

          <button onClick={() => setIsDeviceInfoOpen(true)} className="p-2 text-gray-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M19.5 8.25h1.5M19.5 12h1.5M19.5 15.75h1.5M15.75 21v-1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6.75 6.75 0 100-13.5 6.75 6.75 0 000 13.5z" />
              </svg>
          </button>
      </nav>

      {/* Overlays */}
      <ServerSelector isOpen={isServerModalOpen} onClose={() => setIsServerModalOpen(false)} selectedServer={selectedServer} onSelect={(s) => {setSelectedServer(s); setIsServerModalOpen(false); addLog(`Nó alterado para ${s.city}`);}} credits={credits} />
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} config={sniConfig} onUpdate={setSniConfig} />
      <AIChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <EarningLog isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} history={earningHistory} />
      <PartnerPortal isOpen={isPartnerPortalOpen} onClose={() => setIsPartnerPortalOpen(false)} />
      <TechnicalLogs isOpen={isTechLogsOpen} onClose={() => setIsTechLogsOpen(false)} logs={logs} />
      <PlatformHub isOpen={isPlatformHubOpen} onClose={() => setIsPlatformHubOpen(false)} />
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} onUpdateServers={setServers} />
      <DeviceNetworkInfo isOpen={isDeviceInfoOpen} onClose={() => setIsDeviceInfoOpen(false)} />
    </div>
  );
};

export default App;
