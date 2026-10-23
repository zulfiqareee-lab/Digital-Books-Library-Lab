import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { createBkashPayment, executeBkashPayment, fetchSystemStatus } from '../services/api';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Smartphone,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const BkashCheckoutScreen: React.FC = () => {
  const { selectedBook, navigateTo, language, setLastPaymentResult, refreshUserData } = useLibrary();
  const { user } = useAuth();

  const isBn = language === 'bn';
  const book = selectedBook;

  // Checkout Steps: 1 = Phone Number, 2 = OTP Code, 3 = PIN confirmation, 4 = Verifying
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '01712345678');
  const [otp, setOtp] = useState('1234');
  const [pin, setPin] = useState('12345');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sysStatus, setSysStatus] = useState<any>(null);

  useEffect(() => {
    fetchSystemStatus().then(setSysStatus);
  }, []);

  // Initiate Payment Session with server on mount
  useEffect(() => {
    if (!book || !user) return;

    createBkashPayment({
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName,
      bookId: book.id
    })
      .then(res => {
        setOrderId(res.orderId);
        setPaymentId(res.paymentId);
      })
      .catch(err => {
        setErrorMessage(err.message);
      });
  }, [book, user]);

  if (!book) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500 mb-4">{isBn ? 'কোনো বই নির্বাচন করা হয়নি।' : 'No book selected.'}</p>
        <button
          onClick={() => navigateTo('catalogue')}
          className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
        >
          {isBn ? 'ক্যাটালগ দেখুন' : 'Go to Catalogue'}
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <Lock className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">
          {isBn ? 'লগইন প্রয়োজন' : 'Authentication Required'}
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          {isBn
            ? 'বই ক্রয় ও ডাউনলোড করার পূর্বে আপনার অ্যাকাউন্ট দিয়ে লগইন করা আবশ্যক যাতে কেনা বইটি আপনার লাইব্রেরিতে যুক্ত হতে পারে।'
            : 'Please log in to your account before checkout so your purchased book is permanently entitled to your library.'}
        </p>
        <button
          onClick={() => navigateTo('login')}
          className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors"
        >
          {isBn ? 'এখনই লগইন করুন' : 'Log In Now'}
        </button>
      </div>
    );
  }

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length !== 11 || !clean.startsWith('01')) {
      setErrorMessage(
        isBn
          ? 'সঠিক ১১ সংখ্যার বিকাশ অ্যাকাউন্ট নম্বর লিখুন (যেমন: 01712345678)'
          : 'Please enter a valid 11-digit bKash number starting with 01'
      );
      return;
    }
    setStep(2);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!otp || otp.length < 4) {
      setErrorMessage(isBn ? 'সঠিক ওটিপি কোড প্রদান করুন।' : 'Please enter valid OTP code.');
      return;
    }
    setStep(3);
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!pin || pin.length < 5) {
      setErrorMessage(isBn ? 'সঠিক ৫ সংখ্যার বিকাশ পিন দিন।' : 'Enter 5-digit bKash PIN.');
      return;
    }

    if (!orderId || !paymentId) {
      setErrorMessage(isBn ? 'পেমেন্ট সেশন পাওয়া যায়নি।' : 'Payment session missing.');
      return;
    }

    setIsProcessing(true);
    setStep(4);

    try {
      // Execute payment on trusted backend (Never client trust!)
      const result = await executeBkashPayment({
        orderId,
        paymentId,
        customerMsisdn: phoneNumber,
        otp,
        pin,
        userId: user.uid
      });

      await refreshUserData();

      setLastPaymentResult({
        success: true,
        trxId: result.trxId,
        orderId: result.orderId,
        book,
        amount: book.priceBdt,
        message: result.message
      });

      navigateTo('payment_result', { book });
    } catch (err: any) {
      setIsProcessing(false);
      setStep(3);
      setErrorMessage(err.message || 'বিকাশ পেমেন্ট যাচাই ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 flex-1 pb-20">
      {/* Back button */}
      <button
        onClick={() => navigateTo('book_detail', { book })}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isBn ? 'বইয়ের বিবরণে ফিরুন' : 'Back to book'}</span>
      </button>

      {/* Main bKash Payment Modal Frame */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Official bKash Branded Top Bar */}
        <div className="bg-[#e2136e] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-extrabold text-[#e2136e] text-lg shadow-sm">
              ব
            </div>
            <div>
              <span className="text-[11px] font-semibold text-pink-100 uppercase tracking-wider block">
                bKash Merchant Checkout
              </span>
              <span className="text-base font-bold text-white leading-tight block">
                Digital Book Library BD
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-pink-200 block">{isBn ? 'পরিশোধের পরিমাণ' : 'Amount'}</span>
            <span className="text-xl font-bold font-mono tabular-nums text-white">
              ৳{book.priceBdt}
            </span>
          </div>
        </div>

        {/* Invoice Summary Strip */}
        <div className="bg-pink-50/60 px-5 py-3 border-b border-pink-100 flex items-center justify-between text-xs text-slate-700">
          <div>
            <span className="text-slate-600">{isBn ? 'ইনভয়েস নং:' : 'Invoice:'}</span>{' '}
            <span className="font-mono font-bold text-slate-900">{orderId || 'ORD-BKASH-INIT'}</span>
          </div>
          <div className="font-semibold text-slate-900 truncate max-w-[200px]">
            {isBn ? book.titleBn : book.titleEn}
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="m-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block mb-0.5">{isBn ? 'পেমেন্ট ত্রুটি' : 'Payment Error'}</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Multi-step Form Content */}
        <div className="p-6">
          {/* STEP 1: Phone Number Input */}
          {step === 1 && (
            <form onSubmit={handlePhoneSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isBn ? 'আপনার বিকাশ অ্যাকাউন্ট নম্বর' : 'Your bKash Account Number'}
                </label>
                <div className="relative">
                  <Smartphone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    maxLength={11}
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:border-[#e2136e] focus:ring-2 focus:ring-pink-500/20 focus:outline-hidden transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-600 mt-1.5 font-medium">
                  {isBn
                    ? '১১ সংখ্যার সচল বিকাশ ওয়ালেট নম্বর প্রদান করুন।'
                    : 'Enter 11-digit active bKash wallet number.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="rounded text-[#e2136e] focus:ring-[#e2136e] cursor-pointer"
                />
                <label htmlFor="agree" className="text-xs text-slate-600 cursor-pointer select-none">
                  {isBn
                    ? 'আমি বিকাশ মার্চেন্ট পেমেন্ট শর্তাবলীর সাথে একমত'
                    : 'I agree to the bKash terms and conditions'}
                </label>
              </div>

              <button
                type="submit"
                disabled={!agreeTerms}
                className="w-full py-3.5 bg-[#e2136e] hover:bg-[#c20f5e] disabled:opacity-40 text-white font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer"
              >
                {isBn ? 'পরবর্তী ধাপে যান' : 'Proceed to Verification'}
              </button>
            </form>
          )}

          {/* STEP 2: Verification Code (OTP) */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  {isBn ? 'যাচাইকরণ কোড (OTP) লিখুন' : 'Enter Verification Code (OTP)'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isBn
                    ? `${phoneNumber} নম্বরে ৪ সংখ্যার ওটিপি পাঠানো হয়েছে`
                    : `A 4-digit OTP was sent to ${phoneNumber}`}
                </p>
              </div>

              <div className="max-w-[240px] mx-auto">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="1234"
                  className="w-full text-center py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xl font-mono font-bold tracking-widest text-slate-900 focus:bg-white focus:border-[#e2136e] focus:ring-2 focus:ring-pink-500/20 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-600 text-center block mt-1 font-semibold">
                  (পরীক্ষামূলক ওটিপি: 1234)
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 border border-slate-200 text-slate-600 text-xs font-semibold rounded-2xl hover:bg-slate-50"
                >
                  {isBn ? 'নম্বর পরিবর্তন' : 'Change'}
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3.5 bg-[#e2136e] hover:bg-[#c20f5e] text-white font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  {isBn ? 'ওটিপি নিশ্চিত করুন' : 'Confirm OTP'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Secret PIN Input */}
          {step === 3 && (
            <form onSubmit={handlePinSubmit} className="space-y-5">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  {isBn ? 'বিকাশ গোপন পিন (PIN) প্রদান করুন' : 'Enter bKash Secret PIN'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isBn
                    ? `৳${book.priceBdt} টাকা পরিশোধ সম্পন্ন করতে পিন দিন`
                    : `Enter PIN to finalize payment of ৳${book.priceBdt}`}
                </p>
              </div>

              <div className="max-w-[240px] mx-auto relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  maxLength={5}
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="•••••"
                  className="w-full text-center py-3 pl-8 pr-4 bg-slate-50 border border-slate-300 rounded-2xl text-xl font-mono font-bold tracking-widest text-slate-900 focus:bg-white focus:border-[#e2136e] focus:ring-2 focus:ring-pink-500/20 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-600 text-center block mt-1 font-semibold">
                  (পরীক্ষামূলক পিন: 12345)
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3 border border-slate-200 text-slate-600 text-xs font-semibold rounded-2xl hover:bg-slate-50"
                >
                  {isBn ? 'পেছনে যান' : 'Back'}
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3.5 bg-[#e2136e] hover:bg-[#c20f5e] text-white font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  {isBn ? 'পেমেন্ট সম্পন্ন করুন' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Server Verification in Progress */}
          {step === 4 && (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 border-3 border-[#e2136e] border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {isBn ? 'বিকাশ লেনদেন যাচাই করা হচ্ছে...' : 'Verifying bKash Transaction...'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isBn
                    ? 'সার্ভারের মাধ্যমে অফিসিয়াল বিকাশ গেটওয়ে ভেরিফিকেশন চলছে। অপেক্ষা করুন।'
                    : 'Server is validating transaction reference and entitlement tokens.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Security & System Status Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isBn ? 'সার্ভার এনক্রিপ্টেড চেকআউট' : 'Server-side Encrypted PGW'}</span>
            </span>
            <span className="font-mono text-slate-400">SSL 256-Bit</span>
          </div>

          {/* bKash Configuration Status Strip */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-slate-700">{isBn ? 'গেটওয়ে স্ট্যাটাস:' : 'Gateway Mode:'}</span>
              <span className={sysStatus?.bkash?.isConfigured ? 'text-emerald-700' : 'text-amber-700'}>
                {sysStatus?.bkash?.merchantAccount || 'Interactive Sandbox Testbed'}
              </span>
            </div>
            <p className="text-[10px] text-slate-600 leading-normal font-medium">
              {isBn
                ? 'বিকাশের সিক্রেট কি কখনও ক্লায়েন্ট বা অ্যান্ড্রয়েডে রাখা হয় না। ব্যাকএন্ডে রিয়েল-টাইম সত্যায়ন সম্পন্ন হয়।'
                : 'Secret keys are kept strictly on the trusted backend. Payments are verified via server API.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
