<script setup>
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';

const toast = useToast();

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

function embedJpegMetadata(blob) {
    const comment = [
        `Source: ${window.location.origin}`,
        `Generator: EC Prayer Times`,
        `URL: ${window.location.href}`,
        `Date: ${new Date().toISOString()}`,
    ].join('\n');

    return blob.arrayBuffer().then(function (buffer) {
        const original = new Uint8Array(buffer);
        const encoder = new TextEncoder();
        const commentBytes = encoder.encode(comment);
        const commentLength = commentBytes.length + 2; // +2 for the length field itself

        // COM segment: FF FE + 2-byte length + comment
        const comSegment = new Uint8Array(4 + commentBytes.length);
        comSegment[0] = 0xFF;
        comSegment[1] = 0xFE;
        comSegment[2] = (commentLength >> 8) & 0xFF;
        comSegment[3] = commentLength & 0xFF;
        comSegment.set(commentBytes, 4);

        // Insert after SOI marker (first 2 bytes: FF D8)
        const result = new Uint8Array(original.length + comSegment.length);
        result.set(original.subarray(0, 2), 0);
        result.set(comSegment, 2);
        result.set(original.subarray(2), 2 + comSegment.length);

        return new Blob([result], { type: 'image/jpeg' });
    });
}

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
        toast.add({
            title: "Wallpaper not ready.",
            description: "Please wait for the wallpaper to load before downloading.",
            color: "warning"
        });
        return;
    }

    isLoading.value = true;

    const el = props.wallpaperRef.value;
    const width = el.offsetWidth;
    const height = el.offsetHeight;

    const config = {
        style: {
            transformOrigin: 'top left',
            alignItems: 'start',
            justifyContent: 'start',
        },
        width,
        height,
        imageTimeout: 0,
        foreignObjectRendering: true
    };

    // Save reference to today element before removing class
    const todayElements = el.getElementsByClassName('today');
    const todayElement = todayElements.length > 0 ? todayElements[0] : null;

    if (todayElement) {
        todayElement.classList.remove('today');
    }

    if (props.usingSafari) {
        // Safari/iOS path: use html2canvas
        html2canvas(el, { ...config, scale: 2 })
            .then(function (canvas) {
                canvas.toBlob(function (blob) {
                    if (!blob) {
                        console.error('Canvas is empty.');
                        toast.add({
                            title: "Download failed.",
                            description: "The image could not be rendered. Please try again.",
                            color: "error"
                        });
                        return;
                    }
                    embedJpegMetadata(blob).then(function (tagged) {
                        const url = URL.createObjectURL(tagged);
                        triggerDownload(url, true);
                    });
                }, 'image/jpeg', 0.95);
            })
            .catch(function (error) {
                console.error('html2canvas error:', error);
                toast.add({
                    title: "Error downloading image.",
                    description: error.message || "Unknown error occurred.",
                    color: "error"
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
        domtoimage.toJpeg(el, config)
            .then(function (dataUrl) {
                return fetch(dataUrl).then(r => r.blob());
            })
            .then(function (blob) {
                return embedJpegMetadata(blob);
            })
            .then(function (tagged) {
                const url = URL.createObjectURL(tagged);
                triggerDownload(url, true);
            })
            .catch(function (error) {
                console.error('dom-to-image error:', error);
                toast.add({
                    title: "Error downloading image.",
                    description: error.message || "Unknown error occurred.",
                    color: "error"
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
        class="buttons text-white font-semibold text-lg lg:text-xl shadow-lg hover:shadow-2xl hover:drop-shadow-2xl transform transition duration-500 hover:scale-105"
        variant="solid"
        :loading="isLoading"
        :disabled="isLoading"
        @click="downloadImage"
    >
        Download Image
    </UButton>
</template>
