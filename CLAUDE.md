# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EC Prayer Times is a Nuxt 3 web app that calculates Islamic prayer (Salah) times for a given location and generates downloadable phone wallpapers containing prayer timetables.

## Commands

```bash
npm run dev        # Start dev server on http://localhost:3000
npm run build      # Build for production
npm run generate   # Generate static site
npm run preview    # Preview production build
```

No test runner or linter is configured.

## Environment Variables

- `GOOGLE_API_KEY` — Required for reverse geocoding via Google Geocoding API. Exposed to the client through Vite's `define` in `nuxt.config.ts`.

## Architecture

**Framework:** Nuxt 3 with Vue 3 Composition API, Tailwind CSS, and @nuxt/ui components. Dark mode by default.

**Component hierarchy:**
- `app.vue` — Root; handles Safari detection, notification system, responsive root container, footer
- `HomePage.vue` — Central state manager; orchestrates all child components via props/emits; holds `wallpaperOptions` state
- `WallpaperOutput.vue` — Full-size wallpaper renderer (950x2048px, hidden off-screen); computes gregorian month range; uses `justify-content: flex-end` for bottom 2/3 positioning
- `WallpaperPreview.vue` — Live preview inside an iPhone mockup; passes wallpaperOptions through
- `wallpapers/WallpaperOptions.vue` — Collapsible wallpaper customization panel (fonts, colors, table style, highlights, columns, day range)
- `wallpapers/designs/WhiteTextYellowTableDesign.vue` — Wallpaper design template; uses flexbox positioning with `max-height: 1365px` (2/3 of 2048px); accepts wallpaperOptions prop; dynamic colors, blur, fonts
- `wallpapers/WallpaperPrayerTimetable.vue` — Prayer times table; accepts wallpaperOptions prop; column filtering, day range filtering, row highlights, dynamic colors/fonts
- `DownloadWallpaper.vue` — Converts DOM to image with proper if/else branching for Safari (html2canvas) vs non-Safari (dom-to-image); includes loading state and today class restore

**State management:** No Vuex/Pinia. All state lives in `HomePage.vue` and flows down via props, back up via emits.

**Composables (`composables/`):**
- `adhantimes.js` — Wraps the `adhan` library; calculates prayer times with ALL configurable params: method, madhab, fajr/isha/maghrib angles, high latitude rule, polar circle resolution, shafaq, rounding, and per-prayer adjustments. Supports both Gregorian month (`calculateAdhanMonth`) and Hijri month (`calculateAdhanHijriMonth`) calculation. Provides `getNext12HijriMonths()` for month selection. Converts dates to Hijri calendar via `hijrah-date`.
- `geocodingapi.js` — Reverse geocoding (coordinates → location name) via Google Geocoding API.
- `googlefonts.js` — Lazy Google Fonts loader; `loadGoogleFont(fontFamily)` injects `<link>` tags on demand with `display=swap`; exports `allFontOptions`, `localFontOptions`, `googleFontOptions`.
- `helpers.js` — Utility functions (array shuffling).

**Key data flow:**
1. User grants geolocation → browser API gets coordinates → Google Geocoding API resolves location name
2. User configures calculation parameters in `PrayerTimesCalculationForm.vue`:
   - Main form: fajr angle, sighting committee, asr method (madhab), calendar type, month
   - Advanced settings (collapsible): high latitude rule, polar circle resolution, shafaq (conditional on MoonsightingCommittee), rounding, isha/maghrib angle overrides, per-prayer minute adjustments (nested collapsible)
3. User configures wallpaper appearance in `WallpaperOptions.vue`:
   - Fonts (header/title/timings, Google Fonts lazy-loaded), font size scale
   - Colors (header bg/text, title text, timings text)
   - Table style (alternating row colors, backdrop blur, blur opacity)
   - Highlights (Monday/Thursday, White Days 13-14-15 Hijri, today color)
   - Column visibility (toggle date, hijri, fajr, sunrise, dhuhr, asr, maghrib, isha)
   - Day range (full month, date range, single day)
