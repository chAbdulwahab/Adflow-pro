import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { MessageSquare, User } from 'lucide-react';

export default async function MessagesLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  // Fetch conversations where user is buyer or seller
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, ad_id, created_at, ads(title), buyer:profiles!buyer_id(id, name), seller:profiles!seller_id(id, name)')
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  const safeConvs = conversations || [];

  return (
    <div className="flex h-[calc(100vh-8rem)] glass-card rounded-2xl overflow-hidden mt-2 border-white/10">
      {/* Left Sidebar - Conversation List */}
      <div className="w-1/3 min-w-[280px] border-r border-white/10 bg-white/2 flex flex-col h-full">
        <div className="p-5 border-b border-white/5">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <MessageSquare size={20} className="text-indigo-400" />
            Messages
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {safeConvs.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              <p>No conversations yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {safeConvs.map((conv: any) => {
                const isBuyer = conv.buyer.id === user.id;
                const otherParty = isBuyer ? conv.seller : conv.buyer;
                
                return (
                  <Link 
                    key={conv.id} 
                    href={`/client/messages/${conv.id}`}
                    className="block p-4 hover:bg-white/5 transition-colors focus:bg-white/5 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/30 transition-colors">
                        <User size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{otherParty.name}</p>
                        <p className="text-xs text-indigo-300 truncate">{conv.ads.title}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Content - Chat Box */}
      <div className="flex-1 bg-black/20 flex flex-col h-full">
        {children}
      </div>
    </div>
  );
}
