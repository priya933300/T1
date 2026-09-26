export interface GeoResult {
  latitude: number;
  longitude: number;
  displayName: string;
  suburbOrArea: string;
  city: string;
  state: string;
}

export const getBestLocationSilently = async (): Promise<GeoResult> => {
  try {
    return await requestUserLocation();
  } catch {
    return {
      latitude: 22.5726,
      longitude: 88.3639,
      displayName: 'নিকটবর্তী এলাকা (৩-৫ কিমি)',
      suburbOrArea: 'লোকাল সেন্টার',
      city: 'নিকটবর্তী এলাকা',
      state: 'পশ্চিমবঙ্গ',
    };
  }
};

export const requestUserLocation = (): Promise<GeoResult> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('আপনার ব্রাউজারে জিপিএস সুবিধা সমর্থিত নয়'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          // Attempt reverse geocode with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4500);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const suburb =
              addr.suburb ||
              addr.neighbourhood ||
              addr.residential ||
              addr.road ||
              addr.quarter ||
              '';
            const city =
              addr.city ||
              addr.town ||
              addr.state_district ||
              addr.county ||
              '';
            const state = addr.state || '';

            const localName = [suburb, city].filter(Boolean).join(', ') || data.display_name.split(',').slice(0, 2).join(', ');

            resolve({
              latitude: lat,
              longitude: lon,
              displayName: localName || `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
              suburbOrArea: suburb || 'Local Area',
              city: city || 'Local City',
              state: state || 'Bengal',
            });
            return;
          }
        } catch {
          // Graceful fallback if reverse geocode fails or is blocked
        }

        resolve({
          latitude: lat,
          longitude: lon,
          displayName: `লোকেশন জিপিএস (${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E)`,
          suburbOrArea: 'নিকটবর্তী এলাকা',
          city: 'আপনার শহর',
          state: 'পশ্চিমবঙ্গ',
        });
      },
      (err) => {
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
};
