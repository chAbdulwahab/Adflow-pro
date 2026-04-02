import { createClient } from '@/lib/supabase/server';
import { 
  Shield, 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Globe, 
  HelpCircle,
  Save,
  ChevronRight
} from 'lucide-react';

export default async function AdminSettings() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-700 pb-20">
      <header>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
          Admin Settings
        </h1>
        <p className="text-zinc-400 mt-1">Manage your platform preferences and security configurations.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Navigation Tabs */}
        <aside className="md:col-span-1 space-y-2">
           {[
             { name: 'Profile', icon: User, active: true },
             { name: 'Notifications', icon: Bell, active: false },
             { name: 'Security', icon: Lock, active: false },
             { name: 'Platform Settings', icon: Globe, active: false },
             { name: 'Support', icon: HelpCircle, active: false }
           ].map(tab => (
             <button key={tab.name} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
               tab.active ? 'bg-indigo-600 text-white font-medium shadow-lg' : 'text-zinc-400 hover:bg-white/5'
             }`}>
               <div className="flex items-center gap-3">
                 <tab.icon size={18} />
                 <span>{tab.name}</span>
               </div>
               {tab.active && <ChevronRight size={16} />}
             </button>
           ))}
        </aside>

        {/* Content Area */}
        <main className="md:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-2xl space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-white/5 pb-4">Personal Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-60">Full Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5" defaultValue="Administrator" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-60">Email Address</label>
                  <input type="email" readOnly className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 opacity-50" defaultValue={user?.email || ''} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 opacity-60">Bio</label>
                <textarea rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5" placeholder="Tell us about yourself..." />
              </div>
            </div>

            <div className="pt-4">
               <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                 <Save size={18} />
                 Save Changes
               </button>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl border-indigo-500/10">
            <h2 className="text-xl font-bold text-indigo-400 mb-4 flex items-center gap-3">
              <Shield size={24} /> 
              Platform Security
            </h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Your account is protected by hardware security keys. We recommend enabling two-factor authentication for added safety.
            </p>
            <button className="w-full sm:w-auto px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors font-medium">
              Enable Two-Factor Auth
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
