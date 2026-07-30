<script setup>
import moment from 'moment';
import { convertToHijri } from '~/composables/adhantimes';

const latitude = ref(null);
const longitude = ref(null);
const location = ref(null);
const prayerTimes = ref(null);
const wallpaperRef = ref(null);
const wallpaperContainerRef = ref(null);
const templateChosen = ref(null);
const gregorianDate = ref(null);
const hijriDate = ref(null);
const selectedHijriMonth = ref(null);
const wallpaperOptions = ref({
    headerBgColor: '#FEC04A',
    headerTextColor: '#011631',
    titleTextColor: '#FEC04A',
    titleBgColor: 'transparent',
    timingsTextColor: '#FFFFFF',
    tableBgColor: 'transparent',
    useAlternatingColors: true,
    evenRowColor: '#FFFFFF1A',
    oddRowColor: '#0000001A',
    tableBlur: 0,
    tableBlurOpacity: 0,
    tableOffset: 0,
    columnSpacing: 0.85,
    rowSpacing: 0.25,
    titleDropShadow: false,
    titleShadowBlur: 12,
    titleShadowOpacity: 1.0,
    headerFont: 'Gilroy',
    titleFont: 'Gilroy',
    timingsFont: 'Gilroy',
    titleFontWeight: 300,
    titleFontSize: 1.0,
    headerFontSize: 1.0,
    timingsFontSize: 1.0,
    highlightMondayThursday: false,
    mondayThursdayColor: '#2563EB',
    highlightWhiteDays: false,
    whiteDaysColor: '#059669',
    todayColor: '#FF0000',
    use24Hour: false,
    columns: {
        date: true, hijri: true, fajr: true, sunrise: true,
        dhuhr: true, asr: true, maghrib: true, isha: true,
    },
    dayRange: 'full',
    dayRangeStart: 1,
    dayRangeEnd: 30,
    daySingle: 1,
});

const phoneContainerRef = ref(null);
const phoneImageRef = ref(null);
const phoneImageWidth = ref(0);
const phoneImageHeight = ref(0);
const previewScaleFactor = ref(0.337);
const borderRadius = ref(70);

const props = defineProps({
    windowWidth: Number,
    windowHeight: Number,
    usingSafari: Boolean
});

watch(() => prayerTimes.value, (newValue, _) => {
    const today = moment().format('YYYY-MM-DD');
    const prayerTimesToday = newValue[today];

    if (prayerTimesToday) {
        gregorianDate.value = prayerTimesToday.date;
    } else {
        const prayerTimeFirst = Object.keys(newValue)[0];
        gregorianDate.value = newValue[prayerTimeFirst].date;
    }

    // When in Gregorian mode (selectedHijriMonth is null), always show today's hijri date
    // since hijri months don't align with Gregorian months
    if (selectedHijriMonth.value) {
        // Hijri mode: use the hijri date from the prayer times entry
        if (prayerTimesToday) {
            hijriDate.value = prayerTimesToday.hijri;
        } else {
            const prayerTimeFirst = Object.keys(newValue)[0];
            hijriDate.value = newValue[prayerTimeFirst].hijri;
        }
    } else {
        // Gregorian mode: always use today's hijri date for the header
        hijriDate.value = convertToHijri(today);
    }
});

const wallpaperName = computed(() => {
    const hasLocation = location.value && location.value.area && location.value.country;
    let monthPart = '';

    if (selectedHijriMonth.value) {
        monthPart = selectedHijriMonth.value.label || '';
    } else if (gregorianDate.value) {
        monthPart = moment(gregorianDate.value).format('MMMM-YYYY');
    }

    const parts = hasLocation
        ? [`${location.value.area}-${location.value.country}`, monthPart, 'ec-prayer-timetable']
        : [monthPart, 'ec-prayer-timetable'];

    return parts.filter(Boolean).join('-').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
});

function updatePrayerTimes(prayer) {
    prayerTimes.value = prayer;
}

function updateLocation(locationObj) {
    latitude.value = locationObj.latitude;
    longitude.value = locationObj.longitude;
    location.value = locationObj.location;
}

function updateSelectedHijriMonth(data) {
    selectedHijriMonth.value = data;
}

function updateUse24Hour(val) {
    wallpaperOptions.value = { ...wallpaperOptions.value, use24Hour: val };
}

function updateWallpaperOptions(opts) {
    wallpaperOptions.value = { ...wallpaperOptions.value, ...opts };
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
});

watch(() => props.windowWidth, (newValue, _) => {
    phoneImageWidth.value = phoneImageRef.value.clientWidth;
    phoneImageHeight.value = phoneImageRef.value.clientHeight;
    changeBorderRadius();
});

</script>

<template>
    <div class="container-page flex flex-col-reverse md:flex-row justify-center gap-6 sm:gap-10 lg:gap-16 align-middle">
        <WallpaperOutput :location="location" @updateWallpaperRef="updateWallpaperRef"
            @updateWallpaperContainerRef="updateWallpaperContainerRef" :templateChosen="templateChosen"
            :prayerTimes="prayerTimes" :gregorianDate="gregorianDate" :hijriDate="hijriDate"
            :wallpaperOptions="wallpaperOptions"
            class="home-wallpaper-fullscreen" />

        <div class="left-container">
            <div class="prayer-times-form-container">
                <LocationPrayerTimesCalculationForm :latitude="latitude" :longitude="longitude"
                    :gregorianDate="gregorianDate"
                    @updatePrayerTimetable="updatePrayerTimes"
                    @updateSelectedHijriMonth="updateSelectedHijriMonth"
                    @updateUse24Hour="updateUse24Hour" />
            </div>
            <WallpapersWallpaperOptions @updateWallpaperOptions="updateWallpaperOptions" />
            <div class="button-group">
                <LocationLocateUserLocation @updateUserLocation="updateLocation" />
                <WallpapersDownloadWallpaper :wallpaperRef="wallpaperRef" :wallpaperName="wallpaperName"
                    :usingSafari="usingSafari" :wallpaperLink="templateChosen"/>
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
                    :hijriDate="hijriDate" :phoneImageHeight="phoneImageHeight" :borderRadius="borderRadius"
                    :wallpaperOptions="wallpaperOptions" />
            </div>
        </div>
    </div>
</template>

<style>
.home-wallpaper-fullscreen {
    opacity: 0;
}


.left-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.right-container {
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
