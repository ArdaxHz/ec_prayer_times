<script setup>
import { shuffleArray } from '~/composables/helpers';
// import wallpaperData from '@/assets/wallpapers/designs.json' with { type: 'json' };

const images = computed(() => {
    const imagesUrls = shuffleArray(Object.values(import.meta.glob('@/assets/wallpapers/*.{png,jpg,jpeg,PNG,JPEG}', { eager: true, query: '?url', import: 'default' })));
    return imagesUrls.map((image) => {
        return {
            preview: new URL(image, import.meta.url),
            template: new URL(image, import.meta.url),
            typeface: "WallpapersDesignsWhiteTextYellowTableDesign"
        }
    });
    // return wallpaperData.map((image) => {
    //     return {
    //         preview: new URL(`/assets/wallpapers/preview/${image.preview}`, import.meta.url),
    //         template: new URL(`/assets/wallpapers/template/${image.template}`, import.meta.url),
    //         typeface: image.typeface
    //     }
    // })
});

const templateChosen = ref(null);
const emits = defineEmits(['updateTemplateChosen']);

function chooseTemplate(swiper) {
    templateChosen.value = images.value[swiper.realIndex]
    emits('updateTemplateChosen', templateChosen.value)
}
</script>


<template>
    <div class="template-chooser-container">
        <h1 class="text-2xl font-bold max-w-[410px]">Choose from the following {{ images.length }} designs:</h1>
        <p class="text-whtie text-sm font-light italic">Swipe left or right to change the background.</p>
        <div class="template-images-container rounded-lg">
            <Swiper class="swiper-cards rounded-lg" :modules="[SwiperPagination, SwiperNavigation, SwiperScrollbar]"
                :slides-per-view="1" :loop="true" :loopedSlides="3" :effect="'cards'"
                @activeIndexChange="chooseTemplate" @init="chooseTemplate" navigation :pagination="{ clickable: true }"
                :scrollbar="{ draggable: true }">
                <SwiperSlide v-for="(image, index) in images" :key="index" class="template-images-div rounded-lg">
                    <img :src="image.preview" :alt="'Image ' + index" />
                </SwiperSlide>
            </Swiper>
        </div>
    </div>
</template>


<style scoped>
.template-chooser-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
}

.template-images-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 20px;
    overflow: hidden;
    cursor: pointer;
}

.template-images-div {
    display: flex;
    object-fit: cover;
    width: auto;
    margin-right: 0.5rem;
}

.template-images-div:last-child {
    margin-right: 0;
}

.template-images-div img {
    display: block;
    width: inherit;
    height: inherit;
}

.swiper-cards {
    width: 150px;
}
</style>

<style>
.swiper-button-prev {
    left: 0 !important;
}

.swiper-button-next {
    right: 0 !important;
}

.swiper-button-prev,
.swiper-button-next {
    color: rgb(var(--color-primary-400) / var(--tw-bg-opacity)) !important;
}

.swiper-horizontal>.swiper-scrollbar,
.swiper-scrollbar.swiper-scrollbar-horizontal {
    background-color: white !important;
    height: 5px !important;
}

.swiper-scrollbar-drag {
    background-color: rgb(var(--color-primary-400) / var(--tw-bg-opacity)) !important;
}

.swiper-pagination-bullets {
    display: none !important;
}
</style>