import { createClient } from '@/lib/supabase/server';
import { CheckCircle, XCircle, CreditCard, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default async function AdminPayments() {
  const supabase = await createClient();
  
  // Fetch ads that are pending payment verification
  const { data: ads } = await supabase
    .from('ads')
    .select('*, profiles(name)')
    .eq('status', 'payment_pending')
    .order('created_at', { ascending: false });

  const pendingPayments = ads || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-emerald-400 to-teal-400">
          Payment Verification
        </h1>
        <p className="text-zinc-400 mt-1">Verify transactions and publish ads to the marketplace.</p>
      </header>

      <div className="glass-card flex items-center justify-between p-6 rounded-xl border-emerald-500/20">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Pending Verification</span>
          <span className="text-4xl font-bold text-white mt-1">{pendingPayments.length}</span>
        </div>
        <CreditCard size={48} className="text-emerald-500/20" />
      </div>

      <div className="space-y-4">
        {pendingPayments.length === 0 ? (
          <div className="glass-panel p-12 text-center text-zinc-400 rounded-2xl">
            <CheckCircle size={48} className="opacity-20 mb-4 mx-auto text-emerald-400" />
            <p className="text-lg">No pending payments!</p>
            <p className="text-sm">All invoices have been verified.</p>
          </div>
        ) : (
          pendingPayments.map(ad => (
            <div key={ad.id} className="glass-panel p-6 rounded-xl flex flex-col md:flex-row gap-6 md:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 uppercase tracking-wide flex items-center gap-1">
                    <DollarSign size={12} /> Pending Payment
                  </span>
                  <span className="text-xs text-zinc-500">
                    User: {ad.profiles?.name || 'Unknown'} (ID: {ad.user_id.split('-')[0]}...)
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white">{ad.title}</h3>
                <div className="flex gap-4 mt-3 text-sm text-zinc-500">
                  <span>Price: <strong className="text-white">${Number(ad.price).toLocaleString()}</strong></span>
                  <span>Package: <strong className="text-white capitalize">{ad.package}</strong></span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-3 shrink-0">
                <form action={async () => {
                  'use server';
                  const sc = await createClient();
                  // Set to published and set expire_at (e.g. +30 days)
                  const expireAt = new Date();
                  expireAt.setDate(expireAt.getDate() + 30);
                  
                  await sc.from('ads').update({ 
                    status: 'published',
                    publish_at: new Date().toISOString(),
                    expire_at: expireAt.toISOString()
                  }).eq('id', ad.id);
                }}>
                  <button className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/50 px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] font-medium text-sm">
                    <CheckCircle size={16} /> Mark Paid & Publish
                  </button>
                </form>

                <form action={async () => {
                  'use server';
                  const sc = await createClient();
                  await sc.from('ads').update({ status: 'rejected' }).eq('id', ad.id);
                }}>
                  <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-rose-400 border border-white/10 px-4 py-2 rounded-lg transition-colors font-medium text-sm">
                    <XCircle size={16} /> Mark Unpaid & Reject
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
