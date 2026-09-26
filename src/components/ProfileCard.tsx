import React, { useState } from 'react';
import { Star, MapPin, ShieldCheck, Heart, Sparkles, ChevronRight, Zap, Crown, Wallet } from 'lucide-react';
import { CompanionProfile } from '../types';
import { formatCurrencyINR } from '../data/initialData';

interface ProfileCardProps {
  profile: CompanionProfile;
  userLocationName: string;
  onBookNow: (profile: CompanionProfile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  userLocationName,
  onBookNow,
}) => {
  const [liked, setLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const displayPhoto = imageError
    ? `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80`
    : profile.photoUrl;

  const formattedCapacity = formatCurrencyINR(profile.dailySpendingCapacity || 85000);

  return (
    <div className="group relative bg-[#09090f] hover:bg-[#0d0d16] border-2 border-amber-500/30 hover:border-amber-400/70 rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_0_35px_rgba(212,175,55,0.3)] transition-all duration-300 flex flex-col">
      {/* Golden accent top line */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-600" />

      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
        <img
          src={displayPhoto}
          alt={profile.name}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-105"
          loading="lazy"
        />

        {/* Gradient dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090f] via-transparent to-black/40 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-amber-400/40 px-3 py-1 rounded-full text-xs font-bold text-amber-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>সক্রিয় / অনলাইন</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              liked
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg scale-110'
                : 'bg-black/60 text-amber-200 hover:text-amber-400 hover:bg-black/80'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-black' : ''}`} />
          </button>
        </div>

        {/* Distance (3 to 5 km strictly) & Rating Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-1.5">
          <div className="inline-flex items-center gap-1 bg-black/85 backdrop-blur-md border border-amber-500/40 px-2.5 py-1 rounded-full text-xs font-bold text-amber-300 shadow-lg">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{profile.distanceKm} কিমি দূরে</span>
            <span className="text-amber-400/60 font-normal">({profile.locationName})</span>
          </div>

          <div className="inline-flex items-center gap-1 bg-black/85 backdrop-blur-md border border-amber-500/40 px-2 py-1 rounded-full text-xs text-amber-300 font-extrabold shadow-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{profile.rating.toFixed(2)}</span>
            <span className="text-amber-400/60 text-[10px]">({profile.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Content Body with Golden Text and Rich Look */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5 bg-gradient-to-b from-[#09090f] to-[#06060a]">
        <div>
          {/* Bengali Name & Age (19-25) */}
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-lg font-black text-gold-gradient group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <span>{profile.name}</span>
              <span className="text-amber-400/70 text-xs font-bold">({profile.age} বছর)</span>
            </h3>

            {profile.verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-400/40 px-2.5 py-0.5 rounded-full shadow-sm">
                <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                ভেরিফাইড
              </span>
            )}
          </div>

          {/* Daily Spending Capacity on Self Badge (50,000 to 1,65,000 INR) */}
          <div className="my-2 p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-[#18150f] to-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              <span>দৈনিক নিজের খরচ ক্ষমতা:</span>
            </div>
            <div className="text-xs font-black text-amber-200 tracking-wider">
              {formattedCapacity} <span className="text-[10px] text-amber-400/60 font-normal">/দিন</span>
            </div>
          </div>

          {/* Lifestyle quote / Good Words */}
          {profile.lifestyleQuote && (
            <p className="text-[11px] italic text-amber-300/80 mb-1.5 flex items-center gap-1">
              <span>“{profile.lifestyleQuote}”</span>
            </p>
          )}

          {/* Respectful & Charming Bio (ভালো ভালো কথা) */}
          <p className="text-xs text-amber-100/90 leading-relaxed font-normal">
            {profile.bio}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {profile.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-bold bg-[#14141e] text-amber-300/90 px-2.5 py-0.5 rounded-md border border-amber-500/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Book Now Action: Fixed 369 INR with GST */}
        <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-amber-300/70 uppercase font-bold tracking-wider">বুকিং চার্জ (GST সহ)</div>
            <div className="text-xl font-black text-gold-gradient flex items-baseline gap-1">
              <span>₹369</span>
              <span className="text-[10px] text-amber-300/60 font-semibold">ফিক্সড</span>
            </div>
          </div>

          <button
            onClick={() => onBookNow(profile)}
            className="flex-1 max-w-[155px] py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-yellow-400 active:scale-95 text-black font-black text-xs shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all flex items-center justify-center gap-1.5 border border-amber-200/50"
          >
            <Zap className="w-3.5 h-3.5 fill-black text-black" />
            <span>Book Now</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
