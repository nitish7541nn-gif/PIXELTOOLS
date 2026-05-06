import React, { useState, useRef } from 'react';
import { Upload, Download, Maximize2, ArrowLeft, RefreshCw, Lock, Unlock, Grid3X3, Smartphone, Laptop } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { translations, Language } from '../../translations';

interface ResizerProps {
  onBack: () => void;
  lang: Language;
}

const PRESETS = [
  { name: 'Instagram', width: 1080, height: 1080, icon: Grid3X3 },
  { name: 'Twitter', width: 1200, height: 675, icon: Laptop },
  { name: 'Story', width: 1080, height: 1920, icon: Smartphone },
  { name: 'HD', width: 1920, height: 1080, icon: Maximize2 },
];

export default function Resizer({ onBack, lang }: ResizerProps) {
  const t = translations[lang];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setDimensions({ width: img.width, height: img.height });
        setPreviewUrl(event.target?.result as string);
        setResizedUrl(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
  };

  const handleDimensionChange = (type: 'width' | 'height', value: number) => {
    if (aspectRatioLocked && originalDimensions.width && originalDimensions.height) {
      const ratio = originalDimensions.width / originalDimensions.height;
      if (type === 'width') {
        setDimensions({ width: value, height: Math.round(value / ratio) });
      } else {
        setDimensions({ width: Math.round(value * ratio), height: value });
      }
    } else {
      setDimensions(prev => ({ ...prev, [type]: value }));
    }
  };

  const applyPreset = (w: number, h: number) => {
    if (aspectRatioLocked) setAspectRatioLocked(false);
    setDimensions({ width: w, height: h });
  };

  const resizeImage = () => {
    if (!previewUrl || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
        setResizedUrl(canvas.toDataURL(selectedFile?.type || 'image/png'));
      }
    };
    img.src = previewUrl;
  };

  const download = () => {
    if (!resizedUrl) return;
    const link = document.createElement('a');
    link.href = resizedUrl;
    link.download = `scaled_${selectedFile?.name || 'image'}`;
    link.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t.resize}</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">{t.localProcessing}</p>
        </div>
        <button onClick={onBack} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-2 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {t.back}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Bar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-6 shadow-sm">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t.width}</label>
              <input 
                type="number" 
                value={dimensions.width || ''}
                onChange={(e) => handleDimensionChange('width', parseInt(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-xl font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>

            <div className="relative flex justify-center py-2">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -z-10" />
              <button 
                onClick={() => setAspectRatioLocked(!aspectRatioLocked)}
                className={cn(
                  "p-2 rounded-full border bg-white transition-all shadow-sm",
                  aspectRatioLocked ? "border-indigo-600 text-indigo-600" : "border-gray-200 text-gray-400"
                )}
              >
                {aspectRatioLocked ? <Lock size={12} /> : <Unlock size={12} />}
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t.height}</label>
              <input 
                type="number" 
                value={dimensions.height || ''}
                onChange={(e) => handleDimensionChange('height', parseInt(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-xl font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>

            <div className="pt-2 space-y-3">
              <button 
                onClick={resizeImage}
                disabled={!selectedFile}
                className="w-full py-3.5 bg-indigo-600 disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
              >
                <RefreshCw size={14} /> Refresh
              </button>
              {resizedUrl && (
                <button 
                  onClick={download}
                  className="w-full py-3.5 bg-black text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
                >
                   <Download size={14} /> {t.export}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Viewport Area */}
        <div className="lg:col-span-8 flex flex-col">
          <div 
            className="flex-1 min-h-[450px] bg-white border border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden group shadow-sm"
          >
            {previewUrl ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-6 relative">
                <img 
                  src={resizedUrl || previewUrl}
                  className={cn(
                    "max-w-full max-h-[500px] rounded-xl shadow-xl object-contain border border-gray-100 transition-all",
                    resizedUrl ? "ring-2 ring-indigo-500" : ""
                  )}
                  alt="Preview" 
                />
                <div className="inline-flex gap-4 px-3 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-bold tracking-widest">
                  <span>{dimensions.width}px</span>
                  <span className="opacity-30">×</span>
                  <span>{dimensions.height}px</span>
                </div>
                
                <button 
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); setResizedUrl(null); }}
                  className="absolute top-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 shadow-sm"
                >
                  <ArrowLeft size={16} className="rotate-90" />
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-300">
                  <Upload size={32} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-900">{t.selectImage}</h4>
                  <p className="text-xs text-gray-400">Scale your assets to perfection</p>
                </div>
                <label className="inline-block cursor-pointer px-6 py-2 bg-white border border-gray-200 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-900 hover:border-indigo-600 hover:text-indigo-600 transition-all">
                   {t.selectImage}
                  <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if(file) loadImage(file); }} className="hidden" />
                </label>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
}
