'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { 
  LayoutDashboard, 
  PlusCircle, 
  List, 
  MessageSquare, 
  LogOut,
  Settings,
  PieChart,
  CheckCircle,
  CreditCard
} from 'lucide-react';

interface SidebarProps {
  role: 'client' | 'moderator' | 'admin';
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const roleLinks = {
    client: [
      { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
      { name: 'My Ads', href: '/client/my-ads', icon: List },
      { name: 'Create Ad', href: '/client/create-ad', icon: PlusCircle },
      { name: 'Messages', href: '/client/messages', icon: MessageSquare },
    ],
    moderator: [
      { name: 'Dashboard', href: '/moderator/dashboard', icon: LayoutDashboard },
      { name: 'Review Ads', href: '/moderator/review', icon: CheckCircle },
    ],
    admin: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Analytics', href: '/admin/analytics', icon: PieChart },
      { name: 'Payments', href: '/admin/payments', icon: CreditCard },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]
  };

  const links = roleLinks[role] || [];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="w-64 glass-panel border-y-0 border-l-0 flex flex-col h-full sticky top-0 left-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400 mb-1">
          AdFlow Pro
        </h1>
        <p className="text-xs uppercase tracking-wider opacity-60 font-semibold">{role} Portal</p>
      </div>
      
      <div className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link key={link.name} href={link.href}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                isActive ? 'text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active" 
                    className="absolute inset-0 bg-indigo-500/20 border border-indigo-500/30 rounded-lg -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                <Icon size={18} className={isActive ? 'text-indigo-400' : ''} />
                <span className="font-medium text-sm">{link.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
