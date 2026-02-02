'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';
import { Send, Paperclip, Mic, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  isConnected: boolean;
  onSendMessage: (content: string) => void;
}

export function ChatInterface({ messages, isLoading, isConnected, onSendMessage }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-900">
      {/* Header */}
      <div className="h-14 px-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-white">Chat with Bhairav</h2>
          <div className={clsx(
            'w-2 h-2 rounded-full',
            isConnected ? 'bg-green-500' : 'bg-red-500'
          )} />
          <span className="text-xs text-zinc-500">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map(message => (
          <div
            key={message.id}
            className={clsx(
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div className={clsx(
              'max-w-[75%] rounded-2xl px-5 py-3',
              message.role === 'user'
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                : 'bg-zinc-800 text-zinc-100'
            )}>
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🔱</span>
                  <span className="text-xs font-bold text-orange-400">BHAIRAV</span>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <p className={clsx(
                'text-xs mt-2',
                message.role === 'user' ? 'text-orange-200' : 'text-zinc-500'
              )}>
                {format(new Date(message.timestamp), 'h:mm a')}
              </p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🔱</span>
                <span className="text-xs font-bold text-orange-400">BHAIRAV</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={isLoading ? 'Bhairav is thinking...' : 'Message Bhairav...'}
              disabled={isLoading}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pr-20 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button type="button" className="p-1.5 hover:bg-zinc-700 rounded-lg transition-colors">
                <Paperclip size={18} className="text-zinc-500" />
              </button>
              <button type="button" className="p-1.5 hover:bg-zinc-700 rounded-lg transition-colors">
                <Mic size={18} className="text-zinc-500" />
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-5 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition-all text-white shadow-lg shadow-orange-500/20 disabled:shadow-none"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-xs text-zinc-600 mt-2 text-center">
          {isConnected
            ? 'Bhairav can generate images, videos, and voiceovers for your projects'
            : '⚠️ Not connected to gateway'}
        </p>
      </div>
    </div>
  );
}

export default ChatInterface;
