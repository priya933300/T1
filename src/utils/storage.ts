import { AppSettings, BookingOrder, CompanionProfile, UserRegistration } from '../types';
import { DEFAULT_SETTINGS, INITIAL_PROFILES } from '../data/initialData';

const STORAGE_KEYS = {
  SETTINGS: 'localmatch_app_settings_v3',
  PROFILES: 'localmatch_companion_profiles_v4',
  REGISTRATIONS: 'localmatch_registrations_v1',
  BOOKINGS: 'localmatch_bookings_v1',
  CURRENT_USER: 'localmatch_current_active_user_v1',
};

export const getStoredSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const getEffectiveSettings = (): AppSettings => {
  const base = getStoredSettings();
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlUpi = params.get('upi') || params.get('u');
      const urlWa = params.get('wa') || params.get('w') || params.get('whatsapp');
      const urlPrice = params.get('price') || params.get('p');
      if (urlUpi && urlUpi.trim()) base.upiId = urlUpi.trim();
      if (urlWa && urlWa.trim()) base.whatsAppNumber = urlWa.replace(/\D/g, '');
      if (urlPrice && !isNaN(Number(urlPrice))) base.defaultPrice = Number(urlPrice);
    } catch (e) {
      console.warn('URL param parse error:', e);
    }
  }
  return base;
};

export const saveStoredSettings = (settings: AppSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

export const getStoredProfiles = (): CompanionProfile[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_PROFILES));
      return INITIAL_PROFILES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PROFILES;
  } catch {
    return INITIAL_PROFILES;
  }
};

export const saveStoredProfiles = (profiles: CompanionProfile[]): void => {
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
};

export const getStoredRegistrations = (): UserRegistration[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveRegistration = async (registration: UserRegistration): Promise<void> => {
  const current = getStoredRegistrations();
  const updated = [registration, ...current];
  localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(registration));

  // Sync to Google Drive / Webhook if configured
  const settings = getStoredSettings();
  if (settings.googleDriveWebhookUrl) {
    try {
      await fetch(settings.googleDriveWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'NEW_REGISTRATION', data: registration, timestamp: new Date().toISOString() }),
        mode: 'no-cors'
      });
    } catch (e) {
      console.warn('Webhook sync error:', e);
    }
  }
};

export const getCurrentUser = (): UserRegistration | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const getStoredBookings = (): BookingOrder[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveBookingOrder = async (order: BookingOrder): Promise<void> => {
  const current = getStoredBookings();
  const updated = [order, ...current];
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));

  const settings = getStoredSettings();
  if (settings.googleDriveWebhookUrl) {
    try {
      await fetch(settings.googleDriveWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'NEW_BOOKING_ORDER', data: order, timestamp: new Date().toISOString() }),
        mode: 'no-cors'
      });
    } catch (e) {
      console.warn('Webhook sync error:', e);
    }
  }
};

export const generateRegistrationsCSV = (): string => {
  const data = getStoredRegistrations();
  let csvContent = 'ID,Name,Mobile,Location,Latitude,Longitude,Date,DriveSync\n';
  data.forEach((r) => {
    csvContent += `"${r.id}","${r.fullName}","${r.mobile}","${r.locationName}","${r.latitude || ''}","${r.longitude || ''}","${r.registeredAt}","${r.syncedToDrive}"\n`;
  });
  return csvContent;
};

export const generateBookingsCSV = (): string => {
  const data = getStoredBookings();
  let csvContent = 'Ticket,User_Name,User_Mobile,Location,Profile,Amount,UPI_ID,UTR,Status,Date\n';
  data.forEach((b) => {
    csvContent += `"${b.ticketNumber}","${b.user.fullName}","${b.user.mobile}","${b.user.locationName}","${b.profileName}","${b.amount}","${b.upiId}","${b.utrNumber || ''}","${b.paymentStatus}","${b.createdAt}"\n`;
  });
  return csvContent;
};

export const exportDataToCSV = (type: 'registrations' | 'bookings'): void => {
  let csvContent = '';
  let filename = '';

  if (type === 'registrations') {
    csvContent = generateRegistrationsCSV();
    filename = `user_registrations_google_drive_${new Date().toISOString().slice(0, 10)}.csv`;
  } else {
    csvContent = generateBookingsCSV();
    filename = `bookings_tickets_google_drive_${new Date().toISOString().slice(0, 10)}.csv`;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
