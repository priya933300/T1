import { CompanionProfile, UserRegistration } from '../types';

export const BENGALI_NAMES = [
  'প্রিয়াঙ্কা চ্যাটার্জী (Priyanka)',
  'শ্রেয়া সেনগুপ্ত (Shreya)',
  'অনন্যা বোস (Ananya)',
  'দেবস্মিতা ঘোষ (Debasmita)',
  'অর্পিতা মুখার্জী (Arpita)',
  'তনয়া রায় (Tanaya)',
  'কোয়েল মজুমদার (Koel)',
  'সায়ন্তিকা গাঙ্গুলী (Sayantika)',
  'রূপসা চক্রবর্তী (Rupsha)',
  'ঈশিতা বন্দ্যোপাধ্যায় (Ishita)',
  'স্বস্তিকা দত্ত (Swastika)',
  'মৌমিতা দে (Moumita)',
];

export const RESPECTFUL_BIOS = [
  'দুধে-আলতা অসম্ভব উজ্জ্বল ধবধবে ফর্সা গায়ের রঙ ও নিখুঁত লাস্যময়ী রূপ। মায়াবী ডাগর চোখ, মিষ্টি হাসিখুশি মুখশ্রী এবং পুরুষের চোখে চরম আকর্ষণীয় আধুনিক সৌন্দর্য। রুচিশীল ব্যক্তিত্ব ও একান্ত সুন্দর আনন্দময় সময় কাটানোর জন্য নির্ভরযোগ্য সঙ্গিনী।',
  'টকটকে উজ্জ্বল ফর্সা ত্বক ও আকর্ষণীয় শার্প ফিগার। ফ্যাশনেবল মডার্ন আউটফিট, মোহনীয় আবেদন ও মিষ্টি আদুরে হাসিমুখ। পুরুষের মনে দোলা দেওয়ার মতো রূপলাবণ্য এবং অমায়িক মার্জিত ব্যবহার। যেকোনো বিশেষ সান্ধ্য আড্ডা বা ডিনারে অনবদ্য সঙ্গিনী।',
  'ক্লোজ-আপে চোখ জুড়ানো নিখুঁত কাঁচা ফর্সা রূপ ও একগাল মিষ্টি হাসির তরুণী। ডাগর চোখের চাহনি আর কোঁকড়ানো চুলে অদ্ভুত মাদকতা। পুরুষের চোখে চরম আকর্ষণীয় এবং আদুরে মিষ্টি মিষ্টি কথায় মন ভরিয়ে দেওয়ার মতো মায়াবী ব্যক্তিত্ব।',
  'উজ্জ্বল ধবধবে ফর্সা বর্ণ ও অভিজাত সুন্দরী বৌদি লুক। গভীর কালো চোখের শান্ত চাহনি, চমৎকার সাজপোশাক ও আকর্ষণীয় ব্যক্তিত্ব। হাই-প্রোফাইল লাইফস্টাইল ও পরম যত্নশীল আন্তরিক কথায় একান্তে সময়কে স্বর্গীয় করে তোলে।',
  'দীপ্তিময়ী অতি ফর্সা রঙ ও শান্ত স্নিগ্ধ মাদকতাময় চাহনি। নিখুঁত বাঙালী রূপবতী ও আধুনিক স্টাইলের অপরূপ রূপসী। মনমাতানো মিষ্টি সুর ও পরম যত্নশীল সান্নিধ্যে যেকোনো ক্লান্তি নিমেষেই দূর করে দেয়।',
  'উজ্জ্বল ফর্সা বর্ণ ও হাসিখুশি মনকাড়া উচ্ছল যৌবনের প্রতীক। পুরুষের চোখে চরম আকর্ষণীয় আধুনিক সাজ ও মায়াবী দৃষ্টি। খোলামেলা প্রাণবন্ত আড্ডা ও একান্তে একান্ত বিশ্বাসের সঙ্গিনী।',
];

