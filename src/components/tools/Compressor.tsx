import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Upload, Download, Loader2, ArrowLeft, Zap } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { translations, Language } from '../../translations';

interface CompressorProps {
  onBack: () => void;
  lang: Language;
}

export default function Compressor({ onBack, lang }: CompressorProps) {
  const t = translations[lang];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [quality, setQuality] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState(1920);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCompressedFile(null);
      setCompressedUrl(null);
    }
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    setIsCompressing(true);
    try {
      const options = {
        maxSizeMB: quality * 2,
        maxWidthOrHeight: maxWidth,
        useWebWorker: true,
        initialQuality: quality,
      };

      const compressed = await imageCompression(selectedFile, options);
      setCompressedFile(compressed);
      setCompressedUrl(URL.createObjectURL(compressed));
    } catch (error) {
      console.error("Compression failed", error);
    } finally {
      setIsCompressing(false);
    }
  };

  const download = () => {
    if (!compressedUrl || !compressedFile) return;
    const link = document.createElement('a');
    link.href = compressedUrl;
    link.download = `optimized_${selectedFile?.name || 'image'}`;
    link.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t.compress}</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">{t.localProcessing}</p>
        </div>
        <button onClick={onBack} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-2 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {t.back}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Compact Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t.quality}</label>
                <span className="text-sm font-bold text-gray-900">{Math.round(quality * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="1.0" 
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-100 rounded-lg appearance-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t.settings}</label>
              <select 
                value={maxWidth}
                onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option value={800}>Small (800px)</option>
                <option value={1200}>Medium (1200px)</option>
                <option value={1920}>Normal (1920px)</option>
                <option value={3840}>Ultra (3840px)</option>
              </select>
            </div>

            <div className="pt-2 space-y-3">
              <button
                onClick={handleCompress}
                disabled={!selectedFile || isCompressing}
                className="w-full py-3.5 bg-blue-600 disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100"
              >
                {isCompressing ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />}
                {isCompressing ? '...' : t.optimizeNow}
              </button>

              {compressedUrl && (
                <button
                  onClick={download}
                  className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 hover:bg-black"
                >
                  <Download size={14} /> {t.export}
                </button>
              )}
            </div>
          </div>

          {selectedFile && (
            <div className="bg-white border border-gray-100 p-5 rounded-2xl">
               <div className="space-y-3 text-[11px] font-bold uppercase tracking-tight">
                 <div className="flex justify-between items-center text-gray-400">
                   <span>Original</span>
                   <span className="text-gray-900">{formatSize(selectedFile.size)}</span>
                 </div>
                 {compressedFile && (
                   <div className="flex justify-between items-center text-blue-600 pt-3 border-t border-gray-50">
                     <span>Result</span>
                     <div className="text-right">
                       <p className="text-xs">{formatSize(compressedFile.size)}</p>
                       <p className="text-[9px] text-emerald-500">-{Math.round((1 - compressedFile.size / selectedFile.size) * 100)}% Smallest</p>
                     </div>
                   </div>
                 )}
               </div>
            </div>
          )}
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-8">
          <div 
            className="aspect-[4/3] sm:aspect-video bg-white border border-gray-200 rounded-3xl flex flex-col items-center justify-center p-6 relative overflow-hidden group shadow-sm"
          >
            {previewUrl ? (
              <div className="w-full h-full flex flex-col gap-4">
                <div className="flex-1 w-full flex items-center justify-center gap-3">
                  <div className="flex-1 h-full bg-gray-50 rounded-2xl p-3 border border-gray-100 relative overflow-hidden">
                    <img src={previewUrl} className="w-full h-full object-contain" alt="Original" />
                    <span className="absolute top-3 left-3 bg-white/70 backdrop-blur-sm border border-gray-200 px-2.5 py-0.5 rounded text-[8px] font-bold text-gray-400 uppercase tracking-widest">Original</span>
                  </div>
                  {compressedUrl && (
                    <div className="flex-1 h-full bg-blue-50/30 rounded-2xl p-3 border border-blue-100 relative overflow-hidden">
                      <img src={compressedUrl} className="w-full h-full object-contain" alt="Compressed" />
                      <span className="absolute top-3 left-3 bg-blue-600 text-white px-2.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">Optimized</span>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); setCompressedUrl(null); }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"
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
                  <p className="text-xs text-gray-400">Drag & drop or browse your local files</p>
                </div>
                <label className="inline-block cursor-pointer px-6 py-2 bg-white border border-gray-200 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-900 hover:border-blue-600 hover:text-blue-600 transition-all">
                  {t.selectImage}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
