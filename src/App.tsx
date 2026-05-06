import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Maximize2, 
  Crop, 
  Zap, 
  ArrowRight, 
  Image as ImageIcon,
  ShieldCheck,
  MousePointer2,
  Lock,
  Globe
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { translations, Language } from './translations';
import Compressor from './components/tools/Compressor';
import Resizer from './components/tools/Resizer';
import Cropper from './components/tools/Cropper';

type Tool = 'home' | 'compress' | 'resize' | 'crop';

const App = () => {
  const [activeTool, setActiveTool] = useState<Tool>('home');
  const [lang, setLang] = useState<Language>('en-US');
  const t = translations[lang];

  const tools = [
    {
      id: 'compress',
      name: t.compress,
      description: t.compressDesc,
      icon: Zap,
      gradient: 'vibrant-gradient-blue',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      id: 'resize',
      name: t.resize,
      description: t.resizeDesc,
      icon: Maximize2,
      gradient: 'vibrant-gradient-purple',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      id: 'crop',
      name: t.crop,
      description: t.cropDesc,
      icon: Crop,
      gradient: 'vibrant-gradient-rose',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-blue-600 selection:text-white">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center px-6">
          <div 
            className="flex items-center gap-3 py-4 border-b sm:border-b-0 sm:border-r border-gray-100 pr-6 mr-6 cursor-pointer group"
            onClick={() => setActiveTool('home')}
          >
            <div className="w-10 h-10 vibrant-gradient-blue rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 transition-transform group-hover:scale-110">
              <ImageIcon size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-base font-extrabold tracking-tighter text-gray-900 uppercase">{t.name}</h1>
          </div>
          
          <nav className="flex flex-1 items-center gap-1 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTool('home')}
              className={cn(
                "px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all rounded-full",
                activeTool === 'home' ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-gray-400 hover:text-gray-900"
              )}
            >
              {t.dashboard}
            </button>
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as Tool)}
                className={cn(
                  "px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all rounded-full flex items-center gap-2",
                  activeTool === tool.id ? "bg-gray-900 text-white shadow-md shadow-gray-200" : "text-gray-400 hover:text-gray-900"
                )}
              >
                {tool.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4 py-4 sm:py-0 border-t sm:border-t-0 sm:border-l border-gray-100 pl-6 h-full">
            <Globe size={14} className="text-gray-400" />
            <select 
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="text-[10px] font-bold uppercase tracking-widest bg-transparent outline-none focus:text-blue-600 transition-colors"
            >
              <option value="en-US">USA</option>
              <option value="en-GB">UK</option>
              <option value="en-CA">CAN</option>
              <option value="en-IN">IND</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTool === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              {/* Colorful Hero */}
              <div className="relative group">
                <div className="absolute -inset-4 vibrant-gradient-blue opacity-5 blur-3xl rounded-[3rem] -z-10 group-hover:opacity-10 transition-opacity" />
                <div className="max-w-3xl space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-blue-600 text-[10px] font-bold">
                    <ShieldCheck size={12} strokeWidth={3} /> {t.privacy} • {t.localProcessing}
                  </div>
                  <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-900 leading-[0.9]">
                    {t.heroTitle} <br />
                    <span className="text-transparent bg-clip-text vibrant-gradient-blue">{t.heroSubtitle}</span>
                  </h2>
                  <p className="text-lg text-gray-500 font-medium max-w-xl leading-relaxed">
                    Professional grade image manipulation tools built for efficiency and speed. 
                    No registration required, 100% free, and processed entirely in your browser.
                  </p>
                </div>
              </div>

              {/* Vibrant Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id as Tool)}
                    className="group cursor-pointer glass-card p-8 rounded-[2rem] transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/5 hover:border-gray-300 relative overflow-hidden"
                  >
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:scale-110", tool.gradient)}>
                      <tool.icon size={28} strokeWidth={2.5} className="text-white" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-extrabold text-gray-900">{tool.name}</h4>
                      <p className="text-gray-400 font-medium leading-relaxed">{tool.description}</p>
                    </div>
                    
                    <div className={cn("mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors", tool.color)}>
                      Launch System <ArrowRight size={14} />
                    </div>

                    <div className={cn("absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-opacity", tool.gradient)} />
                  </div>
                ))}
              </div>

              {/* Status Bar */}
              <div className="flex flex-wrap gap-8 justify-center py-10 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t.ready}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MousePointer2 size={12} className="text-gray-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t.browserBased}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock size={12} className="text-gray-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Secure</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTool === 'compress' && (
            <motion.div key="compress" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
              <Compressor onBack={() => setActiveTool('home')} lang={lang} />
            </motion.div>
          )}

          {activeTool === 'resize' && (
            <motion.div key="resize" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
              <Resizer onBack={() => setActiveTool('home')} lang={lang} />
            </motion.div>
          )}

          {activeTool === 'crop' && (
            <motion.div key="crop" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
              <Cropper onBack={() => setActiveTool('home')} lang={lang} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 border-t border-gray-50 bg-white px-6 py-12">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-gray-300">
             <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
             <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
             <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
             {t.name} &copy; 2026 • Professional Image Utilities
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
