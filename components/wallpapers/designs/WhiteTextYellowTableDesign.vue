<script setup>
const city = ref(null);
const area = ref(null);
const country = ref(null);

const props = defineProps({
    location: Object,
    prayerTimes: Object,
    gregorianMonth: String,
    gregorianYear: String,
    hijriMonthShort: String,
    hijriMonthLong: String,
    hijriYear: String,
    gregorianMonthRange: {
        type: String,
        default: ''
    },
    wallpaperOptions: {
        type: Object,
        default: () => ({})
    }
});

const titleFont = computed(() => props.wallpaperOptions.titleFont || 'Gilroy');
const titleTextColor = computed(() => props.wallpaperOptions.titleTextColor || '#FEC04A');
const tableBlur = computed(() => props.wallpaperOptions.tableBlur || 0);
const tableBlurOpacity = computed(() => props.wallpaperOptions.tableBlurOpacity || 0);
const titleFontScale = computed(() => props.wallpaperOptions.titleFontSize || 1.0);
const titleFontWeight = computed(() => props.wallpaperOptions.titleFontWeight || 900);

const titleStyle = computed(() => ({
    fontFamily: titleFont.value,
    color: titleTextColor.value,
    fontWeight: titleFontWeight.value,
}));

const monthsStyle = computed(() => ({
    fontFamily: titleFont.value,
    color: titleTextColor.value,
    fontWeight: titleFontWeight.value,
}));

const hasBlur = computed(() => tableBlur.value > 0 || tableBlurOpacity.value > 0);

const blurStyle = computed(() => {
    if (!hasBlur.value) return {};
    const styles = {
        padding: '0.75rem',
        borderRadius: '1.25rem',
    };
    if (tableBlur.value > 0) {
        styles.backdropFilter = `blur(${tableBlur.value}px)`;
        styles.webkitBackdropFilter = `blur(${tableBlur.value}px)`;
    }
    const opacity = tableBlurOpacity.value > 0 ? tableBlurOpacity.value : 0.15;
    styles.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
    return styles;
});

const areaFontSize = computed(() => `${3.6 * titleFontScale.value}rem`);
const monthsFontSize = computed(() => `${2.8 * titleFontScale.value}rem`);

onMounted(() => {
    city.value = props.location.city
    area.value = props.location.area
    country.value = props.location.country
});
</script>

<template>
    <div class="typeface-design-container">
        <div class="formatted-location-container">
            <div class="center-location-container">
                <h1 class="area" :style="{ ...titleStyle, fontSize: areaFontSize }">{{ area }}</h1>
                <div class="months" :style="{ ...monthsStyle, fontSize: monthsFontSize }" :key="hijriMonthLong" v-if="hijriMonthLong">
                    <span>{{ hijriMonthLong }} {{ hijriYear }}</span>
                    <div class="hijri-month-display" v-if="gregorianMonthRange || gregorianMonth" :key="gregorianMonth">
                        <span>&nbsp|&nbsp</span>
                        <span>{{ gregorianMonthRange || `${gregorianMonth} ${gregorianYear}` }}</span>
                    </div>
                </div>
                <div class="months" :style="{ ...monthsStyle, fontSize: monthsFontSize }" :key="gregorianMonth" v-else-if="gregorianMonth">
                    <span>{{ gregorianMonth }} {{ gregorianYear }}</span>
                </div>
            </div>
        </div>
        <div class="table-blur-wrapper" :style="blurStyle">
            <WallpapersWallpaperPrayerTimetable :key="props.prayerTimes" :prayerTimes="props.prayerTimes"
                :wallpaperOptions="props.wallpaperOptions" />
        </div>
    </div>
</template>

<style scoped>
.typeface-design-container {
    width: 100%;
}

.table-blur-wrapper {
    width: fit-content;
    margin-inline: auto;
}

.formatted-location-container {
    display: flex;
    position: relative;
    width: 100%;
    height: auto;
    z-index: 1;
    overflow: hidden;
    padding-bottom: 1rem;
    justify-content: center;
    align-items: center;

    text-wrap: nowrap;
    word-break: break-all;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.center-location-container {
    display: flex;
    flex-direction: column;
    width: inherit;
    justify-content: center;
    align-items: center;
}

.area {
    width: 100%;
    max-width: 900px;

    text-transform: uppercase;
    font-size: 3.6rem;
    line-height: 0.9;
    overflow: hidden;
    margin-inline: auto;
    text-align: center;
    justify-content: center;
    letter-spacing: 0.2rem;

    text-overflow: ellipsis;
}

.months {
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    font-size: 2.8rem;
    line-height: 1;
    overflow: hidden;
    margin-inline: auto;
    text-align: center;
    justify-content: center;
    font-stretch: expanded;
}

.hijri-month-display {
    display: flex;
    flex-direction: row;
}
</style>

<style>
.prayer-times-table-container {
    width: 100%;
    justify-content: center;
    align-items: center;
}

.prayer-times-table {
    border-collapse: collapse;
    color: white;
    margin: auto;
    text-align: center;
    z-index: 5;
    overflow: hidden;
}

tbody:before {
    content: "@";
    display: block;
    line-height: 7px;
    text-indent: -99999px;
}

thead {
    vertical-align: middle;
}

.prayer-times-table-header-row th {
    font-family: 'Gilroy';
    line-height: .75rem;
    background-color: #FEC04A;
    padding-block: 1.5rem;
    padding-inline: 1rem;
    font-weight: 900;
    font-size: 2.2rem;
    text-transform: uppercase;
    color: #011631;
    margin-bottom: 1rem;
}

.prayer-times-table-header-row th:first-child {
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
    padding-inline: 1.5rem;
}

.prayer-times-table-header-row th:last-child {
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
    padding-inline: 1.5rem;
    border-right: none;
}

.prayer-times-table td {
    font-family: 'Gilroy';
    padding-block: 0.25rem;
    padding-inline: 0.375rem;
    font-weight: 700;
    font-size: 1.7rem;
    line-height: 2.2rem;
    overflow: hidden;
    white-space: nowrap;
}
</style>
