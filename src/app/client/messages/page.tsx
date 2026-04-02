import { MessageSquare } from 'lucide-react';

export default function MessagesIndex() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 h-full p-8 text-center">
      <MessageSquare size={64} className="opacity-20 mb-4" />
      <h3 className="text-xl font-medium text-zinc-300">Your Messages</h3>
      <p className="mt-2 text-sm max-w-sm">Select a conversation from the sidebar to view your chat history and reply.</p>
    </div>
  );
}
