<script setup>
import domtoimage from 'dom-to-image-more';

const props = defineProps({
    wallpaperRef: Object,
    wallpaperName: {
        type: String,
        default: 'ec-prayer-timetable'
    }
});


function downloadImage() {
    domtoimage
        .toJpeg(props.wallpaperRef.value)
        .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = `${props.wallpaperName}.jpg`;
            link.href = dataUrl;
            link.click();
        });
}

</script>

<template>
    <div>
        <button @click="downloadImage" class="buttons">Download Image</button>
    </div>
</template>