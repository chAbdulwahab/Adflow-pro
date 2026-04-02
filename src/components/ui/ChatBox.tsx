'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Send } from 'lucide-react';

interface ChatBoxProps {
  conversationId: string;
  initialMessages: any[];
  currentUserId: string;
}

export default function ChatBox({ conversationId, initialMessages, currentUserId }: ChatBoxProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Subscribe to Realtime messages
  useEffect(() => {
    const channel = supabase
      .channel(`chat_${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        // Fetch the sender's profile to append name (optional, or just append raw payload if we aren't showing names for every bubble)
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, supabase]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      message: newMessage.trim()
    });
    
    if (!error) {
      setNewMessage('');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Message List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
      >
        {messages.map((msg: any) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} className={`flex flex-col w-full ${isMe ? 'items-end' : 'items-start'}`}>
              <div className={`
                max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm
                ${isMe 
                  ? 'bg-indigo-600 text-white rounded-br-sm' 
                  : 'bg-white/10 text-white rounded-bl-sm border border-white/5'
                }
              `}>
                <p className="whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-white/2 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={loading}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder-zinc-500 text-sm"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim() || loading}
            className="w-12 h-12 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 shrink-0"
          >
            <Send size={18} className={newMessage.trim() && !loading ? "translate-x-[2px] transition-transform" : ""} />
          </button>
        </form>
      </div>
    </div>
  );
}
