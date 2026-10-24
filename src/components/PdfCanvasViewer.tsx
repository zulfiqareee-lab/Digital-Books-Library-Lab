import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';
import { Loader2, AlertCircle } from 'lucide-react';

// Configure local worker bundled by Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export type FitMode = 'width' | 'page' | 'free';

interface PdfCanvasViewerProps {
  source: string | Blob | ArrayBuffer;
  currentPage: number;
  zoomLevel: number; // e.g. 100
  readerTheme: 'light' | 'sepia' | 'dark';
  fitMode?: FitMode;
  isFullScreen?: boolean;
  watermarkText?: string;
  onTotalPagesLoaded?: (totalPages: number) => void;
  onError?: (err: string) => void;
}

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({
  source,
  currentPage,
  zoomLevel,
  readerTheme,
  fitMode = 'width',
  isFullScreen = false,
  watermarkText = 'Digital Book Library • Read-Only Mode',
  onTotalPagesLoaded,
  onError
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [isDocumentLoading, setIsDocumentLoading] = useState(true);
  const [isPageRendering, setIsPageRendering] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [pageDimensions, setPageDimensions] = useState<{ width: number; height: number }>({ width: 800, height: 1100 });

  const currentRenderTaskRef = useRef<any>(null);

  // Measure container width and react to resize / orientation changes
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const measured = containerRef.current.clientWidth;
        if (measured > 0) {
          setContainerWidth(measured);
        }
      }
    };

    updateSize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [isFullScreen]);

  // 1. Load PDF Document
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

  // 2. Render Page with Adaptive Scale (Fit Width, Fit Page, or Zoom Level)
  const renderCurrentPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    if (currentRenderTaskRef.current) {
      try {
        currentRenderTaskRef.current.cancel();
      } catch {}
    }

    setIsPageRendering(true);

    try {
      const pageNum = Math.min(Math.max(currentPage, 1), pdfDoc.numPages);
      const page = await pdfDoc.getPage(pageNum);

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      // Base unscaled viewport at 1.0 scale to determine intrinsic aspect ratio
      const unscaledViewport = page.getViewport({ scale: 1.0 });

      // Calculate available width
      const effectiveContainerWidth = containerWidth > 50
        ? containerWidth
        : (typeof window !== 'undefined' ? (window.innerWidth < 640 ? window.innerWidth - 16 : Math.min(window.innerWidth - 40, 1000)) : 800);

      const zoomFactor = zoomLevel / 100;
      let calculatedBaseScale = 1.0;

      if (fitMode === 'width') {
        // Fit 100% of the screen/container width seamlessly
        const scaleToFitWidth = effectiveContainerWidth / unscaledViewport.width;
        calculatedBaseScale = scaleToFitWidth * zoomFactor;
      } else if (fitMode === 'page') {
        // Fit full page height into window
        const availableHeight = typeof window !== 'undefined'
          ? (window.innerHeight - (isFullScreen ? 40 : 160))
          : 800;
        const scaleToFitHeight = availableHeight / unscaledViewport.height;
        const scaleToFitWidth = effectiveContainerWidth / unscaledViewport.width;
        calculatedBaseScale = Math.min(scaleToFitHeight, scaleToFitWidth) * zoomFactor;
      } else {
        // Free zoom mode
        calculatedBaseScale = 1.4 * zoomFactor;
      }

      // Device Pixel Ratio for ultra-crisp Bengali font rendering
      const dpr = Math.min(typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1, 2.5);
      const renderViewport = page.getViewport({ scale: calculatedBaseScale * dpr });

      // Hardware resolution of canvas
      canvas.width = Math.floor(renderViewport.width);
      canvas.height = Math.floor(renderViewport.height);

      // Logical CSS display size
      const cssWidth = Math.floor(renderViewport.width / dpr);
      const cssHeight = Math.floor(renderViewport.height / dpr);
      setPageDimensions({ width: cssWidth, height: cssHeight });

      // Background canvas fill
      ctx.fillStyle = readerTheme === 'sepia' ? '#fbf0d9' : '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: ctx,
        viewport: renderViewport,
      };

      const renderTask = page.render(renderContext);
      currentRenderTaskRef.current = renderTask;

      await renderTask.promise;
      setIsPageRendering(false);
    } catch (err: any) {
      if (err.name !== 'RenderingCancelledException') {
        console.warn('Page render error:', err);
        setIsPageRendering(false);
      }
    }
  }, [pdfDoc, currentPage, zoomLevel, fitMode, containerWidth, isFullScreen, readerTheme]);

  useEffect(() => {
    let isCancelled = false;
    renderCurrentPage();

    return () => {
      isCancelled = true;
      if (currentRenderTaskRef.current) {
        try {
          currentRenderTaskRef.current.cancel();
        } catch {}
      }
    };
  }, [renderCurrentPage]);

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900 max-w-lg mx-auto shadow-sm">
        <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
        <p className="text-sm font-bold text-rose-700 dark:text-rose-400">পিডিএফ রেন্ডারিং সমস্যা</p>
        <p className="text-xs text-rose-600 dark:text-rose-300 mt-1">{loadError}</p>
        <p className="text-[11px] text-slate-500 mt-3">টেক্সট মোডে বইটি পড়ার চেষ্টা করুন বা ফাইল লিংকটি পুনরায় পরীক্ষা করুন।</p>
      </div>
    );
  }

  const themeFilter = {
    light: '',
    sepia: 'sepia(0.12) contrast(1.02)',
    dark: 'invert(0.92) hue-rotate(180deg) brightness(1.05)'
  }[readerTheme];

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full select-none"
    >
      {/* Loading Overlay */}
      {(isDocumentLoading || isPageRendering) && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/75 dark:bg-slate-900/75 backdrop-blur-[2px] rounded-xl transition-opacity">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {isDocumentLoading ? 'পিডিএফ ফাইল প্রস্তুত হচ্ছে...' : `পৃষ্ঠা ${currentPage} রেন্ডার হচ্ছে...`}
          </p>
        </div>
      )}

      {/* PDF Page Canvas Card */}
      <div
        style={{
          width: fitMode === 'width' ? '100%' : `${pageDimensions.width}px`,
          maxWidth: fitMode === 'width' ? '100%' : `${pageDimensions.width}px`,
          filter: themeFilter,
          transition: 'filter 0.2s ease'
        }}
        className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-300/60 dark:border-slate-800 bg-white mx-auto"
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
        />

        {/* Subtle Anti-Piracy Watermark Stamp */}
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
