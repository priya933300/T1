import React from 'react';
import { Crown, MapPin, User, Settings, Sparkles, RefreshCw } from 'lucide-react';
import { UserRegistration } from '../types';

interface HeaderProps {
  currentUser: UserRegistration | null;
  onOpenAdmin?: () => void;
  onResetSearch: () => void;
  onOpenRegistration: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenAdmin,
  onResetSearch,
  onOpenRegistration,
}) => {
  const clickTimesRef = React.useRef<number[]>([]);

  const handleLogoClick = () => {
    const now = Date.now();
    // Keep clicks within the last 1500ms
    const recentClicks = [...clickTimesRef.current.filter((t) => now - t < 1500), now];
    clickTimesRef.current = recentClicks;

    if (recentClicks.length >= 3) {
      clickTimesRef.current = [];
      if (onOpenAdmin) {
        onOpenAdmin();
      }
    } else {
      onResetSearch();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#07070b]/90 backdrop-blur-xl border-b border-amber-500/30 px-4 py-3.5 shadow-2xl shadow-black/80">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand / Logo with Royal Gold Aesthetic */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick} title="রয়্যাল সঙ্গী">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30 border border-amber-300/40 group-hover:scale-105 transition-transform duration-300">
            <Crown className="w-6 h-6 text-black fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-tight text-gold-gradient drop-shadow-md">
                রয়্যাল<span className="text-white">সঙ্গী</span>
              </span>
              <span className="bg-amber-500/10 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-400/40 tracking-wider">
                24K VIP GPS
              </span>
            </div>
            <p className="text-[11px] text-amber-200/70 font-medium">
              নিকটবর্তী ৩-৫ কিমি ভেরিফাইড প্রোফাইল ও ইনস্ট্যান্ট বুকিং
            </p>
          </div>
        </div>

        {/* User Location / Status & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <div 
              onClick={onOpenRegistration}
              className="flex items-center gap-2 bg-[#0e0e14] hover:bg-[#151520] transition-all border border-amber-500/30 px-3 py-1.5 rounded-full cursor-pointer max-w-[210px] sm:max-w-xs truncate shadow-inner"
              title="লোকেশন পরিবর্তন করুন"
            >
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0 shadow-[0_0_8px_#f59e0b]" />
              <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-xs text-amber-100 truncate font-semibold">
                {currentUser.locationName}
              </span>
              <span className="text-[11px] text-amber-300/60 hidden sm:inline">
                ({currentUser.fullName})
              </span>
            </div>
          ) : (
            <button
              onClick={onOpenRegistration}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-yellow-500 text-black text-xs font-black px-4 py-2 rounded-full shadow-lg shadow-amber-500/30 transition-all active:scale-95 border border-amber-200/50"
            >
              <User className="w-3.5 h-3.5 fill-black" />
              <span>রেজিস্ট্রেশন করুন</span>
            </button>
          )}

          {/* Quick Reshuffle Action */}
          {currentUser && (
            <button
              onClick={onResetSearch}
              title="অন্য ৪ জন সঙ্গী খুঁজুন (Shuffle)"
              className="p-2 rounded-full bg-[#0e0e14] border border-amber-500/30 text-amber-300 hover:text-amber-100 hover:border-amber-400 transition-all active:scale-90"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
