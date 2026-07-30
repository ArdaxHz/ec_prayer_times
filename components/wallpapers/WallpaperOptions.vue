<script setup>
import { loadGoogleFont, allFontOptions, localFontOptions } from '~/composables/googlefonts';

const emits = defineEmits(['updateWallpaperOptions']);

const showOptions = ref(false);
const showFonts = ref(false);
const showColors = ref(false);
const showTableStyle = ref(false);
const showHighlights = ref(false);
const showColumns = ref(false);
const showDayRange = ref(false);

// Colors
const headerBgColor = ref('#FEC04A');
const headerTextColor = ref('#011631');
const titleTextColor = ref('#FEC04A');
const titleBgColor = ref('transparent');
const timingsTextColor = ref('#FFFFFF');
const tableBgColor = ref('transparent');

// Alternating row colors
const useAlternatingColors = ref(true);
const evenRowColor = ref('#FFFFFF1A');
const oddRowColor = ref('#0000001A');

// Table blur — opacity range -1 to 1: negative = black overlay, positive = white overlay
const tableBlur = ref(0);
const tableBlurOpacity = ref(0);

// Table vertical offset (px)
const tableOffset = ref(0);

// Table spacing
const columnSpacing = ref(0.85);
const rowSpacing = ref(0.25);

// Title drop shadow
const titleDropShadow = ref(false);
const titleShadowBlur = ref(12);
const titleShadowOpacity = ref(1.0);

// Fonts
const headerFont = ref('Gilroy');
const titleFont = ref('Gilroy');
const timingsFont = ref('Gilroy');

// Title font weight
const titleFontWeight = ref(300);

// Font size scales (per element)
const titleFontSize = ref(1.0);
const headerFontSize = ref(1.0);
const timingsFontSize = ref(1.0);

// Highlights
const highlightMondayThursday = ref(false);
const mondayThursdayColor = ref('#2563EB');
const highlightWhiteDays = ref(false);
const whiteDaysColor = ref('#059669');
const todayColor = ref('#FF0000');

// Columns
const colDate = ref(true);
const colHijri = ref(true);
const colFajr = ref(true);
const colSunrise = ref(true);
const colDhuhr = ref(true);
const colAsr = ref(true);
const colMaghrib = ref(true);
const colIsha = ref(true);

// Day range
const dayRange = ref('full');
const dayRangeStart = ref(1);
const dayRangeEnd = ref(30);
const daySingle = ref(1);

const dayRangeOptions = [
    { value: 'full', label: 'Full Month' },
    { value: 'range', label: 'Date Range' },
    { value: 'single', label: 'Single Day' },
];

const localFontValues = new Set(localFontOptions.map(f => f.value));

function onFontChange(fontValue) {
    if (!localFontValues.has(fontValue)) {
        loadGoogleFont(fontValue);
    }
}

function resetAlternatingColors() {
    evenRowColor.value = '#FFFFFF1A';
    oddRowColor.value = '#0000001A';
}

function buildOptions() {
    return {
        headerBgColor: headerBgColor.value,
        headerTextColor: headerTextColor.value,
        titleTextColor: titleTextColor.value,
        titleBgColor: titleBgColor.value,
        timingsTextColor: timingsTextColor.value,
        tableBgColor: tableBgColor.value,
        useAlternatingColors: useAlternatingColors.value,
        evenRowColor: evenRowColor.value,
        oddRowColor: oddRowColor.value,
        tableBlur: tableBlur.value,
        tableBlurOpacity: tableBlurOpacity.value,
        tableOffset: tableOffset.value,
        columnSpacing: columnSpacing.value,
        rowSpacing: rowSpacing.value,
        titleDropShadow: titleDropShadow.value,
        titleShadowBlur: titleShadowBlur.value,
        titleShadowOpacity: titleShadowOpacity.value,
        headerFont: headerFont.value,
        titleFont: titleFont.value,
        timingsFont: timingsFont.value,
        titleFontWeight: titleFontWeight.value,
        titleFontSize: titleFontSize.value,
        headerFontSize: headerFontSize.value,
        timingsFontSize: timingsFontSize.value,
        highlightMondayThursday: highlightMondayThursday.value,
        mondayThursdayColor: mondayThursdayColor.value,
        highlightWhiteDays: highlightWhiteDays.value,
        whiteDaysColor: whiteDaysColor.value,
        todayColor: todayColor.value,
        columns: {
            date: colDate.value,
            hijri: colHijri.value,
            fajr: colFajr.value,
            sunrise: colSunrise.value,
            dhuhr: colDhuhr.value,
            asr: colAsr.value,
            maghrib: colMaghrib.value,
            isha: colIsha.value,
        },
        dayRange: dayRange.value,
        dayRangeStart: dayRangeStart.value,
        dayRangeEnd: dayRangeEnd.value,
        daySingle: daySingle.value,
    };
}

