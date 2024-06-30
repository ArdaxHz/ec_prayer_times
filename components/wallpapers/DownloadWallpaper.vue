<script setup>
import { toCanvas } from 'html-to-image';
import html2canvas from 'html2canvas';
import FileSaver from 'file-saver';

import domtoimage from 'dom-to-image';


const { notify } = useNotification();

const props = defineProps({
    wallpaperRef: Object,
    wallpaperName: {
        type: String,
        default: 'ec-prayer-timetable'
    },
    usingSafari: Boolean
});

const DownloadImageRef = ref(null);
const isOpen = ref(false);
const imageHref = ref(null);
const text = ref("If the image doesn't download automatically, right click > 'Save as' to download.");

// function downloadImage() {
//     toCanvas(props.wallpaperRef.value, { imageTimeout: 0, foreignObjectRendering: true })
//         .then(function (canvas) {
//             canvas.toBlob(function (blob) {
//                 if (blob == null) {
//                     console.error('Canvas is empty.');
//                     return;
//                 }
//                 let url = URL.createObjectURL(blob);
//                 window.navigator.clipboard.writeText(url)
//                 imageHref.value = url;
//                 console.log(url);
//                 isOpen.value = true;
//                 FileSaver.saveAs(blob, `${props.wallpaperName}.jpg`);
//             })
//         }, "image/jpeg")
//         .catch(function (error) {
//             console.error('oops, something went wrong!', error);
//             text.value = 'Error downloading image.';
//             isOpen.value = true;
//             notify({
//                 title: `Error downloading image ${error.code}.`,
//                 text: error.message,
//                 type: "error"
//             });
//         });
// }

function downloadImage() {
    const config = {
      style: {
        transformOrigin: 'top left',
        alignItems: 'start',
        justifyContent: 'start',
      },
      imageTimeout: 0, foreignObjectRendering: true
    }

    domtoimage
    .toPng(props.wallpaperRef.value, config)
    .then(url => {
        var img = new Image();
        img.src = url;
        document.body.appendChild(img);

        const link = document.createElement('a')
        link.download = `${props.wallpaperName}.png`
        if (
            // isFirefox
            window.navigator.userAgent.indexOf('Firefox') !== -1 &&
            window.navigator.userAgent.indexOf('Chrome') === -1
        ) {
            link.target = '_blank'
        }
        console.log(url);
        link.href = url
        imageHref.value = url;
        isOpen.value = true;
        document.body.appendChild(link)
        link.click()
        link.remove()
    })
    // .toSvg(props.wallpaperRef.value, config)
    // .then(dataURL =>
    //     dataURL
    //     .replace(/&nbsp;/g, '&#160;')
    //     .replace(/%23/g, '#')
    //     .replace(/%0A/g, '\n')
    //     .replace(/&(?!#?[a-z0-9]+;)/g, '&amp;')
    // )
    // .then(uri => uri.slice(uri.indexOf(',') + 1))
    // .then(data => new Blob([data], { type: 'image/svg+xml' }))
    // .then(blob => window.URL.createObjectURL(blob))
    // .then(url => {
    //     const link = document.createElement('a')
    //     link.download = `${props.wallpaperName}.svg`
    //     if (
    //         // isFirefox
    //         window.navigator.userAgent.indexOf('Firefox') !== -1 &&
    //         window.navigator.userAgent.indexOf('Chrome') === -1
    //     ) {
    //         link.target = '_blank'
    //     }
    //     console.log(url);
    //     link.href = url
    //     imageHref.value = url;
    //     isOpen.value = true;
    //     document.body.appendChild(link)
    //     link.click()
    //     link.remove()
    //     const image = new Image()
    //     image.crossOrigin="anonymous"
    //     image.src = url
        
    //     image.addEventListener('load', () => {
    //         const width = 1297
    //         const height = 2796
    //         const canvas = document.createElement('canvas')
            
    //         canvas.setAttribute('width', width)
    //         canvas.setAttribute('height', height)
            
    //         const context = canvas.getContext('2d')
    //         context.drawImage(image, 0, 0, width, height)
            
    //         const dataUrl = canvas.toDataURL('image/png')
    //     })
        
        
    // })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
        notify({
            title: `Error downloading image ${error.code}.`,
            text: error.message,
            type: "error"
        });
    }
    );
}
</script>

<template>
    <div>
        <UModal v-model="isOpen">
            <UCard
                :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', header: { padding: 'px-0 py-1' } }">
                <template #header>
                    <div class="flex flex-row items-center justify-between px-1">
                        <p class="flex items-center font-semibold pt-2 pb-1 text-lg">{{ text }}</p>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                            @click="isOpen = false" />
                    </div>
                </template>
                <img ref="DownloadImageRef" alt="img" :src="imageHref"></img>
            </UCard>
        </UModal>
    </div>
    <UButton @click="downloadImage"
        class="buttons text-white dark:text-whtie font-semibold text-lg lg:text-xl shadow-lg hover:shadow-2xl hover:drop-shadow-2xl transform transition duration-500 hover:scale-105"
        variant="solid">
        Download Image
    </UButton>
</template>