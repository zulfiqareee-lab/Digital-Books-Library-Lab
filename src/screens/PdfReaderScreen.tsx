import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { fetchProtectedPage, getBookPdfSource } from '../services/api';
import { PdfCanvasViewer, FitMode } from '../components/PdfCanvasViewer';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  BookOpen,
  Download,
  List,
  ShieldCheck,
  FileText,
  Layers,
  StretchHorizontal,
  Maximize,
  Eye,
  EyeOff,
  Globe,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

export const PdfReaderScreen: React.FC = () => {
  const { selectedBook, readerPage, navigateTo, language, hasEntitlement } = useLibrary();

  const isBn = language === 'bn';
  const book = selectedBook;

  // Resolve Google Drive file ID if hosted on Drive
  const driveFileId = book?.driveFileId || (book?.storageIdentifier?.startsWith('drive:') ? book.storageIdentifier.replace('drive:', '') : null);
  const isDriveHosted = Boolean(driveFileId || book?.isDriveHosted);

  const [currentPage, setCurrentPage] = useState<number>(readerPage || 1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark'>('sepia');
  const [fitMode, setFitMode] = useState<FitMode>('width');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);
  const [pageData, setPageData] = useState<any>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [showToc, setShowToc] = useState(false);

  // PDF Source and Viewer Mode ('drive' | 'pdf' | 'text')
  const [pdfSource, setPdfSource] = useState<string | Blob | ArrayBuffer | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'drive' | 'pdf' | 'text'>(
    isDriveHosted ? 'drive' : 'pdf'
  );
  const [totalPdfPages, setTotalPdfPages] = useState<number>(book?.totalPages || 100);

  const totalPages = totalPdfPages || book?.totalPages || 100;
  const isOwned = book ? hasEntitlement(book.id) : false;

  // Track browser fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = Boolean(document.fullscreenElement);
      setIsFullScreen(isFs);
      if (!isFs) {
        setIsImmersive(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Update default view mode when book changes
  useEffect(() => {
    if (isDriveHosted && driveFileId) {
      setViewMode('drive');
    }
  }, [book?.id, isDriveHosted, driveFileId]);

  // 1. Fetch real PDF source (IndexedDB local blob or remote server URL)
  useEffect(() => {
    if (!book) return;

    let isCancelled = false;
    setIsPdfLoading(true);

    getBookPdfSource(book).then(src => {
      if (!isCancelled) {
        if (src) {
          setPdfSource(src);
          // If not drive hosted, use canvas pdf
          if (!isDriveHosted) {
            setViewMode('pdf');
          }
        } else {
          setPdfSource(null);
          if (!isDriveHosted) {
            setViewMode('text');
          }
        }
        setIsPdfLoading(false);
      }
    }).catch(err => {
      console.warn('Could not locate PDF binary:', err);
      if (!isCancelled) {
        setPdfSource(null);
        if (!isDriveHosted) {
          setViewMode('text');
        }
        setIsPdfLoading(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [book, isDriveHosted]);

  // 2. Fetch fallback protected text page if in text view mode
  useEffect(() => {
    if (!book || viewMode !== 'text') return;
    let isCancelled = false;
    setIsLoadingPage(true);

    fetchProtectedPage(book.id, currentPage).then(data => {
      if (!isCancelled) {
        setPageData(data);
        setIsLoadingPage(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [book, currentPage, viewMode]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        setIsFullScreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullScreen(false);
        setIsImmersive(false);
      }
    } catch (e) {
      // In restricted webviews, fallback to CSS pseudo-fullscreen
      setIsFullScreen(prev => !prev);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevPage();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullScreen();
      } else if (e.key === 'Escape' && isImmersive) {
        setIsImmersive(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, isImmersive]);

  if (!book) {
    return (
      <div className="p-12 text-center w-full max-w-full">
        <p className="text-slate-500 mb-4">{isBn ? 'পড়ার জন্য কোনো বই নির্বাচন করা হয়নি।' : 'No book selected for reading.'}</p>
        <button
          onClick={() => navigateTo('catalogue')}
          className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
        >
          {isBn ? 'ক্যাটালগ দেখুন' : 'Go to Catalogue'}
        </button>
      </div>
    );
  }

  // Color schemes for reading canvas
  const themeStyles = {
    light: 'bg-white text-slate-900 border-slate-200',
    sepia: 'bg-[#fbf0d9] text-[#433422] border-[#e8d7b8]',
    dark: 'bg-[#181a1b] text-[#e0e0e0] border-[#2c2f31]'
  };

  const canvasBackground = {
    light: 'bg-slate-100',
    sepia: 'bg-[#f4e6cc]',
    dark: 'bg-slate-950'
  };

  return (
    <div
      className={`min-h-screen w-full max-w-full overflow-x-hidden flex flex-col ${
        canvasBackground[readerTheme]
      } select-none relative transition-colors duration-200 ${isFullScreen ? 'h-screen overflow-hidden' : ''}`}
    >
      {/* Top Reader Navigation Bar (hidden in Immersive Mode) */}
      {!isImmersive && (
        <header className="sticky top-0 z-40 bg-slate-900 text-white px-2.5 sm:px-6 py-2 flex items-center justify-between gap-1.5 sm:gap-3 shadow-md w-full max-w-full overflow-hidden">
          {/* Left: Back & Title */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 max-w-[150px] sm:max-w-xs">
            <button
              onClick={() => {
                if (isFullScreen && document.exitFullscreen) {
                  document.exitFullscreen().catch(() => {});
                }
                navigateTo('book_detail', { book });
              }}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors shrink-0"
              title={isBn ? 'বইয়ের বিবরণে ফিরুন' : 'Back to book details'}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold truncate text-white leading-tight">
                {isBn ? book.titleBn : book.titleEn}
              </h1>
              <p className="text-[10px] text-emerald-400 font-medium truncate flex items-center gap-1">
                <span>{book.authorBn}</span>
                {isDriveHosted && (
                  <span className="text-sky-300 font-bold bg-sky-950/80 px-1 rounded text-[9px]">Google Drive</span>
                )}
              </p>
            </div>
          </div>

          {/* Center: Page Controls (visible on tablets & desktops) */}
          {viewMode !== 'drive' && (
            <div className="hidden md:flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="p-1 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono tabular-nums text-slate-200 font-semibold px-1">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="p-1 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Right: Controls & Screen Modes */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mode Switcher: Google Drive vs PDF Canvas vs Text View */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 shrink-0">
              {driveFileId && (
                <button
                  onClick={() => setViewMode('drive')}
                  className={`px-1.5 sm:px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors ${
                    viewMode === 'drive' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  title={isBn ? 'গুগল ড্রাইভ অফিসিয়াল রিডার' : 'Google Drive Reader'}
                >
                  <Globe className="w-3.5 h-3.5 text-sky-300" />
                  <span className="hidden sm:inline">{isBn ? 'ড্রাইভ রিডার' : 'Drive'}</span>
                </button>
              )}
              {pdfSource && (
                <button
                  onClick={() => setViewMode('pdf')}
                  className={`px-1.5 sm:px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors ${
                    viewMode === 'pdf' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  title={isBn ? 'ক্যানভাস পাতা' : 'Canvas Pages'}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isBn ? 'ক্যানভাস' : 'Canvas'}</span>
                </button>
              )}
              <button
                onClick={() => setViewMode('text')}
                className={`px-1.5 sm:px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors ${
                  viewMode === 'text' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title={isBn ? 'টেক্সট মোড' : 'Text'}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isBn ? 'টেক্সট' : 'Text'}</span>
              </button>
            </div>

            {/* Fit Width / Fit Page Mode Toggle (Only in Canvas mode) */}
            {viewMode === 'pdf' && (
              <div className="hidden sm:flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                <button
                  onClick={() => setFitMode('width')}
                  className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors ${
                    fitMode === 'width' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  title={isBn ? 'স্ক্রিন ফিট (চওড়া ভিউ)' : 'Fit to Screen Width'}
                >
                  <StretchHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">{isBn ? 'স্ক্রিন ফিট' : 'Fit Width'}</span>
                </button>
                <button
                  onClick={() => setFitMode('page')}
                  className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors ${
                    fitMode === 'page' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  title={isBn ? 'সম্পূর্ণ পৃষ্ঠা' : 'Fit Whole Page'}
                >
                  <Maximize className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">{isBn ? 'সম্পূর্ণ পৃষ্ঠা' : 'Fit Page'}</span>
                </button>
              </div>
            )}

            {/* Table of contents toggle (Canvas / Text) */}
            {viewMode !== 'drive' && (
              <button
                onClick={() => setShowToc(!showToc)}
                className={`p-1.5 rounded-lg transition-colors ${
                  showToc ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
                title={isBn ? 'সূচিপত্র' : 'Table of Contents'}
              >
                <List className="w-4 h-4" />
              </button>
            )}

            {/* Theme switcher */}
            <div className="hidden xs:flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => setReaderTheme('light')}
                className={`p-1 sm:p-1.5 rounded text-xs ${
                  readerTheme === 'light' ? 'bg-slate-700 text-amber-300' : 'text-slate-400 hover:text-white'
                }`}
                title="Light"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReaderTheme('sepia')}
                className={`px-1 sm:px-1.5 py-1 rounded text-[10px] font-bold ${
                  readerTheme === 'sepia' ? 'bg-amber-100 text-amber-900' : 'text-slate-400 hover:text-white'
                }`}
                title="Sepia"
              >
                সেপিয়া
              </button>
              <button
                onClick={() => setReaderTheme('dark')}
                className={`p-1 sm:p-1.5 rounded text-xs ${
                  readerTheme === 'dark' ? 'bg-slate-700 text-sky-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Dark"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Full Screen Toggle (Mobile & Desktop) */}
            <button
              onClick={toggleFullScreen}
              className={`p-1.5 rounded-lg transition-colors ${
                isFullScreen ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
              title={isFullScreen ? (isBn ? 'ফুল স্ক্রিন বন্ধ' : 'Exit Full Screen') : (isBn ? 'ফুল স্ক্রিন' : 'Full Screen')}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Download Original PDF Button */}
            {isOwned ? (
              <button
                onClick={() => navigateTo('payment_result', { book })}
                className="px-2 sm:px-3 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-[11px] sm:text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isBn ? 'ডাউনলোড' : 'Download'}</span>
              </button>
            ) : (
              <button
                onClick={() => navigateTo('bkash_checkout', { book })}
                className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-pink-700 hover:bg-pink-600 text-white text-[11px] sm:text-xs font-bold flex items-center gap-1 shadow-sm transition-colors whitespace-nowrap"
              >
                <Download className="w-3 h-3" />
                <span>{isBn ? `বিকাশ ৳${book.priceBdt}` : `bKash`}</span>
              </button>
            )}
          </div>
        </header>
      )}

      {/* Main Reading Viewport - Strictly constrained to prevent horizontal scrolling */}
      <main
        className={`flex-1 w-full max-w-full overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start relative transition-all duration-150 ${
          isFullScreen ? 'p-0 sm:p-2' : 'p-1.5 sm:p-4'
        }`}
      >
        {/* Table of Contents Drawer */}
        {showToc && (
          <aside className="absolute top-4 left-4 z-30 w-72 max-w-[85vw] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {isBn ? 'সূচিপত্র ও নেভিগেশন' : 'Table of Contents'}
              </span>
              <button
                onClick={() => setShowToc(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1.5 max-h-80 overflow-y-auto text-xs">
              {book.samplePages?.length > 0 ? (
                book.samplePages.map(page => (
                  <button
                    key={page.pageNumber}
                    onClick={() => {
                      setCurrentPage(page.pageNumber);
                      setShowToc(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                      currentPage === page.pageNumber
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="truncate">{page.titleBn}</span>
                    <span className="font-mono text-[10px] text-slate-400">পৃষ্ঠা {page.pageNumber}</span>
                  </button>
                ))
              ) : (
                <div className="text-xs text-slate-500 py-3 text-center">
                  {isBn ? 'সরাসরি পৃষ্ঠা নম্বর নির্বাচন করুন' : 'Select page number below'}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* ======================================================== */}
        {/* MODE 1: Google Drive Official Embedded Reader (Guaranteed 100% Reliable) */}
        {/* ======================================================== */}
        {viewMode === 'drive' && driveFileId && (
          <div className="w-full flex-1 flex flex-col items-center justify-start max-w-full overflow-hidden p-1 sm:p-2">
            {/* Quick Helper Banner */}
            <div className="w-full max-w-5xl mb-2 px-3 py-1.5 bg-slate-900/90 border border-slate-700 rounded-xl flex items-center justify-between text-xs text-slate-300 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Globe className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="truncate font-semibold text-slate-100">
                  {isBn ? 'গুগল ড্রাইভ ক্লাউড ভিউয়ার · সরাসরি বইটির প্রতিটি পৃষ্ঠা পাঠ করুন' : 'Google Drive Cloud Viewer · Direct Page Stream'}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://drive.google.com/file/d/${driveFileId}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-400 hover:text-sky-300 bg-sky-950/70 px-2.5 py-1 rounded-lg border border-sky-800 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="hidden sm:inline">{isBn ? 'ড্রাইভ উইন্ডো' : 'Drive Window'}</span>
                </a>
              </div>
            </div>

            {/* Embedded Responsive Google Drive Preview Iframe */}
            <div
              className={`w-full max-w-5xl rounded-2xl overflow-hidden border border-slate-700/80 bg-white shadow-2xl relative transition-all ${
                isFullScreen
                  ? 'h-[calc(100vh-10px)] max-w-none rounded-none border-0'
                  : 'h-[calc(100vh-140px)] min-h-[500px]'
              }`}
            >
              <iframe
                src={`https://drive.google.com/file/d/${driveFileId}/preview`}
                className="w-full h-full border-0 block"
                allow="autoplay"
                allowFullScreen
                title={book.titleBn}
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 2: PDF Canvas Viewer */}
        {/* ======================================================== */}
        {viewMode === 'pdf' && pdfSource && (
          <div
            className={`w-full max-w-full flex flex-col items-center overflow-hidden transition-all ${
              isFullScreen
                ? 'max-w-none px-0'
                : fitMode === 'width'
                ? 'max-w-5xl px-0 sm:px-2'
                : 'max-w-3xl px-1 sm:px-2'
            }`}
          >
            <PdfCanvasViewer
              source={pdfSource}
              currentPage={currentPage}
              zoomLevel={zoomLevel}
              fitMode={fitMode}
              isFullScreen={isFullScreen}
              readerTheme={readerTheme}
              watermarkText={`Digital Book Library • Read-Only Online • ${book.titleBn}`}
              onTotalPagesLoaded={(pages) => setTotalPdfPages(pages)}
              onError={(err) => {
                console.warn('PDF canvas error, fallback to drive or text:', err);
                if (driveFileId) {
                  setViewMode('drive');
                } else {
                  setViewMode('text');
                }
              }}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 3: Structured Text Reader Page */}
        {/* ======================================================== */}
        {viewMode === 'text' && (
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className={`relative w-full max-w-2xl min-h-[640px] p-6 sm:p-14 rounded-2xl border shadow-xl transition-all duration-150 flex flex-col justify-between my-2 max-w-full overflow-hidden ${themeStyles[readerTheme]}`}
          >
            {/* Subtle Anti-Copy Security Watermark Stamp */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-[0.035] overflow-hidden rotate-[-25deg]">
              <p className="text-4xl font-extrabold uppercase tracking-widest text-current whitespace-nowrap">
                Digital Book Library • Read-Only
              </p>
              <p className="text-2xl font-bold uppercase tracking-wider text-current whitespace-nowrap mt-4">
                বাংলাদেশ ডিজিটাল গ্রন্থালয়
              </p>
            </div>

            {/* Page Header */}
            <div className="border-b pb-3 mb-6 flex items-center justify-between text-xs opacity-60">
              <span className="font-medium italic">{book.titleBn}</span>
              <span>{isBn ? 'পৃষ্ঠা' : 'Page'} {currentPage}</span>
            </div>

            {/* Page Text Body */}
            <div className="flex-1">
              {isLoadingPage ? (
                <div className="py-20 text-center opacity-60 animate-pulse space-y-3">
                  <BookOpen className="w-8 h-8 mx-auto stroke-1" />
                  <p className="text-xs">{isBn ? 'পৃষ্ঠা লোড হচ্ছে...' : 'Loading page stream...'}</p>
                </div>
              ) : pageData?.pageData ? (
                <article className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif mb-4 pb-2 border-b border-current/10">
                    {pageData.pageData.titleBn}
                  </h2>
                  <div className="text-sm sm:text-base leading-relaxed sm:leading-loose whitespace-pre-line font-serif">
                    {pageData.pageData.contentBn}
                  </div>
                  {pageData.pageData.contentEn && (
                    <div className="mt-8 pt-4 border-t border-current/10 text-xs sm:text-sm italic opacity-85 leading-relaxed font-serif">
                      {pageData.pageData.contentEn}
                    </div>
                  )}
                </article>
              ) : (
                <div className="py-20 text-center opacity-70 space-y-3">
                  <p className="font-bold text-sm">{book.titleBn} · পৃষ্ঠা {currentPage}</p>
                  <p className="text-xs leading-relaxed max-w-md mx-auto">
                    {isBn
                      ? 'অনলাইনে বিনামূল্যে ডিজিটাল বুক লাইব্রেরির মাধ্যমে বইটি পাঠ করছেন। মূল হাই-রেজোলিউশন মুদ্রণ সংস্করণ ডিভাইসে অফলাইনে সংরক্ষণ করতে বিকাশ দিয়ে ক্রয় সম্পন্ন করুন।'
                      : 'You are reading this book online for free. To keep an offline high-resolution PDF copy, complete a verified bKash purchase.'}
                  </p>
                  {driveFileId && (
                    <button
                      onClick={() => setViewMode('drive')}
                      className="px-4 py-2 bg-sky-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow"
                    >
                      <Globe className="w-4 h-4" />
                      <span>{isBn ? 'গুগল ড্রাইভ অফিসিয়াল ভিউয়ারে পড়ুন' : 'Switch to Google Drive Official Reader'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Page Footer */}
            <div className="border-t pt-4 mt-8 flex items-center justify-between text-[11px] opacity-60">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? 'সুরক্ষিত পড়ার মোড' : 'Protected Reading Mode'}</span>
              </span>
              <span className="font-mono font-medium">
                {currentPage} / {totalPages}
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Floating Control Bar (Hidden in Immersive Fullscreen Mode or Drive Mode) */}
      {!isImmersive && viewMode !== 'drive' && (
        <footer className="sticky bottom-0 z-40 bg-slate-900/95 backdrop-blur-md text-slate-200 border-t border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-3 shadow-lg w-full max-w-full overflow-hidden">
          {/* Previous Button */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{isBn ? 'পূর্ববর্তী' : 'Previous'}</span>
          </button>

          {/* Page Slider & Direct Input */}
          <div className="flex-1 max-w-md flex items-center gap-2 min-w-0">
            <input
              type="range"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={e => setCurrentPage(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            />
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-200 shrink-0 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
              <span>{currentPage}</span>
              <span className="text-slate-500">/</span>
              <span>{totalPages}</span>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <span className="hidden sm:inline">{isBn ? 'পরবর্তী' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </footer>
      )}

      {/* Footer when in Google Drive mode */}
      {!isImmersive && viewMode === 'drive' && (
        <footer className="sticky bottom-0 z-40 bg-slate-900/95 backdrop-blur-md text-slate-200 border-t border-slate-800 px-3 sm:px-4 py-1.5 flex items-center justify-between gap-3 shadow-lg w-full max-w-full overflow-hidden text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] truncate">
            <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate">{isBn ? 'গুগল ড্রাইভ ক্লাউড থেকে পেজ স্ক্রোল ও জুম করুন' : 'Scroll and pinch-to-zoom Google Drive pages'}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {pdfSource && (
              <button
                onClick={() => setViewMode('pdf')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors flex items-center gap-1"
              >
                <Layers className="w-3 h-3 text-emerald-400" />
                <span>{isBn ? 'ক্যানভাস মোড' : 'Canvas Mode'}</span>
              </button>
            )}
            <button
              onClick={toggleFullScreen}
              className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-semibold transition-colors flex items-center gap-1"
            >
              {isFullScreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              <span>{isFullScreen ? (isBn ? 'ফুল স্ক্রিন বন্ধ' : 'Exit Full') : (isBn ? 'ফুল স্ক্রিন' : 'Full Screen')}</span>
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};
