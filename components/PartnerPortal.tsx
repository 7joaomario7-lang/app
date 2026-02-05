
import React, { useState } from 'react';
import { AdContract, BrandCampaign } from '../types';
import { vpnAi } from '../services/geminiService';

interface PartnerPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_BRAND_DEALS: BrandCampaign[] = [
  { id: 'b1', name: 'Lançamento 5G', brand: 'Africell AO', budgetKz: 2500000, remainingImpressions: 45000, ctr: 4.2, color: '#facc15', status: 'LIVE' },
  { id: 'b2', name: 'Promo Unitel Money', brand: 'Unitel', budgetKz: 1800000, remainingImpressions: 12000, ctr: 3.8, color: '#ef4444', status: 'LIVE' },
  { id: 'b3', name: 'App Standard Bank', brand: 'Standard Bank', budgetKz: 3200000, remainingImpressions: 85000, ctr: 2.1, color: '#3b82f6', status: 'PAUSED' },
];

const MOCK_AD_CONTRACTS: AdContract[] = [
  { id: 'c1', companyName: 'Africell Angola', status: 'ATIVO', type: 'Video', revenueKz: 1250000, impressions: 850000, logo: 'A' },
  { id: 'c2', companyName: 'Banco BIC', status: 'ATIVO', type: 'Banner', revenueKz: 800000, impressions: 1200000, logo: 'B' },
  { id: 'c3', companyName: 'Unitel Money', status: 'PENDENTE', type: 'Redirect', revenueKz: 2100000, impressions: 2500000, logo: 'U' },
  { id: 'c4', companyName: 'Tupuca', status: 'EXPIRADO', type: 'Video', revenueKz: 650000, impressions: 400000, logo: 'T' },
];

