import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Maximize2, 
  Crop, 
  Zap, 
  Home, 
  ArrowRight, 
  Image as ImageIcon,
  ShieldCheck,
  MousePointer2,
  Lock
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import Compressor from './components/tools/Compressor';
import Resizer from './components/tools/Resizer';
import Cropper from './components/tools/Cropper';

type Tool = 'home' | 'compress' | 'resize' | 'crop';

const App = () => {
  const [activeTool, setActiveTool] = useState<Tool>('home');

  const tools = [
    {
      id: 'compress',
      name: 'Compress',
      description: 'Optimize size without visible quality loss',
      icon: Zap,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      id: 'resize',
      name: 'Resize',
      description: 'Change pixel dimensions with ease',
      icon: Maximize2,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      id: 'crop',
      name: 'Crop',
      description: 'Remove unwanted areas precisely',
      icon: Crop,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans selection:bg-blue-600 selection:text-white">
      {/* Refined Technical Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center">
          <div 
            className="flex items-center gap-2 px-6 py-4 border-b sm:border-b-0 sm:border-r border-gray-100 cursor-pointer group"
            onClick={() => setActiveTool('home')}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-105">
              <ImageIcon size={18} strokeWidth={2.5} />
            </div>
            <h1 className="text-sm font-bold tracking-tight text-gray-900">PIXELTOOLS</h1>
          </div>
          
          <nav className="flex flex-1 overflow-x-auto no-scrollbar py-1">
            <button 
              onClick={() => setActiveTool('home')}
              className={cn(
                "px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                activeTool === 'home' ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30" : "text-gray-400 hover:text-gray-900"
              )}
            >
              Dashboard
            </button>
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as Tool)}
                className={cn(
                  "px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2",
                  activeTool === tool.id ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30" : "text-gray-400 hover:text-gray-900"
                )}
              >
                {tool.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTool === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              {/* Refined Hero */}
              <div className="py-12 border-b border-gray-100">
                <div className="max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                    <ShieldCheck size={12} /> Local Processing • 100% Private
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                    Image optimization tools <br />
                    <span className="text-blue-600">for the modern web.</span>
                  </h2>
                </div>
              </div>

              {/* Compact Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id as Tool)}
                    className="group cursor-pointer bg-white border border-gray-200 p-6 rounded-2xl transition-all hover:bg-gray-50 hover:shadow-lg hover:border-gray-300 relative overflow-hidden"
                  >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", tool.bg, tool.color)}>
                      <tool.icon size={24} strokeWidth={2} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-gray-900">{tool.name}</h4>
                      <p className="text-sm text-gray-400 font-medium">{tool.description}</p>
                    </div>
                    
                    <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                      Open Utility <ArrowRight size={14} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Clean Status Bar */}
              <div className="flex flex-wrap gap-8 justify-center py-6 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <MousePointer2 size={12} className="text-gray-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Client-Side</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock size={12} className="text-gray-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Secure</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTool === 'compress' && (
            <motion.div key="compress" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Compressor onBack={() => setActiveTool('home')} />
            </motion.div>
          )}

          {activeTool === 'resize' && (
            <motion.div key="resize" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Resizer onBack={() => setActiveTool('home')} />
            </motion.div>
          )}

          {activeTool === 'crop' && (
            <motion.div key="crop" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Cropper onBack={() => setActiveTool('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 border-t border-gray-100 bg-white px-6 py-8">
        <div className="max-w-6xl mx-auto flex justify-center">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
            Pixel Tools &copy; 2026 • Local Processing
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
