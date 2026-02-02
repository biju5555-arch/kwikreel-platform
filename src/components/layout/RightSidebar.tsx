'use client';

import { GeneratedAsset, DirectorTask, Agent } from '@/types';
import { Download, Image, Video, Music, FileText, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
import AgentPanel from '@/components/agents/AgentPanel';

interface RightSidebarProps {
  tasks: DirectorTask[];
  assets: GeneratedAsset[];
  agents: Agent[];
  isConnected: boolean;
}

const assetIcons = {
  image: Image,
  video: Video,
  audio: Music,
  document: FileText,
};

const assetColors = {
  image: 'bg-purple-900/30 text-purple-400 border-purple-800/30',
  video: 'bg-blue-900/30 text-blue-400 border-blue-800/30',
  audio: 'bg-green-900/30 text-green-400 border-green-800/30',
  document: 'bg-zinc-800 text-zinc-400 border-zinc-700',
};

export function RightSidebar({ tasks, assets, agents, isConnected }: RightSidebarProps) {
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="w-80 bg-zinc-950 border-l border-zinc-800 flex flex-col h-full overflow-hidden">
      {/* Agent Status Panel */}
      <AgentPanel agents={agents} />

      {/* Progress Section */}
      <div className="p-4 border-b border-zinc-800">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Project Progress
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-500" />
              <span className="text-sm text-zinc-300">Completed</span>
            </div>
            <span className="text-sm font-medium text-white">{completedTasks}/{totalTasks}</span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-orange-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500">
            {progressPercent}% complete
          </p>
        </div>
      </div>

      {/* Generated Assets */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Working Folder
        </h3>
        <div className="space-y-2">
          {assets.length === 0 ? (
            <p className="text-sm text-zinc-600 py-4 text-center">
              No assets yet. Start creating!
            </p>
          ) : (
            assets.map(asset => {
              const AssetIcon = assetIcons[asset.type];
              return (
                <div
                  key={asset.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-900 cursor-pointer transition-colors group"
                >
                  <div className={clsx(
                    'w-10 h-10 rounded-lg flex items-center justify-center border',
                    assetColors[asset.type]
                  )}>
                    <AssetIcon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">{asset.name}</p>
                    <p className="text-xs text-zinc-500">
                      {new Date(asset.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <button className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <Download size={14} className="text-zinc-500" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Connection Status */}
      <div className="p-4 border-t border-zinc-800">
        <div className={clsx(
          'flex items-center gap-2 p-3 rounded-xl',
          isConnected ? 'bg-green-950/30' : 'bg-red-950/30'
        )}>
          <div className={clsx(
            'w-2 h-2 rounded-full',
            isConnected ? 'bg-green-500' : 'bg-red-500'
          )} />
          <span className={clsx(
            'text-sm font-medium',
            isConnected ? 'text-green-400' : 'text-red-400'
          )}>
            {isConnected ? 'Connected to Clawdbot' : 'Disconnected'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;