const getStatusStyles = (status: 'ATIVO' | 'PENDENTE' | 'EXPIRADO') => {
    switch (status) {
        case 'ATIVO': return 'bg-green-500/10 text-green-400 border-green-500/20';
        case 'PENDENTE': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        case 'EXPIRADO': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
}


const PartnerPortal: React.FC<PartnerPortalProps> = ({ isOpen, onClose }) => {
  const [pitch, setPitch] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetCompany, setTargetCompany] = useState('Africell Angola');
  const [activeTab, setActiveTab] = useState<'marketplace' | 'unity' | 'ai-sales'>('marketplace');

  const handleGeneratePitch = async () => {
    setIsGenerating(true);
    const result = await vpnAi.generateSalesPitch(targetCompany, 18500);
    setPitch(result);
    setIsGenerating(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-0 sm:p-4 bg-black/95 backdrop-blur-2xl">
      <div className="glass w-full h-full sm:max-w-4xl sm:h-[85vh] rounded-none sm:rounded-3xl overflow-hidden animate-slide-up flex flex-col border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
        
        {/* Header Enterprise */}
        <div className="p-6 bg-gradient-to-r from-zinc-900 to-black border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center font-black text-xl shadow-lg">B</div>
            <div>
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">PM.ENTERPRISE <span className="text-yellow-500">ADS HUB</span></h3>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">Gestão de Inventário & Parcerias Diretas</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 border border-white/5 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Internal Sidebar Nav */}
          <div className="w-16 sm:w-56 border-r border-white/5 flex flex-col p-2 gap-1 bg-black/40">
            {[
              { id: 'marketplace', label: 'Direct Marketplace', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
              { id: 'unity', label: 'Redes Globais', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
              { id: 'ai-sales', label: 'Venda com IA', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.9-.4-2.593-.903l-.547-.547z' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`p-4 rounded-xl flex items-center gap-4 transition-all group ${
                  activeTab === tab.id ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/10' : 'text-gray-500 hover:bg-white/5'
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-[#050505]">
            
            {activeTab === 'marketplace' && (
              <div className="animate-fade-in space-y-12">
                <div>
                    <div className="flex justify-between items-end">
                        <div>
                            <h4 className="text-sm font-black text-white italic uppercase">Campanhas Ativas em Angola</h4>
                            <p className="text-[10px] text-gray-500 mt-1">Ganhos diretos de marcas parceiras via CPM fixo.</p>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4">
                      {MOCK_BRAND_DEALS.map(campaign => (
                        <div key={campaign.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl group hover:border-white/20 transition-all">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-black" style={{ backgroundColor: campaign.color }}>
                                {campaign.brand[0]}
                              </div>
                              <div>
                                <h5 className="font-black text-white text-lg tracking-tight italic">{campaign.name}</h5>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{campaign.brand}</p>
                              </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[8px] font-black border ${
                                campaign.status === 'LIVE' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-white/5'
                            }`}>
                              {campaign.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-end">
                        <div>
                            <h4 className="text-sm font-black text-white italic uppercase">Contratos de Publicidade Direta</h4>
                            <p className="text-[10px] text-gray-500 mt-1">Acordos comerciais com parceiros estratégicos em Angola.</p>
                        </div>
                        <button className="px-4 py-2 bg-white text-black font-black text-[10px] rounded-lg uppercase tracking-widest hover:scale-105 transition-all">Propor Contrato</button>
                    </div>

                    <div className="mt-4 flex flex-col gap-3">
                        {MOCK_AD_CONTRACTS.map(contract => (
                            <div key={contract.id} className="bg-zinc-900 border border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center font-black text-white">{contract.logo}</div>
                                    <div>
                                        <h5 className="font-bold text-white text-sm">{contract.companyName}</h5>
                                        <div className={`mt-1 px-2 py-0.5 inline-block rounded text-[9px] font-black border ${getStatusStyles(contract.status)}`}>
                                            {contract.status}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:flex items-center gap-6 text-sm w-full sm:w-auto">
                                    <div className="text-left sm:text-right">
                                        <span className="text-[8px] text-gray-500 font-bold uppercase block">Faturamento</span>
                                        <span className="font-mono font-bold text-green-400">{contract.revenueKz.toLocaleString()} Kz</span>
                                    </div>
                                     <div className="text-left sm:text-right">
                                        <span className="text-[8px] text-gray-500 font-bold uppercase block">Impressões</span>
                                        <span className="font-mono font-bold">{contract.impressions.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'ai-sales' && (
              <div className="animate-fade-in space-y-6">
                 <div className="bg-gradient-to-br from-indigo-900/20 to-black p-8 rounded-3xl border border-indigo-500/20">
                    <h4 className="text-xl font-black text-white italic mb-2">GERADOR DE PROPOSTAS IA</h4>
                    <p className="text-xs text-gray-400 max-w-md leading-relaxed">Nossa IA analisa o tráfego do PM.TUNNEL e gera argumentos de venda personalizados para fechar contratos com grandes empresas.</p>
                    
                    <div className="mt-8 space-y-4">
                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Empresa Alvo</label>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={targetCompany}
                                onChange={(e) => setTargetCompany(e.target.value)}
                                className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-indigo-500 text-white"
                                placeholder="ex: Africell, BFA, Unitel..."
                            />
                            <button 
                                onClick={handleGeneratePitch}
                                disabled={isGenerating}
                                className="px-8 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-50"
                            >
                                {isGenerating ? 'ANALISANDO...' : 'GERAR'}
                            </button>
                        </div>
                    </div>

                    {pitch && (
                        <div className="mt-6 bg-black/80 p-6 rounded-2xl border border-white/5 relative group">
                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => {navigator.clipboard.writeText(pitch); alert("Copiado!")}} className="text-[9px] font-black text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Copiar</button>
                            </div>
                            <pre className="text-xs text-indigo-100/70 whitespace-pre-wrap font-sans leading-relaxed italic">
                                "{pitch}"
                            </pre>
                        </div>
                    )}
                 </div>
              </div>
            )}

            {activeTab === 'unity' && (
                <div className="animate-fade-in space-y-6">
                    <div className="p-8 bg-zinc-900 border border-white/5 rounded-3xl text-center">
                        <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-6 text-black">
                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                        </div>
                        <h4 className="text-2xl font-black text-white italic tracking-tighter">UNITY ADS GLOBAL</h4>
                        <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">Tráfego residual monetizado automaticamente via redes de anúncios internacionais.</p>
                        
                        <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-[8px] text-gray-500 font-black uppercase">Revenue 24h</span>
                                <p className="text-lg font-black text-green-500 jetbrains-mono">$42.80</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-[8px] text-gray-500 font-black uppercase">Fill Rate</span>
                                <p className="text-lg font-black text-blue-500 jetbrains-mono">98.4%</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Footer Admin Branding */}
        <div className="p-6 border-t border-white/5 bg-zinc-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
                <div className="flex flex-col">
                    <span className="text-[8px] text-gray-600 font-black uppercase">Faturamento Mensal Estimado</span>
                    <span className="text-lg font-black text-white jetbrains-mono">15.420.000 <span className="text-[10px] text-yellow-500">Kz</span></span>
                </div>
            </div>
            <button onClick={onClose} className="w-full sm:w-auto px-10 py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-red-700 shadow-xl shadow-red-600/20 transition-all">Fechar Portal</button>
        </div>
      </div>
    </div>
  );
};

export default PartnerPortal;
