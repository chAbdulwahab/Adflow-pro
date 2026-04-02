import { createClient } from '@/lib/supabase/server';
import { 
  Users, 
  Tag, 
  CreditCard, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  // Basic platform stats
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: pendingAds } = await supabase.from('ads').select('*', { count: 'exact', head: true })
    .eq('status', 'submitted');
  const { count: pendingPayments } = await supabase.from('ads').select('*', { count: 'exact', head: true })
    .eq('status', 'payment_pending');
  const { data: recentAds } = await supabase.from('ads').select('*').limit(5).order('created_at', { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
          Admin Control Panel
        </h1>
        <p className="text-zinc-400 mt-1">Global platform overview and quick management actions.</p>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 border-indigo-500/10">
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><Users size={20} /></span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><TrendingUp size={12} />+12%</span>
          </div>
          <h3 className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Total Users</h3>
          <p className="text-3xl font-bold text-white mt-1">{userCount || 0}</p>
        </div>

        <div className="glass-card p-6 border-blue-500/10">
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><AlertCircle size={20} /></span>
          </div>
          <h3 className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Pending Review</h3>
          <p className="text-3xl font-bold text-white mt-1">{pendingAds || 0}</p>
        </div>

        <div className="glass-card p-6 border-emerald-500/10">
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><CreditCard size={20} /></span>
          </div>
          <h3 className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Unverified Payments</h3>
          <p className="text-3xl font-bold text-white mt-1">{pendingPayments || 0}</p>
        </div>

        <Link href="/admin/analytics" className="glass-card p-6 border-purple-500/20 hover:border-purple-500/40 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:scale-110 transition-transform"><BarChart3 size={20} /></span>
          </div>
          <h3 className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Live Analytics</h3>
          <p className="text-sm font-medium text-purple-400 mt-2 flex items-center gap-1">
            View Analytics &rarr;
          </p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <h2 className="text-xl font-bold text-white">Management Tasks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/moderator/dashboard" className="p-4 bg-white/5 rounded-xl hover:bg-white/10 border border-white/5 transition-all">
               <h3 className="font-semibold text-indigo-400 text-sm mb-1">Moderation Queue</h3>
               <p className="text-xs text-zinc-500">Review pending ads for quality control.</p>
            </Link>
            <Link href="/admin/payments" className="p-4 bg-white/5 rounded-xl hover:bg-white/10 border border-white/5 transition-all">
               <h3 className="font-semibold text-emerald-400 text-sm mb-1">Verify Payments</h3>
               <p className="text-xs text-zinc-500">Publish ads after confirming transactions.</p>
            </Link>
          </div>
        </div>

        {/* Global Recent Activity */}
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Recent Ads</h2>
          <div className="space-y-4">
            {recentAds?.map(ad => (
              <div key={ad.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-zinc-600"><Tag size={20} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{ad.title}</p>
                  <p className="text-xs text-zinc-500">Status: <span className="text-indigo-300 uppercase">{ad.status}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
