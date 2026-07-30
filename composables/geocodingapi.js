export const location = ref(null);

const CACHE_KEY = 'geocode_cache';
const CACHE_TTL = 8 * 60 * 60 * 1000; // 8 hours

function getCachedLocation(lat, lng) {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const cache = JSON.parse(raw);
        // Round to 3 decimal places (~111m precision) for cache key matching
        const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
        const entry = cache[key];
        if (!entry) return null;
        if (Date.now() - entry.timestamp > CACHE_TTL) {
            delete cache[key];
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
            return null;
        }
        return entry.data;
    } catch {
        return null;
    }
}

function setCachedLocation(lat, lng, data) {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        const cache = raw ? JSON.parse(raw) : {};
        const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
        cache[key] = { data, timestamp: Date.now() };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {
        // localStorage full or unavailable
    }
}

let geocoderReady = null;

function loadGoogleMaps() {
    if (geocoderReady) return geocoderReady;

    geocoderReady = new Promise((resolve, reject) => {
        if (window.google?.maps?.Geocoder) {
            resolve(new window.google.maps.Geocoder());
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`;
        script.async = true;
        script.onload = () => resolve(new window.google.maps.Geocoder());
        script.onerror = () => reject(new Error('Failed to load Google Maps'));
        document.head.appendChild(script);
    });

    return geocoderReady;
}

export async function fetchCoordsLocation(latitude, longitude) {
    // Check cache first
    const cached = getCachedLocation(latitude, longitude);
    if (cached) {
        return cached;
    }

    const geocoder = await loadGoogleMaps();

    return new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === 'OK' && results?.length > 0) {
                const response = { status: 'OK', results };
                setCachedLocation(latitude, longitude, response);
                resolve(response);
            } else {
                reject(new Error(`Geocoding failed: ${status}`));
            }
        });
    });
}

export function getCurrentLocationNames(currentLocation) {
    const locality = currentLocation.filter(element => element.types.includes('locality'))[0]?.long_name ?? null
    const sublocality = currentLocation.filter(element => element.types.includes('sublocality'))[0]?.long_name ?? null
    const postal_town = currentLocation.filter(element => element.types.includes('postal_town'))[0]?.long_name ?? null
    const administrative_area_level_1 = currentLocation.filter(element => element.types.includes('administrative_area_level_1'))[0]?.long_name ?? null
    const administrative_area_level_2 = currentLocation.filter(element => element.types.includes('administrative_area_level_2'))[0]?.long_name ?? null
    const country = currentLocation.filter(element => element.types.includes('country'))[0]?.long_name ?? null

    const area = locality ?? postal_town ?? administrative_area_level_1 ?? administrative_area_level_2 ?? sublocality

    return {
        "area": area,
        "city": area,
        "country": country
    }
}
