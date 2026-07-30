<script setup>
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';
import { needsCanvasCapture } from '~/composables/browser';

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

// iOS WebKit caps a canvas at 4096px per side and ~16.7M pixels in total. Going
// over either limit does not throw — it hands back a blank canvas, which is how
// a wallpaper download ends up as a plain white JPEG on an iPhone.
const MAX_CANVAS_SIDE = 4096;
const MAX_CANVAS_AREA = 16777216;

const useCanvasCapture = computed(() => props.usingSafari || needsCanvasCapture());

function captureScale(width, height) {
    if (!width || !height) return 1;

    const scale = Math.min(
        window.devicePixelRatio || 1,
        MAX_CANVAS_SIDE / Math.max(width, height),
        Math.sqrt(MAX_CANVAS_AREA / (width * height))
    );

    return scale > 0 ? scale : 1;
}

// A canvas that blew past the WebKit limits reads back as a single flat colour.
function isBlankCanvas(canvas) {
    if (!canvas || !canvas.width || !canvas.height) return true;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return false;

    let reference = null;
    for (let row = 1; row < 16; row++) {
        for (let col = 1; col < 8; col++) {
            const x = Math.floor((canvas.width * col) / 8);
            const y = Math.floor((canvas.height * row) / 16);
            const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data;
            const pixel = `${r},${g},${b},${a}`;

            if (reference === null) reference = pixel;
            else if (pixel !== reference) return false;
        }
    }

    return true;
}

function renderCanvas(node, scale) {
    return html2canvas(node, {
        scale,
        useCORS: true,
        imageTimeout: 0,
        logging: false,
        backgroundColor: '#000000',
        // Safari cannot rasterise the foreignObject html2canvas builds for this.
        foreignObjectRendering: false,
    });
}

function toJpegBlob(canvas) {
    return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.95));
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

async function captureWithHtml2Canvas(node) {
    const { width, height } = node.getBoundingClientRect();

    let canvas = await renderCanvas(node, captureScale(width, height));
    if (isBlankCanvas(canvas)) {
        canvas = await renderCanvas(node, 1);
    }
    if (isBlankCanvas(canvas)) {
        throw new Error('The wallpaper rendered blank on this device.');
    }

    const blob = await toJpegBlob(canvas);
    if (!blob) {
        throw new Error('The image could not be encoded.');
    }

    triggerDownload(URL.createObjectURL(blob), true);
}

async function captureWithDomToImage(node) {
    const url = await domtoimage.toJpeg(node, {
        quality: 0.95,
        style: {
            transformOrigin: 'top left',
            alignItems: 'start',
            justifyContent: 'start',
        },
    });

    triggerDownload(url, false);
}

async function downloadImage() {
    const node = props.wallpaperRef && props.wallpaperRef.value;

    if (!node) {
        notify({
            title: "Wallpaper not ready.",
            text: "Please wait for the wallpaper to load before downloading.",
            type: "warn"
        });
        return;
    }

    isLoading.value = true;

    const todayElements = node.getElementsByClassName('today');
    const todayElement = todayElements.length > 0 ? todayElements[0] : null;
    if (todayElement) {
        todayElement.classList.remove('today');
    }

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    try {
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }

        if (useCanvasCapture.value) {
            // The wallpaper lives in a position: fixed container, so html2canvas
            // crops an empty region of the page whenever it is captured while
            // scrolled down — which is always the case on a phone.
            window.scrollTo(0, 0);
            await nextTick();
            await new Promise((resolve) => requestAnimationFrame(resolve));

            await captureWithHtml2Canvas(node);
        } else {
            await captureWithDomToImage(node);
        }
    } catch (error) {
        console.error('Wallpaper capture error:', error);
        notify({
            title: "Error downloading image.",
            text: error.message || "Unknown error occurred.",
            type: "error"
        });
    } finally {
        window.scrollTo(scrollX, scrollY);
        if (todayElement) {
            todayElement.classList.add('today');
        }
        isLoading.value = false;
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