4. `adhan` library computes prayer times locally for the selected month (no API call)
5. Wallpaper component renders prayer table over a background image with customized styling
6. `DownloadWallpaper.vue` captures the DOM node as a downloadable JPEG; filename uses `area-country_hijrimonth-year` format

**wallpaperOptions object:** A single reactive object containing all wallpaper customization. Flows from `WallpaperOptions.vue` → `HomePage.vue` → `WallpaperOutput.vue`/`WallpaperPreview.vue` → `WhiteTextYellowTableDesign.vue` → `WallpaperPrayerTimetable.vue`.

Key properties:
- `headerBgColor`, `headerTextColor`, `titleTextColor`, `timingsTextColor` — dynamic colors
- `headerFont`, `titleFont`, `timingsFont` — per-element font family (local or Google Font)
- `fontSizeScale` — multiplier for all font sizes (0.5–2.0)
- `tableBlur`, `tableBlurOpacity` — backdrop-filter blur and overlay opacity
- `useAlternatingColors`, `evenRowColor`, `oddRowColor` — alternating row styling
- `highlightMondayThursday`, `mondayThursdayColor` — fasting day highlights
- `highlightWhiteDays`, `whiteDaysColor` — 13th/14th/15th Hijri day highlights
- `todayColor` — today row highlight color
- `columns` — object with boolean flags for each column (date, hijri, fajr, sunrise, dhuhr, asr, maghrib, isha)
- `dayRange` ('full'|'range'|'single'), `dayRangeStart`, `dayRangeEnd`, `daySingle` — day filtering

**Google Fonts:**
- `composables/googlefonts.js` maintains a `Set` of loaded fonts to prevent duplicate `<link>` injection
- 12 Google Fonts available + 2 local fonts (Gilroy, Vazirmatn)
- Fonts loaded with `display=swap` for text visibility during load

**Hijri month selection:**
- `getNext12HijriMonths()` generates the next 12 Hijri months from today
- `calculateAdhanHijriMonth()` iterates over each day of a Hijri month, converts to Gregorian, and calculates prayer times
- The gregorian date range is computed from the first/last prayer times keys and displayed as secondary info

## Browser Compatibility

Safari requires special handling throughout the codebase:
- **Image capture:** dom-to-image fails on Safari; falls back to html2canvas (proper if/else branching, not both running)
- **Download behavior:** Firefox opens downloads in a new tab (`_blank`)
- Safari detection is done via user-agent string in `app.vue`

## Responsive Design

- Root container uses responsive width breakpoints: `w-[95svw] sm:w-[92svw] md:w-[90svw] lg:w-[85svw]`
- Form grid: `grid-cols-1 sm:grid-cols-2` (stacks on narrow screens)
- Advanced settings grid: `grid-cols-1 sm:grid-cols-2` (stacks on small screens)
- Layout gap scales: `gap-6 sm:gap-10 lg:gap-16`
- Wallpaper text scaling is handled by `scaleText()` function in `WallpaperOutput.vue`

## Key Libraries

- `adhan` — Prayer time calculation engine (supports 12+ calculation methods, madhab, angles, high latitude rules, polar circle resolution, shafaq, rounding, adjustments)
- `dom-to-image` / `html2canvas` — DOM-to-image conversion (primary / Safari fallback)
- `hijrah-date` — Gregorian-to-Hijri date conversion; provides `getMonth()`, `getDate()`, `getFullYear()`, `getMonthLength()`, `plusMonths()`, `toGregorian()`
- `moment` + `moment-timezone` — Date/time formatting and timezone handling
- `nuxt-swiper` — Wallpaper selection carousel
- `file-saver` — Client-side file download

## Deployment

Docker-based: Node 20.14 Alpine image, builds the app and serves `.output/server/index.mjs` on port 3000 (mapped to 5164 in docker-compose).

## License

All Rights Reserved. See `LICENSE` file.
