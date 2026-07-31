<script setup>
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';
import { needsCanvasCapture, isIOSDevice } from '~/composables/browser';

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

// iOS WebKit caps a canvas at 4096px per side and ~16.7M pixels in total. Going
// over either limit does not throw — it hands back a blank canvas, which is how
// a wallpaper download ends up as a plain white JPEG on an iPhone.
const MAX_CANVAS_SIDE = 4096;
const MAX_CANVAS_AREA = 16777216;

// Every await below is bounded. Without this a stalled image decode or a
// toBlob() callback that never fires leaves the button spinning forever, which
// is exactly how this failed on iPhone.
const FONT_WAIT_MS = 3000;
const RENDER_TIMEOUT_MS = 45000;
const ENCODE_TIMEOUT_MS = 20000;
const IMAGE_TIMEOUT_MS = 15000;

const useCanvasCapture = computed(() => props.usingSafari || needsCanvasCapture());

function withTimeout(promise, ms, message) {
    let timer;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(message)), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function captureScale(width, height) {
    if (!width || !height) return 1;

    // The wallpaper is already authored at full resolution, so scaling past 1
    // buys no detail — it only multiplies the canvas memory. iOS is the platform
    // that runs out of it, so it never upscales.
    const ceiling = isIOSDevice() ? 1 : (window.devicePixelRatio || 1);

    const scale = Math.min(
        ceiling,
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

    // Sampled sparsely: getImageData is comparatively slow on iOS and this runs
    // over a multi-megapixel canvas.
    let reference = null;
    for (let row = 1; row < 8; row++) {
        for (let col = 1; col < 4; col++) {
            const x = Math.floor((canvas.width * col) / 4);
            const y = Math.floor((canvas.height * row) / 8);
            const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data;
            const pixel = `${r},${g},${b},${a}`;

            if (reference === null) reference = pixel;
            else if (pixel !== reference) return false;
        }
    }

    return true;
}

function renderCanvas(node, scale) {
    return withTimeout(
        html2canvas(node, {
            scale,
            useCORS: true,
            // NOT 0 — html2canvas treats 0 as "wait forever", so a single image
            // that never settles hangs the whole capture.
            imageTimeout: IMAGE_TIMEOUT_MS,
            logging: false,
            backgroundColor: '#000000',
            // Safari cannot rasterise the foreignObject html2canvas builds for this.
            foreignObjectRendering: false,
        }),
        RENDER_TIMEOUT_MS,
        'Rendering the wallpaper timed out on this device.'
    );
}

function dataUrlToBlob(dataUrl) {
    const [header, encoded] = dataUrl.split(',');
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: /:(.*?);/.exec(header)?.[1] || 'image/jpeg' });
}

// iOS WebKit sometimes never invokes the toBlob callback on a large canvas, so
// this falls back to the synchronous toDataURL path rather than hanging.
async function toJpegBlob(canvas) {
    try {
        const blob = await withTimeout(
            new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.95)),
            ENCODE_TIMEOUT_MS,
            'Encoding the image timed out.'
        );
        if (blob) return blob;
    } catch {
        // fall through to toDataURL
    }

    return dataUrlToBlob(canvas.toDataURL('image/jpeg', 0.95));
}

// Stamps provenance into the JPEG's COM segment so a saved wallpaper records
// where it came from.
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

// Hands the finished image to the OS. Deliberately called *after* the spinner is
// cleared: on iOS this opens the native share sheet, which stays open for as
// long as the user wants, and the capture is already finished by then.
async function deliverImage(tagged) {
    const fileName = `${props.wallpaperName}.jpg`;

    // On iOS the share sheet is the route that lands the image in Photos; a
    // plain <a download> at best drops it into Files. share() needs the tap that
    // started this to still count as user activation, so if it is refused we
    // fall back to the anchor.
    if (isIOSDevice() && navigator.canShare) {
        try {
            const file = new File([tagged], fileName, { type: 'image/jpeg' });
            if (navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: fileName });
                return;
            }
        } catch (error) {
            // The user dismissing the sheet is a completed action, not a failure.
            if (error && error.name === 'AbortError') return;
        }
    }

    triggerDownload(URL.createObjectURL(tagged), true);
}

async function captureWithHtml2Canvas(node) {
    const { width, height } = node.getBoundingClientRect();

    const scale = captureScale(width, height);
    let canvas = await renderCanvas(node, scale);
    // Retrying at scale 1 only helps if the first attempt was above it.
    if (isBlankCanvas(canvas) && scale > 1) {
        canvas = await renderCanvas(node, 1);
    }
    if (isBlankCanvas(canvas)) {
        throw new Error('The wallpaper rendered blank on this device.');
    }

    const blob = await toJpegBlob(canvas);
    if (!blob) {
        throw new Error('The image could not be encoded.');
    }

    return embedJpegMetadata(blob);
}

async function captureWithDomToImage(node) {
    const dataUrl = await withTimeout(
        domtoimage.toJpeg(node, {
            quality: 0.95,
            style: {
                transformOrigin: 'top left',
                alignItems: 'start',
                justifyContent: 'start',
            },
        }),
        RENDER_TIMEOUT_MS,
        'Rendering the wallpaper timed out.'
    );

    const blob = await fetch(dataUrl).then((r) => r.blob());
    return embedJpegMetadata(blob);
}

async function downloadImage() {
    const node = props.wallpaperRef && props.wallpaperRef.value;

    if (!node) {
        toast.add({
            title: "Wallpaper not ready.",
            description: "Please wait for the wallpaper to load before downloading.",
            color: "warning"
        });
        return;
    }

    isLoading.value = true;

    // Today's row is highlighted by a CSS class, so dropping the class keeps the
    // highlight out of the saved image; it goes back on in the finally block.
    const todayElements = node.getElementsByClassName('today');
    const todayElement = todayElements.length > 0 ? todayElements[0] : null;
    if (todayElement) {
        todayElement.classList.remove('today');
    }

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    let image = null;

    try {
        if (document.fonts && document.fonts.ready) {
            // Fonts are a nicety, not a blocker — never let them stall the capture.
            await withTimeout(document.fonts.ready, FONT_WAIT_MS, 'fonts').catch(() => {});
        }

        if (useCanvasCapture.value) {
            // The wallpaper lives in a position: fixed container, so html2canvas
            // crops an empty region of the page whenever it is captured while
            // scrolled down — which is always the case on a phone.
            window.scrollTo(0, 0);
            await nextTick();
            await new Promise((resolve) => requestAnimationFrame(resolve));

            image = await captureWithHtml2Canvas(node);
        } else {
            image = await captureWithDomToImage(node);
        }
    } catch (error) {
        console.error('Wallpaper capture error:', error);
        toast.add({
            title: "Error downloading image.",
            description: error.message || "Unknown error occurred.",
            color: "error"
        });
    } finally {
        window.scrollTo(scrollX, scrollY);
        if (todayElement) {
            todayElement.classList.add('today');
        }
        // Cleared before delivery on purpose — the capture is what the spinner
        // reports, and the iOS share sheet below can sit open indefinitely.
        isLoading.value = false;
    }

    if (!image) return;

    try {
        await deliverImage(image);
    } catch (error) {
        console.error('Wallpaper delivery error:', error);
        toast.add({
            title: "Error saving image.",
            description: error.message || "The image could not be saved.",
            color: "error"
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
