import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { requestDownloadToken } from '../services/api';
import { BookmarkCheck, Download, BookOpen, Clock, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';

export const MyLibraryScreen: React.FC = () => {
  const { books, entitlements, navigateTo, language } = useLibrary();
  const { user } = useAuth();

  const isBn = language === 'bn';
  const [downloadingBookId, setDownloadingBookId] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <BookmarkCheck className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">
          {isBn ? 'আপনার লাইব্রেরি দেখতে লগইন করুন' : 'Log in to view My Library'}
        </h2>
        <p className="text-xs text-slate-500">
          {isBn
            ? 'আপনার ক্রয়কৃত বইসমূহ দেখতে এবং পুনরায় ডাউনলোড করতে অ্যাকাউন্টে প্রবেশ করুন।'
            : 'Access your purchased books and re-download original PDFs anytime.'}
        </p>
        <button
          onClick={() => navigateTo('login')}
          className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl"
        >
          {isBn ? 'লগইন করুন' : 'Log In'}
        </button>
      </div>
    );
  }

  // Get full book objects for user's entitlements
  const ownedBooks = entitlements
    .map(ent => {
      const book = books.find(b => b.id === ent.bookId);
      return book ? { book, entitlement: ent } : null;
    })
    .filter(Boolean) as { book: (typeof books)[0]; entitlement: (typeof entitlements)[0] }[];

  const handleDownload = async (bookId: string, bookTitle: string) => {
    setDownloadingBookId(bookId);
    try {
      const tokenRes = await requestDownloadToken(bookId, user.uid);
      const downloadLink = document.createElement('a');
      downloadLink.href = tokenRes.downloadUrl;
      downloadLink.setAttribute('download', `${bookTitle}.pdf`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err: any) {
      alert(err.message || 'ডাউনলোড ব্যর্থ হয়েছে।');
    } finally {
      setDownloadingBookId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isBn ? 'আমার ব্যক্তিগত লাইব্রেরি' : 'My Personal Library'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isBn
              ? `বিকাশে ক্রয়কৃত মোট ${ownedBooks.length} টি বই সংরক্ষিত রয়েছে`
              : `${ownedBooks.length} purchased books available for offline download`}
          </p>
        </div>

        <button
          onClick={() => navigateTo('purchase_history')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors w-fit"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{isBn ? 'ক্রয় ইতিহাস দেখুন' : 'Order History'}</span>
        </button>
      </div>

      {ownedBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {ownedBooks.map(({ book, entitlement }) => (
            <div
              key={book.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
            >
              <div className="flex gap-4 items-center min-w-0">
                <div
                  onClick={() => navigateTo('book_detail', { book })}
                  className="w-20 aspect-3/4 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer shadow-sm border border-slate-200"
                >
                  <img
                    src={book.coverUrl}
                    alt={book.titleBn}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isBn ? 'যাচাইকৃত স্বত্ব' : 'Verified Entitlement'}</span>
                  </div>
                  <h3
                    onClick={() => navigateTo('book_detail', { book })}
                    className="text-base font-bold text-slate-900 truncate hover:text-emerald-700 cursor-pointer"
                  >
                    {isBn ? book.titleBn : book.titleEn}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">{book.authorBn}</p>
                  <div className="text-[11px] text-slate-400 font-mono">
                    <span>TrxID: {entitlement.bkashTrxId}</span> ·{' '}
                    <span>{entitlement.downloadCount || 0} {isBn ? 'বার ডাউনলোড' : 'downloads'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <button
                  onClick={() => navigateTo('pdf_reader', { book, page: 1 })}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isBn ? 'পড়ুন' : 'Read'}</span>
                </button>

                <button
                  onClick={() => handleDownload(book.id, book.titleEn || book.id)}
                  disabled={downloadingBookId === book.id}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingBookId === book.id ? (isBn ? 'ডাউনলোড হচ্ছে...' : 'Downloading...') : (isBn ? 'ডাউনলোড' : 'Download')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto my-8 space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {isBn ? 'আপনার লাইব্রেরিতে কোনো বই নেই' : 'No books in your library yet'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {isBn
              ? 'আপনি অনলাইনে সব বই ফ্রি পড়তে পারেন। তবে ডিভাইসে অফলাইনে সংরক্ষণের জন্য বিকাশ দিয়ে কিনে নিলে এখানে স্থায়ীভাবে যুক্ত হবে।'
              : 'Browse our collection, read free online, or purchase verified downloads with bKash.'}
          </p>
          <button
            onClick={() => navigateTo('catalogue')}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2"
          >
            <span>{isBn ? 'বই ক্যাটালগ দেখুন' : 'Explore Books'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
