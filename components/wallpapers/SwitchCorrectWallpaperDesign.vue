<script setup>
const props = defineProps({
    location: Object,
    prayerTimes: Object,
    gregorianMonth: String,
    gregorianYear: String,
    hijriMonthShort: String,
    hijriMonthLong: String,
    hijriYear: String,
    typeface: String
})

</script>

<template>
    <div class="typeface-switcher">
        <WallpapersDesignsWhiteTextYellowTableDesign v-if="typeface == 'WallpapersDesignsWhiteTextYellowTableDesign'"
            :key="location" :location="location" :prayerTimes="props.prayerTimes" :gregorianMonth="gregorianMonth"
            :gregorianYear="gregorianYear" :hijriMonthShort="hijriMonthShort" :hijriYear="hijriYear"
            :hijriMonthLong="hijriMonthLong" />
        <WallpapersDesignsSimpleWhiteTextOrangeTableDesign
            v-if="typeface == 'WallpapersDesignsSimpleWhiteTextOrangeTableDesign'" :key="location" :location="location"
            :prayerTimes="props.prayerTimes" :gregorianMonth="gregorianMonth" :gregorianYear="gregorianYear"
            :hijriMonthShort="hijriMonthShort" :hijriYear="hijriYear" :hijriMonthLong="hijriMonthLong" />
    </div>
</template>

<style>
.typeface-switcher {
    width: 100%;
}
</style>