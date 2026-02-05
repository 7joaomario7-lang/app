
import React from 'react';
import { VPNServer } from './types';

export const MOCK_SERVERS: VPNServer[] = [
  // Angola Core
  // Added status property to satisfy VPNServer interface
  { id: 'ao-1', country: 'Angola', city: 'Luanda', flag: '🇦🇴', ping: 5, load: 12, isPremium: true, ip: '197.231.128.44', status: 'ONLINE' },
  
  // Free / Standard Tier (Expanded)
  // Added status property to satisfy VPNServer interface
  { id: 'br-1', country: 'Brasil', city: 'São Paulo', flag: '🇧🇷', ping: 12, load: 15, isPremium: false, ip: '191.252.214.5', status: 'ONLINE' },
  { id: 'us-1', country: 'United States', city: 'New York', flag: '🇺🇸', ping: 42, load: 35, isPremium: false, ip: '104.21.77.10', status: 'ONLINE' },
  { id: 'fr-1', country: 'França', city: 'Paris', flag: '🇫🇷', ping: 38, load: 45, isPremium: false, ip: '51.15.22.190', status: 'ONLINE' },
  { id: 'ca-1', country: 'Canadá', city: 'Toronto', flag: '🇨🇦', ping: 55, load: 28, isPremium: false, ip: '198.51.100.42', status: 'ONLINE' },
  { id: 'pt-1', country: 'Portugal', city: 'Lisboa', flag: '🇵🇹', ping: 95, load: 22, isPremium: false, ip: '185.11.164.21', status: 'ONLINE' },
  { id: 'in-1', country: 'Índia', city: 'Mumbai', flag: '🇮🇳', ping: 140, load: 60, isPremium: false, ip: '13.233.15.11', status: 'ONLINE' },
  { id: 'za-1', country: 'South Africa', city: 'Johannesburg', flag: '🇿🇦', ping: 45, load: 33, isPremium: false, ip: '154.0.12.1', status: 'ONLINE' },
  
  // Premium Tier
  // Added status property to satisfy VPNServer interface
  { id: 'uk-1', country: 'United Kingdom', city: 'London', flag: '🇬🇧', ping: 102, load: 31, isPremium: true, ip: '35.176.12.84', status: 'ONLINE' },
  { id: 'sg-1', country: 'Singapore', city: 'Singapore', flag: '🇸🇬', ping: 180, load: 12, isPremium: true, ip: '128.199.124.5', status: 'ONLINE' },
];

export const SNI_CATEGORIES = {
  "Recomendados (Unitel)": [
    { host: 'fast-connect.unitel.co.ao', status: 'Rápido' },
    { host: 'internet.unitel.co.ao', status: 'Estável' },
    { host: 'gcloud.unitel.co.ao', status: 'Estável' },
    { host: 'portal.unitel.co.ao', status: 'Rápido' },
    { host: 'investir.unitel.co.ao', status: 'Estável' },
  ],
  "Redes Sociais (Zero-Rated)": [
    { host: 'g.whatsapp.net', status: 'Rápido' },
    { host: 'v.whatsapp.net', status: 'Estável' },
    { host: 'free.facebook.com', status: 'Instável' },
    { host: 'm.tiktok.com', status: 'Rápido' },
  ],
  "Alternativos (Global CDN)": [
    { host: 'www.google.com', status: 'Estável' },
    { host: 'cdn.jsdelivr.net', status: 'Rápido' },
    { host: 'cdnjs.cloudflare.com', status: 'Estável' },
    { host: 'speedtest.net', status: 'Instável' },
  ]
};

export const AD_PROVIDERS = [
  { id: 'unity', name: 'Unity Ads', logo: 'U', color: 'bg-blue-600', textColor: 'text-white' },
  { id: 'africell', name: 'Africell Angola', logo: 'A', color: 'bg-yellow-400', textColor: 'text-black' },
  { id: 'unitel', name: 'Unitel Money', logo: 'M', color: 'bg-red-600', textColor: 'text-white' },
  { id: 'tupuca', name: 'Tupuca Delivery', logo: 'T', color: 'bg-orange-500', textColor: 'text-white' },
  { id: 'bic', name: 'Banco BIC', logo: 'B', color: 'bg-indigo-700', textColor: 'text-white' },
  { id: 'sbank', name: 'Standard Bank', logo: 'S', color: 'bg-sky-500', textColor: 'text-white' },
];
