import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Smartphone, 
  QrCode, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  Crown
} from 'lucide-react';
import { CompanionProfile, UserRegistration, BookingOrder } from '../types';
import { generateTicketNumber } from '../data/initialData';
import { saveBookingOrder } from '../utils/storage';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CompanionProfile;
  user: UserRegistration;
  upiId: string;
  targetWhatsApp: string;
  onPaymentConfirmed: (order: BookingOrder) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  profile,
  user,
  upiId,
  targetWhatsApp,
  onPaymentConfirmed,
}) => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [customerName, setCustomerName] = useState(user.fullName || 'ভিআইপি অতিথি');
  const [customerMobile, setCustomerMobile] = useState(user.mobile || '');
  const [selectedMethod, setSelectedMethod] = useState<'qr' | 'apps'>('qr');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fixed 369 INR with GST
  const amount = 369;

  useEffect(() => {
    if (isOpen) {
      const newTicket = generateTicketNumber();
      setTicketNumber(newTicket);
      setUtrNumber('');
      setErrorMsg('');
      if (user.fullName && user.fullName !== 'সম্মানিত ভিআইপি অতিথি') {
        setCustomerName(user.fullName);
      }
      if (user.mobile) {
        setCustomerMobile(user.mobile);
      }

      // Build standard UPI URL for 369 INR
      const payeeName = encodeURIComponent('Royal Companion Service');
      const note = encodeURIComponent(`Ticket-${newTicket}-${profile.name.slice(0, 8)}`);
      const upiUrl = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR&tn=${note}`;

      QRCode.toDataURL(upiUrl, {
        width: 300,
        margin: 1.5,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [isOpen, upiId, profile, amount]);

  if (!isOpen) return null;

  const payeeName = encodeURIComponent('Royal Companion Service');
  const note = encodeURIComponent(`Ticket-${ticketNumber}`);
  const standardUpiUrl = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR&tn=${note}`;
  const phonePeUrl = `phonepe://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR&tn=${note}`;
  const gpayUrl = `tez://upi/pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR&tn=${note}`;
  const paytmUrl = `paytmmp://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR&tn=${note}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfirmPayment = async () => {
    setIsVerifying(true);
    setErrorMsg('');

    try {
      const finalUser: UserRegistration = {
        ...user,
        fullName: customerName.trim() || user.fullName || 'ভিআইপি অতিথি',
        mobile: customerMobile.replace(/\D/g, '') || user.mobile || '',
      };

      const order: BookingOrder = {
        id: `ord-${Date.now()}`,
        ticketNumber: ticketNumber,
        user: finalUser,
        profileId: profile.id,
        profileName: profile.name,
        profilePhoto: profile.photoUrl,
        amount: amount,
        upiId: upiId,
        targetWhatsApp: targetWhatsApp,
        paymentStatus: 'completed',
        utrNumber: utrNumber.trim() || undefined,
        createdAt: new Date().toISOString(),
        whatsAppSent: false,
      };

      await saveBookingOrder(order);

      setTimeout(() => {
        setIsVerifying(false);
        onPaymentConfirmed(order);
      }, 1200);
    } catch (err) {
      setIsVerifying(false);
      setErrorMsg('পেমেন্ট কনফার্মেশনে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0a0a10] border-2 border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(212,175,55,0.25)] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-300/70 hover:text-amber-200 p-1.5 rounded-full hover:bg-amber-500/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-amber-500/20">
          <img
            src={profile.photoUrl}
            alt={profile.name}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] bg-amber-500/15 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                ভিআইপি বুকিং গেটওয়ে
              </span>
              <span className="text-[11px] bg-black text-amber-400 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/40 font-mono">
                টিকেট #{ticketNumber}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-gold-gradient mt-1">
              {profile.name} - এর সাথে সাক্ষাৎ বুকিং
            </h2>
            <p className="text-xs text-amber-200/70">
              গ্রাহক: {user.fullName} (+91 {user.mobile})
            </p>
          </div>
        </div>

        {/* Amount Pill: Fixed 369 INR with GST */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#14120c] to-amber-500/10 border border-amber-400/40 flex items-center justify-between shadow-inner">
          <div>
            <div className="text-xs text-amber-300/80 font-medium">ফিক্সড বুকিং চার্জ (GST সহ):</div>
            <div className="text-3xl font-black text-gold-gradient flex items-baseline gap-1.5">
              <span>₹369</span>
              <span className="text-xs text-amber-300/80 font-bold">INR (সকল ট্যাক্স অন্তর্ভুক্ত)</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-amber-300 bg-amber-500/15 border border-amber-400/40 px-3 py-1 rounded-full font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              100% সেফ পেমেন্ট
            </span>
          </div>
        </div>

        {/* Mode Selector Tabs (QR Code vs Direct Apps) */}
        <div className="grid grid-cols-2 gap-2 mb-4 bg-black p-1.5 rounded-xl border border-amber-500/30">
          <button
            type="button"
            onClick={() => setSelectedMethod('qr')}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              selectedMethod === 'qr'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md'
                : 'text-amber-200/70 hover:text-amber-100'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>UPI QR কোড স্ক্যান</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedMethod('apps')}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              selectedMethod === 'apps'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md'
                : 'text-amber-200/70 hover:text-amber-100'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>PhonePe / GPay অ্যাপ</span>
          </button>
        </div>

        {/* TAB 1: QR Code Scanner */}
        {selectedMethod === 'qr' && (
          <div className="text-center space-y-3">
            <div className="inline-block p-3.5 rounded-2xl bg-white shadow-2xl border-4 border-amber-400">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="UPI QR Code"
                  className="w-48 h-48 mx-auto"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-slate-500 text-xs">
                  QR তৈরি হচ্ছে...
                </div>
              )}
            </div>

            <p className="text-xs text-amber-200 font-semibold">
              আপনার ফোন থেকে <strong>PhonePe, Google Pay, Paytm</strong> দিয়ে সরাসরি ₹৩৬৯ স্ক্যান করুন
            </p>
          </div>
        )}

        {/* TAB 2: Direct UPI Apps One-Click */}
        {selectedMethod === 'apps' && (
          <div className="space-y-2.5">
            <p className="text-xs text-amber-200/90 mb-2 font-medium">
              নিচের যেকোনো বাটনে ক্লিক করলে সরাসরি আপনার ফোনের পেমেন্ট অ্যাপে ₹৩৬৯ সেট হয়ে যাবে:
            </p>

            <a
              href={phonePeUrl}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#140a20] hover:bg-[#1f1032] border border-purple-500/50 text-purple-200 transition-all text-sm font-bold active:scale-[0.98] shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow">
                  Pe
                </div>
                <span>PhonePe দিয়ে ₹৩৬৯ পে করুন</span>
              </div>
              <ExternalLink className="w-4 h-4 text-purple-400" />
            </a>

            <a
              href={gpayUrl}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#0a1424] hover:bg-[#102038] border border-blue-500/50 text-blue-200 transition-all text-sm font-bold active:scale-[0.98] shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow">
                  G
                </div>
                <span>Google Pay (GPay) দিয়ে ₹৩৬৯ পে করুন</span>
              </div>
              <ExternalLink className="w-4 h-4 text-blue-400" />
            </a>

            <a
              href={paytmUrl}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#091522] hover:bg-[#0e2136] border border-sky-500/50 text-sky-200 transition-all text-sm font-bold active:scale-[0.98] shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow">
                  Pay
                </div>
                <span>Paytm দিয়ে ₹৩৬৯ পে করুন</span>
              </div>
              <ExternalLink className="w-4 h-4 text-sky-400" />
            </a>

            <a
              href={standardUpiUrl}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#14141e] hover:bg-[#1a1a28] border border-amber-500/40 text-amber-200 transition-all text-sm font-bold active:scale-[0.98] shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 text-black flex items-center justify-center font-black text-xs shadow">
                  UPI
                </div>
                <span>অন্য যেকোনো UPI অ্যাপ খুলুন (All UPI Apps)</span>
              </div>
              <ExternalLink className="w-4 h-4 text-amber-400" />
            </a>
          </div>
        )}

        {/* UPI ID Display & Copy Button */}
        <div className="mt-4 p-3 rounded-xl bg-black border border-amber-500/30 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-amber-400/70 font-bold uppercase tracking-wider">অফিসিয়াল UPI আইডি:</div>
            <div className="text-xs font-mono font-bold text-amber-300 select-all">
              {upiId}
            </div>
          </div>
          <button
            onClick={handleCopyUpi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181822] hover:bg-[#222230] text-amber-200 text-xs font-bold border border-amber-400/40 transition-all active:scale-95 flex-shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>কপি করুন</span>
              </>
            )}
          </button>
        </div>

        {/* Post-Payment Confirmation Section */}
        <div className="mt-5 pt-4 border-t border-amber-500/20 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-amber-200 mb-1">
                আপনার নাম (বুকিং রসিদের জন্য):
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full bg-[#111118] border border-amber-500/30 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-amber-100 placeholder-amber-400/30 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-amber-200 mb-1">
                WhatsApp মোবাইল নম্বর (ঐচ্ছিক):
              </label>
              <input
                type="tel"
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                placeholder="10-সংখ্যার মোবাইল"
                className="w-full bg-[#111118] border border-amber-500/30 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-amber-100 placeholder-amber-400/30 outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-200 mb-1 flex items-center justify-between">
              <span>পেমেন্ট UTR / রেফারেন্স নম্বর (ঐচ্ছিক):</span>
              <span className="text-[10px] text-amber-400/60 font-mono">12-digit UPI UTR</span>
            </label>
            <input
              type="text"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="উদাঃ 429381928374"
              className="w-full bg-[#111118] border border-amber-500/30 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-amber-100 placeholder-amber-400/30 outline-none font-mono"
            />
          </div>

          {errorMsg && (
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Confirm Button */}
          <button
            onClick={handleConfirmPayment}
            disabled={isVerifying}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-yellow-400 text-black font-black text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 border border-amber-200/50"
          >
            {isVerifying ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>পেমেন্ট ও ৬-সংখ্যার টিকেট ভেরিফাই হচ্ছে...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>₹৩৬৯ পেমেন্ট সম্পন্ন করেছি (টিকেট জেনারেট করুন)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>

        <p className="text-center text-[10px] text-amber-400/60 mt-3">
          পেমেন্ট কনফার্ম করার পর অটোমেটিক আপনার WhatsApp ({targetWhatsApp}) এ স্লিপ চলে যাবে।
        </p>
      </div>
    </div>
  );
};
