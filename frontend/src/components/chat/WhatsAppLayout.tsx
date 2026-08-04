import React from 'react';
import { motion } from 'motion/react';
import { ChatList, ChatThreadItem } from './ChatList';

interface WhatsAppLayoutProps {
  threads?: ChatThreadItem[];
  selectedThreadId?: string;
  onSelectThread?: (thread: ChatThreadItem) => void;
  children: React.ReactNode;
}

export const WhatsAppLayout: React.FC<WhatsAppLayoutProps> = ({
  threads,
  selectedThreadId,
  onSelectThread,
  children
}) => {
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 h-[calc(100vh-70px)] min-h-[600px]">
      <div className="w-full h-full bg-[#efeae2] rounded-3xl shadow-xl border border-gray-200/90 overflow-hidden flex flex-col lg:flex-row">
        {/* Left Sidebar (Desktop Only or when threads provided) */}
        {threads && threads.length > 0 && onSelectThread && (
          <div className="w-full lg:w-80 xl:w-96 shrink-0 h-full hidden lg:block border-r border-gray-200">
            <ChatList
              threads={threads}
              selectedId={selectedThreadId}
              onSelectThread={onSelectThread}
            />
          </div>
        )}

        {/* Right Main Content Area */}
        <div className="flex-1 h-full overflow-y-auto relative flex flex-col justify-between">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
