
export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
}

export interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  status: 'processing' | 'completed' | 'failed';
  timestamp: Date;
}

export interface UserSite {
  id: string;
  name: string;
  domain: string;
  thumbnail: string;
  lastModified: Date;
}

export interface DatabaseTable {
  name: string;
  rows: number;
  size: string;
  health: 'optimal' | 'vacuuming' | 'indexing';
}

export interface QueryLog {
  id: string;
  query: string;
  duration: number;
  timestamp: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  tier: 'Silicon' | 'Carbon' | 'Neural';
  status: 'active' | 'suspended';
  computeUsed: number;
}

export interface Transaction {
  id: string;
  user: string;
  amount: number;
  date: Date;
  status: 'success' | 'pending' | 'failed';
}

export enum AppRoute {
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  IMAGE = 'image',
  VIDEO = 'video',
  BUILDER = 'builder',
  AR_STORE = 'ar-store',
  MARKETPLACE = 'marketplace',
  SETTINGS = 'settings',
  ADMIN = 'admin'
}
