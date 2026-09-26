import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Send, 
  Download, 
  X, 
  Sparkles, 
  ExternalLink,
  MapPin,
  Phone,
  User,
  Copy,
  Check,
  Crown
} from 'lucide-react';
import { BookingOrder } from '../types';
import { formatWhatsAppMessage } from '../data/initialData';

interface TicketConfirmationModalProps {
  order: BookingOrder;
  onClose: () => void;
  onBookAnother: () => void;
}

export const TicketConfirmationModal: React.FC<TicketConfirmationModalProps> = ({
  order,
  onClose,
  onBookAnother,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F5D061', '#FFFFFF', '#B8860B', '#10B981'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  }, []);

  const whatsappMessage = formatWhatsAppMessage(
    order.ticketNumber,
    order.user.fullName,
    order.user.mobile,
    order.user.locationName,
    order.profileName,
    order.profilePhoto,
    order.amount,
    order.utrNumber
  );

  const cleanWhatsAppNumber = order.targetWhatsApp.replace(/\D/g, '');
  const formattedPhone = cleanWhatsAppNumber.startsWith('91') ? cleanWhatsAppNumber : `91${cleanWhatsAppNumber}`;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(order.ticketNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPhoto = async () => {
    try {
      const response = await fetch(order.profilePhoto);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Booking_Ticket_${order.ticketNumber}_${order.profileName}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(order.profilePhoto, '_blank');
    }
  };

  const handleSharePhoto = async () => {
    if (navigator.share) {
      try {
        const response = await fetch(order.profilePhoto);
        const blob = await response.blob();
        const file = new File([blob], `Ticket_${order.ticketNumber}.jpg`, { type: 'image/jpeg' });
        await navigator.share({
          title: `টিকেট #${order.ticketNumber} - ${order.profileName}`,
          text: `টিকেট #${order.ticketNumber} এর বুক করা ক্যান্ডিডেট: ${order.profileName}`,
          files: [file],
        });
      } catch {
        window.open(whatsappUrl, '_blank');
      }
    } else {
      window.open(whatsappUrl, '_blank');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl overflow-y-auto animate-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-lg bg-[#0a0a10] border-2 border-amber-500/50 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(212,175,55,0.3)] max-h-[94vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-300/70 hover:text-amber-200 p-1.5 rounded-full hover:bg-amber-500/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Celebration Badge */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-black border-2 border-amber-200 shadow-xl mb-3">
            <Crown className="w-9 h-9 fill-black" />
          </div>
          <h2 className="text-2xl font-black text-gold-gradient tracking-tight">
            বুকিং সফলভাবে সম্পন্ন হয়েছে!
          </h2>
          <p className="text-xs text-amber-200/80 mt-1">
            আপনার ₹৩৬৯ পেমেন্ট ভেরিফাই হয়েছে ও ৬-সংখ্যার অফিশিয়াল ভিআইপি টিকেট তৈরি হয়েছে
          </p>
        </div>

        {/* Big Highlighted 6-digit Ticket Card with Royal Gold Aesthetics */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-r from-[#181408] via-[#0d0d14] to-[#181408] border-2 border-amber-400/60 shadow-lg text-center mb-5">
          <div className="text-xs uppercase font-black tracking-widest text-amber-400 mb-1">
            অফিসিয়াল টিকিট নম্বর (VIP Ticket ID)
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl sm:text-4xl font-mono font-black text-gold-bright tracking-widest drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">
              #{order.ticketNumber}
            </span>
            <button
              onClick={handleCopyTicket}
              className="p-2 rounded-xl bg-[#141420] hover:bg-[#202030] text-amber-300 border border-amber-400/40 transition-all active:scale-90"
              title="টিকেট নম্বর কপি করুন"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-amber-300/80 mt-1 font-medium">
            (এই ৬-সংখ্যার টিকেট নম্বরটি আপনার মিটিং ও গেট কনফার্মেশন কোড)
          </p>
        </div>

        {/* Candidate Photo Showcase Card (For Admin Identification) */}
        <div className="bg-[#121018] border-2 border-amber-500/40 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row items-center gap-4 shadow-lg">
          <div className="relative w-28 h-36 rounded-xl overflow-hidden border-2 border-amber-400 shadow-md flex-shrink-0 bg-black">
            <img
              src={order.profilePhoto}
              alt={order.profileName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <span className="absolute bottom-1 right-1 bg-black/80 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-400/50">
              বুকড
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="text-[11px] uppercase tracking-wider font-extrabold text-amber-400">
              📸 বুক করা ক্যান্ডিডেটের ভেরিফাইড ছবি
            </div>
            <h4 className="text-base font-black text-gold-gradient">
              {order.profileName}
            </h4>
            <p className="text-[11px] text-amber-200/70">
              WhatsApp এ মেসেজ পাঠানোর সাথে সাথে এই ছবিটি সরাসরি অ্যাডমিন লিঙ্কে দেখা যাবে।
            </p>

            <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
              <button
                type="button"
                onClick={handleDownloadPhoto}
                className="px-3 py-1.5 rounded-lg bg-black hover:bg-[#1a1a24] text-amber-200 text-xs font-bold border border-amber-400/50 flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>ছবিটি ডাউনলোড করুন</span>
              </button>
            </div>
          </div>
        </div>

        {/* Structured Booking Receipt Summary */}
        <div className="bg-black/80 border border-amber-500/30 rounded-2xl p-4 space-y-2.5 text-xs text-amber-100/90 mb-5">
          <div className="flex justify-between items-center pb-2 border-b border-amber-500/20">
            <span className="text-amber-300/70">বুক করা সঙ্গী:</span>
            <span className="font-bold text-amber-200 flex items-center gap-2">
              <img
                src={order.profilePhoto}
                alt={order.profileName}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover border border-amber-400"
              />
              {order.profileName}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-amber-300/70 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-400" />
              গ্রাহকের নাম:
            </span>
            <span className="font-semibold text-white">{order.user.fullName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-amber-300/70 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              গ্রাহকের মোবাইল:
            </span>
            <span className="font-mono text-amber-200">+91 {order.user.mobile}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-amber-300/70 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              লাইভ লোকেশন:
            </span>
            <span className="text-white text-right max-w-[200px] truncate font-medium">
              {order.user.locationName}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-amber-300/70">পরিশোধিত টাকা:</span>
            <span className="text-gold-gradient font-black text-base">
              ₹369 (GST সহ ফিক্সড)
            </span>
          </div>

          {order.utrNumber && (
            <div className="flex justify-between items-center">
              <span className="text-amber-300/70">UTR নম্বর:</span>
              <span className="font-mono text-amber-200">{order.utrNumber}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-amber-500/20 text-[11px]">
            <span className="text-amber-400/50">তারিখ ও সময়:</span>
            <span className="text-amber-300/70">
              {new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </span>
          </div>
        </div>

        {/* WhatsApp Send Action */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98] border border-emerald-400/40"
          >
            <Send className="w-4 h-4" />
            <span>হোয়াটসঅ্যাপে বুকিং স্লিপ ও টিকেট পাঠান</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#14141e] hover:bg-[#1a1a28] text-amber-200 text-xs font-bold border border-amber-400/40 flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>রসিদ প্রিন্ট / সেভ</span>
            </button>
            <button
              onClick={onBookAnother}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black text-xs font-black flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>নতুন ৪ জন দেখুন</span>
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-black border border-amber-500/30 text-[11px] text-amber-300/70 text-center">
          হোয়াটসঅ্যাপ নম্বর <strong>+91 {order.targetWhatsApp}</strong> এ টিকেট যাওয়ার পরপরই আমাদের এক্সিকিউটিভ আপনার সাথে সরাসরি যোগাযোগ করবেন।
        </div>
      </div>
    </div>
  );
};
