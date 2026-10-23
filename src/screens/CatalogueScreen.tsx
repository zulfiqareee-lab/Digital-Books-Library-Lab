import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from '../components/BookCard';
import { CATEGORIES } from '../data/initialBooks';
import { Filter, SlidersHorizontal, BookOpen } from 'lucide-react';

export const CatalogueScreen: React.FC = () => {
  const { books, language } = useLibrary();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLang, setSelectedLang] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'pages'>('newest');

  const isBn = language === 'bn';

  const filteredBooks = books.filter(book => {
    if (selectedCategory !== 'all' && book.category !== selectedCategory) return false;
    if (selectedLang !== 'all' && book.language !== selectedLang) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_low') return a.priceBdt - b.priceBdt;
    if (sortBy === 'price_high') return b.priceBdt - a.priceBdt;
    if (sortBy === 'pages') return b.totalPages - a.totalPages;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 pb-20">
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isBn ? 'ডিজিটাল বইয়ের সমাহার' : 'Public Digital Book Catalogue'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isBn
              ? `মোট ${filteredBooks.length} টি বই পাওয়া গেছে · সব বই অনলাইনে সম্পূর্ণ ফ্রি পড়া যায়`
              : `Showing ${filteredBooks.length} books · Free online reading enabled for all`}
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500">{isBn ? 'সাজান:' : 'Sort:'}</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="newest">{isBn ? 'নতুন প্রকাশিত' : 'Newest'}</option>
              <option value="price_low">{isBn ? 'কম মূল্য' : 'Price: Low to High'}</option>
              <option value="price_high">{isBn ? 'বেশি মূল্য' : 'Price: High to Low'}</option>
              <option value="pages">{isBn ? 'পৃষ্ঠা সংখ্যা' : 'Page Count'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-slate-200">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {isBn ? cat.nameBn : cat.nameEn}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto my-12">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">
            {isBn ? 'কোনো বই পাওয়া যায়নি' : 'No books found'}
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            {isBn ? 'অন্য কোনো ক্যাটাগরি বা ফিল্টার নির্বাচন করে চেষ্টা করুন।' : 'Try selecting another category or filter.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedLang('all');
            }}
            className="px-4 py-2 text-xs font-semibold bg-emerald-700 text-white rounded-xl"
          >
            {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
          </button>
        </div>
      )}
    </div>
  );
};
