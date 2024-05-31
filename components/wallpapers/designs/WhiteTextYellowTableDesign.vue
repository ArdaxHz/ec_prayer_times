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
    hijriYear: String
});

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
                <h1 class="area">{{ area }}</h1>
                <!-- <h1 class="country">{{ country }}</h1> -->
                <div class="months" :key="gregorianMonth" v-if="gregorianMonth">
                    <span>{{ gregorianMonth }} {{ gregorianYear }}</span>
                    <div class="hijri-month-display" :key="hijriYear">
                        <span>&nbsp|&nbsp</span>
                        <span>{{ hijriMonthLong }} {{ hijriYear }}</span>
                    </div>
                </div>
            </div>
        </div>
        <WallpapersWallpaperPrayerTimetable :key="props.prayerTimes" :prayerTimes="props.prayerTimes" />
    </div>
</template>

<style>
.typeface-design-container {
    transform: translate(0, 13rem);
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

}

.center-location-container {
    display: flex;
    flex-direction: column;
    width: inherit;
    justify-content: center;
    align-items: center;
}

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
    text-align: center;
}

tbody:before {
    content: "@";
    display: block;
    line-height: 15px;
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
    font-size: 1.4rem;
    text-transform: uppercase;
    color: #011631;
    margin-bottom: 1rem;
    /* border-right: 1px solid #000; */
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
    font-size: 1rem;
}

.prayer-times-table tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.1);
}

.prayer-times-table tr:nth-child(odd) {
    background-color: rgba(0, 0, 0, 0.1);
}

.large-city {
    font-family: 'Gilroy';
    font-size: 5rem;
    line-height: 1.2;
    font-weight: 800;
    color: white;
    text-align: center;
    width: min-content;
    position: absolute;
    left: -250px;
    overflow: hidden;
    opacity: 0.05;
    transform: translate(0, -50%);
}

.area {
    font-family: 'Gilroy';
    text-transform: uppercase;
    font-size: 3rem;
    line-height: 1.1;
    font-weight: 900;
    color: white;
    overflow: hidden;
    margin-inline: auto;
    text-align: center;
    justify-content: center;
    letter-spacing: 0.2rem;
}

.country {
    font-family: 'Gilroy';
    font-size: 2.5rem;
    line-height: 1.3;
    font-weight: 400;
    color: white;
    overflow: hidden;
    margin-inline: auto;
    text-align: center;
    justify-content: center;
}

.months {
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    font-family: 'Gilroy';
    font-size: 2rem;
    line-height: 1;
    font-weight: 300;
    color: white;
    overflow: hidden;
    margin-inline: auto;
    text-align: center;
    justify-content: center;
    font-stretch: expanded;
    color: #FEC04A;
}

.hijri-month-display {
    display: flex;
    flex-direction: row;
}
</style>