import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';
import { Loader2, AlertCircle } from 'lucide-react';

// Configure local worker bundled by Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface PdfCanvasViewerProps {
  source: string | Blob | ArrayBuffer;
  currentPage: number;
  zoomLevel: number; // e.g. 100
  readerTheme: 'light' | 'sepia' | 'dark';
  watermarkText?: string;
  onTotalPagesLoaded?: (totalPages: number) => void;
  onError?: (err: string) => void;
}

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({
  source,
  currentPage,
  zoomLevel,
  readerTheme,
  watermarkText = 'Digital Book Library • Read-Only Mode',
  onTotalPagesLoaded,
  onError
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [isDocumentLoading, setIsDocumentLoading] = useState(true);
  const [isPageRendering, setIsPageRendering] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pageDimensions, setPageDimensions] = useState<{ width: number; height: number }>({ width: 600, height: 850 });

  const currentRenderTaskRef = useRef<any>(null);

  // 1. Load the PDF Document when source changes
  useEffect(() => {
    let isCancelled = false;
    setIsDocumentLoading(true);
    setLoadError(null);

    async function loadPdf() {
      try {
        let loadingTask: any;

        if (typeof source === 'string') {
          loadingTask = pdfjsLib.getDocument({
            url: source,
            cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
            cMapPacked: true,
          });
        } else if (source instanceof Blob) {
          const arrayBuffer = await source.arrayBuffer();
          loadingTask = pdfjsLib.getDocument({
            data: arrayBuffer,
            cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
            cMapPacked: true,
          });
        } else {
          loadingTask = pdfjsLib.getDocument({
            data: source,
            cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
            cMapPacked: true,
          });
        }

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setIsDocumentLoading(false);
          if (onTotalPagesLoaded && doc.numPages) {
            onTotalPagesLoaded(doc.numPages);
          }
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error('Error loading PDF document:', err);
          const msg = err.message || 'পিডিএফ ফাইল লোড করা সম্ভব হয়নি।';
          setLoadError(msg);
          setIsDocumentLoading(false);
          onError?.(msg);
        }
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [source]);

  // 2. Render the specific page whenever currentPage, zoomLevel, or pdfDoc changes
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let isCancelled = false;
    setIsPageRendering(true);

    // Cancel any ongoing render task to prevent conflict
    if (currentRenderTaskRef.current) {
      try {
        currentRenderTaskRef.current.cancel();
      } catch {}
    }

    const renderPage = async () => {
      try {
        const pageNum = Math.min(Math.max(currentPage, 1), pdfDoc.numPages);
        const page = await pdfDoc.getPage(pageNum);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        // Calculate high-resolution scale for razor-sharp Bengali text
        const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
        const baseScale = (zoomLevel / 100) * 1.5;
        const viewport = page.getViewport({ scale: baseScale * dpr });

        // Set internal canvas resolution
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        // Aspect ratio for styling
        const cssWidth = Math.floor(viewport.width / dpr);
        const cssHeight = Math.floor(viewport.height / dpr);
        setPageDimensions({ width: cssWidth, height: cssHeight });

        // Background fill
        ctx.fillStyle = readerTheme === 'sepia' ? '#fbf0d9' : '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        currentRenderTaskRef.current = renderTask;

        await renderTask.promise;

        if (!isCancelled) {
          setIsPageRendering(false);
        }
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.warn('Page render warning:', err);
          if (!isCancelled) {
            setIsPageRendering(false);
          }
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (currentRenderTaskRef.current) {
        try {
          currentRenderTaskRef.current.cancel();
        } catch {}
      }
    };
  }, [pdfDoc, currentPage, zoomLevel, readerTheme]);

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900 max-w-lg mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
        <p className="text-sm font-bold text-rose-700 dark:text-rose-400">পিডিএফ রেন্ডারিং সমস্যা</p>
        <p className="text-xs text-rose-600 dark:text-rose-300 mt-1">{loadError}</p>
        <p className="text-[11px] text-slate-500 mt-3">টেক্সট মোডে বইটি পড়ার চেষ্টা করুন।</p>
      </div>
    );
  }

  const themeFilter = {
    light: '',
    sepia: 'sepia(0.12) contrast(1.02)',
    dark: 'invert(0.92) hue-rotate(180deg) brightness(1.05)'
  }[readerTheme];

  return (
    <div className="relative flex flex-col items-center justify-center w-full select-none">
      {/* Loading Overlay */}
      {(isDocumentLoading || isPageRendering) && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-[2px] rounded-xl transition-opacity">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {isDocumentLoading ? 'পিডিএফ ফাইল প্রস্তুত হচ্ছে...' : `পৃষ্ঠা ${currentPage} রেন্ডার হচ্ছে...`}
          </p>
        </div>
      )}

      {/* PDF Page Canvas Card */}
      <div
        style={{
          maxWidth: `${pageDimensions.width}px`,
          filter: themeFilter,
          transition: 'filter 0.2s ease'
        }}
        className="w-full relative shadow-2xl rounded-lg overflow-hidden border border-slate-300/60 dark:border-slate-800 bg-white"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-auto block"
        />

        {/* Subtle Watermark Stamp */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-[0.035] overflow-hidden rotate-[-25deg]">
          <p className="text-3xl sm:text-4xl font-extrabold uppercase tracking-widest text-black whitespace-nowrap">
            {watermarkText}
          </p>
          <p className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-black whitespace-nowrap mt-3">
            ডিজিটাল বুক লাইব্রেরি বাংলাদেশ
          </p>
        </div>
      </div>
    </div>
  );
};
