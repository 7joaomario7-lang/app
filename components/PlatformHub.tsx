
import React, { useState } from 'react';
import { vpnAi } from '../services/geminiService';

interface PlatformHubProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlatformHub: React.FC<PlatformHubProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [inviteMsg, setInviteMsg] = useState('');
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);

  const OFFICIAL_LINK = "https://pmtunnel.ao/v5-android-final";

  const startDownload = () => {
    setDownloading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDownloading(false), 1000);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(OFFICIAL_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateInvite = async () => {
    setIsGeneratingInvite(true);
    // Simulating AI generation for the invite text
    const msg = `🔥 *PM.TUNNEL V5 ATUALIZADO* 🔥\n\nInternet ilimitada na Unitel/Movicel com servidores de Luanda! 🇦🇴\n\n✅ Sem gastar saldo\n✅ Ping baixo para Free Fire\n✅ Grátis com anúncios\n\n*Baixa aqui o APK oficial:* \n${OFFICIAL_LINK}`;
    setInviteMsg(msg);
    setIsGeneratingInvite(false);
  };

  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(inviteMsg || `Baixa o PM.TUNNEL aqui: ${OFFICIAL_LINK}`)}`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
      <div className="w-full max-w-xl bg-[#0a0a0a] border border-green-500/20 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(34,197,94,0.15)] animate-slide-up flex flex-col max-h-[95vh]">
        
        {/* Header com Branding Android */}
        <div className="p-8 border-b border-white/10 flex justify-between items-start bg-gradient-to-b from-green-600/10 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414L20.355 18.1734L18.941 19.5874L16.109 16.7554C15.013 17.5414 13.682 18.0004 12.25 18.0004C8.936 18.0004 6.25 15.3144 6.25 12.0004C6.25 8.6864 8.936 6.0004 12.25 6.0004C15.564 6.0004 18.25 8.6864 18.25 12.0004C18.25 13.4324 17.791 14.7634 17.005 15.8594L17.523 15.3414ZM12.25 16.0004C14.459 16.0004 16.25 14.2094 16.25 12.0004C16.25 9.7914 14.459 8.0004 12.25 8.0004C10.041 8.0004 8.25 9.7914 8.25 12.0004C8.25 14.2094 10.041 16.0004 12.25 16.0004Z"/></svg>
            </div>
            <div>
                <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">Obter Link Oficial</h2>
                <p className="text-[10px] text-green-400 font-black uppercase tracking-[0.3em] mt-1">PM.TUNNEL v5.0 Build 2025</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto custom-scrollbar">
          
          {/* Main Download Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#111] to-black border border-white/5 p-8 rounded-3xl group hover:border-green-500/40 transition-all text-center">
            <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 bg-white p-2 rounded-2xl mb-4 shadow-xl">
                    {/* Simulated QR Code */}
                    <div className="w-full h-full border-2 border-black grid grid-cols-8 grid-rows-8 gap-0.5">
                        {Array.from({length: 64}).map((_, i) => (
                            <div key={i} className={`${Math.random() > 0.7 ? 'bg-black' : 'bg-white'}`} />
                        ))}
                    </div>
                </div>
                <h4 className="font-black text-white text-lg italic">Scan para Baixar</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Mostra o QR Code para o teu mambo!</p>
            </div>

            <div className="bg-black/60 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 mb-6">
                <div className="flex-1 truncate text-left">
                    <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest block mb-1">Direct Link</span>
                    <span className="text-xs font-mono text-green-400">{OFFICIAL_LINK}</span>
                </div>
                <button 
                    onClick={copyLink}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all ${copied ? 'bg-green-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    {copied ? 'COPIADO!' : 'COPIAR'}
                </button>
            </div>

            {downloading ? (
                <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-900 rounded-full overflow-hidden border border-white/5 p-1">
                        <div className="h-full bg-green-500 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.6)]" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-[11px] text-green-400 font-black uppercase animate-pulse">Iniciando Download do APK... {progress}%</p>
                </div>
            ) : (
                <button 
                    onClick={startDownload}
                    className="w-full py-5 bg-green-600 text-black rounded-2xl text-[14px] font-black uppercase tracking-[0.3em] transition-all border-b-4 border-green-800 hover:bg-green-500 hover:scale-[1.02] active:scale-95 shadow-[0_15px_40px_rgba(34,197,94,0.3)]"
                >
                    DESCARREGAR APK AGORA
                </button>
            )}
          </div>

          {/* Social Share Engine */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Partilha com os Amigos</h4>
                <span className="text-[8px] text-blue-400 font-black bg-blue-400/10 px-2 py-0.5 rounded-full uppercase">Ganhe Créditos</span>
             </div>
             
             <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                {inviteMsg ? (
                    <div className="space-y-4 animate-fade-in">
                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-[11px] text-gray-300 leading-relaxed italic whitespace-pre-wrap">
                            {inviteMsg}
                        </div>
                        <button 
                            onClick={shareWhatsApp}
                            className="w-full py-4 bg-[#25D366] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            ENVIAR NO WHATSAPP
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={generateInvite}
                        disabled={isGeneratingInvite}
                        className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
                    >
                        {isGeneratingInvite ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                GERANDO CONVITE...
                            </>
                        ) : 'GERAR MENSAGEM DE CONVITE IA'}
                    </button>
                )}
             </div>
          </div>
        </div>

        <div className="p-8 bg-[#050505] border-t border-white/5 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-5 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all border border-white/5"
          >
            FECHAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlatformHub;
