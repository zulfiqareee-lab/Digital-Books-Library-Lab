import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { fetchProtectedPage } from '../services/api';
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
  CheckCircle2
} from 'lucide-react';

export const PdfReaderScreen: React.FC = () => {
  const { selectedBook, readerPage, navigateTo, language, hasEntitlement } = useLibrary();

  const isBn = language === 'bn';
  const book = selectedBook;

  const [currentPage, setCurrentPage] = useState<number>(readerPage || 1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark'>('sepia');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [pageData, setPageData] = useState<any>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [showToc, setShowToc] = useState(false);

  const totalPages = book?.totalPages || 120;
  const isOwned = book ? hasEntitlement(book.id) : false;

  useEffect(() => {
    if (!book) return;
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
  }, [book, currentPage]);

  if (!book) {
    return (
      <div className="p-12 text-center">
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

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      setIsFullScreen(false);
    }
  };

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
    <div className={`min-h-screen flex flex-col ${canvasBackground[readerTheme]} select-none relative transition-colors duration-200`}>
      {/* Top Reader Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-md">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigateTo('book_detail', { book })}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title={isBn ? 'বইয়ের বিবরণে ফিরুন' : 'Back to book details'}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold truncate text-white leading-tight">
              {isBn ? book.titleBn : book.titleEn}
            </h1>
            <p className="text-[10px] text-emerald-400 font-medium truncate">
              {book.authorBn} · {isBn ? 'সুরক্ষিত উন্মুক্ত পাঠকক্ষ' : 'Protected Free Reader'}
            </p>
          </div>
        </div>

        {/* Center: Page Controls */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700 text-xs">
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

        {/* Right: Controls & Purchase CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Table of contents toggle */}
          <button
            onClick={() => setShowToc(!showToc)}
            className={`p-2 rounded-lg transition-colors ${
              showToc ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title={isBn ? 'সূচিপত্র' : 'Table of Contents'}
          >
            <List className="w-4 h-4" />
          </button>

          {/* Theme switcher */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setReaderTheme('light')}
              className={`p-1.5 rounded text-xs ${
                readerTheme === 'light' ? 'bg-slate-700 text-amber-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Light"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setReaderTheme('sepia')}
              className={`px-1.5 py-1 rounded text-[10px] font-bold ${
                readerTheme === 'sepia' ? 'bg-amber-100 text-amber-900' : 'text-slate-400 hover:text-white'
              }`}
              title="Sepia"
            >
              সেপিয়া
            </button>
            <button
              onClick={() => setReaderTheme('dark')}
              className={`p-1.5 rounded text-xs ${
                readerTheme === 'dark' ? 'bg-slate-700 text-sky-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Dark"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="hidden md:flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setZoomLevel(z => Math.max(75, z - 15))}
              className="p-1.5 text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1 text-slate-300">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(z => Math.min(175, z + 15))}
              className="p-1.5 text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Full Screen */}
          <button
            onClick={toggleFullScreen}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors hidden sm:block"
            title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Download Original PDF Button */}
          {isOwned ? (
            <button
              onClick={() => navigateTo('payment_result', { book })}
              className="px-3 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isBn ? 'ডাউনলোড' : 'Download'}</span>
            </button>
          ) : (
            <button
              onClick={() => navigateTo('bkash_checkout', { book })}
              className="px-3 py-1.5 rounded-lg bg-pink-700 hover:bg-pink-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isBn ? `বিকাশ (৳${book.priceBdt})` : `bKash`}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Reading Canvas */}
      <main className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center relative">
        {/* Table of Contents Drawer */}
        {showToc && (
          <aside className="absolute top-4 left-4 z-30 w-72 max-w-[85vw] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {isBn ? 'সূচিপত্র ও অধ্যায়' : 'Table of Contents'}
              </span>
              <button
                onClick={() => setShowToc(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1.5 max-h-80 overflow-y-auto text-xs">
              {book.samplePages.map(page => (
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
                  <span className="font-mono text-[10px] text-slate-400">{page.pageNumber}</span>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Server-Rendered Protected Reading Page */}
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className={`relative w-full max-w-2xl min-h-[640px] p-8 sm:p-14 rounded-2xl border shadow-xl transition-all duration-150 flex flex-col justify-between ${themeStyles[readerTheme]}`}
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

          {/* Page Header Header */}
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
              <div className="py-20 text-center opacity-70 space-y-2">
                <p className="font-bold text-sm">{book.titleBn} · পৃষ্ঠা {currentPage}</p>
                <p className="text-xs leading-relaxed max-w-md mx-auto">
                  {isBn
                    ? 'আপনি অনলাইনে বিনামূল্যে ডিজিটাল বুক লাইব্রেরির মাধ্যমে বইটি পাঠ করছেন। মূল হাই-রেজোলিউশন মুদ্রণ সংস্করণ ডিভাইসে অফলাইনে সংরক্ষণ করতে বিকাশ দিয়ে ক্রয় সম্পন্ন করুন।'
                    : 'You are reading this book online for free. To keep an offline high-resolution PDF copy, complete a verified bKash purchase.'}
                </p>
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
      </main>

      {/* Bottom Floating Control Bar */}
      <footer className="sticky bottom-0 z-40 bg-slate-900/95 backdrop-blur-md text-slate-200 border-t border-slate-800 px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Previous Button */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{isBn ? 'পূর্ববর্তী পৃষ্ঠা' : 'Previous'}</span>
        </button>

        {/* Page Slider */}
        <div className="flex-1 max-w-xs flex items-center gap-2">
          <input
            type="range"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={e => setCurrentPage(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <span className="font-mono text-xs font-bold text-slate-200 tabular-nums shrink-0">
            {currentPage}/{totalPages}
          </span>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span>{isBn ? 'পরবর্তী পৃষ্ঠা' : 'Next'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
