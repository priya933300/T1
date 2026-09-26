import React, { useState, useEffect } from 'react';
import { Crown, MapPin, Sparkles, Radio, ShieldCheck } from 'lucide-react';
import { UserRegistration } from '../types';

interface SearchingRadarProps {
  user: UserRegistration;
  onComplete: () => void;
}

export const SearchingRadar: React.FC<SearchingRadarProps> = ({ user, onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { title: '🛰️ মিলিটারী গ্রেড জিপিএস স্যাটেলাইট সংযোগ স্থাপিত...', detail: 'Establishing 24K Satellite GPS Lock' },
    { title: `📍 গ্রাহকের অবস্থান লক: ${user.locationName}`, detail: 'Coordinates verified within 30m precision' },
    { title: '📡 নিকটবর্তী ৩ থেকে ৫ কিমি ব্যাসার্ধে ভেরিফাইড প্রোফাইল স্ক্যান...', detail: 'Scanning 3km - 5km local radius for verified companions' },
    { title: '💎 অভিজাত পরিবারের উচ্চশিক্ষিত ব্যক্তিত্বময়ী বায়োডাটা ফিল্টারিং...', detail: 'Matching high-lifestyle & respectful profiles' },
    { title: '✨ ৩-৫ কিমির মধ্যে ৪ জন বাঙালী সঙ্গী চূড়ান্ত করা হয়েছে!', detail: 'Finalizing 4 top verified profiles. Loading showcase...' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 800);
          return 100;
        }
        const nextVal = prev + Math.floor(Math.random() * 8) + 6;
        return nextVal > 100 ? 100 : nextVal;
      });
    }, 280);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    if (progress < 25) {
      setCurrentStepIndex(0);
    } else if (progress < 50) {
      setCurrentStepIndex(1);
    } else if (progress < 75) {
      setCurrentStepIndex(2);
    } else if (progress < 95) {
      setCurrentStepIndex(3);
    } else {
      setCurrentStepIndex(4);
    }
  }, [progress]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#09090e] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_60px_rgba(212,175,55,0.2)] text-center relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Radar Graphic with Gold Highlights */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-6 flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-amber-500/20" />
          <div className="absolute inset-6 rounded-full border border-amber-500/30" />
          <div className="absolute inset-16 rounded-full border border-amber-500/40" />
          <div className="absolute inset-28 rounded-full border border-amber-500/50" />

          {/* Crosshairs */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-[1px] bg-amber-500/20" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-[1px] bg-amber-500/20" />
          </div>

          {/* Gold Radar Sweep Animation */}
          <div
            className="absolute inset-0 rounded-full origin-center pointer-events-none animate-spin"
            style={{
              animationDuration: '2.5s',
              background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(212, 175, 55, 0.45) 360deg)',
            }}
          />

          {/* Target Blips in 3 to 5 km Range */}
          <div className="absolute top-10 right-14 flex items-center justify-center">
            <span className="w-3.5 h-3.5 bg-amber-400 rounded-full animate-ping opacity-75" />
            <span className="absolute w-2 h-2 bg-yellow-300 rounded-full" />
            <span className="absolute -top-4 -right-6 text-[10px] bg-black text-amber-300 font-mono px-1.5 py-0.5 rounded border border-amber-400/50 font-bold">
              3.2km
            </span>
          </div>

          <div className="absolute bottom-12 left-12 flex items-center justify-center">
            <span className="w-3.5 h-3.5 bg-yellow-400 rounded-full animate-ping opacity-75" />
            <span className="absolute w-2 h-2 bg-amber-300 rounded-full" />
            <span className="absolute -bottom-4 -left-6 text-[10px] bg-black text-amber-300 font-mono px-1.5 py-0.5 rounded border border-amber-400/50 font-bold">
              3.8km
            </span>
          </div>

          <div className="absolute top-20 left-12 flex items-center justify-center">
            <span className="w-3.5 h-3.5 bg-amber-300 rounded-full animate-ping opacity-75" />
            <span className="absolute w-2 h-2 bg-yellow-400 rounded-full" />
            <span className="absolute -top-4 -left-6 text-[10px] bg-black text-amber-300 font-mono px-1.5 py-0.5 rounded border border-amber-400/50 font-bold">
              4.3km
            </span>
          </div>

          <div className="absolute bottom-16 right-10 flex items-center justify-center">
            <span className="w-3.5 h-3.5 bg-yellow-300 rounded-full animate-ping opacity-75" />
            <span className="absolute w-2 h-2 bg-amber-400 rounded-full" />
            <span className="absolute -bottom-4 -right-6 text-[10px] bg-black text-amber-300 font-mono px-1.5 py-0.5 rounded border border-amber-400/50 font-bold">
              4.9km
            </span>
          </div>

          {/* Center Point - User's location */}
          <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/50 border border-amber-200">
            <Radio className="w-6 h-6 text-black animate-pulse" />
          </div>
        </div>

        {/* Heading & Live Status */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>৩ - ৫ কিমি লাইভ স্যাটেলাইট রাডার ট্র্যাকিং</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-gold-gradient">
            {steps[currentStepIndex].title}
          </h3>
          <p className="text-xs text-amber-300/60 font-mono">
            {steps[currentStepIndex].detail}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 mb-5">
          <div className="flex justify-between text-xs font-mono text-amber-300/80">
            <span>স্ক্যানিং অগ্রগতি:</span>
            <span className="text-amber-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-[#12121c] rounded-full overflow-hidden p-0.5 border border-amber-500/30">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-300 shadow-[0_0_10px_#f59e0b]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* User Summary Pill */}
        <div className="flex items-center justify-center gap-2 text-xs text-amber-200/80 bg-[#101018] py-2.5 px-4 rounded-xl border border-amber-500/20">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>টার্গেট: <strong className="text-amber-100 font-bold">{user.locationName}</strong></span>
          <span className="text-amber-500/40">|</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-bold">৩ - ৫ কিমি রেঞ্জ লকড</span>
        </div>
      </div>
    </div>
  );
};
