let isLoaded = false;
let loadingPromise = null;

const loadGoogleMapsAPI = (apiKeyFromArgs) => {
  const fallbackKey = 'AIzaSyAwFp1cENKvgJCENmg9ULN5pmPDgRzUqN4';

  // Get key from env (works with both CRA and Vite)
  const envKey =
    typeof process !== 'undefined' &&
    process.env &&
    (process.env.REACT_APP_GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY);

  const apiKey = apiKeyFromArgs || envKey || fallbackKey;

  // Guard clause for missing API key
  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    console.error('❌ Google Maps API key is missing in .env or passed argument.');
    return Promise.reject(new Error('Google Maps API key is missing in .env'));
  }

  // If already loaded
  if (typeof window.google === 'object' && window.google.maps) {
    isLoaded = true;
    return Promise.resolve(window.google);
  }

  if (isLoaded) return Promise.resolve(window.google);
  if (loadingPromise) return loadingPromise;

  // If callback is already set up (retry loop)
  if (typeof window.__initGoogleMaps === 'function') {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(check);
          resolve(window.google);
        }
      }, 50);
    });
  }

  // Load Maps script
  loadingPromise = new Promise((resolve, reject) => {
    window.__initGoogleMaps = () => {
      isLoaded = true;
      resolve(window.google);
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=__initGoogleMaps&loading=async&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onerror = (err) => {
      console.error('❌ Google Maps API load failed:', err);
      reject(err);
    };

    // Prevent duplicate loading
    const existing = document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`);
    if (!existing) {
      document.head.appendChild(script);
    } else {
      console.warn('⚠️ Google Maps script already present. Skipping injection.');
    }
  });

  return loadingPromise;
};

export default loadGoogleMapsAPI;
