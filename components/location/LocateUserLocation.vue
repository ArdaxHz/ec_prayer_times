<script setup>
import { fetchCoordsLocation, getCurrentLocationNames } from '../../composables/geocodingapi.js'
const { notify } = useNotification();

const emits = defineEmits(['location-update']);
const latitude = ref(null);
const longitude = ref(null);
const locationNames = ref({ city: null, area: null, country: null });


function getCurrentLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            latitude.value = position.coords.latitude
            longitude.value = position.coords.longitude

            console.log(latitude.value, longitude.value)

            fetchCoordsLocation(latitude.value, longitude.value)
                .then((results) => {
                    if (!results || results.length == 0 || results.status !== "OK") {
                        const errorMessage = "An error occurred while trying to fetch your location from Google Maps. Please try again later."
                        if (results) {
                            console.log(results)
                        }

                        notify({
                            title: "Google Maps API Error.",
                            text: errorMessage,
                            type: "error"
                        });
                        emitLocation()
                        return
                    }
                    const data = results.results[0]
                    if (!data) {
                        notify({
                            title: "Error, could not get location.",
                            text: "An error occurred while trying to get your location. Please try again later",
                            type: "error"
                        });
                        emitLocation()
                        return
                    }

                    const address_components = data.address_components
                    locationNames.value = getCurrentLocationNames(address_components)
                    emitLocation()
                })
                .catch((error) => {
                    console.log(error)
                    notify({
                        title: "Error, could not get location.",
                        text: error?.message || "An error occurred while trying to get your location. Please try again later",
                        type: "error"
                    });
                    emitLocation()
                })

        },
            (error) => {
                notify({
                    title: `Error getting location ${error.code}.`,
                    text: error.message,
                    type: "error"
                });
                console.log(error)
                emitLocation()
            },
            { enableHighAccuracy: true }
        )
    } else {
        emitLocation()
    }
}

function emitLocation() {
    emits('location-update', {
        latitude: latitude.value,
        longitude: longitude.value,
        location: locationNames.value
    })
}

onMounted(() => {
    getCurrentLocation()
})
</script>

<template>
    <div>
        <button @click="getCurrentLocation" class="buttons auto-locate-button">Locate</button>
    </div>
</template>
