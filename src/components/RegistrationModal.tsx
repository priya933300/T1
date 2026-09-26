import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Navigation, Crown, CheckCircle2, ShieldAlert, CloudUpload, X, Sparkles } from 'lucide-react';
import { UserRegistration } from '../types';
import { requestUserLocation } from '../utils/geo';
import { saveRegistration } from '../utils/storage';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: (user: UserRegistration) => void;
  initialUser?: UserRegistration | null;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialUser,
}) => {
  const [fullName, setFullName] = useState(initialUser?.fullName || '');
  const [mobile, setMobile] = useState(initialUser?.mobile || '');
  const [locationName, setLocationName] = useState(initialUser?.locationName || '');
  const [latitude, setLatitude] = useState<number | null>(initialUser?.latitude || null);
  const [longitude, setLongitude] = useState<number | null>(initialUser?.longitude || null);
  
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialUser) {
      setFullName(initialUser.fullName);
      setMobile(initialUser.mobile);
      setLocationName(initialUser.locationName);
      setLatitude(initialUser.latitude);
      setLongitude(initialUser.longitude);
      setLocationSuccess(true);
    } else {
      handleAcquireGPS();
    }
  }, [initialUser, isOpen]);

  const handleAcquireGPS = async () => {
    setIsLocating(true);
    setErrorMsg('');
    try {
      const geo = await requestUserLocation();
      setLatitude(geo.latitude);
      setLongitude(geo.longitude);
      setLocationName(geo.displayName || `${geo.suburbOrArea}, ${geo.city}`);
      setLocationSuccess(true);
    } catch (err: any) {
      console.warn('GPS location request error:', err);
      setErrorMsg('জিপিএস লোকেশন স্বয়ংক্রিয়ভাবে পাওয়া যায়নি। অনুগ্রহ করে নিচে আপনার এলাকা বা শহরের নাম লিখুন।');
      if (!locationName) {
        setLocationName('সল্টলেক, কলকাতা');
      }
    } finally {
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMsg('অনুগ্রহ করে সঠিক ১০ সংখ্যার মোবাইল নম্বর দিন।');
      return;
    }

    if (!locationName.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার বর্তমান এলাকা বা শহরের নাম লিখুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      const newUser: UserRegistration = {
        id: initialUser?.id || `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        fullName: fullName.trim(),
        mobile: cleanMobile,
        latitude: latitude,
        longitude: longitude,
        locationName: locationName.trim(),
        registeredAt: new Date().toISOString(),
        syncedToDrive: true,
      };

      await saveRegistration(newUser);
      onSuccess(newUser);
    } catch (err) {
      setErrorMsg('সংরক্ষণে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0a0a0f] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.25)]">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-amber-300/70 hover:text-amber-200 p-1.5 rounded-full hover:bg-amber-500/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header Icon & Golden Titles */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 text-black shadow-lg shadow-amber-500/30 border border-amber-200/50 mb-3">
            <Crown className="w-8 h-8 fill-black" />
          </div>
          <h2 className="text-2xl font-black text-gold-gradient tracking-tight">
            ভিআইপি মেম্বার রেজিস্ট্রেশন
          </h2>
          <p className="text-xs text-amber-200/80 mt-1 font-medium">
            আপনার ৩-৫ কিমির মধ্যে থাকা শীর্ষ স্থানীয় ভেরিফাইড প্রোফাইল দেখতে তথ্য প্রদান করুন
          </p>
        </div>

        {/* Error notification if any */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Name */}
          <div>
            <label className="block text-xs font-bold text-amber-200 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              আপনার নাম (Full Name) *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="উদাঃ অনিরুদ্ধ ব্যানার্জী / Aniruddha"
              className="w-full bg-[#111118] border border-amber-500/30 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 rounded-xl px-4 py-2.5 text-sm text-amber-100 placeholder-amber-400/30 transition-all outline-none"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-amber-200 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              মোবাইল নম্বর (WhatsApp Supported) *
            </label>
            <div className="relative flex">
              <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-amber-500/30 bg-[#151522] text-amber-300 text-xs font-bold">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full bg-[#111118] border border-amber-500/30 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 rounded-r-xl px-4 py-2.5 text-sm text-amber-100 placeholder-amber-400/30 transition-all outline-none font-mono tracking-wider"
              />
            </div>
            <p className="text-[11px] text-amber-300/60 mt-1">
              বুকিং কনফার্মেশন ও ৬-সংখ্যার টিকেট আপনার নম্বরে পাঠানো হবে
            </p>
          </div>

          {/* GPS Location Auto-Detection & Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                আপনার লাইভ GPS লোকেশন *
              </label>
              <button
                type="button"
                onClick={handleAcquireGPS}
                disabled={isLocating}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
              >
                <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'খোঁজা হচ্ছে...' : 'পুনরায় সনাক্ত করুন'}</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => {
                  setLocationName(e.target.value);
                  setLocationSuccess(true);
                }}
                placeholder="যেমন: সল্টলেক, সেক্টর ৫, কলকাতা"
                className="w-full bg-[#111118] border border-amber-500/30 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 rounded-xl px-4 py-2.5 text-sm text-amber-100 placeholder-amber-400/30 pr-10 transition-all outline-none"
              />
              <div className="absolute right-3 top-3">
                {isLocating ? (
                  <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                ) : locationSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <MapPin className="w-4 h-4 text-amber-500/40" />
                )}
              </div>
            </div>

            {latitude && longitude ? (
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3" />
                GPS লক সংগৃহীত: {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
              </p>
            ) : (
              <p className="text-[11px] text-amber-300/60 mt-1">
                আপনার এলাকার ৩ থেকে ৫ কিলোমিটারের মধ্যে প্রোফাইল ম্যাচ করা হবে
              </p>
            )}
          </div>

          {/* Google Drive Automatic Sync notice */}
          <div className="p-3 rounded-xl bg-[#101018] border border-amber-500/20 flex items-center gap-2.5 text-amber-200/80 text-xs">
            <CloudUpload className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="text-[11px] leading-relaxed">
              <span className="text-amber-100 font-bold">অটোমেটিক গুগল ড্রাইভ সিঙ্ক:</span>{' '}
              আপনার তথ্য এনক্রিপ্ট হয়ে স্বয়ংক্রিয়ভাবে সংরক্ষিত ও সিঙ্ক হবে।
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-yellow-500 active:scale-[0.98] text-black font-black text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-amber-200/50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>সংরক্ষণ ও স্যাটেলাইট ম্যাচিং হচ্ছে...</span>
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 fill-black" />
                <span>প্রোফাইল সেটআপ ও ৩-৫ কিমির মধ্যে সঙ্গী খুঁজুন</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[11px] text-amber-400/50 mt-4">
          🔒 আপনার ব্যক্তিগত তথ্য সম্পূর্ণ সুরক্ষিত ও এনক্রিপ্ট করা
        </p>
      </div>
    </div>
  );
};
