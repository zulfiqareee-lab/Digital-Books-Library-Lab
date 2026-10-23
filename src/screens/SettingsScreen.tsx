import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { fetchSystemStatus } from '../services/api';
import {
  Smartphone,
  Tablet,
  Monitor,
  Globe,
  ShieldCheck,
  CreditCard,
  Database,
  Lock,
  LogOut,
  Info
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { deviceMode, setDeviceMode, language, setLanguage, navigateTo } = useLibrary();
  const { user, isAdmin, logout } = useAuth();

  const isBn = language === 'bn';
  const [sysStatus, setSysStatus] = useState<any>(null);

  useEffect(() => {
    fetchSystemStatus().then(setSysStatus);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 pb-24 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isBn ? 'অ্যাপ্লিকেশন সেটিংস ও গেটওয়ে কনফিগারেশন' : 'Settings & Integrations'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isBn
            ? 'ডিভাইস ভিউপোর্ট, ভাষা, বিকাশ মার্চেন্ট গেটওয়ে এবং ফায়ারবেস স্ট্যাটাস'
            : 'Device viewports, language, bKash merchant gateway, and Firebase setup status'}
        </p>
      </div>

      {/* Device Viewport Mode */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-700" />
          <span>{isBn ? 'অ্যান্ড্রয়েড ডিভাইস ফ্রেম প্রিভিউ' : 'Android Device Frame Preview'}</span>
        </h2>
        <p className="text-xs text-slate-500">
          {isBn
            ? 'অ্যান্ড্রয়েড ফোন ও ট্যাবলেটের ম্যাটেরিয়াল ৩ ডিজাইন সরাসরি পরীক্ষা করার জন্য ডিভাইস মোড পরিবর্তন করুন:'
            : 'Toggle between native Android Pixel 8 phone frame, tablet, and responsive desktop layout:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setDeviceMode('phone')}
            className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              deviceMode === 'phone'
                ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Smartphone className="w-6 h-6 text-slate-700" />
              {deviceMode === 'phone' && (
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Active</span>
              )}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Pixel 8 Pro</span>
              <span className="text-[11px] text-slate-500">Android Phone View</span>
            </div>
          </button>

          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              deviceMode === 'tablet'
                ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Tablet className="w-6 h-6 text-slate-700" />
              {deviceMode === 'tablet' && (
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Active</span>
              )}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Pixel Tablet 11"</span>
              <span className="text-[11px] text-slate-500">Tablet Split Layout</span>
            </div>
          </button>

          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              deviceMode === 'desktop'
                ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Monitor className="w-6 h-6 text-slate-700" />
              {deviceMode === 'desktop' && (
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Active</span>
              )}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Responsive Desktop</span>
              <span className="text-[11px] text-slate-500">1440px Web Viewport</span>
            </div>
          </button>
        </div>
      </div>

      {/* Language Preferences */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-700" />
          <span>{isBn ? 'ভাষা নির্বাচন' : 'Language Preference'}</span>
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => setLanguage('bn')}
            className={`px-5 py-3 rounded-2xl border text-xs font-bold transition-all ${
              isBn ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs' : 'border-slate-200 text-slate-600'
            }`}
          >
            বাংলা (Bengali - Default)
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-5 py-3 rounded-2xl border text-xs font-bold transition-all ${
              !isBn ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs' : 'border-slate-200 text-slate-600'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* bKash Merchant Configuration Status */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-pink-600" />
            <span>{isBn ? 'বিকাশ মার্চেন্ট গেটওয়ে স্ট্যাটাস' : 'bKash Merchant Gateway Configuration'}</span>
          </h2>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
            sysStatus?.bkash?.isConfigured
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {sysStatus?.bkash?.isConfigured ? 'LIVE MERCHANT KEYS ACTIVE' : 'PGW SANDBOX / TESTBED MODE'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {isBn
            ? 'বিকাশের অফিশিয়াল টোকেনাইজড পেমেন্ট গেটওয়ের সাথে লাইভ সংযুক্তির জন্য সার্ভার-সাইড এনভায়রনমেন্ট ভেরিয়েবল প্রয়োজন। ক্লায়েন্টে কোনো গোপনীয় কি রাখা হয় না।'
            : 'Server-side bKash PGW API communicates with bKash MFS servers. All credentials remain safe in server environment variables.'}
        </p>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono text-[11px] space-y-1.5 text-slate-700">
          <div className="flex justify-between py-0.5">
            <span className="text-slate-500">BKASH_APP_KEY:</span>
            <span>{sysStatus?.bkash?.hasAppKey ? '•••••••••••••••• (Set)' : 'Not Set (Testbed Default)'}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-slate-500">BKASH_APP_SECRET:</span>
            <span>{sysStatus?.bkash?.hasAppSecret ? '•••••••••••••••• (Set)' : 'Not Set (Testbed Default)'}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-slate-500">BKASH_BASE_URL:</span>
            <span>https://tokenized.sandbox.bka.sh/v1.2.0-beta</span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs text-slate-500 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span>
            {isBn
              ? 'টেস্টবেড মোডে বিকাশ নম্বর (যেমন: 01712345678), ওটিপি (1234) এবং পিন (12345) দিয়ে সম্পূর্ণ বাস্তব চেকআউট ও আসল পিডিএফ ডাউনলোড সফলভাবে টেস্ট করতে পারবেন।'
              : 'In sandbox mode, use any 01XXXXXXXXX number, OTP 1234, and PIN 12345 to test end-to-end payment verification and token download delivery.'}
          </span>
        </div>
      </div>

      {/* Account Info & Logout */}
      {user && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">{isBn ? 'লগইনকৃত অ্যাকাউন্ট:' : 'Active Account:'}</span>
            <span className="text-sm font-bold text-slate-900">{user.displayName}</span>
            <span className="text-xs text-slate-500 block font-mono">{user.email}</span>
          </div>

          <button
            onClick={() => {
              logout();
              navigateTo('home');
            }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isBn ? 'লগআউট' : 'Sign Out'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
