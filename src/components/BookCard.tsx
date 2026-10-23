import React, { useState } from 'react';
import { Book } from '../types';
import { useLibrary } from '../context/LibraryContext';
import { BookOpen, Download, CheckCircle2 } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { navigateTo, language, hasEntitlement } = useLibrary();
  const [imgError, setImgError] = useState(false);

  const isBn = language === 'bn';
  const isOwned = hasEntitlement(book.id);

  const formatBdt = (amount: number) => {
    if (amount === 0) return isBn ? 'বিনামূল্যে' : 'Free';
    if (!isBn) return `৳${amount}`;
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return '৳' + amount.toString().split('').map(c => bengaliDigits[parseInt(c, 10)] || c).join('');
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Book Cover Frame (3:4 aspect ratio) */}
      <div
        onClick={() => navigateTo('book_detail', { book })}
        className="relative aspect-3/4 w-full bg-slate-100 overflow-hidden cursor-pointer"
      >
        {!imgError ? (
          <img
            src={book.coverUrl}
            alt={book.titleBn}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 text-center">
            <BookOpen className="w-10 h-10 mb-2 text-slate-400 stroke-1" />
            <span className="font-semibold text-xs line-clamp-2">{book.titleBn}</span>
            <span className="text-[10px] mt-1 text-slate-400">{book.authorBn}</span>
          </div>
        )}

        {/* Free to Read Banner Indicator */}
        <div className="absolute top-2.5 left-2.5 bg-emerald-700/95 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-md shadow-xs">
          {isBn ? 'বিনামূল্যে পড়ুন' : 'Free to Read'}
        </div>

        {/* Owned Badge if bought */}
        {isOwned && (
          <div className="absolute top-2.5 right-2.5 bg-sky-700/95 text-white text-[10px] font-semibold px-2 py-1 rounded-md flex items-center gap-1 shadow-xs">
            <CheckCircle2 className="w-3 h-3" />
            <span>{isBn ? 'কেনা হয়েছে' : 'Owned'}</span>
          </div>
        )}
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Quiet unboxed text with typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 flex-wrap">
            <span>{book.category}</span>
            <span aria-hidden="true">·</span>
            <span>{book.totalPages} {isBn ? 'পৃষ্ঠা' : 'pages'}</span>
            <span aria-hidden="true">·</span>
            <span>{book.language === 'bn' ? 'বাংলা' : book.language === 'en' ? 'English' : 'দ্বিভাষিক'}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => navigateTo('book_detail', { book })}
            className="text-base font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors cursor-pointer"
          >
            {isBn ? book.titleBn : book.titleEn}
          </h3>

          {/* Author */}
          <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
            {isBn ? book.authorBn : book.authorEn}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-600 block font-bold">
              {isBn ? 'ডাউনলোড মূল্য' : 'Download Price'}
            </span>
            <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
              {formatBdt(book.priceBdt)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Read Free Online Button */}
            <button
              onClick={() => navigateTo('pdf_reader', { book, page: 1 })}
              title={isBn ? 'বিনামূল্যে অনলাইনে পড়ুন' : 'Read Free Online'}
              className="px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg flex items-center gap-1 transition-colors min-h-[36px]"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isBn ? 'পড়ুন' : 'Read'}</span>
            </button>

            {/* Buy / Download Button */}
            {isOwned ? (
              <button
                onClick={() => navigateTo('payment_result', { book })}
                title={isBn ? 'ডাউনলোড করুন' : 'Download PDF'}
                className="px-2.5 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg flex items-center gap-1 transition-colors min-h-[36px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isBn ? 'ডাউনলোড' : 'Download'}</span>
              </button>
            ) : (
              <button
                onClick={() => navigateTo('bkash_checkout', { book })}
                title={isBn ? 'বিকাশে কিনুন ও ডাউনলোড করুন' : 'Buy with bKash'}
                className="px-2.5 py-1.5 text-xs font-semibold text-white bg-pink-700 hover:bg-pink-800 rounded-lg flex items-center gap-1 transition-colors shadow-xs min-h-[36px]"
              >
                <span>{isBn ? 'বিকাশ' : 'bKash'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
