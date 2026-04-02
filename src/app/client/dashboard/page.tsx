import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { Layers, Activity, Clock, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Simple status colors
const getStatusColor = (status: string) => {
  switch(status) {
    case 'published': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'payment_pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'draft': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  }
};

export default async function ClientDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single();
  const { data: ads } = await supabase
    .from('ads')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const safeAds = ads || [];
  
  const stats = {
    total: safeAds.length,
    active: safeAds.filter(a => a.status === 'published').length,
    expired: safeAds.filter(a => a.status === 'expired').length,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
            Welcome back, {profile?.name || 'Client'}
          </h1>
          <p className="text-zinc-400 mt-1">Here's what's happening with your ads today.</p>
        </div>
        <Link 
          href="/client/create-ad" 
          className="flex items-center gap-2 bg-indigo-600 py-2.5 px-5 rounded-xl font-medium text-white transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-0.5"
        >
          <Plus size={18} />
          Create New Ad
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-center">
            <p className="text-zinc-400 font-medium tracking-wide text-sm uppercase">Total Ads</p>
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><Layers size={20} /></div>
          </div>
          <h3 className="text-4xl font-bold">{stats.total}</h3>
        </div>

        <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-center">
            <p className="text-zinc-400 font-medium tracking-wide text-sm uppercase">Active Ads</p>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Activity size={20} /></div>
          </div>
          <h3 className="text-4xl font-bold">{stats.active}</h3>
        </div>

        <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-center">
            <p className="text-zinc-400 font-medium tracking-wide text-sm uppercase">Expired</p>
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400"><Clock size={20} /></div>
          </div>
          <h3 className="text-4xl font-bold">{stats.expired}</h3>
        </div>
      </div>

      {/* Recent Ads Table View */}
      <div className="glass-card rounded-xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Recent Ads</h2>
          <Link href="/client/my-ads" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        
        {safeAds.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center text-zinc-400">
            <Layers size={48} className="opacity-20 mb-4" />
            <p>You haven't created any ads yet.</p>
            <Link href="/client/create-ad" className="text-indigo-400 mt-2 hover:underline">Get started by creating one</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-zinc-400 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {safeAds.slice(0, 5).map((ad) => (
                  <tr key={ad.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{ad.title}</td>
                    <td className="px-6 py-4 text-zinc-400">{ad.category || 'N/A'}</td>
                    <td className="px-6 py-4 text-zinc-300">${Number(ad.price).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full border ${getStatusColor(ad.status)}`}>
                        {ad.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      {format(new Date(ad.created_at), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
