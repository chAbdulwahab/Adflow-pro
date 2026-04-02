import Sidebar from '@/components/ui/Sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Ensure user is authorized for moderator routes
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  
  if (profile?.role !== 'moderator' && profile?.role !== 'admin') {
    redirect(`/${profile?.role}/dashboard`);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar role="moderator" />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
