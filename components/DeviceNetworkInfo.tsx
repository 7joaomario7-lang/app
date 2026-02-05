
import React, { useState, useEffect } from 'react';
import { DeviceInfo } from '../types';
import { deviceInfoService } from '../services/deviceInfoService';

interface DeviceNetworkInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoRow: React.FC<{ label: string; value: string | undefined; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3">
            <div className="text-blue-400">{icon}</div>
            <span className="text-sm font-medium text-gray-300">{label}</span>
        </div>
        <span className="text-sm font-bold text-white jetbrains-mono">{value || '...'}</span>
    </div>
);


const DeviceNetworkInfo: React.FC<DeviceNetworkInfoProps> = ({ isOpen, onClose }) => {
    const [info, setInfo] = useState<DeviceInfo | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const data = await deviceInfoService.getDeviceInfo();
        setInfo(data);
        setLoading(false);
    };

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    if (!isOpen) return null;
    
    const { ip, city, country, isp, connectionType, effectiveType, os, browser, latitude, longitude } = info || {};

    return (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass w-full max-w-lg rounded-3xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh] border-t border-white/10">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-white italic">Diagnóstico de Rede</h3>
                <p className="text-[10px] text-blue-500 font-black tracking-widest uppercase mt-1">Status da Conexão Local</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
    
            <div className="p-6 space-y-3 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Conexão Pública</h4>
                  <InfoRow label="Endereço IP" value={ip} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>} />
                  <InfoRow label="Provedor (ISP)" value={isp} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
                  <InfoRow label="Localização do IP" value={`${city}, ${country}`} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />

                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pt-4">Rede Local</h4>
                  <InfoRow label="Tipo de Conexão" value={connectionType?.toUpperCase()} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25l.243.243a.75.75 0 010 1.061l-.243.243a.75.75 0 01-1.061 0l-.243-.243a.75.75 0 010-1.061l.243-.243zM12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.28 8.452a9.75 9.75 0 0117.44 0M1.5 12.332a13.5 13.5 0 0121 0" /></svg>} />
                  <InfoRow label="Qualidade da Rede" value={effectiveType?.toUpperCase()} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18m6-12h-6m-6 6h6m6-3h-6m-6 9h6" /></svg>} />
                  <InfoRow label="Coordenadas GPS" value={latitude ? `${latitude.toFixed(2)}, ${longitude?.toFixed(2)}` : 'N/A'} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s-8-4.5-8-11.5A8 8 0 1112 3.5a8 8 0 010 16z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 13a3 3 0 100-6 3 3 0 000 6z" /></svg>} />


                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pt-4">Dispositivo</h4>
                  <InfoRow label="Sistema Operativo" value={os} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18h3" /></svg>} />
                  <InfoRow label="Browser" value={browser} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.793V9a2 2 0 00-2-2h-3.879a.5.5 0 01-.353-.146l-1.586-1.586A2 2 0 0012 4H7a2 2 0 00-2 2v12a2 2 0 002 2h3" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.5 14.5a3 3 0 116 0 3 3 0 01-6 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.8 21.5l1.4-1.4" /></svg>} />

                </>
              )}
            </div>
    
            <div className="p-6 bg-zinc-900">
              <button 
                onClick={onClose}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-xs tracking-[0.3em] uppercase transition-all shadow-xl"
              >
                FECHAR DIAGNÓSTICO
              </button>
            </div>
          </div>
        </div>
      );
};

export default DeviceNetworkInfo;
