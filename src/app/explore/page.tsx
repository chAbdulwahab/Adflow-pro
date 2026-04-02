import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Search, MapPin, Tag, Home as HomeIcon } from 'lucide-react';

export default async function ExplorePage() {
  const supabase = await createClient();
  
  // Only fetch published ads
  const { data: ads } = await supabase
    .from('ads')
    .select('*, profiles(name)')
    .eq('status', 'published');

  const safeAds = ads || [];

  // Ranking formula
  const rankedAds = safeAds.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    
    if (a.package === 'premium') scoreA += 50;
    else if (a.package === 'standard') scoreA += 20;
    
    if (b.package === 'premium') scoreB += 50;
    else if (b.package === 'standard') scoreB += 20;
    
    const daysA = (Date.now() - new Date(a.created_at).getTime()) / (1000 * 3600 * 24);
    const daysB = (Date.now() - new Date(b.created_at).getTime()) / (1000 * 3600 * 24);
    
    scoreA += Math.max(0, 30 - daysA);
    scoreB += Math.max(0, 30 - daysB);
    
    return scoreB - scoreA;
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Navbar */}
        <header className="flex justify-between items-center bg-white/2 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-400">
            Explore Ads
          </h1>
          <div className="flex gap-4">
            <Link href="/" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
              <HomeIcon size={16} /> Home
            </Link>
            <Link href="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all">
              Post an Ad
            </Link>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 glass-card p-6 flex flex-col gap-6 sticky top-8 shrink-0">
            <div>
              <h3 className="font-medium text-white mb-3">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-zinc-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Keyword..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-3 flex items-center gap-2"><MapPin size={16} className="text-indigo-400" /> City</h3>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none">
                <option value="">All Cities</option>
                <option value="ny">New York</option>
                <option value="la">Los Angeles</option>
              </select>
            </div>

            <div>
              <h3 className="font-medium text-white mb-3 flex items-center gap-2"><Tag size={16} className="text-purple-400" /> Category</h3>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none">
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Vehicles">Vehicles</option>
              </select>
            </div>
          </aside>

          {/* Main Grid */}
          <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rankedAds.length === 0 ? (
              <div className="col-span-full glass-panel p-12 text-center text-zinc-400 rounded-2xl flex flex-col items-center">
                <Search size={48} className="opacity-20 mb-4" />
                <p className="text-lg">No active ads found.</p>
                <p className="text-sm mt-1">Be the first to post an ad in this category!</p>
              </div>
            ) : (
              rankedAds.map((ad) => (
                <Link key={ad.id} href={`/ad/${ad.id}`}>
                  <div className="glass-card flex flex-col h-full overflow-hidden hover:-translate-y-1 transition-transform group relative border-white/5 hover:border-indigo-500/30">
                    {ad.package === 'premium' && (
                      <div className="absolute top-0 right-0 bg-linear-to-l from-amber-500 to-orange-400 text-xs font-bold px-3 py-1 text-white rounded-bl-lg z-10 shadow-lg">
                        FEATURED
                      </div>
                    )}
                    <div className="h-48 bg-white/5 border-b border-white/5 relative overflow-hidden flex items-center justify-center">
                       {/* Placeholder for Media */}
                       <Tag size={40} className="text-white/10 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">
                          {ad.category}
                        </span>
                        <span className="text-xs text-zinc-500">{ad.city}</span>
                      </div>
                      <h3 className="font-semibold text-lg text-white mb-2 line-clamp-2 leading-tight group-hover:text-indigo-300 transition-colors">
                        {ad.title}
                      </h3>
                      <p className="text-2xl font-bold text-white mt-auto pt-4 flex items-end">
                        ${Number(ad.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
