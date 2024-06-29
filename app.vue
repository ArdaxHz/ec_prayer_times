<script setup>
const rootContainer = ref(null);
const windowWidth = ref(0);
const windowHeight = ref(0);
const usingSafari = ref(false);

const { notify } = useNotification();

const isSafari = () => {
  const ua = navigator.userAgent.toLowerCase();
  const iOS = !!ua.match(/iP(ad|od|hone)/i);
  const webkit = !!ua.match(/WebKit/i);
  const notsafari = ua.match(/(?:chrome|firefox|opera|brave|CriOS|FxiOS)/i);

  return (iOS || webkit) && !notsafari;
};

useResizeObserver(rootContainer, (entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  windowWidth.value = width;
  windowHeight.value = height;
});

onMounted(() => {
  if (isSafari()) {
    usingSafari.value = true;
    console.log("Using Safari.")

    notify({
      title: "Safari detected, image downloading may not work.",
      text: "Image downloading does not work correctly on Safari, please use a different browser if the image downloaded is blank.",
      type: "warn",
      duration: -1,
      closeOnClick: false
    });
  }
});

useHead({
  title: 'Salah Times',
  meta: [
    { name: 'description', content: 'Calculates Salah times and generates a wallpaper to download for your phone.' }
  ]
})
</script>

<template>
  <div ref="rootContainer" class="root-container mx-auto min-w-[5rem] min-h-[80svh] w-[90svw] max-h-[90svh]">
    <NuxtNotifications position="bottom left" :speed="500" />
    <div class="py-10 px-4">
      <h1 class="safari-site-notif mb-8 px-10 text-center text-4xl font-extrabold text-red-500" v-if="usingSafari">
        Image downloading does not work correctly on Safari, please use a different browser if the image downloaded is blank.
      </h1>
      <HomePage :windowWidth="windowWidth" :windowHeight="windowHeight" :usingSafari="usingSafari" />
    </div>
    <p class="versioning">v0.0.7</p>
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

.safari-site-notif {
  font-family: 'Gilroy';
}
</style>