import { createClient } from '@/lib/supabase/server';
import AnalyticsCharts from '@/components/ui/AnalyticsCharts';

export default async function AdminAnalytics() {
  const supabase = await createClient();
  
  const { data: ads } = await supabase.from('ads').select('*');
  const safeAds = ads || [];

  // Aggregate stats
  const stats = {
    totalAds: safeAds.length,
    activeAds: safeAds.filter(a => a.status === 'published').length,
    pendingAds: safeAds.filter(a => a.status === 'payment_pending' || a.status === 'submitted').length,
    // rough estimation
    revenue: safeAds.reduce((acc, ad) => {
      if (ad.status === 'published') {
         if (ad.package === 'premium') return acc + 99;
         if (ad.package === 'standard') return acc + 29;
         if (ad.package === 'basic') return acc + 9;
      }
      return acc;
    }, 0)
  };

  // Group by category
  const categoriesMap = safeAds.reduce((acc: any, ad) => {
    const cat = ad.category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.keys(categoriesMap).map(k => ({ category: k, count: categoriesMap[k] }));

  // Group by package
  const packagesMap = safeAds.reduce((acc: any, ad) => {
    const pkg = ad.package || 'basic';
    acc[pkg] = (acc[pkg] || 0) + 1;
    return acc;
  }, {});

  const packages = Object.keys(packagesMap).map(k => ({ package: k, count: packagesMap[k] }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
          Analytics Dashboard
        </h1>
        <p className="text-zinc-400 mt-1">Platform performance, ad statistics, and revenue insights.</p>
      </header>

      <AnalyticsCharts 
        stats={stats} 
        chartData={{ categories, packages }} 
      />
    </div>
  );
}
