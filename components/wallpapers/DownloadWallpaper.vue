<script setup>
import domtoimage from 'dom-to-image-more';
import download from 'downloadjs';
import { toJpeg, toCanvas } from 'html-to-image';

const props = defineProps({
    wallpaperRef: Object,
    wallpaperName: {
        type: String,
        default: 'ec-prayer-timetable'
    }
});


function downloadImage() {
    // domtoimage
    //     .toJpeg(props.wallpaperRef.value)
    //     .then(function (dataUrl) {
    //         var link = document.createElement('a');
    //         link.download = `${props.wallpaperName}.jpg`;
    //         link.href = dataUrl;
    //         link.click();
    //     });

    toCanvas(props.wallpaperRef.value)
        .then(function (canvas) {
            console.log(canvas.toDataURL());
            var img = canvas.toDataURL("image/png");
            download(canvas.toDataURL(), `${props.wallpaperName}.jpg`, "image/jpg");
        }
        );
}

</script>

<template>
    <div>
        <button @click="downloadImage" class="buttons">Download Image</button>
    </div>
</template>