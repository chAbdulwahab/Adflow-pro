'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-zinc-400 hover:text-white border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all"
    >
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  );
}
