import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const { deviceMode } = useLibrary();

  // If in desktop or responsive mode, fit 100% of the screen seamlessly
  if (deviceMode === 'desktop') {
    return (
      <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-900 flex flex-col relative">
        {children}
      </div>
    );
  }

  const isPhone = deviceMode === 'phone';

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-950 sm:py-6 sm:px-4 flex items-center justify-center">
      {/* Device Body Container - Fits 100% on actual mobile devices, simulated bezel only on wide screens */}
      <div
        className={`relative bg-white text-slate-900 shadow-2xl flex flex-col transition-all duration-300 w-full max-w-full ${
          isPhone
            ? 'sm:max-w-[420px] sm:h-[880px] sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 sm:ring-1 sm:ring-slate-700/50 min-h-screen sm:min-h-0'
            : 'sm:max-w-[960px] sm:h-[720px] sm:rounded-[36px] sm:border-[10px] sm:border-slate-800 sm:ring-1 sm:ring-slate-700/50 min-h-screen sm:min-h-0'
        }`}
      >
        {/* Android Punch Hole Camera (Phone simulation on large screens only) */}
        {isPhone && (
          <div className="hidden sm:block absolute top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-slate-950 rounded-full z-50 ring-1 ring-slate-800" />
        )}

        {/* Android Simulated Status Bar (visible only in phone frame mode on desktop) */}
        <div className="hidden sm:flex h-7 bg-slate-900 text-slate-200 px-6 items-center justify-between text-xs font-mono shrink-0 select-none z-40">
          <span className="font-semibold text-slate-100 text-[11px]">12:30</span>
          <div className="flex items-center gap-2 text-slate-400">
            <Signal className="w-3 h-3 text-slate-200" />
            <Wifi className="w-3 h-3 text-slate-200" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] text-slate-200 font-bold">95%</span>
              <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Screen Viewport with smooth scroll and zero horizontal overflow */}
        <div className="flex-1 w-full max-w-full overflow-y-auto overflow-x-hidden flex flex-col relative bg-slate-50">
          {children}
        </div>

        {/* Android Simulated Gesture Bar */}
        <div className="hidden sm:flex h-4 bg-white shrink-0 items-center justify-center z-40 border-t border-slate-100">
          <div className="w-28 h-1 bg-slate-400 rounded-full" />
        </div>
      </div>
    </div>
  );
};
