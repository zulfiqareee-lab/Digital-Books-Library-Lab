import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookOpen, Download, ShieldCheck, ArrowLeft, CheckCircle2, FileText, Calendar, Building, Layers } from 'lucide-react';

export const BookDetailScreen: React.FC = () => {
  const { selectedBook, navigateTo, language, hasEntitlement } = useLibrary();

  const isBn = language === 'bn';

  if (!selectedBook) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500 mb-4">{isBn ? 'কোনো বই নির্বাচন করা হয়নি।' : 'No book selected.'}</p>
        <button
          onClick={() => navigateTo('catalogue')}
          className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
        >
          {isBn ? 'ক্যাটালগে ফিরে যান' : 'Back to Catalogue'}
        </button>
      </div>
    );
  }

  const book = selectedBook;
  const isOwned = hasEntitlement(book.id);

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatBdt = (amount: number) => {
    if (amount === 0) return isBn ? 'বিনামূল্যে' : 'Free';
    if (!isBn) return `৳${amount}`;
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return '৳' + amount.toString().split('').map(c => bengaliDigits[parseInt(c, 10)] || c).join('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 pb-24">
      {/* Back button */}
      <button
        onClick={() => navigateTo('catalogue')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isBn ? 'সকল বইয়ে ফিরে যান' : 'Back to all books'}</span>
      </button>

      {/* Main Book Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Book Cover Showcase */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="sticky top-20">
            <div className="aspect-3/4 w-full bg-slate-100 rounded-3xl overflow-hidden shadow-xl border border-slate-200">
              <img
                src={book.coverUrl}
                alt={book.titleBn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Quick stats below cover */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block">{isBn ? 'মোট পৃষ্ঠা' : 'Pages'}</span>
                <span className="text-xs font-bold text-slate-800 font-mono tabular-nums">{book.totalPages}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block">{isBn ? 'ফাইল সাইজ' : 'File Size'}</span>
                <span className="text-xs font-bold text-slate-800 font-mono">{formatFileSize(book.fileSizeBytes)}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block">{isBn ? 'প্রকাশ সন' : 'Year'}</span>
                <span className="text-xs font-bold text-slate-800 font-mono">{book.publishedYear}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contiguous Purchase & Reading Module */}
        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          <div>
            {/* Unboxed metadata line */}
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold mb-2">
              <span className="uppercase tracking-wider">{book.category}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{book.language === 'bn' ? 'বাংলা সংস্করণ' : 'English Edition'}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{isBn ? 'অনলাইনে বিনামূল্যে পড়া যায়' : 'Free Online Reading'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {book.titleBn}
            </h1>
            {book.titleEn && book.titleEn !== book.titleBn && (
              <h2 className="text-base text-slate-500 font-medium mt-1">
                {book.titleEn}
              </h2>
            )}

            <p className="text-sm font-semibold text-slate-700 mt-2">
              {isBn ? 'লেখক:' : 'Author:'} <span className="text-slate-900">{book.authorBn}</span>
            </p>
          </div>

          {/* Action CTAs Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-600 block font-bold">
                  {isBn ? 'মূল পিডিএফ ডাউনলোড মূল্য' : 'Original PDF Download Price'}
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                    {formatBdt(book.priceBdt)}
                  </span>
                  <span className="text-xs text-slate-400">
                    {isBn ? '(এককালীন বিকাশ পেমেন্ট)' : '(One-time bKash purchase)'}
                  </span>
                </div>
              </div>

              {isOwned && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-800 rounded-xl text-xs font-semibold border border-sky-200">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>{isBn ? 'ক্রয়কৃত বই' : 'Purchased'}</span>
                </div>
              )}
            </div>

            {/* Core Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Button 1: Free Online Reading */}
              <button
                onClick={() => navigateTo('pdf_reader', { book, page: 1 })}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer min-h-[48px]"
              >
                <BookOpen className="w-4 h-4" />
                <span>{isBn ? 'বিনামূল্যে অনলাইনে পড়ুন' : 'Read Free Online'}</span>
              </button>

              {/* Button 2: bKash Buy / Direct Download */}
              {isOwned ? (
                <button
                  onClick={() => navigateTo('payment_result', { book })}
                  className="w-full py-3.5 px-4 rounded-2xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer min-h-[48px]"
                >
                  <Download className="w-4 h-4" />
                  <span>{isBn ? 'পিডিএফ ডাউনলোড করুন' : 'Download Original PDF'}</span>
                </button>
              ) : (
                <button
                  onClick={() => navigateTo('bkash_checkout', { book })}
                  className="w-full py-3.5 px-4 rounded-2xl bg-pink-700 hover:bg-pink-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-pink-900/10 transition-all cursor-pointer min-h-[48px]"
                >
                  <Download className="w-4 h-4" />
                  <span>{isBn ? `বিকাশ দিয়ে কিনুন (${formatBdt(book.priceBdt)})` : `Buy with bKash (${formatBdt(book.priceBdt)})`}</span>
                </button>
              )}
            </div>

            {/* Clear security disclaimer */}
            <div className="flex items-start gap-2.5 pt-3 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                {isBn
                  ? 'নীতিমালা: যেকোনো পাঠক অনলাইনে পুরো বই ফ্রিতে পড়তে পারবেন। ডিভাইসে মূল পিডিএফ ডাউনলোড করার জন্য বিকাশ যাচাইকৃত পেমেন্ট প্রয়োজন।'
                  : 'Policy: Everyone can read online for free. Downloading the original PDF requires a verified bKash payment.'}
              </span>
            </div>
          </div>

          {/* Book Synopsis & Details */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              {isBn ? 'বইয়ের বিবরণ' : 'Book Synopsis'}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {book.descriptionBn}
            </p>
            {book.descriptionEn && (
              <p className="text-xs text-slate-500 leading-relaxed italic pt-2">
                {book.descriptionEn}
              </p>
            )}
          </div>

          {/* Publishing Information List */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
            {book.publisherBn && (
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  {isBn ? 'প্রকাশনা প্রতিষ্ঠান:' : 'Publisher:'}
                </span>
                <span className="font-semibold text-slate-800">{book.publisherBn}</span>
              </div>
            )}
            {book.isbn && (
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  {isBn ? 'আইএসবিএন (ISBN):' : 'ISBN:'}
                </span>
                <span className="font-mono text-slate-800">{book.isbn}</span>
              </div>
            )}
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                {isBn ? 'লাইব্রেরি স্ট্যাটাস:' : 'Format:'}
              </span>
              <span className="font-semibold text-emerald-700">
                {isBn ? 'সার্ভার-সুরক্ষিত ই-বুক ও হাই-রেস পিডিএফ' : 'Server-Protected eBook & Original PDF'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
