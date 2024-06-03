<script setup>
import { fetchCoordsLocation, getCurrentLocationNames } from '../../composables/geocodingapi.js'

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
                .then((data) => {
                    locationNames.value = getCurrentLocationNames(data)
                    console.log(locationNames.value)
                    emitLocation()
                })
                .catch((error) => {
                    console.log(error)
                    emitLocation()
                })

        },
            (error) => {
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
