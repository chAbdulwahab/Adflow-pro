import Link from 'next/link';
import { Layers, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="z-10 text-center space-y-8 max-w-4xl px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-indigo-300 mb-4 backdrop-blur-md">
          <Layers size={16} />
          <span>The Premium Ad Marketplace</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-br from-white via-zinc-200 to-indigo-400">
          Discover. Connect. Transact.
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          AdFlow Pro provides a beautifully designed, secure workflow for creating, managing, and exploring classified ads with real-time chat and payment verification.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            href="/explore" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:-translate-y-1"
          >
            Explore Ads
            <ArrowRight size={18} />
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-medium transition-all backdrop-blur-sm"
          >
            Sign In / Post Ad
          </Link>
        </div>
      </div>
    </div>
  );
}
