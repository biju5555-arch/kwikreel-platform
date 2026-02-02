'use client';

import { Agent } from '@/types';
import { clsx } from 'clsx';

interface AgentPanelProps {
  agents: Agent[];
}

export function AgentPanel({ agents }: AgentPanelProps) {
  return (
    <div className="p-4 border-b border-zinc-800">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
        Active Agents
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {agents.map(agent => (
          <div
            key={agent.id}
            className={clsx(
              'flex items-center gap-2 p-2.5 rounded-xl border transition-all',
              agent.status === 'working'
                ? 'bg-orange-950/30 border-orange-800/50'
                : agent.status === 'completed'
                ? 'bg-green-950/30 border-green-800/50'
                : agent.status === 'error'
                ? 'bg-red-950/30 border-red-800/50'
                : 'bg-zinc-900 border-zinc-800'
            )}
          >
            <span className="text-xl">{agent.avatar || '🤖'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate">{agent.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {/* Status Circle */}
                <div className={clsx(
                  'w-2 h-2 rounded-full transition-colors',
                  agent.status === 'idle' && 'bg-zinc-500',
                  agent.status === 'working' && 'bg-orange-500 animate-pulse',
                  agent.status === 'completed' && 'bg-green-500',
                  agent.status === 'error' && 'bg-red-500'
                )} />
                <p className={clsx(
                  'text-[10px]',
                  agent.status === 'idle' && 'text-zinc-500',
                  agent.status === 'working' && 'text-orange-400',
                  agent.status === 'completed' && 'text-green-400',
                  agent.status === 'error' && 'text-red-400'
                )}>
                  {agent.status === 'idle' && 'Ready'}
                  {agent.status === 'working' && 'Working...'}
                  {agent.status === 'completed' && 'Done'}
                  {agent.status === 'error' && 'Error'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgentPanel;
