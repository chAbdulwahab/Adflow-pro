import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Tag, ArrowLeft, MessageSquare, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

export default async function AdDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: ad } = await supabase
    .from('ads')
    .select('*, profiles(name)')
    .eq('id', id)
    .single();

  if (!ad || (ad.status !== 'published' && ad.status !== 'expired')) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Link href="/explore" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Explore
        </Link>
        
        <div className="glass-card overflow-hidden">
          {/* Header Image Placeholder */}
          <div className="h-64 md:h-96 bg-linear-to-br from-indigo-900/20 to-purple-900/20 flex flex-col items-center justify-center relative border-b border-white/5">
             <Tag size={64} className="text-white/10" />
             {ad.package === 'premium' && (
               <div className="absolute top-4 right-4 bg-linear-to-r from-amber-500 to-orange-400 text-xs font-bold px-3 py-1 text-white rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                 Premium Listing
               </div>
             )}
          </div>
          
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-medium text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full border border-indigo-400/20">
                    {ad.category}
                  </span>
                  <span className="text-sm text-zinc-500 flex items-center gap-1">
                    <Clock size={14} /> 
                    {format(new Date(ad.created_at), 'MMM dd, yyyy')}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{ad.title}</h1>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-emerald-200">
                  ${Number(ad.price).toLocaleString()}
                </p>
              </div>

              <div className="prose prose-invert max-w-none pt-4 border-t border-white/5">
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {ad.description}
                </p>
              </div>
            </div>

            {/* Sidebar info */}
            <div className="w-full md:w-80 shrink-0 space-y-6">
              <div className="glass-panel p-6 rounded-xl space-y-4">
                <h3 className="font-semibold text-white border-b border-white/10 pb-2">Seller Details</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-white">{ad.profiles?.name || 'Anonymous'}</p>
                    <p className="text-sm text-zinc-500 flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {ad.city}
                    </p>
                  </div>
                </div>

                {!user ? (
                  <Link href="/login" className="mt-4 w-full flex items-center justify-center bg-white/5 border border-white/10 text-white py-3 rounded-lg hover:bg-white/10 transition-colors">
                    Login to Contact
                  </Link>
                ) : user.id !== ad.user_id ? (
                  <form action={async () => {
                    'use server';
                    const supabaseServer = await createClient();
                    
                    // Create conversation if none exists
                    let { data: conv } = await supabaseServer.from('conversations')
                      .select('id').eq('ad_id', ad.id).eq('buyer_id', user.id).single();
                      
                    if (!conv) {
                      const { data: newConv } = await supabaseServer.from('conversations').insert({
                        ad_id: ad.id,
                        buyer_id: user.id,
                        seller_id: ad.user_id
                      }).select('id').single();
                      conv = newConv;
                    }
                    
                    redirect(`/client/messages/${conv?.id}`);
                  }}>
                    <button type="submit" className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                      <MessageSquare size={18} />
                      Chat with Seller
                    </button>
                  </form>
                ) : (
                  <div className="mt-4 text-center text-sm text-indigo-300 bg-indigo-500/10 py-3 rounded-lg border border-indigo-500/20">
                    This is your ad
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
