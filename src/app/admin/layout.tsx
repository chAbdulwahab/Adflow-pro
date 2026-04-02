import Sidebar from '@/components/ui/Sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect(`/${profile?.role}/dashboard`);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar role="admin" />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <div className="absolute top-1/2 -right-1/4 w-160 h-160 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
