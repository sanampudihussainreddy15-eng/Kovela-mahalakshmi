/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Github, Twitter, Info } from 'lucide-react';

export default function App() {
  const [currentScore, setCurrentScore] = useState(0);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#050505] p-4 font-sans selection:bg-cyan-400 selection:text-black md:p-8">
      {/* Background Gratitude */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 mb-8 flex w-full max-w-6xl items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-fuchsia-500 p-[2px]">
            <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-black">
              <span className="font-mono text-xl font-black text-white">N</span>
            </div>
          </div>
          <h1 className="text-xl font-black uppercase tracking-tighter text-white">Neon Snake <span className="text-cyan-400 italic">Beats</span></h1>
        </div>
        
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#" className="font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-cyan-400 transition-colors">Documentation</a>
          <a href="#" className="font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-cyan-400 transition-colors">Leaderboard</a>
          <button className="rounded-full border border-white/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/60 hover:border-white/20 hover:text-white transition-all">Support</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        
        {/* Left Stats Section (Visible on large screens) */}
        <aside className="hidden lg:col-span-3 lg:flex flex-col gap-8">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
            <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Status</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-sm text-white/60">AI Engine</span>
                <span className="text-sm font-bold text-green-400">ONLINE</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-sm text-white/60">Latency</span>
                <span className="text-sm font-mono text-cyan-400 text-xs">24ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Mode</span>
                <span className="text-sm font-bold text-fuchsia-500 uppercase tracking-tighter">Hyperdrive</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
            <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Controls</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <kbd className="flex h-7 w-7 items-center justify-center rounded border border-white/20 bg-white/5 font-mono text-xs">↑</kbd>
                <span className="text-xs text-white/50">Navigate Grid</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="flex h-7 w-12 items-center justify-center rounded border border-white/20 bg-white/5 font-mono text-xs">SPACE</kbd>
                <span className="text-xs text-white/50">Pause System</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Game Section */}
        <section className="lg:col-span-5 flex flex-col items-center">
          <div className="mb-2 flex w-full items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">Systems Active</span>
            </div>
            <div className="text-[10px] font-mono text-white/20">V.1.04.2-STABLE</div>
          </div>
          <div className="w-full">
            <SnakeGame onScoreUpdate={setCurrentScore} />
          </div>
        </section>

        {/* Right Music Section */}
        <section className="lg:col-span-4 flex flex-col items-center">
            <MusicPlayer />
            
            <div className="mt-8 flex w-full max-w-sm items-start gap-4 rounded-2xl bg-white/[0.03] p-4 text-white/40">
                <Info size={18} className="mt-0.5 shrink-0 text-cyan-400" />
                <p className="text-[10px] leading-relaxed uppercase tracking-wider">
                  Snake speed increases as you collect data nodes. The audio tracks are procedurally synchronized to the game's clock for a unified sensory experience.
                </p>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 flex w-full max-w-6xl items-center justify-between border-t border-white/5 pt-12 text-white/20">
        <div className="flex items-center gap-8 font-mono text-[10px] uppercase tracking-[0.2em]">
          <span>© 2026 NEON LABS</span>
          <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">
            <Github size={20} />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <Twitter size={20} />
          </a>
        </div>
      </footer>
    </div>
  );
}

