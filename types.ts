
export type Role = 'user' | 'assistant';

export enum UserRole {
  ADMIN = 'admin',
  CREATOR = 'creator',
  GUEST = 'guest'
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

export interface AIAgent {
  id: string;
  name: string;
  specialty: string;
  description: string;
  avatar: string;
  pricePerTask: string;
  rating: number;
  capabilities: string[];
  systemInstruction: string;
  model?: string;
  status?: 'idle' | 'active' | 'forging';
  evolutionLevel?: number;
  neuralDensity?: number;
  deploymentUrl?: string;
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

export enum AppRoute {
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  IMAGE = 'image',
  VIDEO = 'video',
  TRANSLATE = 'translate',
  NEURAL_EDGE = 'neural-edge',
  BUILDER = 'builder',
  AR_STORE = 'ar-store',
  MARKETPLACE = 'marketplace',
  AGENT_MANAGER = 'agent-manager',
  FIGMA = 'figma',
  SETTINGS = 'settings',
  ADMIN = 'admin'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  tier: string;
  status: 'active' | 'suspended';
  computeUsed: number;
}

export interface Transaction {
  id: string;
  user: string;
  amount: number;
  date: Date;
  status: 'success' | 'failed' | 'pending';
}

export interface DatabaseTable {
  name: string;
  rows: number;
  size: string;
  health: 'optimal' | 'indexing' | 'vacuuming' | 'degraded';
}

export interface QueryLog {
  id: string;
  query: string;
  duration: number;
  timestamp: Date;
}
