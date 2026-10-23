import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from '../components/BookCard';
import { Search, X, Sparkles } from 'lucide-react';

export const SearchScreen: React.FC = () => {
  const { books, language } = useLibrary();
  const [query, setQuery] = useState('');

  const isBn = language === 'bn';

  const results = query.trim()
    ? books.filter(b => {
        const q = query.toLowerCase();
        return (
          b.titleBn.toLowerCase().includes(q) ||
          b.titleEn.toLowerCase().includes(q) ||
          b.authorBn.toLowerCase().includes(q) ||
          b.authorEn.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.descriptionBn.toLowerCase().includes(q)
        );
      })
    : [];

  const suggestions = [
    { label: isBn ? 'গীতাঞ্জলি' : 'Gitanjali', val: 'গীতাঞ্জলি' },
    { label: isBn ? 'রবীন্দ্রনাথ ঠাকুর' : 'Rabindranath', val: 'রবীন্দ্রনাথ' },
    { label: isBn ? 'মহাশূন্য ও সায়েন্স ফিকশন' : 'Sci-Fi', val: 'মহাশূন্য' },
    { label: isBn ? 'পুরান ঢাকা থ্রিলার' : 'Dhaka Thriller', val: 'ঢাকা' },
    { label: isBn ? 'বাংলার টেরাকোটা' : 'Architecture', val: 'ইতিহাস' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 pb-20">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isBn ? 'বই ও লেখক অনুসন্ধান' : 'Search Books & Authors'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {isBn
            ? 'বাংলা অথবা ইংরেজিতে বইয়ের নাম, লেখক কিংবা বিষয় লিখে সার্চ করুন'
            : 'Search in Bengali or English by book title, author name, or topic'}
        </p>

        {/* Search Input Box */}
        <div className="relative mt-4">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={isBn ? 'যেমন: রবীন্দ্রনাথ, গীতাঞ্জলি, কল্পবিজ্ঞান...' : 'e.g. Tagore, Gitanjali, Sci-Fi...'}
            className="w-full pl-12 pr-10 py-3.5 bg-white rounded-2xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium text-slate-900 shadow-sm transition-all focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Suggestions */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          <span className="text-xs text-slate-600 flex items-center gap-1 font-semibold">
            <Sparkles className="w-3 h-3 text-slate-600" />
            {isBn ? 'জনপ্রিয় সার্চ:' : 'Trending:'}
          </span>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(s.val)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200 transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {query.trim() ? (
        <div>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-700">
              {isBn
                ? `"${query}" এর জন্য ${results.length} টি ফলাফল`
                : `${results.length} results for "${query}"`}
            </h2>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {results.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                {isBn ? 'কোনো বই পাওয়া যায়নি' : 'No matching books found'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isBn ? 'বানান যাচাই করে আবার চেষ্টা করুন।' : 'Please check the spelling and try again.'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">
          <p className="text-xs">
            {isBn
              ? 'উপরের সার্চ বক্সে যেকোনো শব্দ লিখে শুরু করুন'
              : 'Type keywords in the search bar above to begin'}
          </p>
        </div>
      )}
    </div>
  );
};
