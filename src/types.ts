export interface UserRegistration {
  id: string;
  fullName: string;
  mobile: string;
  latitude: number | null;
  longitude: number | null;
  locationName: string;
  subLocality?: string;
  city?: string;
  registeredAt: string;
  syncedToDrive: boolean;
}

export interface CompanionProfile {
  id: string;
  name: string;
  age: number; // 19 to 25
  photoUrl: string;
  bio: string;
  hobbies?: string[];
  locationName: string;
  distanceKm: number; // 3.0 to 5.0 km
  rating: number;
  reviewsCount: number;
  price: number; // 369 fixed with GST
  dailySpendingCapacity: number; // between 50,000 to 1,65,000 INR
  lifestyleQuote?: string;
  education?: string;
  tags: string[];
  languages: string[];
  verified: boolean;
  online: boolean;
  phoneOrContact?: string;
}

export interface BookingOrder {
  id: string;
  ticketNumber: string; // 6 digit code e.g. "582109"
  user: UserRegistration;
  profileId: string;
  profileName: string;
  profilePhoto: string;
  amount: number; // 369 fixed
  upiId: string;
  targetWhatsApp: string;
  paymentStatus: 'pending' | 'completed' | 'verified';
  paymentMethod?: string;
  utrNumber?: string;
  createdAt: string;
  whatsAppSent?: boolean;
}

export interface AppSettings {
  adminPin: string;
  upiId: string;
  whatsAppNumber: string;
  defaultPrice: number; // 369 fixed
  googleDriveWebhookUrl: string;
  autoSendWhatsApp: boolean;
}
