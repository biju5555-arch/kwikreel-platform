'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Message, DirectorTask, GeneratedAsset, Agent } from '@/types';

interface UseBhairavSocketReturn {
  messages: Message[];
  tasks: DirectorTask[];
  assets: GeneratedAsset[];
  agents: Agent[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export function useBhairavSocket(): UseBhairavSocketReturn {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Bhairav, your Film Director AI. I can help you create video ads, generate images, voiceovers, and manage your creative workflow. What would you like to create today?",
      timestamp: new Date(),
    },
  ]);
  const [tasks, setTasks] = useState<DirectorTask[]>([]);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [agents] = useState<Agent[]>([
    { id: 'ideogram', name: 'Ideogram', status: 'idle', avatar: '' },
    { id: 'runway', name: 'Runway', status: 'idle', avatar: '' },
    { id: 'elevenlabs', name: 'ElevenLabs', status: 'idle', avatar: '' },
    { id: 'ghl', name: 'GoHighLevel', status: 'idle', avatar: '' },
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef<string>(`bhairav-${Date.now()}`);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'GET',
      });
      const data = await response.json();
      setIsConnected(data.status === 'connected');
      if (data.status !== 'connected') {
        setError('Gateway not responding');
      } else {
        setError(null);
      }
    } catch {
      setIsConnected(false);
      setError('Cannot connect to gateway');
    }
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Call our API route which proxies to Clawdbot
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          sessionId: sessionIdRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.message || 'I received your message but got an unexpected response format.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsConnected(true);

      // Handle any tasks or assets returned
      if (data.tasks) {
        setTasks(prev => [...prev, ...data.tasks]);
      }
      if (data.assets) {
        setAssets(prev => [...prev, ...data.assets]);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Connection error: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Chat cleared. Ready for a new project!",
        timestamp: new Date(),
      },
    ]);
  }, []);

  return {
    messages,
    tasks,
    assets,
    agents,
    isConnected,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}

export default useBhairavSocket;
