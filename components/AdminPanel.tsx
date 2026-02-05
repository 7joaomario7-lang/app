
import React, { useState, useEffect } from 'react';
import { VPNServer, AdminMetrics, PayoutTransaction } from '../types';
import { MOCK_SERVERS } from '../constants';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateServers: (servers: VPNServer[]) => void;
}

const INITIAL_TRANSACTIONS: PayoutTransaction[] = [
  { id: 't1', source: 'Unity Ads Global', amountKz: 450000, date: '25 SET, 2025', status: 'COMPLETED', logo: 'U' },
  { id: 't2', source: 'Africell Direct', amountKz: 800000, date: '22 SET, 2025', status: 'COMPLETED', logo: 'A' },
  { id: 't3', source: 'Unitel Money Ads', amountKz: 1200000, date: '15 SET, 2025', status: 'COMPLETED', logo: 'M' },
  { id: 't4', source: 'Tupuca Delivery', amountKz: 250000, date: '1 OUT, 2025', status: 'PENDING', logo: 'T' },
  { id: 't5', source: 'Standard Bank', amountKz: 650000, date: '2 OUT, 2025', status: 'PENDING', logo: 'S' },
];

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onUpdateServers }) => {
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalRevenueKz: 2450800,
    activeUsersGlobal: 18452,
    totalDataTransferred: 852.4, // TB
    systemHealth: 98.4
  });

  const [servers, setServers] = useState<VPNServer[]>(MOCK_SERVERS);
  const [activeTab, setActiveTab] = useState<'overview' | 'servers' | 'financas' | 'ads' | 'security'>('overview');
  const [transactions, setTransactions] = useState<PayoutTransaction[]>(INITIAL_TRANSACTIONS);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          activeUsersGlobal: prev.activeUsersGlobal + (Math.floor(Math.random() * 11) - 5),
          totalRevenueKz: prev.totalRevenueKz + Math.floor(Math.random() * 200)
        }));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const toggleServerStatus = (id: string) => {
    const newServers: VPNServer[] = servers.map(s => {
      if (s.id === id) {
        return { 
          ...s, 
          status: (s.status === 'ONLINE' ? 'MAINTENANCE' : 'ONLINE') as 'ONLINE' | 'MAINTENANCE' | 'OFFLINE'
        };
      }
      return s;
    });
    setServers(newServers);
    onUpdateServers(newServers);
  };
  
  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount);

    if (isNaN(amount) || amount <= 0) {
      alert('Por favor, insira um valor válido para o saque.');
      return;
    }

    if (amount > metrics.totalRevenueKz) {
      alert('Saldo insuficiente para realizar este saque.');
      return;
    }

    setIsWithdrawing(true);
    setTimeout(() => {
      setMetrics(prev => ({
        ...prev,
        totalRevenueKz: prev.totalRevenueKz - amount,
      }));

      const newTransaction: PayoutTransaction = {
        id: `wd-${Date.now()}`,
        source: 'Retirada para Conta Bancária',
        amountKz: -amount,
        date: new Date().toLocaleDateString('pt-AO', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase(),
        status: 'COMPLETED',
        logo: '💸',
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setWithdrawalAmount('');
      setIsWithdrawing(false);
      alert(`Saque de ${amount.toLocaleString()} Kz realizado com sucesso!`);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl">
      <div className="w-full h-full sm:w-[95vw] sm:h-[90vh] bg-[#020202] border border-cyan-500/30 rounded-none sm:rounded-3xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(6,182,212,0.1)]">
        
        <div className="p-6 border-b border-cyan-500/20 flex justify-between items-center bg-cyan-950/20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border-2 border-cyan-500 rounded flex items-center justify-center font-black text-cyan-500">AD</div>
            <div>
              <h2 className="text-xl font-black text-white italic tracking-tighter">ADMIN CONSOLE <span className="text-cyan-500 font-mono text-xs ml-2">v5.0.4-root</span></h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[9px] text-cyan-500/70 font-black uppercase tracking-widest">Sistemas Operacionais - Luanda HQ</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-cyan-500/10 rounded-full text-cyan-500 transition-all border border-cyan-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-20 sm:w-64 border-r border-cyan-500/10 flex flex-col p-4 gap-2">
            {[
              { id: 'overview', label: 'Dashboard', icon: 'M3 13h1m8-8V4m0 9h.01M5.636 5.636l.707.707M12 12l.01-.01M18.364 5.636l-.707.707' },
              { id: 'servers', label: 'Infraestrutura', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2' },
              { id: 'financas', label: 'Finanças', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z' },
              { id: 'ads', label: 'Publicidade', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
              { id: 'security', label: 'Segurança', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-4 p-4 rounded-xl transition-all font-black text-xs uppercase tracking-widest ${activeTab === tab.id ? 'bg-cyan-500 text-black' : 'text-cyan-500/50 hover:bg-cyan-500/5'}`}>
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-black">
            {activeTab === 'overview' && (
              <div className="animate-fade-in space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                  <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-2xl"><span className="text-[10px] text-cyan-500 font-black uppercase tracking-widest block mb-2">Lucro Publicidade</span><div className="text-3xl font-black text-white jetbrains-mono">{metrics.totalRevenueKz.toLocaleString()} <span className="text-sm text-cyan-500">Kz</span></div></div>
                  <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-2xl"><span className="text-[10px] text-cyan-500 font-black uppercase tracking-widest block mb-2">Utilizadores Ativos</span><div className="text-3xl font-black text-white jetbrains-mono">{metrics.activeUsersGlobal.toLocaleString()}</div></div>
                  <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-2xl"><span className="text-[10px] text-cyan-500 font-black uppercase tracking-widest block mb-2">Data Throughput</span><div className="text-3xl font-black text-white jetbrains-mono">{metrics.totalDataTransferred.toFixed(1)} <span className="text-sm text-cyan-500">TB</span></div></div>
                  <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-2xl"><span className="text-[10px] text-cyan-500 font-black uppercase tracking-widest block mb-2">Health Score</span><div className="text-3xl font-black text-green-500 jetbrains-mono">{metrics.systemHealth}%</div></div>
                </div>
                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-3xl p-8"><h3 className="text-lg font-black text-white mb-6 flex items-center gap-3"><svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>LIVE NETWORK OVERVIEW</h3><div className="h-64 flex items-end gap-1 sm:gap-2">{Array.from({ length: 40 }).map((_, i) => (<div key={i} className="flex-1 bg-cyan-500/40 rounded-t hover:bg-cyan-500 transition-all cursor-crosshair" style={{ height: `${20 + Math.random() * 80}%` }}/>)) }</div><div className="flex justify-between mt-4 text-[9px] font-black text-cyan-500/40 uppercase tracking-widest"><span>24 Horas Atrás</span><span>Tempo Real (Luanda)</span></div></div>
              </div>
            )}

            {activeTab === 'servers' && (
              <div className="animate-fade-in space-y-6"><div className="flex justify-between items-center mb-6"><h3 className="text-lg font-black text-white">Nós de Infraestrutura</h3><button className="px-4 py-2 bg-cyan-500 text-black font-black text-[10px] rounded-lg uppercase tracking-widest">Adicionar Nó</button></div><div className="grid grid-cols-1 gap-3">{servers.map(server => (<div key={server.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between group hover:border-cyan-500/40 transition-all"><div className="flex items-center gap-4"><span className="text-3xl">{server.flag}</span><div><div className="font-bold text-white flex items-center gap-2">{server.city}, {server.country}<span className={`text-[8px] px-2 py-0.5 rounded-full ${server.isPremium ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'}`}>{server.isPremium ? 'PREMIUM' : 'FREE'}</span></div><div className="text-[10px] font-mono text-cyan-500/60 mt-1">{server.ip} • Load: {server.load}%</div></div></div><div className="flex items-center gap-4"><div className="text-right"><div className={`text-[9px] font-black mb-1 ${server.status === 'ONLINE' ? 'text-green-500' : 'text-yellow-500'}`}>{server.status || 'ONLINE'}</div><div className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Latência: {server.ping}ms</div></div><button onClick={() => toggleServerStatus(server.id)} className={`w-12 h-6 rounded-full transition-all relative ${server.status === 'ONLINE' ? 'bg-green-600' : 'bg-red-600'}`}><div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${server.status === 'ONLINE' ? 'right-1' : 'left-1'}`} /></button></div></div>))}</div></div>
            )}
            
            {activeTab === 'financas' && (
                <div className="animate-fade-in space-y-8">
                    <h3 className="text-lg font-black text-white italic uppercase tracking-wider">Central Financeira & Pagamentos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-2xl"><span className="text-[10px] text-cyan-500 font-black uppercase tracking-widest block mb-2">Total Arrecadado</span><div className="text-3xl font-black text-white jetbrains-mono">{metrics.totalRevenueKz.toLocaleString()} <span className="text-sm text-cyan-500">Kz</span></div></div>
                        <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-2xl"><span className="text-[10px] text-cyan-500 font-black uppercase tracking-widest block mb-2">Pagamentos Pendentes</span><div className="text-3xl font-black text-white jetbrains-mono">{transactions.filter(t => t.status === 'PENDING').reduce((acc, t) => acc + t.amountKz, 0).toLocaleString()} <span className="text-sm text-yellow-500">Kz</span></div></div>
                        <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-2xl"><span className="text-[10px] text-cyan-500 font-black uppercase tracking-widest block mb-2">Próximo Pagamento</span><div className="text-3xl font-black text-white jetbrains-mono">15 OUT, 2025</div></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-2xl">
                             <h4 className="text-sm font-black text-white mb-4">CONTA DE DESTINO</h4>
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-400"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" /></svg></div>
                                <div><p className="font-bold text-white">Banco BAI (Angola)</p><p className="text-xs text-cyan-400/70 font-mono">AO06 **** **** **** **** 92</p></div>
                             </div>
                        </div>
                        <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-2xl space-y-3">
                            <h4 className="text-sm font-black text-white">SOLICITAR SAQUE</h4>
                            <div>
                                <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Montante (Kz)</label>
                                <input type="number" value={withdrawalAmount} onChange={(e) => setWithdrawalAmount(e.target.value)} disabled={isWithdrawing} placeholder="Ex: 50000" className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-lg mt-2 focus:outline-none focus:border-cyan-500 text-white font-black jetbrains-mono"/>
                            </div>
                            <button onClick={handleWithdrawal} disabled={isWithdrawing || !withdrawalAmount} className="w-full py-4 bg-yellow-500 text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {isWithdrawing ? (<><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />PROCESSANDO...</>) : 'CONFIRMAR SAQUE'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-black text-white mb-4">HISTÓRICO DE TRANSAÇÕES</h4>
                        <div className="space-y-3">
                            {transactions.map(tx => (
                                <div key={tx.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 ${tx.amountKz < 0 ? 'bg-red-900/50' : 'bg-zinc-800'} rounded-lg flex items-center justify-center font-black text-white text-xl`}>{tx.logo}</div>
                                        <div><p className="font-bold text-white text-sm">{tx.source}</p><p className="text-[10px] text-gray-500 font-mono">{tx.date}</p></div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-mono font-bold ${tx.amountKz < 0 ? 'text-red-400' : 'text-white'}`}>{tx.amountKz < 0 ? '' : '+'}{tx.amountKz.toLocaleString()} Kz</p>
                                        <div className="flex items-center justify-end gap-2 mt-1"><div className={`w-2 h-2 rounded-full ${tx.status === 'COMPLETED' ? 'bg-green-500' : 'bg-yellow-500'}`} /><p className={`text-[9px] font-bold uppercase ${tx.status === 'COMPLETED' ? 'text-green-500' : 'text-yellow-500'}`}>{tx.status}</p></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'ads' && (<div className="animate-fade-in flex flex-col items-center justify-center h-full opacity-40 text-center"><svg className="w-20 h-20 mb-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg><h3 className="text-xl font-black text-white italic">GESTÃO DE PUBLICIDADE</h3><p className="text-sm mt-2">Módulo para controle de campanhas e parceiros.</p><div className="mt-8 p-4 border border-cyan-500/20 rounded-xl max-w-sm"><p className="text-[10px] uppercase font-bold text-cyan-500/50">CPM Médio (Angola)</p><p className="text-lg font-black text-white mt-1">3.200 Kz</p></div></div>)}
            {activeTab === 'security' && (<div className="animate-fade-in space-y-6"><div className="p-6 bg-red-950/20 border border-red-500/20 rounded-2xl flex items-center justify-between"><div><h4 className="text-red-500 font-black text-xs uppercase tracking-[0.2em]">Monitor de Anomalias</h4><p className="text-[10px] text-gray-500 mt-1">Nenhuma tentativa de intrusão detectada nos últimos 60 min.</p></div><div className="px-3 py-1 bg-red-500/20 text-red-500 text-[8px] font-black rounded-full border border-red-500/30">ATIVO</div></div><div className="bg-black border border-white/5 rounded-2xl p-4 font-mono text-[10px] text-cyan-500/80 space-y-1"><p>[SYS] Initializing kernel security check...</p><p>[SYS] Scanning active sockets in node ao-1...</p><p className="text-green-500">[OK] Encryption AES-256-GCM verified on all paths.</p><p>[INFO] New user connected from: Luanda (923.xx.xx.xx)</p><p>[WARN] High jitter detected in server us-1...</p><p>[SYS] Rerouting overflow traffic to br-1 node...</p></div></div>)}
          </div>
        </div>

        <div className="p-4 border-t border-cyan-500/20 bg-cyan-950/20 text-center"><p className="text-[8px] font-black text-cyan-500/40 uppercase tracking-[0.5em]">Acesso restrito ao pessoal técnico PM.TUNNEL • Todos os direitos reservados</p></div>
      </div>
    </div>
  );
};

export default AdminPanel;
