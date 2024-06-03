<script setup>
const previewContainer = ref(null);
const scaledWallpaperComponent = ref(null);
const templateWallpaperScaledComponent = ref(null);
const phoneRef = ref(null);

const props = defineProps({
    location: Object,
    templateChosen: Object,
    prayerTimes: Object,
    scaleFactor: Number,
    gregorianDate: Object,
    hijriDate: Object
});

watch(() => props.scaleFactor, (newValue, _) => {
    if (newValue) {
        scaledWallpaperComponent.value.style.transform = `scale(${newValue})`;
    }
});
</script>

<template>
    <div class="preview-container" ref="previewContainer">
        <div class="scaled-component" ref="scaledWallpaperComponent">
            <WallpaperOutput :location="location" :templateChosen="templateChosen" :prayerTimes="prayerTimes"
                :gregorianDate="gregorianDate" :hijriDate="hijriDate" />
        </div>
    </div>
</template>

<style scoped>
.preview-container {
    height: 715px;
    width: auto;
    overflow: hidden;
    position: relative;
}

.scaled-component {
    width: inherit;
    height: inherit;
    transform-origin: top left;
    position: absolute;
    top: 0;
    left: 0;
}
</style>