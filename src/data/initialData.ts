import { CompanionProfile, AppSettings } from '../types';

export const DEFAULT_SETTINGS: AppSettings = {
  adminPin: '1234',
  upiId: '8902221100-2.wallet@phonepe',
  whatsAppNumber: '9518371686',
  defaultPrice: 369,
  googleDriveWebhookUrl: '',
  autoSendWhatsApp: true,
};

// Realistic Bengali Beauties: Age 19 to 25, ultra-fair skin, photorealistic 4K close-up detailing, captivating seductive charm, daily spending capacity 50k to 1.65 lac, fixed 369 INR
export const INITIAL_PROFILES: CompanionProfile[] = [
  {
    id: 'prof-1',
    name: 'প্রিয়াঙ্কা চ্যাটার্জী (Priyanka)',
    age: 22,
    photoUrl: '/candidates/priyanka.jpg?v=4k_real',
    bio: 'দুধে-আলতা অসম্ভব উজ্জ্বল ধবধবে ফর্সা গায়ের রঙ ও নিখুঁত লাস্যময়ী রূপ। মায়াবী ডাগর চোখ, মিষ্টি হাসিখুশি মুখশ্রী এবং পুরুষের চোখে চরম আকর্ষণীয় আধুনিক সৌন্দর্য। রুচিশীল ব্যক্তিত্ব ও একান্ত সুন্দর আনন্দময় সময় কাটানোর জন্য নির্ভরযোগ্য সঙ্গিনী।',
    lifestyleQuote: 'লাস্যময়ী রূপ আর মিষ্টি হাসির ছোঁয়ায় প্রতিটি মুহূর্ত রঙিন ও স্মরণীয়।',
    education: 'স্নাতকোত্তর (কমিউনিকেশন)',
    hobbies: ['লাক্সারি শপিং', 'ক্যাফে আড্ডা', 'ফাইন ডাইনিং', 'লং ড্রাইভ'],
    locationName: 'রয়্যাল গ্রিন পার্ক',
    distanceKm: 3.2,
    rating: 4.98,
    reviewsCount: 74,
    price: 369,
    dailySpendingCapacity: 95000,
    tags: ['চরম লোভনীয় সুন্দরী', 'অসম্ভব উজ্জ্বল ফর্সা', 'লাস্যময়ী বৌদি লুক', 'ভেরিফাইড ভিআইপি'],
    languages: ['বাংলা', 'English', 'Hindi'],
    verified: true,
    online: true,
  },
  {
    id: 'prof-2',
    name: 'শ্রেয়া সেনগুপ্ত (Shreya)',
    age: 24,
    photoUrl: '/candidates/shreya.jpg?v=4k_real',
    bio: 'টকটকে উজ্জ্বল ফর্সা ত্বক ও আকর্ষণীয় শার্প ফিগার। ফ্যাশনেবল মডার্ন আউটফিট, মোহনীয় আবেদন ও মিষ্টি আদুরে হাসিমুখ। পুরুষের মনে দোলা দেওয়ার মতো রূপলাবণ্য এবং অমায়িক মার্জিত ব্যবহার। যেকোনো বিশেষ সান্ধ্য আড্ডা বা ডিনারে অনবদ্য সঙ্গিনী।',
    lifestyleQuote: 'নিজের রূপ ও ভালোবাসায় প্রতিটি আড্ডাকে অনন্য উচ্চতায় নিয়ে যাই।',
    education: 'ফ্যাশন ডিজাইনিং স্নাতক',
    hobbies: ['ফ্যাশন স্টাইলিং', 'লং ড্রাইভ', 'ফাইন ডাইনিং', 'ফটোগ্রাফি'],
    locationName: 'লেসাইড বুলেভার্ড',
    distanceKm: 3.8,
    rating: 4.99,
    reviewsCount: 88,
    price: 369,
    dailySpendingCapacity: 155000,
    tags: ['সুপার গ্ল্যামারাস', 'হাই সোসাইটি লুক', 'উজ্জ্বল ফর্সা ও লাস্যময়ী', 'টপ রেটেড'],
    languages: ['বাংলা', 'English', 'Hindi'],
    verified: true,
    online: true,
  },
  {
    id: 'prof-3',
    name: 'অনন্যা বোস (Ananya)',
    age: 20,
    photoUrl: '/candidates/ananya.jpg?v=4k_real',
    bio: 'ক্লোজ-আপে চোখ জুড়ানো নিখুঁত কাঁচা ফর্সা রূপ ও একগাল মিষ্টি হাসির তরুণী। ডাগর চোখের চাহনি আর কোঁকড়ানো চুলে অদ্ভুত মাদকতা। পুরুষের চোখে চরম আকর্ষণীয় এবং আদুরে মিষ্টি মিষ্টি কথায় মন ভরিয়ে দেওয়ার মতো মায়াবী ব্যক্তিত্ব।',
    lifestyleQuote: 'সরল মিষ্টি হাসি আর মিষ্টি সান্নিধ্যেই জীবনের পরম সুখ।',
    education: 'বিবিএ ছাত্রী',
    hobbies: ['কফি ডেটিং', 'গান শোনা', 'মুভি দেখা', 'রোমান্টিক ড্রাইভ'],
    locationName: 'রয়েল প্যালেস রোড',
    distanceKm: 3.4,
    rating: 4.95,
    reviewsCount: 62,
    price: 369,
    dailySpendingCapacity: 75000,
    tags: ['মিষ্টি হাসিমুখ', 'অত্যন্ত ফর্সা রূপ', 'কিউট ও লাস্যময়ী', '১০০% বিশ্বস্ত'],
    languages: ['বাংলা', 'Hindi'],
    verified: true,
    online: true,
  },
  {
    id: 'prof-4',
    name: 'দেবস্মিতা ঘোষ (Debasmita)',
    age: 24,
    photoUrl: '/candidates/debasmita.jpg?v=4k_real',
    bio: 'উজ্জ্বল ধবধবে ফর্সা বর্ণ ও অভিজাত সুন্দরী বৌদি লুক। গভীর কালো চোখের শান্ত চাহনি, চমৎকার সাজপোশাক ও আকর্ষণীয় ব্যক্তিত্ব। হাই-প্রোফাইল লাইফস্টাইল ও পরম যত্নশীল আন্তরিক কথায় একান্তে সময়কে স্বর্গীয় করে তোলে।',
    lifestyleQuote: 'আভিজাত্য ও রূপের মোহনীয় স্পর্শেই নারীত্ব পরিপূর্ণ।',
    education: 'এম.বি.এ (মার্কেটিং)',
    hobbies: ['ক্যান্ডেল লাইট ডিনার', 'হালকা ক্লাসিক্যাল সুর', 'শপিং', 'পার্টি'],
    locationName: 'হাইপার মার্কেট জংশন',
    distanceKm: 4.2,
    rating: 4.97,
    reviewsCount: 95,
    price: 369,
    dailySpendingCapacity: 165000,
    tags: ['লাক্সারি আইকন', 'এক্সক্লুসিভ বৌদি লুক', 'ধবধবে ফর্সা', 'অফিশিয়াল স্টার'],
    languages: ['বাংলা', 'English', 'Hindi'],
    verified: true,
    online: true,
  },
  {
    id: 'prof-5',
    name: 'অর্পিতা মুখার্জী (Arpita)',
    age: 23,
    photoUrl: '/candidates/arpita.jpg?v=4k_real',
    bio: 'দীপ্তিময়ী অতি ফর্সা রঙ ও শান্ত স্নিগ্ধ মাদকতাময় চাহনি। নিখুঁত বাঙালী রূপবতী ও আধুনিক স্টাইলের অপরূপ রূপসী। মনমাতানো মিষ্টি সুর ও পরম যত্নশীল সান্নিধ্যে যেকোনো ক্লান্তি নিমেষেই দূর করে দেয়।',
    lifestyleQuote: 'স্নিগ্ধ ভালোবাসা ও রূপের আলো প্রতিটি মুহূর্তকে পরম আনন্দময় করে।',
    education: 'সাইকোলজি স্নাতক',
    hobbies: ['পিয়ানো বাজানো', 'প্রকৃতি ভ্রমণ', 'আর্ট গ্যালারি', 'রিচ ডাইনিং'],
    locationName: 'গোল্ডেন স্কয়ার লেন',
    distanceKm: 4.6,
    rating: 4.92,
    reviewsCount: 56,
    price: 369,
    dailySpendingCapacity: 120000,
    tags: ['খুবই মিষ্টি স্বভাব', 'টকটকে ফর্সা', 'ভিআইপি চয়েস', 'রেকমেন্ডেড'],
    languages: ['বাংলা', 'English'],
    verified: true,
    online: true,
  },
  {
    id: 'prof-6',
    name: 'তনয়া রায় (Tanaya)',
    age: 21,
    photoUrl: '/candidates/tanaya.jpg?v=4k_real',
    bio: 'উজ্জ্বল ফর্সা বর্ণ ও হাসিখুশি মনকাড়া উচ্ছল যৌবনের প্রতীক। পুরুষের চোখে চরম আকর্ষণীয় আধুনিক সাজ ও মায়াবী দৃষ্টি। খোলামেলা প্রাণবন্ত আড্ডা ও একান্তে একান্ত বিশ্বাসের সঙ্গিনী।',
    lifestyleQuote: 'হাসিখুশি রূপের আলোয় প্রতিটি দিনকে নতুন করে উপভোগ করাই জীবন।',
    education: 'জার্নালিজম অনার্স',
    hobbies: ['ফটোগ্রাফি', 'মিষ্টি আড্ডা', 'রোড ট্রিপ', 'লং ওয়াক'],
    locationName: 'হেরিটেজ এভিনিউ',
    distanceKm: 4.8,
    rating: 4.96,
    reviewsCount: 68,
    price: 369,
    dailySpendingCapacity: 140000,
    tags: ['গর্জিয়াস লুক', 'ইনস্ট্যান্ট মিট', 'হাই প্রোফাইল', 'ভেরিফাইড'],
    languages: ['বাংলা', 'Hindi', 'English'],
    verified: true,
    online: true,
  }
];

