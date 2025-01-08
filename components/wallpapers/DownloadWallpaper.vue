<script setup>
import html2canvas from 'html2canvas';

import domtoimage from 'dom-to-image';


const {notify} = useNotification();

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

function sendDownload(url) {
  const link = document.createElement('a')
  link.download = `${props.wallpaperName}.jpg`
  if (
      // isFirefox
      window.navigator.userAgent.indexOf('Firefox') !== -1 &&
      window.navigator.userAgent.indexOf('Chrome') === -1
  ) {
    link.target = '_blank'
  }
  // console.log(url);
  link.href = url
  imageHref.value = url;
  // isOpen.value = true;
  document.body.appendChild(link)
  link.click()
  link.remove()
}

function downloadImage() {
  const config = {
    style: {
      transformOrigin: 'top left',
      alignItems: 'start',
      justifyContent: 'start',
    },
    imageTimeout: 0, foreignObjectRendering: true
  }

  const todayElements = props.wallpaperRef.value.getElementsByClassName('today')

  if (todayElements.length > 0) {
    todayElements[0].classList.remove('today');
  }

  // domtoimage.toJpeg(props.wallpaperRef.value, config)
  //     .then(url => {
  //       sendDownload(url);
  //     })
  //     .catch(function (error) {
  //           console.error('oops, something went wrong!', error);
  //           notify({
  //             title: `Error downloading image ${error.code}.`,
  //             text: error.message,
  //             type: "error"
  //           });
  //         }
  //     );

  domtoimage.toPixelData(props.wallpaperRef.value)
      .then(function (pixels) {
        const width = props.wallpaperRef.value.scrollWidth;
        const height = props.wallpaperRef.value.scrollHeight;

        // Create a canvas to draw the image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Create an ImageData object
        const imageData = ctx.createImageData(width, height);

        // Populate the ImageData with pixel data
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const pixelIndex = (y * width + x) * 4;
            imageData.data[pixelIndex] = pixels[pixelIndex];     // Red
            imageData.data[pixelIndex + 1] = pixels[pixelIndex + 1]; // Green
            imageData.data[pixelIndex + 2] = pixels[pixelIndex + 2]; // Blue
            imageData.data[pixelIndex + 3] = pixels[pixelIndex + 3]; // Alpha
          }
        }

        // Draw the image data on the canvas
        ctx.putImageData(imageData, 0, 0);

        // Convert the canvas content to a JPG data URL
        canvas.toBlob((blob) => {
          // Create a link element for downloading the image
          const href = URL.createObjectURL(blob)
          sendDownload(href)
          URL.revokeObjectURL(href);
        }, 'image/jpeg');
      })
      .catch(function (error) {
        console.error('Error rendering image:', error);
      });
}
</script>

<template>
  <div>
    <UModal v-model="isOpen">
      <UCard
          :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', header: { padding: 'p-4' } }">
        <template #header>
          <div class="flex flex-row items-center justify-between">
            <p class="flex items-center font-semibold pt-2 pb-1 text-lg">{{ text }}</p>
            <UButton class="-my-1" color="gray" icon="i-heroicons-x-mark-20-solid" variant="ghost"
                     @click="isOpen = false"/>
          </div>
        </template>
        <span class="flex gap-3 flex-col">
                    <img v-if="imageHref" ref="DownloadImageRef" :src="imageHref" alt="img"></img>
                    <p v-if="!imageHref" class="italic text-red-400 text-md font-semibold p">If you see this message,
                        the
                        image was not
                        rendered
                        correctly,
                        please reload the
                        page and try
                        again.</p>
                </span>
      </UCard>
    </UModal>
  </div>
  <UButton class="buttons text-white dark:text-whtie font-semibold text-lg lg:text-xl shadow-lg hover:shadow-2xl hover:drop-shadow-2xl transform transition duration-500 hover:scale-105"
           variant="solid"
           @click="downloadImage">
    Download Image
  </UButton>
</template>