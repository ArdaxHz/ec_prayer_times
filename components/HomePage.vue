<script setup>
import moment from 'moment';
const latitude = ref(null);
const longitude = ref(null);
const location = ref(null);
const prayerTimes = ref(null);
const wallpaperRef = ref(null);
const wallpaperContainerRef = ref(null);
const templateChosen = ref(null);
const gregorianDate = ref(null);
const hijriDate = ref(null);

const phoneContainerRef = ref(null);
const phoneImageRef = ref(null);
const phoneImageWidth = ref(0);
const phoneImageHeight = ref(0);
const previewScaleFactor = ref(0.337);
const SmallerWallpaperDesignedRef = ref(null);

const props = defineProps({
    windowWidth: Number,
    windowHeight: Number
});

watch(() => prayerTimes.value, (newValue, _) => {
    const today = moment().format('YYYY-MM-DD');
    const prayerTimesToday = newValue[today];

    if (prayerTimesToday) {
        gregorianDate.value = prayerTimesToday.date;
        hijriDate.value = prayerTimesToday.hijri;
    } else {
        const prayerTimeFirst = Object.keys(newValue)[0];
        gregorianDate.value = newValue[prayerTimeFirst].date;
        hijriDate.value = newValue[prayerTimeFirst].hijri;
    }
});

const wallpaperName = computed(() => {
    return location.value ? `${location.value.area}-${location.value.country}_${moment(gregorianDate.value).format('MM-YY')}_prayer-timetable`.toLowerCase() : 'ec-prayer-timetable';
});

function updatePrayerTimes(prayer) {
    prayerTimes.value = prayer;
}

function updateLocation(locationObj) {
    latitude.value = locationObj.latitude;
    longitude.value = locationObj.longitude;
    location.value = locationObj.location;
}

function updateWallpaperRef(ref) {
    wallpaperRef.value = ref;
}

function updateWallpaperContainerRef(ref) {
    wallpaperContainerRef.value = ref;
    previewScaleFactor.value = phoneImageWidth.value / wallpaperContainerRef.value.offsetWidth;
}

function updateTemplateChosen(template) {
    templateChosen.value = template;
}

function changeBorderRadius() {
    const borderRadius = phoneImageHeight.value / 10.4285714;

    phoneContainerRef.value.style.borderRadius = `${borderRadius}px`;
    phoneContainerRef.value.style.MozBorderRadius = `${borderRadius}px`;
}

watch(() => phoneImageWidth.value, (newValue, _) => {
    if (!wallpaperContainerRef.value) return;
    previewScaleFactor.value = phoneImageWidth.value / wallpaperContainerRef.value.offsetWidth;
    changeBorderRadius();
});

onMounted(() => {
    phoneImageWidth.value = phoneImageRef.value.clientWidth;
    phoneImageHeight.value = phoneImageRef.value.clientHeight;
    changeBorderRadius();
});

watch(() => props.windowWidth, (newValue, _) => {
    phoneImageWidth.value = phoneImageRef.value.clientWidth;
    phoneImageHeight.value = phoneImageRef.value.clientHeight;
    changeBorderRadius();
});
</script>

<template>
    <div class="container-page">
        <WallpaperOutput :location="location" @updateWallpaperRef="updateWallpaperRef"
            @updateWallpaperContainerRef="updateWallpaperContainerRef" :templateChosen="templateChosen"
            :prayerTimes="prayerTimes" :gregorianDate="gregorianDate" :hijriDate="hijriDate"
            class="home-wallpaper-fullscreen" />

        <div class="left-container">
            <div class="button-group">
                <LocationLocateUserLocation @location-update="updateLocation" />
                <WallpapersDownloadWallpaper :wallpaperRef="wallpaperRef" :wallpaperName="wallpaperName" />
            </div>

            <div class="prayer-times-form-container">
                <LocationPrayerTimesCalculationForm :latitude="latitude" :longitude="longitude"
                    @prayer-room-update="updatePrayerTimes" />
            </div>
            <client-only>
                <WallpapersLoadWallpapers @updateTemplateChosen="updateTemplateChosen" />
            </client-only>
        </div>
        <div class="right-container">
            <div class="phone" ref="phoneContainerRef">
                <img ref="phoneImageRef" class="phone-image" src="../assets/phone.png" alt="phone" />
                <WallpaperPreview ref="SmallerWallpaperDesignedRef" class="small-wallpaper-image" :location="location"
                    :templateChosen="templateChosen" :prayerTimes="prayerTimes" :scaleFactor="previewScaleFactor"
                    :gregorianDate="gregorianDate" :hijriDate="hijriDate" :phoneImageHeight="phoneImageHeight" />
            </div>

        </div>
    </div>
</template>

<style>
.home-wallpaper-fullscreen {
    opacity: 0;
}

.container-page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 5rem;
}

@media (min-width: 1000px) {
    .container-page {
        align-items: start;
        flex-direction: row;
    }
}

.left-container {
    width: 350px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    margin-bottom: 50px;
}

.right-container {
    width: 350px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    position: relative;
}

.top-left-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.prayer-times-form-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.phone {
    width: 100%;
    overflow: hidden;
    border-radius: 70px;
}

.phone-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    transform: scale(1.02);
}

.button-group {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.buttons {
    width: calc((350px - 10px) / 2);

    padding-block: 0.5rem;
    color: black;
    border: 0;
    font-size: 1.125rem;
    line-height: 1.75rem;
    border-radius: 0.5rem;
    cursor: pointer;
    background-color: white;
    white-space: wrap;
    text-align: center;
    justify-content: center;
}

.buttons:hover {
    background-color: lightblue;
}
</style>
