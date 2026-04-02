import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { Layers, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

const getStatusColor = (status: string) => {
  switch(status) {
    case 'published': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'payment_pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'draft': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  }
};

export default async function MyAdsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: ads } = await supabase
    .from('ads')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const safeAds = ads || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
            My Created Ads
          </h1>
          <p className="text-zinc-400 mt-1">Manage all your listings from here.</p>
        </div>
        <Link 
          href="/client/create-ad" 
          className="flex items-center gap-2 bg-indigo-600 py-2.5 px-5 rounded-xl font-medium text-white transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-0.5"
        >
          <Plus size={18} />
          Create New Ad
        </Link>
      </header>

      {/* Stats Quick Filter? */}
      {safeAds.length === 0 ? (
        <div className="glass-panel p-20 text-center flex flex-col items-center justify-center text-zinc-400 border-white/5 rounded-3xl">
          <Layers size={64} className="opacity-10 mb-6" />
          <h3 className="text-2xl font-bold text-white mb-2">No listings found</h3>
          <p className="max-w-xs mx-auto mb-8 text-sm">You haven't posted any ads yet. Ready to start selling?</p>
          <Link href="/client/create-ad" className="bg-white/5 hover:bg-white/10 px-8 py-3 rounded-xl text-white font-medium border border-white/10 transition-all">
            Create Your First Ad
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {safeAds.map((ad) => (
            <div key={ad.id} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-6 md:items-center relative group overflow-hidden border-white/5 hover:border-indigo-500/20 transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${getStatusColor(ad.status)}`}>
                    {ad.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-zinc-500">
                    Created {format(new Date(ad.created_at), 'MMM dd, yyyy')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white truncate group-hover:text-indigo-300 transition-colors">{ad.title}</h3>
                <div className="flex gap-4 mt-2 text-sm text-zinc-500">
                  <span>Price: <strong className="text-white">${Number(ad.price).toLocaleString()}</strong></span>
                  <span>Category: <strong className="text-white">{ad.category}</strong></span>
                  <span>Package: <strong className="text-white capitalize">{ad.package}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link 
                  href={`/ad/${ad.id}`} 
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-all border border-white/5"
                  title="View Publicly"
                >
                  <Eye size={18} />
                </Link>
                <Link 
                  href={`/client/edit-ad/${ad.id}`} 
                  className="p-2 bg-indigo-600/10 hover:bg-indigo-600/20 rounded-lg text-indigo-400 transition-all border border-indigo-500/20"
                  title="Edit Ad"
                >
                  <Pencil size={18} />
                </Link>
                <form action={async () => {
                   'use server';
                   const sc = await createClient();
                   await sc.from('ads').delete().eq('id', ad.id);
                }}>
                  <button 
                    className="p-2 bg-rose-600/10 hover:bg-rose-600/20 rounded-lg text-rose-400 transition-all border border-rose-500/20"
                    title="Delete Ad"
                  >
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
