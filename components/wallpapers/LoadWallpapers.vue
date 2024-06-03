<script setup>
import wallpaperData from '@/assets/wallpapers/designs.json' with { type: 'json' };

const images = computed(() => {
    return wallpaperData.map((image) => {
        return {
            preview: new URL(`/assets/wallpapers/preview/${image.preview}`, import.meta.url),
            template: new URL(`/assets/wallpapers/template/${image.template}`, import.meta.url),
            typeface: image.typeface
        }
    })
});

const templateChosen = ref(null);
const emits = defineEmits(['updateTemplateChosen']);

function chooseTemplate(swiper) {
    templateChosen.value = images.value[swiper.activeIndex]
    emits('updateTemplateChosen', templateChosen.value)
}
</script>


<template>
    <div class="template-chooser-container">
        <h1>Choose your design:</h1>
        <div class="template-images-container">
            <Swiper class="swiper-cards" :modules="[SwiperAutoplay, SwiperEffectCards]" :slides-per-view="1"
                :loop="false" :effect="'cards'" @activeIndexChange="chooseTemplate" @init="chooseTemplate">
                <SwiperSlide v-for="(image, index) in images" :key="index" class="template-images-div">
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
}

.template-images-container {
    width: inherit;
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
    border-radius: 0.5rem;
}

.template-images-div img {
    display: block;
    width: inherit;
    height: inherit;
}

.swiper-cards {
    width: 250px;
    height: 250px;

    border-radius: 0.5rem;
}
</style>