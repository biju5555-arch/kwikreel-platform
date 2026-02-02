'use client';

import { useState } from 'react';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import QuickGenPanel from '@/components/quickgen/QuickGenPanel';
import { useBhairavSocket } from '@/hooks/useBhairavSocket';
import { DirectorTask, GeneratedAsset } from '@/types';
import { Zap, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';

type ViewMode = 'quick' | 'chat';

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('quick');
  const { messages, tasks: socketTasks, assets: socketAssets, agents, isConnected, isLoading, sendMessage, clearMessages } = useBhairavSocket();

  // Sample data for demo - will be replaced by real data from socket
  const [tasks, setTasks] = useState<DirectorTask[]>([
    {
      id: '1',
      name: 'Generate BuildSage ad image',
      status: 'completed',
      progress: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Create voiceover script',
      status: 'processing',
      progress: 65,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'Render final video',
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [assets, setAssets] = useState<GeneratedAsset[]>([
    {
      id: '1',
      name: 'buildsage_hero.png',
      type: 'image',
      url: '/assets/buildsage_hero.png',
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'contractor_scene.mp4',
      type: 'video',
      url: '/assets/contractor_scene.mp4',
      createdAt: new Date(),
    },
    {
      id: '3',
      name: 'voiceover_v1.mp3',
      type: 'audio',
      url: '/assets/voiceover_v1.mp3',
      createdAt: new Date(),
    },
  ]);

  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>();

  const handleNewProject = () => {
    clearMessages();
    setSelectedTaskId(undefined);
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* Mode Toggle - Fixed Top */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-800/90 backdrop-blur-sm rounded-full p-1 flex gap-1 shadow-lg border border-zinc-700">
        <button
          onClick={() => setViewMode('quick')}
          className={clsx(
            'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2',
            viewMode === 'quick' 
              ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg' 
              : 'text-zinc-400 hover:text-white'
          )}
        >
          <Zap size={16} />
          Quick Generate
        </button>
        <button
          onClick={() => setViewMode('chat')}
          className={clsx(
            'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2',
            viewMode === 'chat' 
              ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg' 
              : 'text-zinc-400 hover:text-white'
          )}
        >
          <MessageSquare size={16} />
          Chat Mode
        </button>
      </div>

      {viewMode === 'quick' ? (
        /* Quick Generate Mode - Simplified single panel */
        <div className="flex-1 pt-16">
          <QuickGenPanel />
        </div>
      ) : (
        /* Chat Mode - Original three-panel layout */
        <>
          {/* Left Sidebar - Tasks & Navigation */}
          <LeftSidebar
            tasks={tasks}
            onNewProject={handleNewProject}
            onSelectTask={handleSelectTask}
            selectedTaskId={selectedTaskId}
          />

          {/* Main Chat Interface */}
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            isConnected={isConnected}
            onSendMessage={sendMessage}
          />

          {/* Right Sidebar - Agents, Progress & Assets */}
          <RightSidebar
            tasks={tasks}
            assets={assets}
            agents={agents}
            isConnected={isConnected}
          />
        </>
      )}
    </div>
  );
}