export const generateTicketNumber = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const formatCurrencyINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatWhatsAppMessage = (
  ticket: string,
  userName: string,
  userMobile: string,
  userLocation: string,
  profileName: string,
  profilePhotoUrl: string,
  amount: number,
  utrNumber?: string
): string => {
  const timeStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const absolutePhotoUrl = profilePhotoUrl.startsWith('http')
    ? profilePhotoUrl
    : typeof window !== 'undefined'
      ? `${window.location.origin}${profilePhotoUrl}`
      : profilePhotoUrl;

  return `🎫 *নতুন প্রিমিয়াম বুকিং ও পেমেন্ট কনফার্মেশন স্লিপ*
========================================
📍 *অফিসিয়াল টিকিট নং:* #${ticket}
👤 *গ্রাহকের নাম:* ${userName}
📱 *মোবাইল নম্বর:* +91 ${userMobile}
📌 *লাইভ জিপিএস লোকেশন:* ${userLocation}
💃 *বুক করা সুন্দরী সঙ্গী:* ${profileName}
🖼️ *ক্যান্ডিডেটের ছবি দেখতে এখানে ক্লিক করুন:*
${absolutePhotoUrl}
💰 *পরিশোধিত বুকিং চার্জ:* ₹${amount} (GST সহ ফিক্সড)
${utrNumber ? `💳 *UTR / লেনদেন আইডি:* ${utrNumber}\n` : ''}🕒 *তারিখ ও সময়:* ${timeStr}
✅ *পেমেন্ট স্ট্যাটাস:* সফলভাবে পরিশোধিত (PhonePe / GPay)
========================================
অনুরোধ: ক্যান্ডিডেটের ছবি ও টিকেট মিলিয়ে অবিলম্বে বুকিং নিশ্চিত করুন।`;
};
