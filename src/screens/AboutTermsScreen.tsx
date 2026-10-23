import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { ShieldCheck, BookOpen, CheckCircle2, Lock, FileText, Mail, Heart, HelpCircle } from 'lucide-react';

export const AboutTermsScreen: React.FC = () => {
  const { language, navigateTo } = useLibrary();
  const isBn = language === 'bn';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 pb-24 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isBn ? 'পরিচিতি, নীতিমালা ও নিরাপত্তা নির্দেশিকা' : 'About, Policies & Security Architecture'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isBn
            ? 'ডিজিটাল বুক লাইব্রেরি বাংলাদেশের প্ল্যাটফর্ম পরিচিতি, বিকাশ নীতিমালা এবং কপিরাইট সুরক্ষা'
            : 'Digital Book Library mission, bKash Merchant integration, and protected reading security'}
        </p>
      </div>

      {/* Core Mission Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-3 shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isBn ? 'আমাদের মূলনীতি' : 'Core Business Model'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">
          {isBn ? 'READ FOR FREE, PAY WITH BKASH TO DOWNLOAD' : 'Read for Free, Pay with bKash to Download'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          {isBn
            ? 'জ্ঞান ও সাহিত্য সবার জন্য উন্মুক্ত হওয়া উচিত। তাই আমাদের যে কেউ যেকোনো বই ব্রাউজারে সম্পূর্ণ বিনামূল্যে পড়তে পারেন। তবে ডিভাইসে স্থায়ীভাবে আসল মূল মুদ্রণ-মানের পিডিএফ সংরক্ষণের জন্য স্বল্পমূল্যের বিকাশ পেমেন্ট প্রযোজ্য।'
            : 'Knowledge should be accessible. Anyone can read the full text of all published books online for free. Downloading high-resolution original PDF files requires an affordable, verified bKash payment.'}
        </p>
      </div>

      {/* Testing Checklist for the User */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{isBn ? 'সিস্টেম ভেরিফিকেশন ও টেস্ট চেকলিস্ট' : 'System Verification & Testing Checklist'}</span>
        </h3>
        <p className="text-xs text-slate-600">
          {isBn
            ? 'অ্যাপ্লিকেশনটির সমস্ত মূল ফিচার কার্যকরভাবে পরীক্ষা করার নির্দেশিকা:'
            : 'Step-by-step checklist to test uploading, previewing, checkout, and secure delivery:'}
        </p>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">1</span>
            <div>
              <span className="font-bold text-slate-900 block">
                {isBn ? 'বিনামূল্যে পড়া পরীক্ষা:' : 'Free Reading Test:'}
              </span>
              <span className="text-slate-600">
                {isBn
                  ? 'হোমপেজ বা ক্যাটালগ থেকে যেকোনো বইয়ের "পড়ুন" বাটনে ক্লিক করুন। কোনো পেমেন্ট ছাড়া সম্পূর্ণ বই জুম, থিম ও ফুল স্ক্রিন মোডে পড়া যায়। মূল পিডিএফ লিঙ্ক কখনই পাবলিকলি উন্মুক্ত হয় না।'
                  : 'Click "Read" on any book. Read online with zoom, themes, and full screen. The original PDF URL is never exposed to public readers.'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">2</span>
            <div>
              <span className="font-bold text-slate-900 block">
                {isBn ? 'বিকাশ চেকআউট ও পেমেন্ট যাচাই:' : 'bKash Checkout Verification:'}
              </span>
              <span className="text-slate-600">
                {isBn
                  ? '"বিকাশ দিয়ে কিনুন" ক্লিক করুন। আপনার বিকাশ নম্বর (017XXXXXXXX), ওটিপি (1234) এবং পিন (12345) দিয়ে পেমেন্ট করুন। সার্ভার যাচাই করে ট্রানজেকশন আইডি তৈরি করবে এবং তাৎক্ষণিক পিডিএফ ডাউনলোড আনলক হবে।'
                  : 'Click "Buy with bKash". Complete testbed checkout with number, OTP 1234, and PIN 12345. Backend validates and grants one-time download token.'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">3</span>
            <div>
              <span className="font-bold text-slate-900 block">
                {isBn ? 'ডাউনলোড টোকেন নিরাপত্তা পরীক্ষা:' : 'Download Security Enforcement:'}
              </span>
              <span className="text-slate-600">
                {isBn
                  ? 'অপরাধমূলক ডাউনলোড প্রতিরোধ: সার্ভার ৬০ সেকেন্ডের একক-ব্যবহারযোগ্য ক্রিপ্টোগ্রাফিক টোকেন দিয়ে ফাইল পাঠায়। পেমেন্ট না করে সরাসরি ডাউনলোড এপিআই কল করলে HTTP 403 Forbidden রিটার্ন করে।'
                  : 'Direct unauthorized download requests without a valid token or verified entitlement strictly return HTTP 403 Forbidden.'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">4</span>
            <div>
              <span className="font-bold text-slate-900 block">
                {isBn ? 'অ্যাডমিন বই আপলোড ও প্রকাশনা টেস্ট:' : 'Admin Upload & Curation Test:'}
              </span>
              <span className="text-slate-600">
                {isBn
                  ? 'অ্যাডমিন হিসেবে লগইন (zulfiqareee@gmail.com) করে "নতুন বই আপলোড" করুন। ড্রাফট বা প্রকাশিত স্ট্যাটাস টগল করুন এবং ক্যাটালগে তার দৃশ্যমানতা যাচাই করুন।'
                  : 'Log in as authorized admin (zulfiqareee@gmail.com). Upload a sample book with PDF, edit, toggle draft/publish, or delete.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Privacy Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-700" />
          <span>{isBn ? 'ব্যবহারের শর্তাবলী ও কপিরাইট নীতিমালা' : 'Terms of Service & Copyright'}</span>
        </h3>
        <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
          <p>
            {isBn
              ? '১. ডিজিটাল বুক লাইব্রেরির সকল বই জনস্বার্থে ও শিক্ষামূলক উদ্দেশ্যে অনলাইনে উন্মুক্ত রাখা হয়েছে। বাণিজ্যিক উদ্দেশ্যে ডিজিটাল ফাইল পাইরেসি বা পুনঃবিক্রয় বাংলাদেশ কপিরাইট আইন অনুযায়ী দণ্ডনীয়।'
              : '1. All books are curated for reading and educational empowerment. Unauthorized commercial reselling or piracy is prohibited.'}
          </p>
          <p>
            {isBn
              ? '২. বিকাশ পেমেন্ট লেনদেন অফিসিয়াল গেটওয়ে এবং সার্ভার সিক্রেটের মাধ্যমে এনক্রিপ্ট করে পরিচালিত হয়। গ্রাহকের বিকাশ পিন কখনও সার্ভারে বা ব্রাউজারে সংরক্ষিত হয় না।'
              : '2. Customer bKash PINs are never stored. Payments are verified via official bKash Merchant APIs.'}
          </p>
          <p>
            {isBn
              ? '৩. কোনো বইয়ের স্বত্বাধিকারী যদি তার বই প্ল্যাটফর্ম থেকে প্রত্যাহার করতে চান, তবে সরাসরি অ্যাডমিনের সাথে যোগাযোগ করলে তাৎক্ষণিক ব্যবস্থা গ্রহণ করা হবে।'
              : '3. Copyright owners can request takedown or royalty coordination by contacting administration.'}
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-700 shadow-xs">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">
              {isBn ? 'অ্যাডমিন ও সহায়তা যোগাযোগ' : 'Administration & Support'}
            </span>
            <span className="font-mono text-slate-500">zulfiqareee@gmail.com</span>
          </div>
        </div>

        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-emerald-700 text-white font-semibold rounded-xl"
        >
          {isBn ? 'হোমে ফিরে যান' : 'Back to Home'}
        </button>
      </div>
    </div>
  );
};
