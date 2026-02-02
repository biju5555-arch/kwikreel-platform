// Core Types for Bhairav AI Platform

export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  name: string;
  size?: number;
}

export interface DirectorTask {
  id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
  agentId?: string;
  result?: GeneratedAsset;
}

export interface GeneratedAsset {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  name: string;
  thumbnail?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'working' | 'completed' | 'error';
  currentTask?: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  tasks: DirectorTask[];
  assets: GeneratedAsset[];
  createdAt: Date;
  updatedAt: Date;
}
