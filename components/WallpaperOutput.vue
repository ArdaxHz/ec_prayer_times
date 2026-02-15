<script setup>
import moment from "moment";

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
    hijriDate: Object,
    wallpaperOptions: {
        type: Object,
        default: () => ({})
    }
});

const emits = defineEmits(['updateWallpaperContainerRef', 'updateWallpaperRef']);

// Compute gregorian month range from prayer times keys (first/last date)
const gregorianMonthRange = computed(() => {
    if (!props.prayerTimes) return '';
    const keys = Object.keys(props.prayerTimes);
    if (keys.length === 0) return '';

    const firstDate = moment(keys[0]);
    const lastDate = moment(keys[keys.length - 1]);

    if (firstDate.format('MMM YYYY') === lastDate.format('MMM YYYY')) {
        return firstDate.format('MMM YYYY');
    }
    if (firstDate.format('YYYY') === lastDate.format('YYYY')) {
        return `${firstDate.format('MMM')} - ${lastDate.format('MMM YYYY')}`;
    }
    return `${firstDate.format('MMM YYYY')} - ${lastDate.format('MMM YYYY')}`;
});

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
        hijriYear.value = String(newValue.date.getFullYear())
    }
});

onMounted(() => {
    emits('updateWallpaperRef', wallpaperRef);
});

const TABLE_TOP_RATIO = 680 / 2048;

function handleImageLoad(ref) {
    const imgW = ref.target.width || 950;
    const imgH = ref.target.height || 2048;
    wallpaperText.value.style.width = `${imgW}px`;
    wallpaperText.value.style.height = `${imgH}px`;
    wallpaperText.value.style.paddingTop = `${Math.round(imgH * TABLE_TOP_RATIO)}px`;
    emits('updateWallpaperContainerRef', { 'offsetWidth': imgW, 'offsetHeight': imgH });
    scaleText(imgW);
}

function scaleText(width) {
    const containerWidth = width;
    const scaleFactor = containerWidth / 1297;
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
                        :hijriMonthShort="hijriMonthShort" :hijriYear="hijriYear" :hijriMonthLong="hijriMonthLong"
                        :gregorianMonthRange="gregorianMonthRange" :wallpaperOptions="props.wallpaperOptions" />
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
    justify-content: flex-start;
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
