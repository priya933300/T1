/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { RegistrationModal } from './components/RegistrationModal';
import { SearchingRadar } from './components/SearchingRadar';
import { ProfileList } from './components/ProfileList';
import { PaymentModal } from './components/PaymentModal';
import { TicketConfirmationModal } from './components/TicketConfirmationModal';
import { AdminPanel } from './components/AdminPanel';
import { CompanionProfile, UserRegistration, BookingOrder, AppSettings } from './types';
import { 
  getCurrentUser, 
  getStoredProfiles, 
  getStoredSettings,
  getEffectiveSettings
} from './utils/storage';
import { generate4RandomProfilesNearby } from './utils/profileGenerator';
import { getBestLocationSilently } from './utils/geo';
import { Crown, Sparkles, MapPin, ShieldCheck, ArrowRight, Wallet, Star } from 'lucide-react';
import { GoldToast, ToastData } from './components/GoldToast';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserRegistration | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [profiles, setProfiles] = useState<CompanionProfile[]>([]);
  const [matchedProfiles, setMatchedProfiles] = useState<CompanionProfile[]>([]);
  const [selectedProfileForBooking, setSelectedProfileForBooking] = useState<CompanionProfile | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<BookingOrder | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const searchParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    return searchParams.has('admin') || searchParams.has('panel') || hash === '#admin';
  });
  const [adminInitialTab, setAdminInitialTab] = useState<'profiles' | 'registrations' | 'bookings' | 'settings'>('settings');
  const [settings, setSettings] = useState<AppSettings>(getEffectiveSettings());
  const [toast, setToast] = useState<ToastData | null>(null);

  // Generate 4 randomized profiles tailored to customer's GPS within 3 to 5 km
  const get4MatchedProfiles = useCallback((user: UserRegistration, allStoredProfiles: CompanionProfile[]) => {
    // If admin added customized profiles, shuffle and use them with proper distance & spending
    if (allStoredProfiles && allStoredProfiles.length >= 4) {
      const shuffled = [...allStoredProfiles].sort(() => 0.5 - Math.random());
      const locationParts = user.locationName.split(',');
      const mainPlace = locationParts[0]?.trim() || 'লোকাল সেন্টার';

      const localAreas = [
        `${mainPlace} রয়্যাল গ্রিন লেন`,
        `${mainPlace} লেকভিউ এভিনিউ`,
        `${mainPlace} গোল্ডেন ক্রিসেন্ট`,
        `${mainPlace} হেরিটেজ পার্ক রোড`,
      ];

      return shuffled.slice(0, 4).map((p, idx) => {
        // Distance strictly between 3.0 and 5.0 km
        const distance = Number((3.0 + Math.random() * 2.0).toFixed(1));
        // Spending strictly between 50,000 and 1,65,000 INR
        const spending = p.dailySpendingCapacity || (50000 + Math.floor(Math.random() * 24) * 5000);
        // Age strictly between 19 and 25
        const age = Math.min(25, Math.max(19, p.age || 22));

        return {
          ...p,
          distanceKm: distance,
          dailySpendingCapacity: Math.min(165000, Math.max(50000, spending)),
          age: age,
          price: 369, // Fixed 369 with GST
          locationName: localAreas[idx % localAreas.length],
        };
      });
    }

    // Dynamic generator fallback
    return generate4RandomProfilesNearby(user);
  }, []);

  // Initial load - Automatic instant open in any browser with zero email or registration popups
  useEffect(() => {
    const storedProfiles = getStoredProfiles();
    const effectiveSettings = getEffectiveSettings();

    setProfiles(storedProfiles);
    setSettings(effectiveSettings);

    const existingUser = getCurrentUser();
    const activeUser: UserRegistration = existingUser || {
      id: `vip-guest-${Date.now()}`,
      fullName: 'সম্মানিত ভিআইপি অতিথি',
      mobile: '',
      locationName: 'আপনার নিকটবর্তী এলাকা (৩-৫ কিমি)',
      latitude: 22.5726,
      longitude: 88.3639,
      registeredAt: new Date().toISOString(),
      syncedToDrive: true,
    };

    setCurrentUser(activeUser);
    const matches = get4MatchedProfiles(activeUser, storedProfiles);
    setMatchedProfiles(matches);
    setIsRegisterOpen(false); // DO NOT pop up registration modal

    // Check URL parameters for admin mode and specific tab
    const handleUrlCheck = () => {
      if (typeof window === 'undefined') return;
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      const hasAdmin = searchParams.has('admin') || searchParams.has('panel') || hash === '#admin';
      setIsAdminMode(hasAdmin);

      if (hasAdmin) {
        const adminParam = searchParams.get('admin');
        const tabParam = searchParams.get('tab');
        if (adminParam === 'settings' || tabParam === 'settings') {
          setAdminInitialTab('settings');
        } else if (adminParam === 'bookings' || tabParam === 'bookings') {
          setAdminInitialTab('bookings');
        } else if (adminParam === 'registrations' || tabParam === 'registrations') {
          setAdminInitialTab('registrations');
        } else {
          setAdminInitialTab('profiles');
        }
      }
    };

    handleUrlCheck();
    window.addEventListener('popstate', handleUrlCheck);
    window.addEventListener('hashchange', handleUrlCheck);

    // Quietly detect GPS in the background if browser permits, without blocking UI
    getBestLocationSilently().then((geo) => {
      if (geo && geo.displayName && geo.displayName !== 'নিকটবর্তী এলাকা (৩-৫ কিমি)') {
        const enrichedUser: UserRegistration = {
          ...activeUser,
          locationName: geo.displayName,
          latitude: geo.latitude,
          longitude: geo.longitude,
        };
        setCurrentUser(enrichedUser);
        setMatchedProfiles(get4MatchedProfiles(enrichedUser, storedProfiles));
      }
    });

    return () => {
      window.removeEventListener('popstate', handleUrlCheck);
      window.removeEventListener('hashchange', handleUrlCheck);
    };
  }, [get4MatchedProfiles]);

  const handleCloseAdmin = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('admin');
      url.searchParams.delete('panel');
      url.searchParams.delete('tab');
      url.hash = '';
      window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
    }
    setIsAdminMode(false);
  };

  const handleOpenAdminSecret = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('admin', 'portal');
      window.history.pushState({}, '', url.toString());
    }
    setIsAdminMode(true);
  };

  // When user completes registration
  const handleRegistrationSuccess = (user: UserRegistration) => {
    setCurrentUser(user);
    setIsRegisterOpen(false);
    setIsSearching(true);
    setToast({
      id: `reg-${Date.now()}`,
      type: 'registration',
      title: 'রেজিস্ট্রেশন সফল (Success)',
      message: `স্বাগতম ${user.fullName}! আপনার নিকটবর্তী এলাকার ৪ জন ভেরিফাইড সঙ্গী স্ক্যান করা হচ্ছে।`,
    });
  };

  // When fake radar search completes
  const handleSearchComplete = () => {
    if (currentUser) {
      const matches = get4MatchedProfiles(currentUser, profiles);
      setMatchedProfiles(matches);
    }
    setIsSearching(false);
  };

  // Re-run fake search
  const handleTriggerSearchAgain = () => {
    if (!currentUser) {
      setIsRegisterOpen(true);
      return;
    }
    setIsSearching(true);
  };

  // Profiles updated from Admin Panel
  const handleProfilesUpdated = () => {
    const freshProfiles = getStoredProfiles();
    const freshSettings = getStoredSettings();
    setProfiles(freshProfiles);
    setSettings(freshSettings);

    if (currentUser) {
      const matches = get4MatchedProfiles(currentUser, freshProfiles);
      setMatchedProfiles(matches);
    }
  };

  // ----------------------------------------------------
  // DEDICATED STANDALONE ADMIN PORTAL VIEW
  // (Completely separate from the public customer portal)
  // ----------------------------------------------------
  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-[#050508] text-amber-50 selection:bg-amber-400 selection:text-black">
        <AdminPanel
          isOpen={true}
          isStandalone={true}
          onClose={handleCloseAdmin}
          onProfilesUpdated={handleProfilesUpdated}
          initialTab={adminInitialTab}
        />
        <GoldToast toast={toast} onClose={() => setToast(null)} />
      </div>
    );
  }

  // ----------------------------------------------------
  // CLEAN CUSTOMER FACING PORTAL (Zero Admin Elements)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#050508] text-amber-50 flex flex-col selection:bg-amber-400 selection:text-black">
      {/* Header with Royal Gold Theme (Secret admin access on logo triple-tap only) */}
      <Header
        currentUser={currentUser}
        onOpenAdmin={handleOpenAdminSecret}
        onResetSearch={handleTriggerSearchAgain}
        onOpenRegistration={() => setIsRegisterOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* State 1: Fake Radar Searching Animation (3 to 5 km Range) */}
        {isSearching && currentUser && (
          <SearchingRadar
            user={currentUser}
            onComplete={handleSearchComplete}
          />
        )}

        {/* State 2: Matched Profiles Showcase */}
        {!isSearching && currentUser && matchedProfiles.length > 0 && (
          <ProfileList
            user={currentUser}
            profiles={matchedProfiles}
            onBookNow={(p) => setSelectedProfileForBooking(p)}
            onRefreshList={handleTriggerSearchAgain}
          />
        )}

        {/* State 3: Welcome Hero if user visits without registration */}
        {!currentUser && !isSearching && (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-300 text-xs font-black">
              <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>১০০% লাইভ জিপিএস ট্র্যাকিং (৩ থেকে ৫ কিমি) ও ফিক্সড ₹৩৬৯ বুকিং</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              আপনার এলাকার সবচেয়ে কাছে <br />
              <span className="text-gold-gradient">
                অভিজাত বাঙালী সঙ্গীদের খুঁজুন ও বুকিং করুন
              </span>
            </h1>

            <p className="max-w-xl mx-auto text-sm sm:text-base text-amber-200/80 leading-relaxed font-normal">
              কাস্টমারের জিপিএস ট্র্যাকিং করে ৩ থেকে ৫ কিমির মধ্যে থাকা ভেরিফাইড প্রোফাইল। 
              বয়স ১৯-২৫, উচ্চ রুচিসম্মত ব্যক্তিত্ব ও দৈনিক ৫০হাজার থেকে ১.৬৫লক্ষ খরচ ক্ষমতা। 
              PhonePe / GPay দিয়ে ফিক্সড ₹৩৬৯ (GST সহ) ইনস্ট্যান্ট বুকিং।
            </p>

            <button
              onClick={() => setIsRegisterOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-yellow-400 text-black font-black text-base shadow-[0_0_35px_rgba(212,175,55,0.4)] transition-all active:scale-95 border border-amber-200/50"
            >
              <span>রেজিস্ট্রেশন করুন ও ৪ জন সঙ্গী দেখুন</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={currentUser ? () => setIsRegisterOpen(false) : undefined}
        onSuccess={handleRegistrationSuccess}
        initialUser={currentUser}
      />

      {/* Payment Gateway Modal: 369 INR Fixed with GST */}
      {selectedProfileForBooking && currentUser && (
        <PaymentModal
          isOpen={true}
          onClose={() => setSelectedProfileForBooking(null)}
          profile={selectedProfileForBooking}
          user={currentUser}
          upiId={settings.upiId}
          targetWhatsApp={settings.whatsAppNumber}
          onPaymentConfirmed={(order) => {
            setSelectedProfileForBooking(null);
            setConfirmedOrder(order);
            setToast({
              id: `book-${Date.now()}`,
              type: 'booking',
              title: 'বুকিং সফল! ৬-সংখ্যার টিকেট তৈরি হয়েছে',
              message: `অভিনন্দন! ${order.profileName}-এর জন্য আপনার বুকিং সফল হয়েছে।`,
              ticketNumber: order.ticketNumber,
            });
          }}
        />
      )}

      {/* Gold Toast Notification System */}
      <GoldToast toast={toast} onClose={() => setToast(null)} />

      {/* Ticket Confirmation & WhatsApp Forward Modal */}
      {confirmedOrder && (
        <TicketConfirmationModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
          onBookAnother={() => {
            setConfirmedOrder(null);
            handleTriggerSearchAgain();
          }}
        />
      )}

      {/* Royal Dark & Gold Customer Footer (Zero Admin Exposure) */}
      <footer className="border-t border-amber-500/20 bg-[#040407] py-6 px-4 text-center text-xs text-amber-400/60 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-4 text-amber-300/80 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            ১০০% নিরাপদ ও সম্পূর্ণ গোপনীয়
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            ৩ - ৫ কিমি লাইভ জিপিএস ট্র্যাকিং
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            ফিক্সড ₹৩৬৯ (GST সহ)
          </span>
        </div>

        <p>© {new Date().getFullYear()} Royal Companion Portal. 24K Gold VIP Edition. সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  );
}
