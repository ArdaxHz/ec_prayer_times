<script setup>
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';

const { notify } = useNotification();

const props = defineProps({
    wallpaperRef: Object,
    wallpaperName: {
        type: String,
        default: 'ec-prayer-timetable'
    },
    usingSafari: Boolean,
    wallpaperLink: Object,
});

const isLoading = ref(false);

function triggerDownload(url, isObjectURL) {
    const link = document.createElement('a');
    link.download = `${props.wallpaperName}.jpg`;
    if (
        window.navigator.userAgent.indexOf('Firefox') !== -1 &&
        window.navigator.userAgent.indexOf('Chrome') === -1
    ) {
        link.target = '_blank';
    }
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();

    if (isObjectURL) {
        setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
}

function downloadImage() {
    if (!props.wallpaperRef || !props.wallpaperRef.value) {
        notify({
            title: "Wallpaper not ready.",
            text: "Please wait for the wallpaper to load before downloading.",
            type: "warn"
        });
        return;
    }

    isLoading.value = true;

    const config = {
        style: {
            transformOrigin: 'top left',
            alignItems: 'start',
            justifyContent: 'start',
        },
        imageTimeout: 0,
        foreignObjectRendering: true
    };

    // Save reference to today element before removing class
    const todayElements = props.wallpaperRef.value.getElementsByClassName('today');
    const todayElement = todayElements.length > 0 ? todayElements[0] : null;

    if (todayElement) {
        todayElement.classList.remove('today');
    }

    if (props.usingSafari) {
        // Safari path: use html2canvas
        html2canvas(props.wallpaperRef.value, config)
            .then(function (canvas) {
                canvas.toBlob(function (blob) {
                    if (!blob) {
                        console.error('Canvas is empty.');
                        notify({
                            title: "Download failed.",
                            text: "The image could not be rendered. Please try again.",
                            type: "error"
                        });
                        return;
                    }
                    const url = URL.createObjectURL(blob);
                    triggerDownload(url, true);
                }, 'image/jpeg');
            })
            .catch(function (error) {
                console.error('html2canvas error:', error);
                notify({
                    title: "Error downloading image.",
                    text: error.message || "Unknown error occurred.",
                    type: "error"
                });
            })
            .finally(function () {
                if (todayElement) {
                    todayElement.classList.add('today');
                }
                isLoading.value = false;
            });
    } else {
        // Non-Safari path: use dom-to-image
        domtoimage.toJpeg(props.wallpaperRef.value, config)
            .then(function (url) {
                triggerDownload(url, false);
            })
            .catch(function (error) {
                console.error('dom-to-image error:', error);
                notify({
                    title: "Error downloading image.",
                    text: error.message || "Unknown error occurred.",
                    type: "error"
                });
            })
            .finally(function () {
                if (todayElement) {
                    todayElement.classList.add('today');
                }
                isLoading.value = false;
            });
    }
}
</script>

<template>
    <UButton
        class="buttons text-white dark:text-whtie font-semibold text-lg lg:text-xl shadow-lg hover:shadow-2xl hover:drop-shadow-2xl transform transition duration-500 hover:scale-105"
        variant="solid"
        :loading="isLoading"
        :disabled="isLoading"
        @click="downloadImage"
    >
        Download Image
    </UButton>
</template>
