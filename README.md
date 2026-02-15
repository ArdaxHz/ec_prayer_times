# Salah Times Wallpaper Generator

Calculates Islamic prayer (Salah) times for a given location and generates downloadable phone wallpapers with prayer timetables.

**Live version:** [salah.emanchannel.tv](https://salah.emanchannel.tv)

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file with a Google Geocoding API key (used for reverse geocoding coordinates to location names):

```
GOOGLE_API_KEY=your_key_here
```

## Development

```bash
npm run dev
```

Opens at `http://localhost:3000`.

## Production

```bash
npm run build
npm run preview
```

### Docker

```bash
docker compose up
```

Serves on port `5164`.

## Adding Wallpaper Backgrounds

Background images are auto-discovered from `assets/wallpapers/`. To add a new wallpaper:

1. Place your image file in `assets/wallpapers/`
2. Supported formats: `.png`, `.jpg`, `.jpeg`
3. The image will automatically appear in the wallpaper selector carousel

### Recommended Dimensions

- **1297 x 2796 px** — This is the standard size used by most included wallpapers. The timetable overlay scales proportionally to match the image dimensions, so other sizes will work but this size gives the best results.
- Use a **portrait** aspect ratio (roughly 9:19 or similar phone wallpaper proportions).
- The top ~40% of the image is visible above the prayer timetable, so place any key visual elements there.
- Keep the bottom ~60% relatively dark or uniform, as the timetable overlays this area.
