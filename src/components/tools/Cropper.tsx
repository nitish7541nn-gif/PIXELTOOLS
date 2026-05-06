import React, { useState, useCallback } from 'react';
import EasyCropper from 'react-easy-crop';
import { Upload, Download, ArrowLeft, RefreshCw, Scissors } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { translations, Language } from '../../translations';

interface CropperProps {
  onBack: () => void;
  lang: Language;
}

const ASPECT_RATIOS = [
  { label: 'Square', value: 1 },
  { label: 'Standard (4:3)', value: 4 / 3 },
  { label: 'Wide (16:9)', value: 16 / 9 },
  { label: 'Classic (3:2)', value: 3 / 2 },
  { label: 'Unchecked', value: undefined },
];

export default function Cropper({ onBack, lang }: CropperProps) {
  const t = translations[lang];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async () => {
    try {
      if (!previewUrl || !croppedAreaPixels) return;
      setIsCropping(true);
      const image = await createImage(previewUrl);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.width = (croppedAreaPixels as any).width;
      canvas.height = (croppedAreaPixels as any).height;

      ctx.drawImage(
        image,
        (croppedAreaPixels as any).x,
        (croppedAreaPixels as any).y,
        (croppedAreaPixels as any).width,
        (croppedAreaPixels as any).height,
        0,
        0,
        (croppedAreaPixels as any).width,
        (croppedAreaPixels as any).height
      );

      return new Promise<string>((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) return;
          resolve(URL.createObjectURL(blob));
        }, selectedFile?.type || 'image/png');
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsCropping(false);
    }
  };

  const handleDownload = async () => {
    const croppedUrl = await getCroppedImg();
    if (croppedUrl) {
      const link = document.createElement('a');
      link.href = croppedUrl;
      link.download = `cropped_${selectedFile?.name || 'image'}`;
      link.click();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t.crop}</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600">{t.localProcessing}</p>
        </div>
        <button onClick={onBack} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-rose-600 transition-colors flex items-center gap-2 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {t.back}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Compact Bar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-8 shadow-sm">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t.aspectRatio}</label>
              <div className="grid grid-cols-2 gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.label}
                    onClick={() => setAspect(ratio.value)}
                    className={cn(
                      "py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border",
                      aspect === ratio.value 
                        ? "bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-100" 
                        : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100"
                    )}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-baseline text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <label>{t.zoom}</label>
                <span className="text-gray-900">{zoom.toFixed(1)}x</span>
              </div>
              <input 
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer h-1.5 bg-gray-100 rounded-lg appearance-none"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={handleDownload}
                disabled={!selectedFile || isCropping}
                className="w-full py-3.5 bg-rose-600 disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 hover:bg-rose-700 shadow-lg shadow-rose-100"
              >
                {isCropping ? <RefreshCw className="animate-spin" size={14} /> : <Scissors size={14} />}
                {isCropping ? '...' : t.export}
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-5 rounded-2xl">
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Controls</h4>
             <ul className="space-y-2 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
               <li className="flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-rose-500" />
                 Drag to Pan
               </li>
               <li className="flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-rose-500" />
                 Scroll to Zoom
               </li>
             </ul>
          </div>
        </div>

        {/* Viewport Area */}
        <div className="lg:col-span-8">
          <div className="h-[450px] sm:h-[550px] bg-gray-900 rounded-3xl relative overflow-hidden shadow-2xl ring-4 ring-white border border-gray-100">
            {previewUrl ? (
              <EasyCropper
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 group">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                  <Upload size={24} className="text-rose-500 opacity-40 group-hover:opacity-100 transition-all" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest">{t.selectImage}</h4>
                  <p className="text-white/20 text-[10px] font-medium max-w-xs mx-auto uppercase tracking-wide">Select an image to activate the crop window</p>
                </div>
                <label className="mt-6 cursor-pointer px-6 py-2 bg-rose-600 rounded-full text-[10px] font-bold uppercase tracking-widest text-white hover:bg-rose-700 transition-all shadow-lg shadow-rose-900/40">
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
