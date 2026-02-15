const loadedFonts = new Set();

export function loadGoogleFont(fontFamily) {
  if (loadedFonts.has(fontFamily)) return;
  loadedFonts.add(fontFamily);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}&display=swap`;
  document.head.appendChild(link);
}

export const googleFontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Source Sans 3', label: 'Source Sans 3' },
  { value: 'Work Sans', label: 'Work Sans' },
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'Outfit', label: 'Outfit' },
  { value: 'Oswald', label: 'Oswald' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Rubik', label: 'Rubik' },
  { value: 'Noto Sans', label: 'Noto Sans' },
  { value: 'Quicksand', label: 'Quicksand' },
  { value: 'Barlow', label: 'Barlow' },
  { value: 'Cabin', label: 'Cabin' },
  { value: 'Josefin Sans', label: 'Josefin Sans' },
  { value: 'Bebas Neue', label: 'Bebas Neue' },
  { value: 'Kanit', label: 'Kanit' },
  { value: 'Archivo', label: 'Archivo' },
];

export const localFontOptions = [
  { value: 'Gilroy', label: 'Gilroy' },
  { value: 'Vazirmatn', label: 'Vazirmatn' },
];

export const allFontOptions = [...localFontOptions, ...googleFontOptions];
