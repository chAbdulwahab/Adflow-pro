import { createClient } from '@/lib/supabase/server';
import ChatBox from '@/components/ui/ChatBox';

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch conversation details
  const { data: conversation } = await supabase
    .from('conversations')
    .select('*, ads(title)')
    .eq('id', id)
    .single();

  if (!conversation) return <div>Conversation not found</div>;

  // Fetch initial messages
  const { data: messages } = await supabase
    .from('messages')
    .select('*, profiles(name)')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true });

  const isBuyer = conversation.buyer_id === user.id;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10 bg-white/2 backdrop-blur-md">
        <h3 className="font-semibold text-white truncate">
          Chat regarding: <span className="text-indigo-400">{conversation.ads?.title}</span>
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          You are the {isBuyer ? 'Buyer' : 'Seller'}
        </p>
      </div>

      <ChatBox 
        conversationId={id} 
        initialMessages={messages || []} 
        currentUserId={user.id} 
      />
    </div>
  );
}
