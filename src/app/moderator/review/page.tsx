import { createClient } from '@/lib/supabase/server';
import { CheckCircle, XCircle, Eye, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default async function ModeratorReview() {
  const supabase = await createClient();
  
  // Fetch ads pending review
  const { data: ads } = await supabase
    .from('ads')
    .select('*, profiles(name)')
    .eq('status', 'submitted')
    .order('created_at', { ascending: true });

  const pendingAds = ads || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
          Ads Review Queue
        </h1>
        <p className="text-zinc-400 mt-1">Approve or reject ads waiting for publication.</p>
      </header>

      <div className="space-y-4">
        {pendingAds.length === 0 ? (
          <div className="glass-panel p-20 text-center text-zinc-400 rounded-3xl border-white/5">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Queue is cleared!</h2>
            <p className="max-w-md mx-auto">There are currently no ads waiting for moderation. Good job!</p>
          </div>
        ) : (
          pendingAds.map(ad => (
            <div key={ad.id} className="glass-panel p-8 rounded-2xl flex flex-col md:flex-row gap-8 md:items-center relative group overflow-hidden border-white/5 hover:border-indigo-500/20 transition-all">
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="w-full md:w-32 h-32 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10 group-hover:border-indigo-500/30 transition-all">
                <ShoppingBag size={48} className="text-zinc-600 group-hover:text-indigo-400 transition-colors" />
              </div>

              <div className="flex-1 min-w-0 relative">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-xs font-bold px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/20 uppercase tracking-widest">
                    {ad.package} listing
                  </span>
                  <span className="text-sm text-zinc-500">
                    ID: #{ad.id.split('-')[0]}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors truncate">{ad.title}</h3>
                <p className="text-zinc-400 text-sm mt-2 line-clamp-2 leading-relaxed">{ad.description}</p>
                
                <div className="flex gap-6 mt-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Price</span>
                    <span className="text-lg font-bold text-emerald-400">${Number(ad.price).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col border-l border-white/10 pl-6">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Category</span>
                    <span className="text-lg font-bold text-white">{ad.category}</span>
                  </div>
                  <div className="flex flex-col border-l border-white/10 pl-6">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Seller</span>
                    <span className="text-lg font-bold text-white">{ad.profiles?.name}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-4 shrink-0 relative mt-6 md:mt-0">
                <form action={async () => {
                  'use server';
                  const sc = await createClient();
                  await sc.from('ads').update({ status: 'payment_pending' }).eq('id', ad.id);
                }}>
                  <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] font-semibold text-sm">
                    <CheckCircle size={18} /> Approve
                  </button>
                </form>

                <form action={async () => {
                  'use server';
                  const sc = await createClient();
                  await sc.from('ads').update({ status: 'rejected' }).eq('id', ad.id);
                }}>
                  <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-rose-400 border border-white/5 px-6 py-3 rounded-xl transition-colors font-semibold text-sm">
                    <XCircle size={18} /> Reject Ad
                  </button>
                </form>

                <Link href={`/ad/${ad.id}`} className="flex items-center justify-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold underline underline-offset-4">
                  <Eye size={14} /> Full Ad Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
