import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from '../components/BookCard';
import { CATEGORIES } from '../data/initialBooks';
import { BookOpen, ShieldCheck, CreditCard, Sparkles, ArrowRight } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { books, navigateTo, language } = useLibrary();
  const isBn = language === 'bn';

  const featuredBooks = books.filter(b => b.featured);
  const recentBooks = books.slice(0, 4);

  return (
    <div className="flex-1 pb-16">
      {/* Editorial Hero Section */}
      <section className="bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white px-4 sm:px-6 py-10 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isBn ? 'বাংলাদেশের প্রথম উন্মুক্ত বাংলা বই প্ল্যাটফর্ম' : "Bangladesh's First Open Digital Library"}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {isBn ? (
                  <>
                    অনলাইনে পড়ুন <span className="text-emerald-400">বিনামূল্যে</span>,<br />
                    ডাউনলোডে পরিশোধ করুন <span className="text-pink-400">বিকাশে</span>
                  </>
                ) : (
                  <>
                    Read Online for <span className="text-emerald-400">Free</span>,<br />
                    Download Original PDF with <span className="text-pink-400">bKash</span>
                  </>
                )}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                {isBn
                  ? 'রবীন্দ্রনাথ ঠাকুরের নোবেল বিজয়ী গীতাঞ্জলি থেকে শুরু করে সমকালীন সাহিত্য, বিজ্ঞান ও ইতিহাস—সকল বই অনলাইনে সবার জন্য উন্মুক্ত। অফলাইন পড়ার জন্য আসল পিডিএফ ডাউনলোড করতে বিকাশ দিয়ে সুরক্ষিত ক্রয় সম্পন্ন করুন।'
                  : 'From timeless literary masterpieces to contemporary sci-fi and history. Read every book completely free online in our protected reader, or purchase verified PDF downloads directly via bKash.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigateTo('catalogue')}
                  className="px-5 py-3 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-700/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isBn ? 'বইয়ের ক্যাটালগ দেখুন' : 'Browse Catalogue'}</span>
                </button>
                <button
                  onClick={() => {
                    const gitanjali = books.find(b => b.id === 'book-gitanjali-01') || books[0];
                    if (gitanjali) navigateTo('pdf_reader', { book: gitanjali, page: 1 });
                  }}
                  className="px-5 py-3 text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{isBn ? 'গীতাঞ্জলি পড়ুন (ফ্রি)' : 'Read Gitanjali (Free)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigateTo('admin_upload')}
                  className="px-5 py-3 text-sm font-semibold rounded-xl bg-pink-700/80 hover:bg-pink-700 text-white border border-pink-500/50 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <ShieldCheck className="w-4 h-4 text-pink-200" />
                  <span>{isBn ? 'বই আপলোড করুন' : 'Upload Book (Admin)'}</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800/80 flex items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isBn ? 'সার্ভার-সুরক্ষিত পাঠকক্ষ' : 'Protected Online Reader'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-pink-400" />
                  <span>{isBn ? 'বিকাশ পেমেন্ট গেটওয়ে' : 'Official bKash PGW'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Book Spotlight */}
            <div className="lg:col-span-5 flex justify-center">
              {featuredBooks[0] && (
                <div
                  onClick={() => navigateTo('book_detail', { book: featuredBooks[0] })}
                  className="relative group bg-slate-800/90 rounded-3xl p-4 sm:p-6 border border-slate-700/60 shadow-2xl cursor-pointer max-w-sm w-full hover:border-emerald-500/50 transition-all"
                >
                  <div className="aspect-3/4 rounded-2xl overflow-hidden shadow-lg bg-slate-900 mb-4">
                    <img
                      src={featuredBooks[0].coverUrl}
                      alt={featuredBooks[0].titleBn}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                      <span>{isBn ? 'নির্বাচিত শ্রেষ্ঠ বই' : 'Featured Masterpiece'}</span>
                      <span className="font-mono tabular-nums text-white font-bold">
                        {isBn ? `৳${featuredBooks[0].priceBdt}` : `BDT ${featuredBooks[0].priceBdt}`}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {isBn ? featuredBooks[0].titleBn : featuredBooks[0].titleEn}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {isBn ? featuredBooks[0].authorBn : featuredBooks[0].authorEn}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Categories Bar */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              {isBn ? 'ক্যাটাগরি অনুযায়ী বই' : 'Browse Categories'}
            </h2>
            <button
              onClick={() => navigateTo('catalogue')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>{isBn ? 'সকল বই' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigateTo('catalogue')}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-white border border-slate-200 hover:border-emerald-600 hover:text-emerald-700 whitespace-nowrap shadow-xs transition-colors shrink-0"
              >
                {isBn ? cat.nameBn : cat.nameEn}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Collection */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isBn ? 'জনপ্রিয় ও নির্বাচিত বই' : 'Featured Books'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isBn
                  ? 'সব বই অনলাইনে বিনামূল্যে পড়ার জন্য উন্মুক্ত'
                  : 'Every book is free to read online anytime'}
              </p>
            </div>
            <button
              onClick={() => navigateTo('catalogue')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>{isBn ? 'আরও দেখুন' : 'Explore All'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Recently Added Collection */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isBn ? 'সম্প্রতি যুক্ত হওয়া বই' : 'Recently Added'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isBn ? 'নতুন প্রকাশিত ডিজিটাল বই' : 'Fresh digital publications and classics'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {recentBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* How It Works Explainer Banner */}
        <section className="bg-emerald-50/70 border border-emerald-100 rounded-3xl p-6 sm:p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {isBn ? 'কীভাবে ডিজিটাল বুক লাইব্রেরি কাজ করে?' : 'How Digital Book Library Works'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-2xl leading-relaxed">
            {isBn
              ? 'আমাদের মূল লক্ষ্য বাংলায় জ্ঞান ও সাহিত্যের প্রচার। যে কেউ যেকোনো স্থান থেকে আমাদের ওয়েবসাইটে বা অ্যান্ড্রয়েড অ্যাপে প্রতিটি প্রকাশিত বই সম্পূর্ণ ফ্রিতে পড়তে পারেন। যদি আপনি নিজের ডিভাইসে অফলাইনে পড়ার জন্য আসল মূল পিডিএফ ফাইলটি ডাউনলোড করতে চান, তবে বিকাশ দিয়ে এককালীন মূল্য পরিশোধ করলেই সাথে সাথে ডাউনলোড লিঙ্ক আনলক হবে।'
              : 'Our mission is open knowledge for Bangladesh. Anyone can read any published book completely free on our site or Android app. If you wish to download the original PDF file to your phone or tablet, simply complete a verified bKash payment to unlock instant, permanent download access.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-emerald-100/80 shadow-xs">
              <span className="text-xs font-bold text-emerald-700 block mb-1">০১. বিনামূল্যে পড়া</span>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">যেকোনো বই খুলুন ও পড়ুন</h4>
              <p className="text-xs text-slate-500">
                কোনো পেমেন্ট ছাড়াই ব্রাউজার বা অ্যাপে ফুল স্ক্রিন মোডে পড়ুন।
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-emerald-100/80 shadow-xs">
              <span className="text-xs font-bold text-pink-700 block mb-1">০২. বিকাশ পেমেন্ট</span>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">নিরাপদ বিকাশ চেকআউট</h4>
              <p className="text-xs text-slate-500">
                ডাউনলোড করতে চাইলে বিকাশ মোবাইল নম্বর ও ওটিপি দিয়ে ভেরিফাই করুন।
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-emerald-100/80 shadow-xs">
              <span className="text-xs font-bold text-sky-700 block mb-1">০৩. আসল পিডিএফ ডাউনলোড</span>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">লাইব্রেরিতে স্থায়ী সংরক্ষণ</h4>
              <p className="text-xs text-slate-500">
                সার্ভার কর্তৃক সত্যায়িত হওয়ার সাথে সাথেই আসল পিডিএফ ডাউনলোড হবে।
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
