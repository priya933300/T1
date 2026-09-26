import React from 'react';
import { MapPin, Sparkles, ShieldCheck, RefreshCw, Crown, Clock, Zap, Wallet } from 'lucide-react';
import { CompanionProfile, UserRegistration } from '../types';
import { ProfileCard } from './ProfileCard';

interface ProfileListProps {
  user: UserRegistration;
  profiles: CompanionProfile[];
  onBookNow: (profile: CompanionProfile) => void;
  onRefreshList: () => void;
}

export const ProfileList: React.FC<ProfileListProps> = ({
  user,
  profiles,
  onBookNow,
  onRefreshList,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {/* Top Banner / Hero Location Box with Rich Golden Dark Style */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#121008] via-[#09090f] to-[#121008] border-2 border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_40px_rgba(212,175,55,0.15)] mb-8">
        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-amber-500/15 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shadow-[0_0_8px_#f59e0b]" />
              <span>লাইভ ৩-৫ কিমি জিপিএস ট্র্যাকিং সম্পন্ন</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              আপনার এলাকার <span className="text-gold-gradient">৪ জন প্রিমিয়াম বাঙালী সঙ্গী</span>
            </h1>

            <div className="flex items-center gap-1.5 text-sm text-amber-200/90 font-medium">
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>বর্তমান লোকেশন: <strong className="text-white font-bold">{user.locationName}</strong></span>
              <span className="text-xs text-amber-400/70 font-bold bg-[#14141c] px-2 py-0.5 rounded-full border border-amber-500/30">
                ৩ থেকে ৫ কিমি ব্যাসার্ধ
              </span>
            </div>
          </div>

          {/* Quick Reshuffle Action */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={onRefreshList}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400/20 via-yellow-500/10 to-amber-600/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/50 text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span>অন্য ৪ জন সঙ্গী খুঁজুন (Shuffle)</span>
            </button>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-5 pt-5 border-t border-amber-500/20 text-xs text-amber-200/80">
          <div className="flex items-center gap-2 bg-[#0e0e16]/80 p-2.5 rounded-xl border border-amber-500/20">
            <Crown className="w-4 h-4 text-amber-400 flex-shrink-0 fill-amber-400" />
            <span>বয়স ১৯ থেকে ২৫ বছর</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0e0e16]/80 p-2.5 rounded-xl border border-amber-500/20">
            <Wallet className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>৫০ হাজার - ১.৬৫ লক্ষ খরচ ক্ষমতা</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0e0e16]/80 p-2.5 rounded-xl border border-amber-500/20">
            <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>ফিক্সড ₹৩৬৯ (GST সহ বুকিং)</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0e0e16]/80 p-2.5 rounded-xl border border-amber-500/20">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>অটো ৬-সংখ্যার টিকেট স্লিপ</span>
          </div>
        </div>
      </div>

      {/* Grid of 4 Profiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            userLocationName={user.locationName}
            onBookNow={onBookNow}
          />
        ))}
      </div>

      {/* Booking instructions / Policy Footer */}
      <div className="mt-10 p-5 rounded-2xl bg-[#090910] border border-amber-500/30 text-center max-w-2xl mx-auto space-y-2 text-xs text-amber-200/70 shadow-lg">
        <p className="text-gold-gradient font-bold text-sm">
          👑 কীভাবে বুকিং করবেন?
        </p>
        <p className="leading-relaxed">
          আপনার পছন্দের প্রোফাইলের নিচে <strong>'Book Now'</strong> বাটনে ক্লিক করুন। 
          সাথে সাথেই <strong>PhonePe / Google Pay QR Code</strong> ও ইউপিআই অ্যাপের লিংক ওপেন হবে। 
          ফিক্সড চার্জ <strong>₹৩৬৯ (GST সহ)</strong> পরিশোধ করা হলে একটি <strong>৬ সংখ্যার ইউনিক টিকেট নম্বর</strong> তৈরি হয়ে স্বয়ংক্রিয়ভাবে আমাদের অফিসিয়াল হোয়াটসঅ্যাপে যুক্ত হবে।
        </p>
      </div>
    </div>
  );
};