export const LIFESTYLE_QUOTES = [
  'লাস্যময়ী রূপ আর মিষ্টি হাসির ছোঁয়ায় প্রতিটি মুহূর্ত রঙিন ও স্মরণীয়।',
  'নিজের রূপ ও ভালোবাসায় প্রতিটি আড্ডাকে অনন্য উচ্চতায় নিয়ে যাই।',
  'সরল মিষ্টি হাসি আর মিষ্টি সান্নিধ্যেই জীবনের পরম সুখ।',
  'আভিজাত্য ও রূপের মোহনীয় স্পর্শেই নারীত্ব পরিপূর্ণ।',
  'স্নিগ্ধ ভালোবাসা ও রূপের আলো প্রতিটি মুহূর্তকে পরম আনন্দময় করে।',
  'হাসিখুশি রূপের আলোয় প্রতিটি দিনকে নতুন করে উপভোগ করাই জীবন।',
];

export const CURATED_PHOTOS = [
  '/candidates/priyanka.jpg?v=4k_real',
  '/candidates/shreya.jpg?v=4k_real',
  '/candidates/ananya.jpg?v=4k_real',
  '/candidates/debasmita.jpg?v=4k_real',
  '/candidates/arpita.jpg?v=4k_real',
  '/candidates/tanaya.jpg?v=4k_real',
];

export const generate4RandomProfilesNearby = (user: UserRegistration): CompanionProfile[] => {
  const locationParts = user.locationName.split(',');
  const mainPlace = locationParts[0]?.trim() || 'লোকাল সেন্টার';
  const city = locationParts[1]?.trim() || 'আপনার এলাকা';

  const localAreaNames = [
    `${mainPlace} রয়্যাল গ্রিন এভিনিউ`,
    `${mainPlace} লেক গার্ডেনস লেন`,
    `${mainPlace} গোল্ডেন ক্রিসেন্ট রোড`,
    `নিকটবর্তী ${city} প্রাইম স্কয়ার`,
    `${mainPlace} হেরিটেজ পার্ক বাইপাস`,
    `${mainPlace} ভিআইপি কলোনি জংশন`,
  ];

  // Pick 4 unique names and photos
  const shuffledNames = [...BENGALI_NAMES].sort(() => 0.5 - Math.random());
  const shuffledPhotos = [...CURATED_PHOTOS].sort(() => 0.5 - Math.random());
  const shuffledBios = [...RESPECTFUL_BIOS].sort(() => 0.5 - Math.random());
  const shuffledQuotes = [...LIFESTYLE_QUOTES].sort(() => 0.5 - Math.random());
  const shuffledAreas = [...localAreaNames].sort(() => 0.5 - Math.random());

  const profiles: CompanionProfile[] = [];

  for (let i = 0; i < 4; i++) {
    // Age strictly between 19 and 25
    const age = Math.floor(19 + Math.random() * 7); // 19, 20, 21, 22, 23, 24, 25

    // Distance strictly between 3.0 and 5.0 km
    const distanceKm = Number((3.0 + Math.random() * 2.0).toFixed(1));

    // Daily spending capacity on self: between 50,000 and 1,65,000 INR
    // Generate rounded in steps of 5,000
    const rawCapacity = 50000 + Math.floor(Math.random() * 24) * 5000;
    const dailySpendingCapacity = Math.min(165000, rawCapacity);

    profiles.push({
      id: `dyn-prof-${Date.now()}-${i}`,
      name: shuffledNames[i % shuffledNames.length],
      age: age,
      photoUrl: shuffledPhotos[i % shuffledPhotos.length],
      bio: shuffledBios[i % shuffledBios.length],
      lifestyleQuote: shuffledQuotes[i % shuffledQuotes.length],
      locationName: shuffledAreas[i % shuffledAreas.length],
      distanceKm: distanceKm,
      rating: Number((4.9 + Math.random() * 0.09).toFixed(2)),
      reviewsCount: 45 + Math.floor(Math.random() * 60),
      price: 369, // 369 ফিক্সড GST সহ
      dailySpendingCapacity: dailySpendingCapacity,
      tags: ['রয়েল চয়েস', 'ভেরিফাইড প্রোফাইল', 'মার্জিত ব্যক্তিত্ব', 'হাই প্রোফাইল'],
      languages: ['বাংলা', 'English', 'Hindi'],
      verified: true,
      online: true,
    });
  }

  return profiles;
};
