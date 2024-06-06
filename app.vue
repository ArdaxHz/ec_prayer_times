<script setup>
const rootContainer = ref(null);
const windowWidth = ref(0);
const windowHeight = ref(0);

useResizeObserver(rootContainer, (entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  windowWidth.value = width;
  windowHeight.value = height;
});
</script>

<template>
  <div ref="rootContainer" class="root-container mx-auto min-w-[5rem] min-h-[80svh] w-[90svw] max-h-[90svh]">
    <NuxtNotifications position="bottom left" :speed="500" />
    <div class="py-10 px-4">
      <HomePage :windowWidth="windowWidth" :windowHeight="windowHeight" />
    </div>
    <p class="versioning">v0.0.6</p>
  </div>
</template>


<style>
* {
  font-family: 'Vazirmatn', Helvetica, sans-serif;
}

.versioning {
  position: absolute;
  bottom: 0;
  right: 50%;
  padding: 1rem;
  font-size: 1rem;
  scale: 0.7;
  display: none;
}


@font-face {
  font-family: 'Vazirmatn';
  src: url('@/assets/fonts/Vazirmatn.ttf') format("truetype");
}

@font-face {
  font-family: 'Gilroy';
  src: url('@/assets/fonts/Gilroy Regular.ttf') format("truetype");
  font-weight: 400;
}

@font-face {
  font-family: 'Gilroy';
  src: url('@/assets/fonts/Gilroy Medium.ttf') format("truetype");
  font-weight: 500;
}

@font-face {
  font-family: 'Gilroy';
  src: url('@/assets/fonts/Gilroy SemiBold.ttf') format("truetype");
  font-weight: 600;
}

@font-face {
  font-family: 'Gilroy';
  src: url('@/assets/fonts/Gilroy Bold.ttf') format("truetype");
  font-weight: 700;
}

@font-face {
  font-family: 'Gilroy';
  src: url('@/assets/fonts/Gilroy ExtraBold.ttf') format("truetype");
  font-weight: 800;
}

@font-face {
  font-family: 'Gilroy';
  src: url('@/assets/fonts/Gilroy Heavy.ttf') format("truetype");
  font-weight: 900;
}
</style>