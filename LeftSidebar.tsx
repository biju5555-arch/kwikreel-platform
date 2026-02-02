'use client';

import { DirectorTask } from '@/types';
import { Plus, FolderOpen, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface LeftSidebarProps {
  tasks: DirectorTask[];
  onNewProject: () => void;
  onSelectTask: (taskId: string) => void;
  selectedTaskId?: string;
}

const statusIcons = {
  pending: Clock,
  processing: Loader2,
  completed: CheckCircle,
  failed: AlertCircle,
};

const statusColors = {
  pending: 'text-zinc-400',
  processing: 'text-yellow-500 animate-spin',
  completed: 'text-green-500',
  failed: 'text-red-500',
};

export function LeftSidebar({ tasks, onNewProject, onSelectTask, selectedTaskId }: LeftSidebarProps) {
  return (
    <div className="w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center font-bold text-xl">
            B
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">BHAIRAV</h1>
            <p className="text-xs text-zinc-500">Film Director AI</p>
          </div>
        </div>
      </div>

      {/* New Project Button */}
      <div className="p-3">
        <button
          onClick={onNewProject}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 text-white shadow-lg shadow-orange-500/20"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Recent Tasks */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <FolderOpen size={14} />
            Recent Tasks
          </h2>
          <div className="space-y-1">
            {tasks.length === 0 ? (
              <p className="text-sm text-zinc-600 px-3 py-2">No tasks yet. Start a new project!</p>
            ) : (
              tasks.map(task => {
                const StatusIcon = statusIcons[task.status];
                return (
                  <button
                    key={task.id}
                    onClick={() => onSelectTask(task.id)}
                    className={clsx(
                      'w-full text-left p-3 rounded-xl transition-all group',
                      selectedTaskId === task.id
                        ? 'bg-zinc-800 border border-zinc-700'
                        : 'hover:bg-zinc-900'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <StatusIcon size={16} className={clsx('mt-0.5', statusColors[task.status])} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">{task.name}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {new Date(task.updatedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    {task.status === 'processing' && (
                      <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* User */}
      <div className="p-3 border-t border-zinc-800">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900 cursor-pointer transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-full flex items-center justify-center text-sm font-medium text-white">
            BM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-200 truncate">Biju Meethaleveedu</p>
            <p className="text-xs text-zinc-500">Barbarian Labs</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;
