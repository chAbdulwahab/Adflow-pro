import { createClient } from '@/lib/supabase/server';
import { CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react';
import Link from 'next/link';

export default async function ModeratorDashboard() {
  const supabase = await createClient();
  
  // Fetch ads pending review
  const { data: ads } = await supabase
    .from('ads')
    .select('*, profiles(name)')
    .eq('status', 'submitted')
    .order('created_at', { ascending: true });

  const pendingAds = ads || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
          Moderation Queue
        </h1>
        <p className="text-zinc-400 mt-1">Review recently submitted ads for compliance and quality.</p>
      </header>

      <div className="glass-card flex items-center justify-between p-6 rounded-xl border-blue-500/20">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Pending Review</span>
          <span className="text-4xl font-bold text-white mt-1">{pendingAds.length}</span>
        </div>
        <AlertTriangle size={48} className="text-blue-500/20" />
      </div>

      <div className="space-y-4">
        {pendingAds.length === 0 ? (
          <div className="glass-panel p-12 text-center text-zinc-400 rounded-2xl">
            <CheckCircle size={48} className="opacity-20 mb-4 mx-auto text-emerald-400" />
            <p className="text-lg">Queue is empty!</p>
            <p className="text-sm">All submitted ads have been processed.</p>
          </div>
        ) : (
          pendingAds.map(ad => (
            <div key={ad.id} className="glass-panel p-6 rounded-xl flex flex-col md:flex-row gap-6 md:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20 uppercase tracking-wide">
                    {ad.package} listing
                  </span>
                  <span className="text-xs text-zinc-500">
                    User ID: {ad.user_id.split('-')[0]}...
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white">{ad.title}</h3>
                <p className="text-zinc-400 text-sm mt-2 line-clamp-2">{ad.description}</p>
                <div className="flex gap-4 mt-3 text-sm text-zinc-500">
                  <span>Price: <strong className="text-white">${Number(ad.price).toLocaleString()}</strong></span>
                  <span>Cat: <strong className="text-white">{ad.category}</strong></span>
                  <span>City: <strong className="text-white">{ad.city}</strong></span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-3 shrink-0">
                <form action={async () => {
                  'use server';
                  const sc = await createClient();
                  await sc.from('ads').update({ status: 'payment_pending' }).eq('id', ad.id);
                }}>
                  <button className="w-full flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg transition-colors font-medium text-sm">
                    <CheckCircle size={16} /> Approve
                  </button>
                </form>

                <form action={async () => {
                  'use server';
                  const sc = await createClient();
                  await sc.from('ads').update({ status: 'rejected' }).eq('id', ad.id);
                }}>
                  <button className="w-full flex items-center justify-center gap-2 bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-500/30 px-4 py-2 rounded-lg transition-colors font-medium text-sm">
                    <XCircle size={16} /> Reject
                  </button>
                </form>

                <Link href={`/ad/${ad.id}`} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg transition-colors text-sm">
                  <Eye size={16} /> View Ad
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
