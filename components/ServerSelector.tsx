
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { VPNServer } from '../types';
import { MOCK_SERVERS } from '../constants';

interface ServerSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServer: VPNServer;
  onSelect: (server: VPNServer) => void;
  credits: number;
}

const ITEM_HEIGHT = 76; // Estimated height for a server item button, including margins.
const HEADER_HEIGHT = 52; // Estimated height for a section header, including margins.
const OVERSCAN_COUNT = 5; // Render extra items above and below the viewport for smooth scrolling.

const ServerSelector: React.FC<ServerSelectorProps> = ({ isOpen, onClose, selectedServer, onSelect, credits }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Update container height when the modal opens or the window is resized.
  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      const updateHeight = () => {
        if (scrollContainerRef.current) {
          setContainerHeight(scrollContainerRef.current.clientHeight);
        }
      };
      updateHeight();
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, [isOpen]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Memoize the flattened list with pre-calculated positions for virtualization.
  const virtualizedList = useMemo(() => {
    const freeServers = MOCK_SERVERS.filter(s => !s.isPremium);
    const premiumServers = MOCK_SERVERS.filter(s => s.isPremium);

    type ListItem = VPNServer | { type: 'header'; label: string; id: string; icon: 'premium' | 'free' };
    const items: ListItem[] = [];
    
    if (premiumServers.length > 0) {
      items.push({ type: 'header', label: 'Servidores VIP (Luanda/Premium)', id: 'header-premium', icon: 'premium' });
      items.push(...premiumServers);
    }
    
    if (freeServers.length > 0) {
      items.push({ type: 'header', label: 'Servidores Grátis (Mundiais)', id: 'header-free', icon: 'free' });
      items.push(...freeServers);
    }
    
    let currentY = 0;
    const itemsWithPositions = items.map(item => {
      const isHeader = 'type' in item && item.type === 'header';
      const height = isHeader ? HEADER_HEIGHT : ITEM_HEIGHT;
      const itemWithPos = { ...item, y: currentY, height };
      currentY += height;
      return itemWithPos;
    });

    return {
      items: itemsWithPositions,
      totalHeight: currentY
    };
  }, []); // MOCK_SERVERS is constant, so no dependency array is needed.

  // Calculate which items to render based on scroll position.
  const startIndex = Math.max(0, virtualizedList.items.findIndex(item => item.y + item.height > scrollTop) - OVERSCAN_COUNT);
  const endIndexRaw = virtualizedList.items.findIndex(item => item.y > scrollTop + containerHeight);
  const endIndex = Math.min(virtualizedList.items.length - 1, (endIndexRaw === -1 ? virtualizedList.items.length - 1 : endIndexRaw) + OVERSCAN_COUNT);
  
  const visibleItems = virtualizedList.items.slice(startIndex, endIndex + 1);

  const renderServerButton = (server: VPNServer) => (
    <button
      key={server.id}
      onClick={() => onSelect(server)}
      disabled={server.isPremium && credits < 5}
      className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all border ${
        selectedServer.id === server.id 
          ? 'bg-red-600/20 border-red-500 shadow-inner' 
          : 'bg-white/5 border-transparent hover:border-white/20'
      } ${server.isPremium && credits < 5 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center gap-4 text-left">
        <span className="text-3xl drop-shadow-md">{server.flag}</span>
        <div>
          <div className="font-bold text-sm sm:text-base text-white">{server.city}, {server.country}</div>
          <div className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-2">
            <span className={server.ping < 60 ? 'text-green-400 font-bold' : server.ping < 120 ? 'text-yellow-400' : 'text-red-400'}>{server.ping}ms</span>
            <span className="w-1 h-1 bg-gray-600 rounded-full" />
            <span className={server.load > 75 ? 'text-red-400 font-bold' : server.load > 50 ? 'text-yellow-400' : 'text-gray-400'}>Carga: {server.load}%</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {server.isPremium ? (
          <span className="bg-yellow-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full border border-yellow-600 shadow-lg">
            PREMIUM
          </span>
        ) : (
          <span className="bg-green-600/20 text-green-500 text-[9px] font-black px-2 py-0.5 rounded-full border border-green-500/30">
            GRÁTIS
          </span>
        )}
        {selectedServer.id === server.id && (
          <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh] border-t border-white/10">
        <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-xl font-black text-white italic">Seletor de Rede</h3>
            <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest mt-1">Nós de Luanda & Globais</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div ref={scrollContainerRef} onScroll={handleScroll} className="px-4 py-2 overflow-y-auto flex-1 custom-scrollbar">
          <div style={{ height: `${virtualizedList.totalHeight}px`, position: 'relative' }}>
            {visibleItems.map(item => {
              const isHeader = 'type' in item && item.type === 'header';
              return (
                <div
                  key={item.id}
                  style={{
                    position: 'absolute',
                    top: `${item.y}px`,
                    height: `${item.height}px`,
                    left: 0,
                    right: 0,
                    paddingTop: isHeader ? '24px' : '4px',
                    paddingBottom: '4px',
                  }}
                >
                  {isHeader ? (
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 ${item.icon === 'premium' ? 'bg-yellow-500' : 'bg-green-500'} rounded-full`} />
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{item.label}</h4>
                    </div>
                  ) : (
                    renderServerButton(item as VPNServer)
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="p-6 bg-red-600/5 border-t border-white/10 text-center shrink-0">
            <p className="text-sm text-yellow-500 mb-2 font-black flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
              Saldo de Créditos: {credits}
            </p>
            <p className="text-[10px] text-gray-500 font-medium italic">Servidores VIP garantem 0% de desconexão em Luanda.</p>
        </div>
      </div>
    </div>
  );
};

export default ServerSelector;
