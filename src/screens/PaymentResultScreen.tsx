import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { requestDownloadToken, getBaseUrl } from '../services/api';
import { getLocalPdf } from '../services/pdfStorage';
import {
  CheckCircle2,
  Download,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Receipt,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

export const PaymentResultScreen: React.FC = () => {
  const { selectedBook, lastPaymentResult, navigateTo, language } = useLibrary();
  const { user } = useAuth();

  const isBn = language === 'bn';
  const book = selectedBook || lastPaymentResult?.book;

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (!book) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500 mb-4">{isBn ? 'কোনো বই পাওয়া যায়নি।' : 'No book details found.'}</p>
        <button
          onClick={() => navigateTo('catalogue')}
          className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
        >
          {isBn ? 'ক্যাটালগ দেখুন' : 'Go to Catalogue'}
        </button>
      </div>
    );
  }

  const trxId = lastPaymentResult?.trxId || 'BKASH_TRX_' + Date.now().toString().slice(-6);
  const orderId = lastPaymentResult?.orderId || 'ORD-BKASH-78210';
  const amount = lastPaymentResult?.amount || book.priceBdt;

  const handleDownload = async () => {
    if (!user) return;
    setIsDownloading(true);
    setDownloadError(null);

    try {
      // 1. Check local IndexedDB storage first (e.g. uploaded in APK or offline)
      const localPdf = await getLocalPdf(book.id);
      if (localPdf) {
        const blob = localPdf instanceof Blob ? localPdf : new Blob([localPdf], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        const filename = (book.titleEn || book.titleBn || 'digital_book').replace(/[^a-zA-Z0-9_\-\u0980-\u09FF]/g, '_');
        downloadLink.setAttribute('download', `${filename}.pdf`);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(blobUrl);
        setDownloadSuccess(true);
        return;
      }

      // 2. Request short-lived single-use download token from server
      const tokenRes = await requestDownloadToken(book.id, user.uid);
      const downloadUrl = tokenRes.downloadUrl.startsWith('http')
        ? tokenRes.downloadUrl
        : `${getBaseUrl()}${tokenRes.downloadUrl}`;

      // 3. Trigger verified download stream
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      const filename = (book.titleEn || book.titleBn || book.id).replace(/[^a-zA-Z0-9_\-\u0980-\u09FF]/g, '_');
      downloadLink.setAttribute('download', `${filename}.pdf`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setDownloadSuccess(true);
    } catch (err: any) {
      setDownloadError(err.message || 'ডাউনলোড সম্পন্ন করতে সমস্যা হয়েছে।');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 flex-1 pb-20">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Success Icon & Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isBn ? 'বিকাশ পেমেন্ট যাচাইকৃত ও সফল' : 'bKash Payment Verified'}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isBn ? 'অভিনন্দন! আপনার ক্রয় সম্পন্ন হয়েছে' : 'Purchase Successful!'}
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isBn
              ? 'সার্ভার আপনার বিকাশ লেনদেন সফলভাবে নিশ্চিত করেছে। বইটি আপনার ব্যক্তিগত লাইব্রেরিতে যুক্ত করা হয়েছে।'
              : 'The backend has securely validated your payment and granted perpetual download entitlement.'}
          </p>
        </div>

        {/* Verified Order Receipt Box */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-bold text-slate-800">
            <span className="flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-emerald-600" />
              <span>{isBn ? 'অফিসিয়াল লেনদেন রশিদ' : 'Verified Transaction Receipt'}</span>
            </span>
            <span className="text-emerald-700 uppercase font-mono tracking-wider font-extrabold">PAID</span>
          </div>

          <div className="space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span>{isBn ? 'বইয়ের নাম:' : 'Book Title:'}</span>
              <span className="font-semibold text-slate-900 text-right">{book.titleBn}</span>
            </div>
            <div className="flex justify-between">
              <span>{isBn ? 'বিকাশ ট্রানজেকশন আইডি (TrxID):' : 'bKash TrxID:'}</span>
              <span className="font-mono font-bold text-[#e2136e]">{trxId}</span>
            </div>
            <div className="flex justify-between">
              <span>{isBn ? 'অর্ডার রেফারেন্স নং:' : 'Order ID:'}</span>
              <span className="font-mono text-slate-800">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>{isBn ? 'পরিশোধিত মূল্য:' : 'Amount Paid:'}</span>
              <span className="font-bold font-mono text-slate-900">৳{amount} BDT</span>
            </div>
            <div className="flex justify-between">
              <span>{isBn ? 'ক্রেতার অ্যাকাউন্ট:' : 'Customer:'}</span>
              <span className="font-medium text-slate-800">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span>{isBn ? 'লেনদেনের সময়:' : 'Timestamp:'}</span>
              <span className="font-mono text-slate-500">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Download Action Area */}
        <div className="space-y-3 pt-2">
          {downloadError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {downloadError}
            </div>
          )}

          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isBn ? 'পিডিএফ ডাউনলোড শুরু হয়েছে!' : 'Download started successfully!'}</span>
            </div>
          )}

          {/* Primary Button: Download Original PDF */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-4 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[50px]"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isBn ? 'ডাউনলোড টোকেন তৈরি হচ্ছে...' : 'Generating secure token...'}</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>{isBn ? 'আসল পিডিএফ ফাইলটি ডাউনলোড করুন' : 'Download Original PDF File'}</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-600 text-center font-medium">
            {isBn
              ? 'নিরাপত্তা নিশ্চিত করতে ডাউনলোড লিঙ্কটি ৬০ সেকেন্ডের জন্য বৈধ একক টোকেন দ্বারা সংরক্ষিত।'
              : 'Secure single-use token valid for 60 seconds. You can re-download anytime from My Library.'}
          </p>
        </div>

        {/* Secondary Navigation Actions */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => navigateTo('pdf_reader', { book, page: 1 })}
            className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>{isBn ? 'অনলাইনে পড়ুন' : 'Read Online'}</span>
          </button>

          <button
            onClick={() => navigateTo('my_library')}
            className="py-3 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>{isBn ? 'আমার লাইব্রেরি' : 'My Library'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
