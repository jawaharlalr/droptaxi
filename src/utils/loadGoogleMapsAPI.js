let isLoaded = false;
let loadingPromise = null;

const loadGoogleMapsAPI = (apiKeyFromArgs) => {
  const fallbackKey = 'AIzaSyAYJI22pE3K68GCQB5ue-Nam7s3FjWUTJY';

  const envKey =
    typeof process !== 'undefined' &&
    process.env &&
    (process.env.REACT_APP_GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY);

  const apiKey = apiKeyFromArgs || envKey || fallbackKey;

  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    console.error('❌ Google Maps API key is missing in .env or passed argument.');
    return Promise.reject(new Error('Google Maps API key is missing in .env'));
  }

  // Already available
  if (typeof window.google === 'object' && window.google.maps) {
    isLoaded = true;
    return Promise.resolve(window.google);
  }

  if (isLoaded) return Promise.resolve(window.google);
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    // Define global callback for async load
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

    // Prevent duplicate script tag
    const existing = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (!existing) {
      document.head.appendChild(script);
    } else {
      console.warn('⚠️ Google Maps script already present. Skipping injection.');
      // fallback: wait for window.google
      const checkLoaded = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkLoaded);
          resolve(window.google);
        }
      }, 50);
    }
  });

  return loadingPromise;
};

export default loadGoogleMapsAPI;
