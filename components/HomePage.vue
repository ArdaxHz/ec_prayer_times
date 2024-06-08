<script setup>
import moment from 'moment';
const { notify } = useNotification();

const latitude = ref(null);
const longitude = ref(null);
const location = ref(null);
const prayerTimes = ref(null);
const wallpaperRef = ref(null);
const wallpaperContainerRef = ref(null);
const templateChosen = ref(null);
const gregorianDate = ref(null);
const hijriDate = ref(null);
const usingSafari = ref(false);

const phoneContainerRef = ref(null);
const phoneImageRef = ref(null);
const phoneImageWidth = ref(0);
const phoneImageHeight = ref(0);
const previewScaleFactor = ref(0.337);
const borderRadius = ref(70);

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
    let name = 'ec-prayer-timetable';
    if (location.value) {
        if (location.value.area && location.value.country) {
            name = `${location.value.area}-${location.value.country}_${moment(gregorianDate.value).format('MM-YY')}_prayer-timetable`.toLowerCase();
        }
    }
    return name;
});

const isSafari = () => {
    var ua = navigator.userAgent.toLowerCase();
    return (ua.indexOf('safari') != -1 && ua.indexOf('chrome') == -1 && ua.indexOf('android') == -1);
};

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
    borderRadius.value = phoneImageHeight.value / 10.4285714;
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

    if (isSafari()) {
        usingSafari.value = true;
        console.log("Using Safari.")

        notify({
            title: "Safari detected.",
            text: "This website does not work on Safari, please use a different browser.",
            type: "warn",
            duration: -1,
            closeOnClick: false
        });
    }
});

watch(() => props.windowWidth, (newValue, _) => {
    phoneImageWidth.value = phoneImageRef.value.clientWidth;
    phoneImageHeight.value = phoneImageRef.value.clientHeight;
    changeBorderRadius();
});

</script>

<template>
    <div class="container-page flex flex-col-reverse md:flex-row justify-center gap-10 lg:gap-16 align-middle">
        <WallpaperOutput :location="location" @updateWallpaperRef="updateWallpaperRef"
            @updateWallpaperContainerRef="updateWallpaperContainerRef" :templateChosen="templateChosen"
            :prayerTimes="prayerTimes" :gregorianDate="gregorianDate" :hijriDate="hijriDate"
            class="home-wallpaper-fullscreen" />

        <div class="left-container">
            <div class="prayer-times-form-container">
                <LocationPrayerTimesCalculationForm :latitude="latitude" :longitude="longitude"
                    @updatePrayerTimetable="updatePrayerTimes" />
            </div>
            <div class="button-group">
                <LocationLocateUserLocation @updateUserLocation="updateLocation" />
                <WallpapersDownloadWallpaper v-if="!usingSafari" :wallpaperRef="wallpaperRef"
                    :wallpaperName="wallpaperName" />
            </div>
            <client-only>
                <WallpapersLoadWallpapers @updateTemplateChosen="updateTemplateChosen" />
            </client-only>
        </div>
        <div class="right-container">
            <div class="phone" ref="phoneContainerRef">
                <img ref="phoneImageRef" class="phone-image" src="../assets/phone.png" alt="phone" />
                <WallpaperPreview class="small-wallpaper-image" :location="location" :templateChosen="templateChosen"
                    :prayerTimes="prayerTimes" :scaleFactor="previewScaleFactor" :gregorianDate="gregorianDate"
                    :hijriDate="hijriDate" :phoneImageHeight="phoneImageHeight" :borderRadius="borderRadius" />
            </div>
        </div>
    </div>
</template>

<style>
.home-wallpaper-fullscreen {
    opacity: 0;
}


.left-container {
    /* min-width: 300px; */
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.right-container {
    /* min-width: 350px; */
    justify-content: center;
    align-items: center;
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
    display: grid;
    overflow: hidden;
    grid-template-areas: 'phone';
    justify-content: center;
    align-items: center;
}

.phone>* {
    grid-area: phone;
}

.small-wallpaper-image {
    border-radius: 70px;
    overflow: hidden;
    transform: scale(0.98);
}

.phone-image {
    z-index: 1;
}

.button-group {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    flex-direction: column;
    flex-wrap: wrap;
}

@media (min-width: 540px) {
    .button-group {
        flex-direction: row;
        /* align-items: center; */
    }
}

.buttons {
    position: relative;
    display: flex;
    flex: 1 1 0;
    max-width: 100%;

    font-weight: 600;
    padding-block: 0.5rem;
    padding-inline: 1.25rem;
    border-radius: 0.5rem;
    cursor: pointer;
    white-space: wrap;
    text-align: center;
    justify-content: center;
}
</style>
