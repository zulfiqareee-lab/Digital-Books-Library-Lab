import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle2, AlertCircle, ArrowLeft, Download, Receipt } from 'lucide-react';

export const PurchaseHistoryScreen: React.FC = () => {
  const { orders, books, navigateTo, language } = useLibrary();
  const { user } = useAuth();

  const isBn = language === 'bn';

  if (!user) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500 mb-4">{isBn ? 'অনুগ্রহ করে প্রথমে লগইন করুন।' : 'Please log in first.'}</p>
        <button
          onClick={() => navigateTo('login')}
          className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
        >
          {isBn ? 'লগইন' : 'Login'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-1 pb-20">
      <button
        onClick={() => navigateTo('my_library')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isBn ? 'আমার লাইব্রেরিতে ফিরুন' : 'Back to Library'}</span>
      </button>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isBn ? 'বিকাশ লেনদেন ও ক্রয় ইতিহাস' : 'bKash Purchase Orders'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isBn
            ? 'সার্ভারের মাধ্যমে বিকাশ পেমেন্ট যাচাইকৃত সকল অর্ডারের তালিকা'
            : 'All orders verified through official bKash Merchant PGW integration'}
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4 font-semibold">{isBn ? 'অর্ডার নং ও বই' : 'Order & Book'}</th>
                  <th className="px-6 py-4 font-semibold">{isBn ? 'বিকাশ TrxID' : 'bKash TrxID'}</th>
                  <th className="px-6 py-4 font-semibold">{isBn ? 'মূল্য (BDT)' : 'Amount (BDT)'}</th>
                  <th className="px-6 py-4 font-semibold">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                  <th className="px-6 py-4 font-semibold">{isBn ? 'তারিখ ও সময়' : 'Date'}</th>
                  <th className="px-6 py-4 font-semibold text-right">{isBn ? 'অ্যাকশন' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {orders.map(order => {
                  const book = books.find(b => b.id === order.bookId);
                  const isCompleted = order.status === 'COMPLETED';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm">{order.bookTitleBn}</div>
                        <div className="font-mono text-[11px] text-slate-400">{order.id}</div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-[#e2136e]">
                        {order.bkashTrxId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 text-sm tabular-nums">
                        ৳{order.amountBdt}
                      </td>
                      <td className="px-6 py-4">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{isBn ? 'সম্পন্ন (Verified)' : 'Completed'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span>{order.status}</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-[11px] font-mono">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isCompleted && book && (
                          <button
                            onClick={() => navigateTo('payment_result', { book, order })}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                          >
                            <Receipt className="w-3 h-3 text-emerald-600" />
                            <span>{isBn ? 'রশিদ / ডাউনলোড' : 'Receipt'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto my-8">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">
            {isBn ? 'কোনো পূর্ববর্তী অর্ডার পাওয়া যায়নি' : 'No previous orders found'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {isBn ? 'বিকাশের মাধ্যমে বই কিনলে এখানে তালিকা দেখা যাবে।' : 'Orders completed with bKash will appear here.'}
          </p>
        </div>
      )}
    </div>
  );
};
