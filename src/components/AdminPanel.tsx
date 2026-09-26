import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Download, 
  Users, 
  Image as ImageIcon, 
  Receipt, 
  Settings, 
  Lock, 
  Check, 
  Save, 
  Crown,
  Wallet,
  ExternalLink,
  Copy,
  Globe
} from 'lucide-react';
import { AppSettings, BookingOrder, CompanionProfile, UserRegistration } from '../types';
import { 
  getStoredSettings, 
  saveStoredSettings, 
  getStoredProfiles, 
  saveStoredProfiles, 
  getStoredRegistrations, 
  getStoredBookings, 
  exportDataToCSV 
} from '../utils/storage';
import { INITIAL_PROFILES, formatCurrencyINR } from '../data/initialData';
import { GoogleDriveSync } from './GoogleDriveSync';

interface AdminPanelProps {
  isOpen: boolean;
  isStandalone?: boolean;
  onClose: () => void;
  onProfilesUpdated: () => void;
  initialTab?: 'profiles' | 'registrations' | 'bookings' | 'settings';
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  isStandalone = false,
  onClose,
  onProfilesUpdated,
  initialTab = 'profiles',
}) => {
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<'profiles' | 'registrations' | 'bookings' | 'settings'>(initialTab);

  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());
  const [profiles, setProfiles] = useState<CompanionProfile[]>([]);
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [bookings, setBookings] = useState<BookingOrder[]>([]);

  // Add / Edit Profile modal state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileId, setEditProfileId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formAge, setFormAge] = useState(21);
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formQuote, setFormQuote] = useState('');
  const [formSpending, setFormSpending] = useState(85000);
  const [formLocation, setFormLocation] = useState('রয়্যাল পার্ক লেন');
  const [formDistance, setFormDistance] = useState(3.5);
  const [formPrice, setFormPrice] = useState(369);
  const [formTags, setFormTags] = useState('রয়েল চয়েস, ভেরিফাইড');
  const [formLanguages, setFormLanguages] = useState('বাংলা, English, Hindi');

  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [copiedDirect, setCopiedDirect] = useState(false);
  const [copiedCustom, setCopiedCustom] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedGoogleSiteUrl, setCopiedGoogleSiteUrl] = useState(false);
  const [copiedAdminLink, setCopiedAdminLink] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadAllData();
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      if (params) {
        const pTab = params.get('tab') || params.get('admin');
        if (pTab === 'settings' || pTab === 'bookings' || pTab === 'registrations' || pTab === 'profiles') {
          setActiveTab(pTab as any);
        } else if (initialTab) {
          setActiveTab(initialTab);
        }
        if (params.get('pin') === '1234') {
          setIsAuthenticated(true);
        }
      } else if (initialTab) {
        setActiveTab(initialTab);
      }
    }
  }, [isOpen, initialTab]);

  const handleTabSelect = (tab: 'profiles' | 'registrations' | 'bookings' | 'settings') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('admin', tab);
      window.history.replaceState(null, '', url.toString());
    }
  };

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('admin');
      url.searchParams.delete('tab');
      url.searchParams.delete('pin');
      window.history.replaceState(null, '', url.toString());
    }
    onClose();
  };

  const loadAllData = () => {
    setSettings(getStoredSettings());
    setProfiles(getStoredProfiles());
    setRegistrations(getStoredRegistrations());
    setBookings(getStoredBookings());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = getStoredSettings();
    if (pinInput === stored.adminPin || pinInput === '1234') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddProfile = () => {
    setEditProfileId(null);
    setFormName('');
    setFormAge(21);
    setFormPhotoUrl('');
    setFormBio('উচ্চশিক্ষিত ও রুচিশীল পরিবারের মেয়ে। মিষ্টি হাসি ও অমায়িক ব্যবহারের জন্য সবার অত্যন্ত প্রিয়।');
    setFormQuote('সৌন্দর্য ও সম্মান সর্বদা মার্জিত ব্যক্তিত্বে প্রকাশ পায়।');
    setFormSpending(85000);
    setFormLocation('রয়্যাল এভিনিউ');
    setFormDistance(3.5);
    setFormPrice(369);
    setFormTags('রয়েল চয়েস, ভেরিফাইড, মার্জিত');
    setFormLanguages('বাংলা, English, Hindi');
    setIsEditingProfile(true);
  };

  const handleOpenEditProfile = (profile: CompanionProfile) => {
    setEditProfileId(profile.id);
    setFormName(profile.name);
    setFormAge(profile.age);
    setFormPhotoUrl(profile.photoUrl);
    setFormBio(profile.bio);
    setFormQuote(profile.lifestyleQuote || '');
    setFormSpending(profile.dailySpendingCapacity || 85000);
    setFormLocation(profile.locationName);
    setFormDistance(profile.distanceKm);
    setFormPrice(profile.price || 369);
    setFormTags(profile.tags.join(', '));
    setFormLanguages(profile.languages.join(', '));
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhotoUrl.trim()) {
      alert('নাম এবং ছবি অবশ্যই দিতে হবে।');
      return;
    }

    const currentProfiles = getStoredProfiles();
    let updated: CompanionProfile[];

    const profileData: CompanionProfile = {
      id: editProfileId || `prof-${Date.now()}`,
      name: formName.trim(),
      age: Math.min(25, Math.max(19, Number(formAge) || 21)),
      photoUrl: formPhotoUrl.trim(),
      bio: formBio.trim() || 'উচ্চশিক্ষিত ও মার্জিত স্বভাবের মিষ্টি মেয়ে।',
      lifestyleQuote: formQuote.trim() || 'মার্জিত ব্যক্তিত্বই শ্রেষ্ঠ পরিচয়।',
      dailySpendingCapacity: Math.min(165000, Math.max(50000, Number(formSpending) || 85000)),
      locationName: formLocation.trim() || 'রয়্যাল লেন',
      distanceKm: Math.min(5.0, Math.max(3.0, Number(formDistance) || 3.5)),
      price: 369,
      rating: 4.95,
      reviewsCount: 50,
      tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
      languages: formLanguages.split(',').map((l) => l.trim()).filter(Boolean),
      verified: true,
      online: true,
    };

    if (editProfileId) {
      updated = currentProfiles.map((p) => (p.id === editProfileId ? profileData : p));
    } else {
      updated = [profileData, ...currentProfiles];
    }

    saveStoredProfiles(updated);
    setProfiles(updated);
    setIsEditingProfile(false);
    onProfilesUpdated();
    showToast('প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleDeleteProfile = (id: string) => {
    if (confirm('আপনি কি এই প্রোফাইলটি ডিলিট করতে চান?')) {
      const current = getStoredProfiles();
      const updated = current.filter((p) => p.id !== id);
      saveStoredProfiles(updated);
      setProfiles(updated);
      onProfilesUpdated();
      showToast('প্রোফাইল ডিলিট করা হয়েছে');
    }
  };

  const handleResetDefaultProfiles = () => {
    if (confirm('পূর্বনির্ধারিত সকল বাঙালী প্রোফাইল পুনরায় রিসেট করতে চান?')) {
      saveStoredProfiles(INITIAL_PROFILES);
      setProfiles(INITIAL_PROFILES);
      onProfilesUpdated();
      showToast('ডিফল্ট প্রোফাইল রিসেট সম্পন্ন হয়েছে');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSettings(settings);
    showToast('সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const showToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleCopyAdminPortalLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const adminUrl = `${origin}/?admin=portal`;
    navigator.clipboard.writeText(adminUrl);
    setCopiedAdminLink(true);
    setTimeout(() => setCopiedAdminLink(false), 2500);
  };

  if (!isOpen) return null;

  const containerClass = isStandalone
    ? 'min-h-screen bg-[#050508] text-amber-50 py-4 sm:py-6 px-3 sm:px-6 flex flex-col selection:bg-amber-400 selection:text-black'
    : 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200';

  const innerCardClass = isStandalone
    ? 'relative w-full max-w-5xl mx-auto bg-[#090910] border-2 border-amber-500/40 rounded-3xl p-4 sm:p-7 shadow-[0_0_60px_rgba(212,175,55,0.25)] flex flex-col flex-1'
    : 'relative w-full max-w-4xl bg-[#090910] border-2 border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(212,175,55,0.2)] max-h-[92vh] flex flex-col';

  return (
    <div className={containerClass}>
      <div className={innerCardClass}>
        {/* Header with Royal Gold Accent */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-black shadow-lg">
              <Crown className="w-5 h-5 fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-gold-gradient">
                  ভিআইপি এডমিন কন্ট্রোল সেন্টার
                </h2>
                <span className="text-[10px] bg-amber-500/15 text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-amber-400/40">
                  {isStandalone ? 'SEPARATE LINK' : 'MASTER 24K'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-200/70 font-medium">
                মূল পেজ থেকে সম্পূর্ণ আলাদা সিকিউর কন্ট্রোল প্যানেল
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyAdminPortalLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/40 rounded-xl text-xs font-bold transition-all"
              title="গোপনীয় এডমিন লিঙ্ক কপি করুন"
            >
              {copiedAdminLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copiedAdminLink ? 'এডমিন লিঙ্ক কপি হয়েছে!' : 'এডমিন লিঙ্ক কপি'}</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black rounded-xl text-xs font-black shadow-md transition-all active:scale-95"
              title="মূল কাস্টমার সাইটে যান"
            >
              <ExternalLink className="w-3.5 h-3.5 text-black" />
              <span>কাস্টমার সাইটে যান</span>
            </button>

            {isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  setIsAuthenticated(false);
                  setPinInput('');
                }}
                className="px-2.5 py-1.5 rounded-xl text-amber-400/80 hover:text-rose-400 hover:bg-rose-500/10 border border-amber-500/30 hover:border-rose-500/30 transition-all text-xs font-bold flex items-center gap-1"
                title="লগআউট"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">লগআউট</span>
              </button>
            )}

            {!isStandalone && (
              <button
                onClick={handleClose}
                className="text-amber-300/70 hover:text-amber-100 p-2 rounded-full hover:bg-amber-500/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* PIN Authentication Screen */}
        {!isAuthenticated ? (
          <div className="py-12 px-4 max-w-sm mx-auto text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-white">এডমিন পাসওয়ার্ড / পিন দিন</h3>
            <p className="text-xs text-amber-200/70">
              কন্ট্রোল প্যানেল অ্যাক্সেস করতে ৪ সংখ্যার পিন প্রদান করুন (ডিফল্ট: 1234)
            </p>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="পিন কোড লিখুন"
                className="w-full text-center tracking-widest text-lg bg-black border border-amber-500/40 focus:border-amber-400 rounded-xl px-4 py-2.5 text-amber-200 outline-none font-mono"
                autoFocus
              />

              {pinError && (
                <p className="text-xs text-rose-400 font-bold">
                  ভুল পিন! আবার চেষ্টা করুন (ডিফল্ট: 1234)
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-black text-sm shadow-md transition-all border border-amber-300/50"
              >
                লগইন করুন
              </button>
            </form>
          </div>
        ) : (
          /* Main Authenticated Dashboard */
          <div className="flex-1 overflow-y-auto mt-4 space-y-4">
            {/* Success Toast */}
            {saveSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-amber-500/20 pb-3">
              <button
                onClick={() => handleTabSelect('profiles')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'profiles'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-600 text-black shadow-md'
                    : 'bg-[#12121a] text-amber-200 hover:text-white border border-amber-500/20'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>প্রোফাইল ও ছবি ({profiles.length})</span>
              </button>

              <button
                onClick={() => handleTabSelect('registrations')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'registrations'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-600 text-black shadow-md'
                    : 'bg-[#12121a] text-amber-200 hover:text-white border border-amber-500/20'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>গ্রাহক তালিকা ও ড্রাইভ সিঙ্ক ({registrations.length})</span>
              </button>

              <button
                onClick={() => handleTabSelect('bookings')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'bookings'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-600 text-black shadow-md'
                    : 'bg-[#12121a] text-amber-200 hover:text-white border border-amber-500/20'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>বুকিং ও ৬-সংখ্যার টিকেট ({bookings.length})</span>
              </button>

              <button
                onClick={() => handleTabSelect('settings')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-600 text-black shadow-md ring-2 ring-amber-300'
                    : 'bg-[#1a1608] text-amber-300 hover:text-white border border-amber-500/40'
                }`}
              >
                <Settings className="w-3.5 h-3.5 text-amber-400" />
                <span>⚙️ সেটিংস ও লিঙ্ক জেনারেটর (Settings)</span>
              </button>
            </div>

            {/* TAB 1: PROFILES MANAGEMENT */}
            {activeTab === 'profiles' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-amber-200/80">
                    এখানে আপনি আপনার ইচ্ছামতো মেয়েদের ছবি আপলোড করতে পারেন, বায়োডাটা ও ৫০হাজার-১.৬৫লাখ খরচ ক্ষমতা এডিট করতে পারেন।
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleResetDefaultProfiles}
                      className="px-3 py-1.5 rounded-lg bg-[#14141e] hover:bg-[#1a1a26] text-amber-200 text-xs border border-amber-500/30"
                    >
                      ডিফল্ট প্রোফাইল রিসেট
                    </button>
                    <button
                      onClick={handleOpenAddProfile}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black text-xs font-black shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>নতুন ছবি ও প্রোফাইল ইনপুট</span>
                    </button>
                  </div>
                </div>

                {/* Profiles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {profiles.map((p) => (
                    <div
                      key={p.id}
                      className="bg-black border border-amber-500/30 rounded-2xl p-3 flex gap-3 items-center justify-between shadow-md"
                    >
                      <img
                        src={p.photoUrl}
                        alt={p.name}
                        className="w-16 h-16 rounded-xl object-cover border border-amber-400/50 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="font-bold text-amber-100 text-sm truncate">{p.name}</div>
                        <div className="text-[11px] text-amber-400 font-bold">
                          দৈনিক খরচ: {formatCurrencyINR(p.dailySpendingCapacity || 85000)}
                        </div>
                        <div className="text-[10px] text-amber-300/70 truncate">
                          {p.locationName} ({p.age} বছর, {p.distanceKm} কিমি)
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleOpenEditProfile(p)}
                          className="p-1.5 rounded-lg bg-[#161622] hover:bg-[#202030] text-amber-300 border border-amber-500/30"
                          title="এডিট করুন"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProfile(p.id)}
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-800/40"
                          title="ডিলিট করুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: USER REGISTRATIONS & GOOGLE DRIVE */}
            {activeTab === 'registrations' && (
              <div className="space-y-6">
                {/* Official Google Drive Sync & Backup Section */}
                <GoogleDriveSync onNotify={showToast} />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">গ্রাহক তালিকা ও ড্রাইভ সিঙ্ক ডাটা</h4>
                    <p className="text-xs text-amber-200/70">নাম, মোবাইল নম্বর, জিপিএস কো-অর্ডিনেট এবং লাইভ অবস্থান</p>
                  </div>
                  <button
                    onClick={() => exportDataToCSV('registrations')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold shadow transition-all border border-emerald-400/40"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>গুগল ড্রাইভ / এক্সেল CSV এক্সপোর্ট</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-amber-500/20">
                  <table className="w-full text-left text-xs text-amber-100">
                    <thead className="bg-black text-amber-400 uppercase font-bold">
                      <tr>
                        <th className="p-3">গ্রাহকের নাম</th>
                        <th className="p-3">মোবাইল নম্বর</th>
                        <th className="p-3">GPS লোকেশন ও শহর</th>
                        <th className="p-3">কো-অর্ডিনেট</th>
                        <th className="p-3">তারিখ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-500/10 bg-[#090910]">
                      {registrations.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-amber-500/50">
                            এখনো কোনো রেজিস্ট্রেশন জমা হয়নি।
                          </td>
                        </tr>
                      ) : (
                        registrations.map((reg) => (
                          <tr key={reg.id} className="hover:bg-[#12121c]">
                            <td className="p-3 font-semibold text-white">{reg.fullName}</td>
                            <td className="p-3 font-mono text-emerald-400">
                              <a href={`tel:${reg.mobile}`} className="hover:underline">
                                +91 {reg.mobile}
                              </a>
                            </td>
                            <td className="p-3">{reg.locationName}</td>
                            <td className="p-3 font-mono text-amber-400/60">
                              {reg.latitude && reg.longitude ? `${reg.latitude.toFixed(3)}, ${reg.longitude.toFixed(3)}` : 'N/A'}
                            </td>
                            <td className="p-3 text-amber-200/60">
                              {new Date(reg.registeredAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: BOOKINGS & 6-DIGIT TICKETS */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">বুকিং হিস্ট্রি ও ৬-সংখ্যার টিকেট তালিকা</h4>
                    <p className="text-xs text-amber-200/70">টিকেট আইডি, বুক করা সঙ্গী, পরিশোধিত টাকা ও UTR</p>
                  </div>
                  <button
                    onClick={() => exportDataToCSV('bookings')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold shadow transition-all border border-emerald-400/40"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>টিকেট ও বুকিং CSV এক্সপোর্ট</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-amber-500/20">
                  <table className="w-full text-left text-xs text-amber-100">
                    <thead className="bg-black text-amber-400 uppercase font-bold">
                      <tr>
                        <th className="p-3">টিকেট নং</th>
                        <th className="p-3">গ্রাহক</th>
                        <th className="p-3">বুক করা সঙ্গী</th>
                        <th className="p-3">টাকা</th>
                        <th className="p-3">UTR আইডি</th>
                        <th className="p-3">স্ট্যাটাস</th>
                        <th className="p-3">তারিখ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-500/10 bg-[#090910]">
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-amber-500/50">
                            এখনো কোনো বুকিং বা টিকিট জেনারেট হয়নি।
                          </td>
                        </tr>
                      ) : (
                        bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-[#12121c]">
                            <td className="p-3 font-mono font-black text-gold-bright">#{b.ticketNumber}</td>
                            <td className="p-3">
                              <div className="font-semibold text-white">{b.user.fullName}</div>
                              <div className="text-[11px] text-amber-400/70">+91 {b.user.mobile}</div>
                            </td>
                            <td className="p-3 font-medium text-amber-200">{b.profileName}</td>
                            <td className="p-3 font-black text-emerald-400">₹{b.amount}</td>
                            <td className="p-3 font-mono text-amber-400/70">{b.utrNumber || 'N/A'}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {b.paymentStatus.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-3 text-amber-200/60">
                              {new Date(b.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: APP & UPI SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-xl">
                <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">
                    পূর্বনির্ধারিত UPI ID (Default UPI for Payments) *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.upiId}
                    onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                    className="w-full bg-black border border-amber-500/40 focus:border-amber-400 rounded-xl px-4 py-2 text-sm text-amber-300 font-mono"
                  />
                  <p className="text-[11px] text-amber-400/70 mt-1">
                    বর্তমান আইডি: <strong>8902221100-2.wallet@phonepe</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">
                    টিকেট পাঠানোর WhatsApp নম্বর (Ticket Receiver WhatsApp) *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.whatsAppNumber}
                    onChange={(e) => setSettings({ ...settings, whatsAppNumber: e.target.value })}
                    className="w-full bg-black border border-amber-500/40 focus:border-amber-400 rounded-xl px-4 py-2 text-sm text-amber-300 font-mono"
                  />
                  <p className="text-[11px] text-amber-400/70 mt-1">
                    বর্তমান নম্বর: <strong>9518371686</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">
                    ফিক্সড বুকিং চার্জ (Fixed Booking Charge ₹ GST সহ) *
                  </label>
                  <input
                    type="number"
                    required
                    value={settings.defaultPrice}
                    onChange={(e) => setSettings({ ...settings, defaultPrice: Number(e.target.value) })}
                    className="w-full bg-black border border-amber-500/40 focus:border-amber-400 rounded-xl px-4 py-2 text-sm text-amber-300 font-bold"
                  />
                  <p className="text-[11px] text-amber-400/70 mt-1">
                    বর্তমান ফিক্সড রেট: <strong>₹369 (GST সহ)</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">
                    অ্যাডমিন পিন কোড (Admin PIN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.adminPin}
                    onChange={(e) => setSettings({ ...settings, adminPin: e.target.value })}
                    className="w-full bg-black border border-amber-500/40 focus:border-amber-400 rounded-xl px-4 py-2 text-sm text-amber-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">
                    গুগল ড্রাইভ / ক্লাউড ওয়েবহুক URL (ঐচ্ছিক):
                  </label>
                  <input
                    type="url"
                    value={settings.googleDriveWebhookUrl}
                    onChange={(e) => setSettings({ ...settings, googleDriveWebhookUrl: e.target.value })}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full bg-black border border-amber-500/40 focus:border-amber-400 rounded-xl px-4 py-2 text-xs text-amber-200 placeholder-amber-400/30"
                  />
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black font-black text-sm shadow-md transition-all flex items-center gap-2 border border-amber-300/50"
                >
                  <Save className="w-4 h-4" />
                  <span>সেটিংস সেভ করুন</span>
                </button>
              </form>

              {/* Dynamic Shareable Link Generator & Browser Compatibility */}
              <div className="mt-8 pt-6 border-t border-amber-500/30 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gold-gradient">
                      শেয়ারেবল লিঙ্ক জেনারেটর (Browser Link Share)
                    </h4>
                    <p className="text-[11px] text-amber-300/70">
                      ক্রোম, সাফারি, স্যামসাং, ভিভো, এমআই ও হোয়াটসঅ্যাপ যে কোনো ব্রাউজারে স্বয়ংক্রিয়ভাবে খুলবে
                    </p>
                  </div>
                </div>

                {/* Dedicated Secret Admin Link Card */}
                <div className="p-4 rounded-2xl bg-[#140f05] border-2 border-amber-400 shadow-[0_0_25px_rgba(212,175,55,0.2)] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-amber-400" />
                      🔐 আপনার গোপনীয় এডমিন লিঙ্ক (Secret Admin Link):
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAdminPortalLink}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow"
                    >
                      {copiedAdminLink ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-black" />}
                      <span>{copiedAdminLink ? 'এডমিন লিঙ্ক কপি হয়েছে!' : 'এডমিন লিঙ্ক কপি করুন'}</span>
                    </button>
                  </div>
                  <div className="text-xs font-mono text-amber-200 bg-black/90 p-2.5 rounded-xl truncate border border-amber-500/40 select-all">
                    {typeof window !== 'undefined' ? `${window.location.origin}/?admin=portal` : 'https://...?admin=portal'}
                  </div>
                  <p className="text-[11px] text-amber-200/90 leading-relaxed">
                    ⚠️ <strong>সতর্কতা:</strong> এই লিঙ্কটি ব্রাউজারে বুকমার্ক করে রাখুন। মূল পেজে কোনো এডমিন বাটন রাখা হয়নি, তাই কেবল এই লিঙ্ক দিয়ে সরাসরি এডমিন প্যানেলে প্রবেশ করা যাবে। সাধারণ কাস্টমারদের নিচের পাবলিক লিঙ্কটি দিন।
                  </p>
                </div>

                {/* Option A: Direct Base URL */}
                <div className="p-3.5 rounded-2xl bg-[#08080f] border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-200">
                      ১. কাস্টমারদের দেওয়ার সাধারণ মূল লিঙ্ক (Public Customer Link):
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const url = typeof window !== 'undefined' ? window.location.origin : '';
                        navigator.clipboard.writeText(url);
                        setCopiedDirect(true);
                        setTimeout(() => setCopiedDirect(false), 2000);
                      }}
                      className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      {copiedDirect ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedDirect ? 'কপি হয়েছে!' : 'কাস্টমার লিঙ্ক কপি'}</span>
                    </button>
                  </div>
                  <div className="text-[11px] font-mono text-amber-300/90 bg-black/60 p-2 rounded-lg truncate border border-amber-500/20">
                    {typeof window !== 'undefined' ? window.location.origin : 'https://...'}
                  </div>
                  <p className="text-[10px] text-amber-400/80 leading-relaxed">
                    ✅ <strong>কাস্টমারদের জন্য ১০০% ক্লিন:</strong> এই মূল লিঙ্কে কোনো এডমিন বাটন বা সেটিংস থাকে না। আপনি যতবারই WhatsApp নম্বর বা UPI ID বদল করবেন, এই মূল লিঙ্কে ভিজিট করা সকল কাস্টমার স্বয়ংক্রিয়ভাবে আপনার সর্বশেষ সংরক্ষিত তথ্য দেখতে পাবে।
                  </p>
                </div>

                {/* Option B: Custom Parameter URL with explicit wa & upi */}
                <div className="p-3.5 rounded-2xl bg-[#08080f] border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-200">
                      ২. ডায়নামিক কাস্টম লিঙ্ক (নির্দিষ্ট WhatsApp ও UPI সহ):
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
                        const customUrl = `${baseUrl}/?wa=${settings.whatsAppNumber}&upi=${encodeURIComponent(settings.upiId)}`;
                        navigator.clipboard.writeText(customUrl);
                        setCopiedCustom(true);
                        setTimeout(() => setCopiedCustom(false), 2000);
                      }}
                      className="px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow"
                    >
                      {copiedCustom ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-black" />}
                      <span>{copiedCustom ? 'কপি হয়েছে!' : 'কাস্টম লিঙ্ক কপি করুন'}</span>
                    </button>
                  </div>
                  <div className="text-[11px] font-mono text-amber-300/90 bg-black/60 p-2 rounded-lg truncate border border-amber-500/20">
                    {typeof window !== 'undefined' ? `${window.location.origin}/?wa=${settings.whatsAppNumber}&upi=${encodeURIComponent(settings.upiId)}` : 'https://...?wa=...&upi=...'}
                  </div>
                  <p className="text-[10px] text-amber-400/80 leading-relaxed">
                    🎯 আপনি চাইলে যেকোনো সময় নতুন WhatsApp নম্বর ও UPI দিয়ে নতুন লিঙ্ক জেনারেট করে কাস্টমারকে পাঠাতে পারেন। লিঙ্ক ওপেন করলেই সাথে সাথে সেই WhatsApp ও UPI প্রযোজ্য হবে।
                  </p>
                </div>

                {/* Option C: Google Sites (sites.google.com) Embed & Friendly Link */}
                <div className="p-3.5 rounded-2xl bg-[#08080f] border border-blue-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      ৩. Google Sites (sites.google.com) লিঙ্ক ও এম্বেড সুবিধা:
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const origin = typeof window !== 'undefined' ? window.location.origin : '';
                          const iframeCode = `<iframe src="${origin}" style="width:100%;height:100vh;border:none;min-height:850px;" allow="geolocation *; clipboard-write *" allowfullscreen></iframe>`;
                          navigator.clipboard.writeText(iframeCode);
                          setCopiedEmbed(true);
                          setTimeout(() => setCopiedEmbed(false), 2000);
                        }}
                        className="px-2.5 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/40 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        {copiedEmbed ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedEmbed ? 'কপি হয়েছে!' : 'Embed কোড কপি'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-amber-100/90 leading-relaxed">
                    🌐 <strong>Google Sites ব্যবহারের সহজ উপায়:</strong> আপনি <strong>sites.google.com</strong>-এ একটি ফ্রি পেজ তৈরি করে এই অ্যাপটি এম্বেড করে দিলে গ্রাহকদের কাছে একটি অফিসিয়াল গুগল লিঙ্ক যাবে, যা হোয়াটসঅ্যাপ বা যেকোনো সোশ্যাল মিডিয়ায় ব্লক হবে না এবং ক্রোম/সাফারি সহ সকল ব্রাউজারে নিমিষে ওপেন হবে।
                  </p>

                  <div className="bg-black/70 p-2.5 rounded-xl border border-blue-500/25 space-y-1.5 text-[11px]">
                    <div className="text-amber-300 font-bold">সহজ ৪টি ধাপ:</div>
                    <ol className="list-decimal list-inside space-y-1 text-amber-200/80 text-[10px]">
                      <li><a href="https://sites.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-bold">sites.google.com</a> খুলে একটি নতুন Blank সাইট তৈরি করুন।</li>
                      <li>ডানপাশের মেনু থেকে <strong>"Embed" (এম্বেড)</strong> বাটনে চাপ দিন।</li>
                      <li><strong>"Embed code"</strong> ট্যাবে গিয়ে উপরের <span className="text-blue-300 font-mono font-bold">'Embed কোড কপি'</span> বাটনের কোডটি পেস্ট করুন।</li>
                      <li>উপরে <strong>"Publish"</strong> বাটনে চাপ দিয়ে আপনার কাঙ্ক্ষিত নাম দিন (যেমন: royal-booking)। এরপর ওই গুগল সাইটের লিঙ্ক সকলকে শেয়ার করুন!</li>
                    </ol>
                  </div>
                </div>

                {/* Google Drive Integration in Settings */}
                <div className="pt-2">
                  <GoogleDriveSync onNotify={showToast} />
                </div>
              </div>
            </div>
            )}
          </div>
        )}

        {/* SUB-MODAL: Add / Edit Profile Form with Photo Upload and 50k-1.65L Capacity */}
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-lg bg-[#0a0a12] border-2 border-amber-400/50 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-amber-500/20">
                <h3 className="text-base font-black text-gold-gradient">
                  {editProfileId ? 'প্রোফাইল এডিট করুন' : 'নতুন বাঙালী মেয়ের ছবি ও প্রোফাইল ইনপুট দিন'}
                </h3>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="text-amber-300/70 hover:text-white p-1 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                {/* Image Upload / Preview */}
                <div>
                  <label className="block font-bold text-amber-200 mb-1.5">
                    মেয়ের ছবি (Upload Photo from Device or Enter URL) *
                  </label>

                  <div className="flex gap-3 items-center">
                    {formPhotoUrl ? (
                      <img
                        src={formPhotoUrl}
                        alt="Preview"
                        className="w-20 h-24 object-cover rounded-xl border-2 border-amber-400"
                      />
                    ) : (
                      <div className="w-20 h-24 rounded-xl border-2 border-dashed border-amber-500/30 flex items-center justify-center text-amber-500/40">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}

                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 px-3 rounded-xl bg-[#141420] hover:bg-[#1c1c2c] text-amber-200 border border-amber-400/40 font-bold flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>ডিভাইস থেকে ছবি আপলোড করুন</span>
                      </button>

                      <input
                        type="url"
                        value={formPhotoUrl}
                        onChange={(e) => setFormPhotoUrl(e.target.value)}
                        placeholder="বা ছবির সরাসরি ওয়েব লিঙ্ক দিন (URL)"
                        className="w-full bg-black border border-amber-500/30 rounded-xl px-3 py-1.5 text-amber-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-amber-200 mb-1">বাঙালী মেয়ের নাম (Name) *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="উদাঃ প্রিয়াঙ্কা চ্যাটার্জী"
                      className="w-full bg-black border border-amber-500/30 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-amber-200 mb-1">বয়স (১৯ থেকে ২৫ এর মধ্যে) *</label>
                    <input
                      type="number"
                      required
                      min={19}
                      max={25}
                      value={formAge}
                      onChange={(e) => setFormAge(Number(e.target.value))}
                      className="w-full bg-black border border-amber-500/30 rounded-xl px-3 py-2 text-amber-200 font-bold"
                    />
                  </div>
                </div>

                {/* Spending Capacity 50k - 1.65L */}
                <div>
                  <label className="block font-bold text-amber-200 mb-1 flex items-center justify-between">
                    <span>দৈনিক নিজের উপর খরচ করার ক্ষমতা (₹৫০,০০০ থেকে ₹১,৬৫,০০০):</span>
                    <span className="text-amber-400 font-mono font-bold">{formatCurrencyINR(formSpending)}</span>
                  </label>
                  <input
                    type="range"
                    min={50000}
                    max={165000}
                    step={5000}
                    value={formSpending}
                    onChange={(e) => setFormSpending(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-amber-200 mb-1">ভালো ভালো কথা / বায়োডাটা (Bio) *</label>
                  <textarea
                    rows={2}
                    value={formBio}
                    onChange={(e) => setFormBio(e.target.value)}
                    placeholder="উচ্চশিক্ষিত ও মার্জিত স্বভাবের মিষ্টি মেয়ে..."
                    className="w-full bg-black border border-amber-500/30 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-amber-200 mb-1">কাছাকাছি এলাকা (Area Tag)</label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="উদাঃ রয়্যাল পার্ক লেন"
                      className="w-full bg-black border border-amber-500/30 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-amber-200 mb-1">দূরত্ব (৩.০ থেকে ৫.০ কিমি)</label>
                    <input
                      type="number"
                      step={0.1}
                      min={3.0}
                      max={5.0}
                      value={formDistance}
                      onChange={(e) => setFormDistance(Number(e.target.value))}
                      className="w-full bg-black border border-amber-500/30 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-amber-200 mb-1">ট্যাগস (কমা দিয়ে আলাদা করুন)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="রয়েল চয়েস, ভেরিফাইড প্রোফাইল, মার্জিত"
                    className="w-full bg-black border border-amber-500/30 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 rounded-xl bg-[#141420] text-amber-200 font-bold"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-black shadow-md border border-amber-300/50"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
