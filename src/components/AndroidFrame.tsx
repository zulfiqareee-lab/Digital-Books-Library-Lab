import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const { deviceMode } = useLibrary();

  if (deviceMode === 'desktop') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        {children}
      </div>
    );
  }

  const isPhone = deviceMode === 'phone';

  return (
    <div className="min-h-screen bg-slate-950 py-4 px-2 sm:px-4 flex items-center justify-center">
      {/* Device Body Container */}
      <div
        className={`relative bg-white text-slate-900 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isPhone
            ? 'w-full max-w-[420px] h-[880px] rounded-[48px] border-[10px] border-slate-800 ring-1 ring-slate-700/50'
            : 'w-full max-w-[960px] h-[720px] rounded-[36px] border-[12px] border-slate-800 ring-1 ring-slate-700/50'
        }`}
      >
        {/* Android Punch Hole Camera (Phone only) */}
        {isPhone && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-950 rounded-full z-50 ring-1 ring-slate-800" />
        )}

        {/* Android Status Bar */}
        <div className="h-8 bg-slate-900 text-slate-200 px-6 flex items-center justify-between text-xs font-mono shrink-0 select-none z-40">
          <span className="font-semibold text-slate-100">12:30</span>
          <div className="flex items-center gap-2 text-slate-400">
            <Signal className="w-3.5 h-3.5 text-slate-200" />
            <Wifi className="w-3.5 h-3.5 text-slate-200" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] text-slate-200 font-bold">94%</span>
              <BatteryMedium className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Screen Viewport with smooth scroll */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative bg-slate-50">
          {children}
        </div>

        {/* Android Gesture Bar */}
        <div className="h-5 bg-white shrink-0 flex items-center justify-center z-40 border-t border-slate-100">
          <div className="w-32 h-1 bg-slate-400 rounded-full" />
        </div>
      </div>
    </div>
  );
};