watch(
    [headerBgColor, headerTextColor, titleTextColor, titleBgColor, timingsTextColor, tableBgColor,
     useAlternatingColors, evenRowColor, oddRowColor,
     tableBlur, tableBlurOpacity, tableOffset, columnSpacing, rowSpacing,
     titleDropShadow, titleShadowBlur, titleShadowOpacity,
     headerFont, titleFont, timingsFont, titleFontWeight, titleFontSize, headerFontSize, timingsFontSize,
     highlightMondayThursday, mondayThursdayColor, highlightWhiteDays, whiteDaysColor, todayColor,
     colDate, colHijri, colFajr, colSunrise, colDhuhr, colAsr, colMaghrib, colIsha,
     dayRange, dayRangeStart, dayRangeEnd, daySingle],
    () => {
        emits('updateWallpaperOptions', buildOptions());
    }
);

// Load Google fonts when font refs change
watch(headerFont, (val) => onFontChange(val));
watch(titleFont, (val) => onFontChange(val));
watch(timingsFont, (val) => onFontChange(val));

onMounted(() => {
    emits('updateWallpaperOptions', buildOptions());
});
</script>

<template>
    <div class="wallpaper-options-container">
        <UButton
            :icon="showOptions ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            variant="ghost"
            color="neutral"
            class="text-white font-semibold text-sm"
            @click="showOptions = !showOptions"
        >
            Wallpaper Options
        </UButton>

        <div v-if="showOptions" class="mt-3 flex flex-col gap-3 pl-2 border-l-2 border-gray-600">

            <!-- Fonts Section -->
            <div>
                <UButton
                    :icon="showFonts ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                    variant="ghost" color="neutral" size="xs"
                    class="text-white font-semibold text-xs"
                    @click="showFonts = !showFonts"
                >
                    Fonts
                </UButton>
                <div v-if="showFonts" class="mt-2 flex flex-col gap-3 pl-2 border-l-2 border-gray-700">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Header Font:</span>
                        <USelectMenu v-model="headerFont" :items="allFontOptions" value-key="value"
                            label-key="label" size="sm" class="w-full" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Title Font:</span>
                        <USelectMenu v-model="titleFont" :items="allFontOptions" value-key="value"
                            label-key="label" size="sm" class="w-full" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Timings Font:</span>
                        <USelectMenu v-model="timingsFont" :items="allFontOptions" value-key="value"
                            label-key="label" size="sm" class="w-full" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Title Size: {{ titleFontSize.toFixed(1) }}x</span>
                        <input type="range" v-model.number="titleFontSize" min="0.5" max="2.0" step="0.1"
                            class="w-full accent-primary-500" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Title Weight: {{ titleFontWeight }}</span>
                        <input type="range" v-model.number="titleFontWeight" min="100" max="900" step="100"
                            class="w-full accent-primary-500" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Header Size: {{ headerFontSize.toFixed(1) }}x</span>
                        <input type="range" v-model.number="headerFontSize" min="0.5" max="2.0" step="0.1"
                            class="w-full accent-primary-500" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Timings Size: {{ timingsFontSize.toFixed(1) }}x</span>
                        <input type="range" v-model.number="timingsFontSize" min="0.5" max="2.0" step="0.1"
                            class="w-full accent-primary-500" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Title Drop Shadow:</span>
                        <USwitch v-model="titleDropShadow" />
                    </div>
                    <div v-if="titleDropShadow" class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Shadow Blur: {{ titleShadowBlur }}px</span>
                        <input type="range" v-model.number="titleShadowBlur" min="0" max="20" step="1"
                            class="w-full accent-primary-500" />
                    </div>
                    <div v-if="titleDropShadow" class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Shadow Strength: {{ titleShadowOpacity.toFixed(1) }}</span>
                        <input type="range" v-model.number="titleShadowOpacity" min="0" max="1" step="0.1"
                            class="w-full accent-primary-500" />
                    </div>
                </div>
            </div>

            <!-- Colors Section -->
            <div>
                <UButton
                    :icon="showColors ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                    variant="ghost" color="neutral" size="xs"
                    class="text-white font-semibold text-xs"
                    @click="showColors = !showColors"
                >
                    Colors
                </UButton>
                <div v-if="showColors" class="mt-2 flex flex-col gap-3 pl-2 border-l-2 border-gray-700">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Header Background:</span>
                        <input type="color" v-model="headerBgColor" class="color-input" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Header Text:</span>
                        <input type="color" v-model="headerTextColor" class="color-input" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Title Text:</span>
                        <input type="color" v-model="titleTextColor" class="color-input" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Timings Text:</span>
                        <input type="color" v-model="timingsTextColor" class="color-input" />
                    </div>
                </div>
            </div>

            <!-- Table Style Section -->
            <div>
                <UButton
                    :icon="showTableStyle ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                    variant="ghost" color="neutral" size="xs"
                    class="text-white font-semibold text-xs"
                    @click="showTableStyle = !showTableStyle"
                >
                    Table Style
                </UButton>
                <div v-if="showTableStyle" class="mt-2 flex flex-col gap-3 pl-2 border-l-2 border-gray-700">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Table Blur: {{ tableBlur }}px</span>
                        <input type="range" v-model.number="tableBlur" min="0" max="40" step="1"
                            class="w-full accent-primary-500" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Overlay: {{ tableBlurOpacity > 0 ? 'White' : tableBlurOpacity < 0 ? 'Black' : 'None' }} {{ Math.abs(tableBlurOpacity).toFixed(1) }}</span>
                        <input type="range" v-model.number="tableBlurOpacity" min="-1" max="1" step="0.05"
                            class="w-full accent-primary-500" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Table Offset: {{ tableOffset }}px</span>
                        <input type="range" v-model.number="tableOffset" min="-300" max="300" step="10"
                            class="w-full accent-primary-500" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Column Spacing: {{ columnSpacing.toFixed(2) }}rem</span>
                        <input type="range" v-model.number="columnSpacing" min="0" max="2" step="0.05"
                            class="w-full accent-primary-500" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Row Spacing: {{ rowSpacing.toFixed(2) }}rem</span>
                        <input type="range" v-model.number="rowSpacing" min="0" max="2" step="0.05"
                            class="w-full accent-primary-500" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Alternating Row Colors:</span>
                        <USwitch v-model="useAlternatingColors" />
                    </div>
                    <div v-if="useAlternatingColors" class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Even Row Color:</span>
                        <input type="color" v-model="evenRowColor" class="color-input" />
                    </div>
                    <div v-if="useAlternatingColors" class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Odd Row Color:</span>
                        <input type="color" v-model="oddRowColor" class="color-input" />
                    </div>
                    <div v-if="useAlternatingColors" class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold"></span>
                        <UButton variant="outline" color="neutral" size="xs" @click="resetAlternatingColors">
                            Reset Row Colors
                        </UButton>
                    </div>
                </div>
            </div>

            <!-- Highlights Section -->
            <div>
                <UButton
                    :icon="showHighlights ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                    variant="ghost" color="neutral" size="xs"
                    class="text-white font-semibold text-xs"
                    @click="showHighlights = !showHighlights"
                >
                    Highlights
                </UButton>
                <div v-if="showHighlights" class="mt-2 flex flex-col gap-3 pl-2 border-l-2 border-gray-700">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Highlight Mon/Thu:</span>
                        <div class="flex items-center gap-2">
                            <USwitch v-model="highlightMondayThursday" />
                            <input v-if="highlightMondayThursday" type="color" v-model="mondayThursdayColor" class="color-input color-input-sm" />
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Highlight White Days:</span>
                        <div class="flex items-center gap-2">
                            <USwitch v-model="highlightWhiteDays" />
                            <input v-if="highlightWhiteDays" type="color" v-model="whiteDaysColor" class="color-input color-input-sm" />
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Today Color:</span>
                        <input type="color" v-model="todayColor" class="color-input" />
                    </div>
                </div>
            </div>

            <!-- Columns Section -->
            <div>
                <UButton
                    :icon="showColumns ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                    variant="ghost" color="neutral" size="xs"
                    class="text-white font-semibold text-xs"
                    @click="showColumns = !showColumns"
                >
                    Columns
                </UButton>
                <div v-if="showColumns" class="mt-2 flex flex-col gap-2 pl-2 border-l-2 border-gray-700">
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <label class="flex items-center gap-1 text-sm text-white cursor-pointer">
                            <UCheckbox v-model="colDate" /> Date
                        </label>
                        <label class="flex items-center gap-1 text-sm text-white cursor-pointer">
                            <UCheckbox v-model="colHijri" /> Hijri
                        </label>
                        <label class="flex items-center gap-1 text-sm text-white cursor-pointer">
                            <UCheckbox v-model="colFajr" /> Fajr
                        </label>
                        <label class="flex items-center gap-1 text-sm text-white cursor-pointer">
                            <UCheckbox v-model="colSunrise" /> Sunrise
                        </label>
                        <label class="flex items-center gap-1 text-sm text-white cursor-pointer">
                            <UCheckbox v-model="colDhuhr" /> Dhuhr
                        </label>
                        <label class="flex items-center gap-1 text-sm text-white cursor-pointer">
                            <UCheckbox v-model="colAsr" /> Asr
                        </label>
                        <label class="flex items-center gap-1 text-sm text-white cursor-pointer">
                            <UCheckbox v-model="colMaghrib" /> Maghrib
                        </label>
                        <label class="flex items-center gap-1 text-sm text-white cursor-pointer">
                            <UCheckbox v-model="colIsha" /> Isha
                        </label>
                    </div>
                </div>
            </div>

            <!-- Day Range Section -->
            <div>
                <UButton
                    :icon="showDayRange ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                    variant="ghost" color="neutral" size="xs"
                    class="text-white font-semibold text-xs"
                    @click="showDayRange = !showDayRange"
                >
                    Day Range
                </UButton>
                <div v-if="showDayRange" class="mt-2 flex flex-col gap-3 pl-2 border-l-2 border-gray-700">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Range:</span>
                        <USelectMenu v-model="dayRange" :items="dayRangeOptions" value-key="value"
                            label-key="label" size="sm" class="w-full" />
                    </div>
                    <div v-if="dayRange === 'range'" class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Start Day:</span>
                        <UInput type="number" v-model.number="dayRangeStart" size="sm" :min="1" :max="30" class="w-full" />
                    </div>
                    <div v-if="dayRange === 'range'" class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">End Day:</span>
                        <UInput type="number" v-model.number="dayRangeEnd" size="sm" :min="1" :max="30" class="w-full" />
                    </div>
                    <div v-if="dayRange === 'single'" class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <span class="text-sm text-white font-semibold">Day:</span>
                        <UInput type="number" v-model.number="daySingle" size="sm" :min="1" :max="30" class="w-full" />
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.color-input {
    width: 100%;
    height: 2rem;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    background: transparent;
}

.color-input-sm {
    width: 2.5rem;
    height: 1.75rem;
}
</style>
