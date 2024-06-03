<script setup>
import moment from "moment";
import HijrahDate from 'hijrah-date';

const templateChosen = ref({ preview: null, template: null, typeface: "WallpapersDesignsWhiteTextYellowTableDesign" });
const wallpaperRef = ref(null);
const wallpaperContainerRef = ref(null);
const wallpaperText = ref(null);
const wallpaperImage = ref(null);
const gregorianMonth = ref(null);
const gregorianYear = ref(null);
const hijriMonthShort = ref(null);
const hijriMonthLong = ref(null);
const hijriYear = ref(null);
const location = ref({ city: null, area: null, country: null });

const props = defineProps({
    location: Object,
    templateChosen: Object,
    prayerTimes: Object,
    gregorianDate: Object,
    hijriDate: Object
});

const emits = defineEmits(['updateWallpaperContainerRef', 'updateWallpaperRef']);

watch(() => props.templateChosen, (newValue, _) => {
    if (newValue) {
        templateChosen.value = Object.assign(templateChosen.value, newValue)
    }
});

watch(() => props.location, (newValue, _) => {
    if (newValue) {
        location.value = newValue
    }
});

watch(() => props.gregorianDate, (newValue, _) => {
    if (newValue) {
        gregorianMonth.value = moment(newValue).format('MMM')
        gregorianYear.value = moment(newValue).format('YYYY')
    }
});

watch(() => props.hijriDate, (newValue, _) => {
    if (newValue) {
        hijriMonthShort.value = newValue.month_short
        hijriMonthLong.value = newValue.month_long
        hijriYear.value = String(new HijrahDate(newValue.date).getFullYear())
    }
});

onMounted(() => {
    emits('updateWallpaperRef', wallpaperRef);
});

function handleImageLoad(ref) {
    wallpaperText.value.style.width = ref.target.width != 0 ? `${ref.target.width}px` : wallpaperText.value.style.width;
    wallpaperText.value.style.height = ref.target.height != 0 ? `${ref.target.height}px` : wallpaperText.value.style.height;
    emits('updateWallpaperContainerRef', { 'offsetWidth': ref.target.width, 'offsetHeight': ref.target.height });
    scaleText(ref.target.width);
}

function scaleText(width) {
    const containerWidth = width;
    const scaleFactor = containerWidth / 1297;

    console.log(width);
    console.log(scaleFactor);

    wallpaperText.value.style.transform = `scale(${(scaleFactor > 0 ? scaleFactor : 1)})`;
};


</script>

<template>
    <div class="full-background-component" ref="wallpaperContainerRef">
        <div class="bounding-box">
            <div ref="wallpaperRef">
                <div class="wallpaper-text" ref="wallpaperText">
                    <WallpapersDesignsWhiteTextYellowTableDesign :key="location" :location="location"
                        :prayerTimes="props.prayerTimes" :gregorianMonth="gregorianMonth" :gregorianYear="gregorianYear"
                        :hijriMonthShort="hijriMonthShort" :hijriYear="hijriYear" :hijriMonthLong="hijriMonthLong" />
                    <!-- <WallpapersSwitchCorrectWallpaperDesign :typeface="templateChosen.typeface" :key="location"
                        :location="location" :prayerTimes="props.prayerTimes" :gregorianMonth="gregorianMonth"
                        :gregorianYear="gregorianYear" :hijriMonthShort="hijriMonthShort" :hijriYear="hijriYear"
                        :hijriMonthLong="hijriMonthLong" /> -->
                </div>
                <img class="wallpaper-image" :src="templateChosen.template" alt="wallpaper" ref="wallpaperImage"
                    :key="templateChosen" @load="handleImageLoad" />
            </div>
        </div>
    </div>
</template>

<style>
.wallpaper-text {
    display: flex;
    z-index: 2;
    position: absolute;
    min-width: 950px;
    min-height: 2048px;
    width: 950px;
    height: 2048px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.wallpaper-image {
    z-index: -1;
}

.bounding-box {
    position: relative;
    width: max-content;
    height: min-content;
    overflow: hidden;
}

.wallpaper-container {
    height: min-content;
    position: relative;
    border-radius: 50px;
    align-items: center;
}

.full-background-component {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}
</style>