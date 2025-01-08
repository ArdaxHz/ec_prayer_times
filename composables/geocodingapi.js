export const location = ref(null);

export function fetchCoordsLocation(latitude, longitude) {
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}&result_type=locality|sublocality|postal_code|country|administrative_area_level_1|administrative_area_level_2`)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.error('Error:', error)
            throw error
        })
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
