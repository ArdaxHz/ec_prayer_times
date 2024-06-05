<template>
  <div>
    <NuxtNotifications position="bottom left" :speed="500" />
    <div class="container">
      <HomePage />
    </div>
    <p class="versioning">v0.0.3</p>
  </div>
</template>


<style>
* {
  margin: 0;
  padding: 0;
  font-family: 'Vazirmatn', Helvetica, sans-serif;
}

img {
  display: block;
}

.container {
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  padding-inline: 2rem;
  padding-block: 2rem;
}

.versioning {
  position: absolute;
  bottom: 0;
  right: 50%;
  padding: 1rem;
  font-size: 1rem;
  scale: 0.7;
}

@media (min-width: 1280px) {
  .container {
    width: 70vh;
  }
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