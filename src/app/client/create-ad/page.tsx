'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, Send, AlertCircle } from 'lucide-react';

export default function CreateAdPage() {
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', city: '', category: '', package: 'basic'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Dynamic Ad Score Calculation
    let newScore = 0;
    if (formData.title.length > 10) newScore += 25;
    if (formData.description.length > 50) newScore += 25;
    if (formData.price && Number(formData.price) > 0) newScore += 15;
    if (formData.city.length > 2) newScore += 15;
    if (formData.category) newScore += 20;
    setScore(newScore > 100 ? 100 : newScore);
  }, [formData]);

  const getScoreColor = () => {
    if (score < 40) return 'bg-rose-500';
    if (score < 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const handleSave = async (status: 'draft' | 'submitted') => {
    if (!formData.title) {
        setError('At least a Title is required to save.');
        return;
    }
    
    setLoading(true);
    setError(null);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        setError('You must be logged in to create an ad.');
        setLoading(false);
        return;
    }
    
    const payload = {
      user_id: user.id,
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      city: formData.city,
      category: formData.category,
      package: formData.package,
      status: status
    };

    const { error: dbError } = await supabase.from('ads').insert(payload);
    
    setLoading(false);
    if (dbError) {
      setError(dbError.message);
    } else {
      router.push('/client/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
          Create New Ad
        </h1>
        <p className="text-zinc-400 mt-1">Fill in the details below to reach thousands of potential buyers.</p>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative items-start">
        {/* Main form */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-xl space-y-6 flex flex-col">
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Ad Title</label>
            <input 
              type="text" 
              maxLength={100}
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder-zinc-500"
              placeholder="E.g. Vintage Leather Sofa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Description</label>
            <textarea 
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder-zinc-500 max-h-64 min-h-[100px]"
              placeholder="Describe your item in detail..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">Price ($)</label>
              <input 
                type="number" 
                min={0}
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">City</label>
              <input 
                type="text" 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white"
                placeholder="New York"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all text-white appearance-none"
              >
                <option value="" disabled>Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Services">Services</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">Package</label>
              <select 
                value={formData.package}
                onChange={(e) => setFormData({...formData, package: e.target.value})}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all text-white appearance-none"
              >
                <option value="basic">Basic (Standard Visibility)</option>
                <option value="standard">Standard (Priority Support)</option>
                <option value="premium">Premium (Featured Placement)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sidebar Sticky Panel */}
        <div className="lg:sticky lg:top-8 flex flex-col gap-6">
          <div className="glass-card p-6 border-indigo-500/20">
            <h3 className="font-semibold text-lg mb-4 text-white">Ad Quality Score</h3>
            <div className="w-full bg-white/5 rounded-full h-3 mb-2 overflow-hidden border border-white/5">
              <motion.div 
                className={`h-full ${getScoreColor()}`} 
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Score</span>
              <span className="font-bold text-white">{score}/100</span>
            </div>
            <p className="text-xs text-zinc-500 mt-4 leading-relaxed">
              Higher quality scores mean your ad is more likely to get approved faster and attract more buyers. Add descriptive text and fill out all fields.
            </p>
          </div>

          <div className="glass-panel p-6 flex flex-col gap-4">
            <h3 className="font-semibold text-white">Actions</h3>
            <button 
              onClick={() => handleSave('draft')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50"
            >
              <Save size={18} />
              Save as Draft
            </button>
            <button 
              onClick={() => handleSave('submitted')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] disabled:opacity-50"
            >
              <Send size={18} />
              Submit for Review
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
