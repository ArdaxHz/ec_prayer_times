<script setup>
import domtoimage from 'dom-to-image-more';
import download from 'downloadjs';
import { toJpeg, toCanvas, toBlob } from 'html-to-image';
import MobileDetect from 'mobile-detect';
import FileSaver from 'file-saver';
import html2canvas from 'html2canvas';


const { notify } = useNotification();


const props = defineProps({
    wallpaperRef: Object,
    wallpaperName: {
        type: String,
        default: 'ec-prayer-timetable'
    }
});

const DownloadImageRef = ref(null);
const isOpen = ref(false);
const imageHref = ref(null);
const text = ref('Right click > Save Image to download.');


function downloadImage() {
    const md = process.server ? new MobileDetect(headers['user-agent']) : new MobileDetect(navigator.userAgent)

    let downloaderToUse = toCanvas;
    if (md.mobile() == 'iPhone' || md.mobile() == 'iPad') {
        console.log('Using apple device.');
        downloaderToUse = html2canvas;
    }

    downloaderToUse(props.wallpaperRef.value, { imageTimeout: 0, width: 1297, height: 2796, foreignObjectRendering: true })
        .then(function (canvas) {

            canvas.toBlob(function (blob) {
                if (blob == null) {
                    console.error('Canvas is empty.');
                    return;
                }

                let url = URL.createObjectURL(blob);
                imageHref.value = url;
                console.log(url);
                isOpen.value = true;
                FileSaver.saveAs(blob, `${props.wallpaperName}.jpg`);
            })
        }, "image/jpeg")

        // let downloadLink = document.createElement('a');
        // downloadLink.setAttribute('download', `${props.wallpaperName}.jpg`);
        // canvas.toBlob(function (blob) {
        //     let url = URL.createObjectURL(blob);
        //     imageHref.value = url;
        //     console.log(url);
        //     isOpen.value = true;
        // });
        // const dataUrl = canvas.toDataURL("image/jpeg");
        // download(dataUrl, `${props.wallpaperName}.jpg`, 'image/jpeg');
        // if (md.mobile() == 'iPhone' || md.mobile() == '`iPad') {
        // } else {
        //     var link = document.createElement('img');

        //     // link.download = `${props.wallpaperName}.jpg`;
        //     // link.href = dataUrl;
        //     // link.click();
        // }
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
            text.value = 'Error downloading image.';
            isOpen.value = true;
            notify({
                title: `Error getting location ${error.code}.`,
                text: error.message,
                type: "error"
            });
        });
}

</script>

<template>
    <div>
        <UModal v-model="isOpen">
            <p>{{ text }}</p>
            <img ref="DownloadImageRef" alt="img" :src="imageHref"></img>
        </UModal>
    </div>
    <UButton @click="downloadImage"
        class="buttons text-white dark:text-whtie font-semibold text-lg lg:text-xl shadow-lg hover:shadow-2xl hover:drop-shadow-2xl transform transition duration-500 hover:scale-105"
        variant="solid">
        Download Image
    </UButton>
</template>