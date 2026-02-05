
export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}

export interface VPNServer {
  id: string;
  country: string;
  city: string;
  flag: string;
  ping: number;
  load: number;
  isPremium: boolean;
  ip: string;
  status: 'ONLINE' | 'MAINTENANCE' | 'OFFLINE';
}

export interface UserStats {
  dataUsed: number; // in MB
  downloadSpeed: number; // in Mbps
  uploadSpeed: number; // in Mbps
  credits: number;
  timeRemaining: number; // in seconds
  stabilityScore: number; // 0-100
}

export interface AdminMetrics {
  totalRevenueKz: number;
  activeUsersGlobal: number;
  totalDataTransferred: number;
  systemHealth: number;
}

export interface ConnectionLog {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

export interface AdContract {
  id: string;
  companyName: string;
  status: 'ATIVO' | 'PENDENTE' | 'EXPIRADO';
  type: 'Banner' | 'Video' | 'Redirect';
  revenueKz: number;
  impressions: number;
  logo: string;
}

export interface BrandCampaign {
  id: string;
  name: string;
  brand: string;
  budgetKz: number;
  remainingImpressions: number;
  ctr: number;
  color: string;
  status: 'LIVE' | 'PAUSED' | 'COMPLETED';
}

export interface SNIConfig {
  host: string;
  protocol: 'VLESS' | 'VMESS' | 'TROJAN' | 'SHADOWSOCKS' | 'SSH' | 'TLS' | 'PROXY' | 'WS' | 'SSH+PROXY';
  encryption: 'TLS' | 'None';
  platformMode: 'Android';
  proxyHost?: string;
  proxyPort?: string;
}

export interface EarningEntry {
  id: string;
  timestamp: Date;
  type: 'credits' | 'turbo' | 'time';
  amount: number | string;
  label: string;
}

export interface PayoutTransaction {
  id: string;
  source: string;
  amountKz: number;
  date: string;
  status: 'COMPLETED' | 'PENDING';
  logo: string;
}

export interface DeviceInfo {
  ip: string;
  city: string;
  country: string;
  isp: string;
  connectionType: string;
  effectiveType: string;
  os: string;
  browser: string;
  latitude?: number;
  longitude?: number;
}
