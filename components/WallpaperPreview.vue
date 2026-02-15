<script setup>
const previewContainer = ref(null);
const scaledWallpaperComponent = ref(null);

const props = defineProps({
    location: Object,
    templateChosen: Object,
    prayerTimes: Object,
    scaleFactor: Number,
    gregorianDate: Object,
    hijriDate: Object,
    phoneImageHeight: Number,
    borderRadius: Number,
    wallpaperOptions: {
        type: Object,
        default: () => ({})
    }
});

watch(() => props.scaleFactor, (newValue, _) => {
    if (newValue) {
        scaledWallpaperComponent.value.style.transform = `scale(${newValue})`;
    }
});

watch(() => props.phoneImageHeight, (newValue, _) => {
    if (newValue) {
        previewContainer.value.style.height = `${newValue}px`;
    }
});

watch(() => props.borderRadius, (newValue, _) => {
    if (newValue) {
        previewContainer.value.style.borderRadius = `${newValue}px`;
        previewContainer.value.style.MozBorderRadius = `${newValue}px`;
    }
});
</script>

<template>
    <div class="preview-container" ref="previewContainer">
        <div class="scaled-component" ref="scaledWallpaperComponent">
            <WallpaperOutput :location="location" :templateChosen="templateChosen" :prayerTimes="prayerTimes"
                :gregorianDate="gregorianDate" :hijriDate="hijriDate" :wallpaperOptions="wallpaperOptions" />
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
