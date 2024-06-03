export const location = ref(null);

export function fetchCoordsLocation(latitude, longitude) {
    console.log(GOOGLE_API_KEY)

    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}&result_type=locality|country|administrative_area_level_2|postal_town`)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)
            if (data.status !== 'OK') {
                return []
            }
            return data.results[0].address_components
        })
        .catch((error) => {
            console.error('Error:', error)
            throw error
        })
}

export function getCurrentLocationNames(currentLocation) {
    console.log(currentLocation)
    const postal_town = currentLocation.filter(element => element.types.includes('postal_town'))[0]?.long_name ?? null
    const administrative_area_level_2 = currentLocation.filter(element => element.types.includes('administrative_area_level_2'))[0]?.long_name ?? null
    const country = currentLocation.filter(element => element.types.includes('country'))[0]?.long_name ?? null

    return { "area": postal_town, "city": administrative_area_level_2 ? administrative_area_level_2 : postal_town, "country": country }
}