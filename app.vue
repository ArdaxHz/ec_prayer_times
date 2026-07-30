<script setup>
import { isSafariBrowser } from '~/composables/browser';

const rootContainer = ref(null);
const windowWidth = ref(0);
const windowHeight = ref(0);
const usingSafari = ref(false);

const toast = useToast();

useResizeObserver(rootContainer, (entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  windowWidth.value = width;
  windowHeight.value = height;
});

onMounted(() => {
  toast.add({
    title: "Please enable location access.",
    description: "This calculator needs location access to work, please enable location access for this calculator to work properly.",
    duration: 5000
  });

  // No Safari warning toast: DownloadWallpaper now captures correctly on
  // WebKit, so the "downloads may be blank" caveat no longer applies.
  if (isSafariBrowser()) {
    usingSafari.value = true;
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
  <UApp :toaster="{ position: 'top-left' }">
    <div ref="rootContainer" class="root-container mx-auto min-w-[5rem] min-h-[80vh] w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] max-w-[1400px]">
      <div class="py-10 px-4">
        <HomePage :windowWidth="windowWidth" :windowHeight="windowHeight" :usingSafari="usingSafari" />
      </div>
      <footer class="footer">
        <p>Built by <a href="https://nevra.tech" target="_blank" class="footer-link">nevra.tech</a> · 2026</p>
      </footer>
    </div>
  </UApp>
</template>


<style>
* {
  font-family: 'Vazirmatn', Helvetica, sans-serif;
}

/* The app is dark-only regardless of the OS preference. Tailwind v4 dropped
   --tw-bg-opacity, so the brand background is written out directly. */
body {
  background-color: #161f28 !important;
  color: white;
}

.footer {
  text-align: center;
  padding: 1.5rem 1rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
}

.footer-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: rgba(255, 255, 255, 0.9);
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