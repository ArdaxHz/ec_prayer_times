<script setup>
import { calculateAdhanMonth, calculateAdhanHijriMonth, getNext12HijriMonths } from '~/composables/adhantimes';
const { notify } = useNotification();

const props = defineProps({
    latitude: Number,
    longitude: Number,
    gregorianDate: Object
})

const emits = defineEmits(['updatePrayerTimetable', 'updateSelectedHijriMonth'])

const fajrAngle = ref(18);
const sightingCommittee = ref('MuslimWorldLeague');
const madhabMethod = ref('shafi');
// Calendar type toggle
const calendarType = ref('hijri');
const calendarTypes = [{ value: 'hijri', label: 'Hijri' }, { value: 'gregorian', label: 'Gregorian' }];

// Hijri month selection
const hijriMonths = ref(getNext12HijriMonths());
const selectedHijriMonthIndex = ref(0);

// Gregorian month selection
const formMonthSelect = ref(new Date().getMonth());
const gregorianMonths = ref((function () {
    const monthsNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const d = new Date();
    const currentYear = d.getFullYear();
    const nextYear = currentYear + 1;
    const rest = monthsNames.slice(d.getMonth()).map((month) => {
        return { index: monthsNames.indexOf(month), name: `${month} ${currentYear}`, year: currentYear };
    });
    const gone = monthsNames.slice(0, d.getMonth()).map((month) => {
        return { index: monthsNames.indexOf(month), name: `${month} ${nextYear}`, year: nextYear };
    });
    return rest.concat(gone);
})());

// Advanced settings
const showAdvanced = ref(false);
const showAdjustments = ref(false);
const highLatitudeRule = ref('recommended');
const polarCircleResolution = ref('Unresolved');
const shafaq = ref('General');
const rounding = ref('Nearest');
const ishaAngle = ref(null);
const maghribAngle = ref(null);

// Per-prayer adjustments (minutes) — explicit refs for reactivity
const adjFajr = ref(0);
const adjSunrise = ref(0);
const adjDhuhr = ref(0);
const adjAsr = ref(0);
const adjMaghrib = ref(0);
const adjIsha = ref(0);

const madhabs = [{ "value": "shafi", "label": "Early" }, { "value": "hanafi", "label": "Late" }];
const sightingCommitteeList = [{ "id": "MuslimWorldLeague", "name": "Muslim World League" }, { "id": "Egyptian", "name": "Egyptian" }, { "id": "Karachi", "name": "Karachi" }, { "id": "UmmAlQura", "name": "Umm Al Qura" }, { "id": "Dubai", "name": "Dubai" }, { "id": "MoonsightingCommittee", "name": "Moonsighting Committee" }, { "id": "NorthAmerica", "name": "North America" }, { "id": "Kuwait", "name": "Kuwait" }, { "id": "Qatar", "name": "Qatar" }, { "id": "Singapore", "name": "Singapore" }, { "id": "Tehran", "name": "Tehran" }, { "id": "Turkey", "name": "Turkey" }];
const highLatitudeRules = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'MiddleOfTheNight', label: 'Middle of the Night' },
    { value: 'SeventhOfTheNight', label: 'Seventh of the Night' },
    { value: 'TwilightAngle', label: 'Twilight Angle' }
];
const polarCircleResolutions = [
    { value: 'Unresolved', label: 'Unresolved' },
    { value: 'AqrabBalad', label: 'Aqrab Balad' },
    { value: 'AqrabYaum', label: 'Aqrab Yaum' }
];
const shafaqOptions = [
    { value: 'General', label: 'General' },
    { value: 'Ahmer', label: 'Ahmer (Red)' },
    { value: 'Abyad', label: 'Abyad (White)' }
];
const roundingOptions = [
    { value: 'Nearest', label: 'Nearest' },
    { value: 'Up', label: 'Up' },
    { value: 'None', label: 'None' }
];

const hijriMonthOptions = computed(() =>
    hijriMonths.value.map((m, i) => ({ value: i, label: m.label }))
);

const isHijri = computed(() => calendarType.value === 'hijri');
const isMoonsightingCommittee = computed(() => sightingCommittee.value === 'MoonsightingCommittee');

const isLocationEmpty = computed(() => {
    return props.latitude == null || props.longitude == null;
});

function clampAngle(val) {
    const n = Number(val);
    if (isNaN(n)) return null;
    return Math.max(0, Math.min(90, n));
}

function clampAdjustment(val) {
    const n = Number(val);
    if (isNaN(n)) return 0;
    return Math.max(-60, Math.min(60, Math.round(n)));
}

function buildCustomParams() {
    const customParams = {
        fajrAngle: fajrAngle.value,
        CalculationMethod: sightingCommittee.value,
        madhab: madhabMethod.value,
        highLatitudeRule: highLatitudeRule.value,
        polarCircleResolution: polarCircleResolution.value,
        rounding: rounding.value,
    };

    if (isMoonsightingCommittee.value) {
        customParams.shafaq = shafaq.value;
    }
    if (ishaAngle.value != null && ishaAngle.value !== '') {
        customParams.ishaAngle = clampAngle(ishaAngle.value);
    }
    if (maghribAngle.value != null && maghribAngle.value !== '') {
        customParams.maghribAngle = clampAngle(maghribAngle.value);
    }

    const adj = {
        fajr: clampAdjustment(adjFajr.value),
        sunrise: clampAdjustment(adjSunrise.value),
        dhuhr: clampAdjustment(adjDhuhr.value),
        asr: clampAdjustment(adjAsr.value),
        maghrib: clampAdjustment(adjMaghrib.value),
        isha: clampAdjustment(adjIsha.value),
    };
    if (Object.values(adj).some(v => v !== 0)) {
        customParams.adjustments = adj;
    }

    return customParams;
}

function calculateMonth() {
    if (isLocationEmpty.value) {
        return;
    }

    try {
        const customParams = buildCustomParams();

        if (isHijri.value) {
            const selected = hijriMonths.value[selectedHijriMonthIndex.value];
            if (!selected) return;

            const prayerTimes = calculateAdhanHijriMonth(
                props.latitude, props.longitude,
                selected.hijriYear, selected.hijriMonth,
                customParams
            );
            emits('updatePrayerTimetable', prayerTimes);
            emits('updateSelectedHijriMonth', selected);
        } else {
            const selectedOption = gregorianMonths.value.find(option => option.index === formMonthSelect.value);
            if (!selectedOption) return;

            const date = new Date();
            date.setMonth(selectedOption.index);
            date.setFullYear(selectedOption.year);

            const prayerTimes = calculateAdhanMonth(
                props.latitude, props.longitude,
                date, customParams
            );
            emits('updatePrayerTimetable', prayerTimes);
            emits('updateSelectedHijriMonth', null);
        }
    } catch (error) {
        console.error('Prayer time calculation error:', error);
        notify({
            title: "Calculation error.",
            text: error.message || "An error occurred while calculating prayer times.",
            type: "error"
        });
    }
}

function autoCalculate() {
    calculateMonth();
}

// Watch all reactive form values
watch(
    [fajrAngle, sightingCommittee, madhabMethod, selectedHijriMonthIndex, formMonthSelect, calendarType,
     highLatitudeRule, polarCircleResolution, shafaq, rounding,
     ishaAngle, maghribAngle,
     adjFajr, adjSunrise, adjDhuhr, adjAsr, adjMaghrib, adjIsha],
    () => { calculateMonth(); }
);

watch(() => props.latitude, () => {
    autoCalculate()
})

onMounted(() => {
    hijriMonths.value = getNext12HijriMonths();
    if (props.latitude != null && props.longitude != null) {
        autoCalculate();
    }
})
</script>

<template>
    <div class="form-container flex gap-4 flex-col">
        <div class="flex flex-col gap-4 sm:gap-5">
            <!-- Fajr Angle -->
            <div class="form-row">
                <div class="form-label-cell">
                    <UFormGroup label="Fajr Angle:" :ui="{ label: { base: 'text-lg sm:text-xl text-white font-semibold' } }" />
                </div>
                <div class="form-input-cell">
                    <UInput type="number" v-model="fajrAngle" size="md" :min="0" :max="90" step="0.1"
                        :ui="{ rounded: 'rounded-lg', color: { white: { outline: 'text-black' } } }" />
                </div>
            </div>

            <!-- Sighting Committee -->
            <div class="form-row">
                <div class="form-label-cell">
                    <UFormGroup label="Sighting Committee:"
                        :ui="{ label: { base: 'text-lg sm:text-xl text-white font-semibold' } }" />
                </div>
                <div class="form-input-cell">
                    <UInputMenu v-model="sightingCommittee" :options="sightingCommitteeList" value-attribute="id"
                        option-attribute="name" size="md" />
                </div>
            </div>

            <!-- Asr Time -->
            <div class="form-row">
                <div class="form-label-cell">
                    <UFormGroup label="Asr Time:" :ui="{ label: { base: 'text-lg sm:text-xl text-white font-semibold' } }" />
                </div>
                <div class="form-input-cell">
                    <div class="form-radio-group">
                        <URadio v-for="madhab of madhabs" :key="madhab.value" v-model="madhabMethod" v-bind="madhab"
                            :label="madhab.label" class="flex radio-option group" :ui="{
                        label: `flex cursor-pointer items-center text-md px-3 py-1 rounded-lg hover:shadow-lg text-whtie
                        ring-1 ring-inset ring-gray-300
                        focus:ring-2 focus:ring-primary-500
                        group-has-[:checked]:bg-primary-500 group-has-[:checked]:text-white group-has-[:checked]:ring-primary-500
                        hover:bg-primary-50 group-has-[:checked]:hover:bg-primary-600
                        dark:hover:bg-primary-950 dark:ring-gray-700 dark:focus:ring-primary-400
                        dark:group-has-[:checked]:bg-primary-700 dark:group-has-[:checked]:ring-primary-700
                        dark:group-has-[:checked]:hover:bg-primary-600 dark:group-has-[:checked]:hover:ring-primary-600 `,
                        inner: 'm-0',
                    }" />
                    </div>
                </div>
            </div>

            <!-- Calendar -->
            <div class="form-row">
                <div class="form-label-cell">
                    <UFormGroup label="Calendar:" :ui="{ label: { base: 'text-lg sm:text-xl text-white font-semibold' } }" />
                </div>
                <div class="form-input-cell">
                    <div class="form-radio-group">
                        <URadio v-for="cal of calendarTypes" :key="cal.value" v-model="calendarType" v-bind="cal"
                            :label="cal.label" class="flex radio-option group" :ui="{
                        label: `flex cursor-pointer items-center text-md px-3 py-1 rounded-lg hover:shadow-lg text-whtie
                        ring-1 ring-inset ring-gray-300
                        focus:ring-2 focus:ring-primary-500
                        group-has-[:checked]:bg-primary-500 group-has-[:checked]:text-white group-has-[:checked]:ring-primary-500
                        hover:bg-primary-50 group-has-[:checked]:hover:bg-primary-600
                        dark:hover:bg-primary-950 dark:ring-gray-700 dark:focus:ring-primary-400
                        dark:group-has-[:checked]:bg-primary-700 dark:group-has-[:checked]:ring-primary-700
                        dark:group-has-[:checked]:hover:bg-primary-600 dark:group-has-[:checked]:hover:ring-primary-600 `,
                        inner: 'm-0',
                    }" />
                    </div>
                </div>
            </div>

            <!-- Month -->
            <div class="form-row">
                <div class="form-label-cell">
                    <UFormGroup label="Month:" :ui="{ label: { base: 'text-lg sm:text-xl text-white font-semibold' } }" />
                </div>
                <div class="form-input-cell">
                    <USelectMenu v-if="isHijri" v-model="selectedHijriMonthIndex" :options="hijriMonthOptions"
                        value-attribute="value" option-attribute="label" size="md" />
                    <USelectMenu v-else v-model="formMonthSelect" :options="gregorianMonths"
                        value-attribute="index" option-attribute="name" size="md" />
                </div>
            </div>
        </div>

        <!-- Advanced Settings -->
        <div class="mt-2">
            <UButton
                :icon="showAdvanced ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                variant="ghost"
                color="gray"
                class="text-white font-semibold text-sm"
                @click="showAdvanced = !showAdvanced"
            >
                Advanced Settings
            </UButton>

            <div v-if="showAdvanced" class="mt-3 flex flex-col gap-4 pl-2 border-l-2 border-gray-600">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <span class="text-sm text-white font-semibold">High Latitude Rule:</span>
                    <USelectMenu v-model="highLatitudeRule" :options="highLatitudeRules" value-attribute="value"
                        option-attribute="label" size="sm" />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <span class="text-sm text-white font-semibold">Polar Circle Resolution:</span>
                    <USelectMenu v-model="polarCircleResolution" :options="polarCircleResolutions" value-attribute="value"
                        option-attribute="label" size="sm" />
                </div>
                <div v-if="isMoonsightingCommittee" class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <span class="text-sm text-white font-semibold">Shafaq (Twilight):</span>
                    <USelectMenu v-model="shafaq" :options="shafaqOptions" value-attribute="value"
                        option-attribute="label" size="sm" />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <span class="text-sm text-white font-semibold">Rounding:</span>
                    <USelectMenu v-model="rounding" :options="roundingOptions" value-attribute="value"
                        option-attribute="label" size="sm" />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <span class="text-sm text-white font-semibold">Isha Angle Override:</span>
                    <UInput type="number" v-model="ishaAngle" size="sm" placeholder="Default"
                        :min="0" :max="90" step="0.1"
                        :ui="{ color: { white: { outline: 'text-black' } } }" />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <span class="text-sm text-white font-semibold">Maghrib Angle Override:</span>
                    <UInput type="number" v-model="maghribAngle" size="sm" placeholder="Default"
                        :min="0" :max="90" step="0.1"
                        :ui="{ color: { white: { outline: 'text-black' } } }" />
                </div>

                <!-- Per-prayer adjustments — each ref bound explicitly -->
                <div>
                    <UButton
                        :icon="showAdjustments ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                        variant="ghost"
                        color="gray"
                        class="text-white font-semibold text-xs"
                        size="xs"
                        @click="showAdjustments = !showAdjustments"
                    >
                        Per-Prayer Adjustments (minutes)
                    </UButton>

                    <div v-if="showAdjustments" class="mt-2 flex flex-col gap-2 pl-2 border-l-2 border-gray-700">
                        <div class="grid grid-cols-2 gap-2 items-center">
                            <span class="text-xs text-gray-300">Fajr:</span>
                            <UInput type="number" v-model="adjFajr" size="xs" :min="-60" :max="60" step="1"
                                :ui="{ color: { white: { outline: 'text-black' } } }" />
                        </div>
                        <div class="grid grid-cols-2 gap-2 items-center">
                            <span class="text-xs text-gray-300">Sunrise:</span>
                            <UInput type="number" v-model="adjSunrise" size="xs" :min="-60" :max="60" step="1"
                                :ui="{ color: { white: { outline: 'text-black' } } }" />
                        </div>
                        <div class="grid grid-cols-2 gap-2 items-center">
                            <span class="text-xs text-gray-300">Dhuhr:</span>
                            <UInput type="number" v-model="adjDhuhr" size="xs" :min="-60" :max="60" step="1"
                                :ui="{ color: { white: { outline: 'text-black' } } }" />
                        </div>
                        <div class="grid grid-cols-2 gap-2 items-center">
                            <span class="text-xs text-gray-300">Asr:</span>
                            <UInput type="number" v-model="adjAsr" size="xs" :min="-60" :max="60" step="1"
                                :ui="{ color: { white: { outline: 'text-black' } } }" />
                        </div>
                        <div class="grid grid-cols-2 gap-2 items-center">
                            <span class="text-xs text-gray-300">Maghrib:</span>
                            <UInput type="number" v-model="adjMaghrib" size="xs" :min="-60" :max="60" step="1"
                                :ui="{ color: { white: { outline: 'text-black' } } }" />
                        </div>
                        <div class="grid grid-cols-2 gap-2 items-center">
                            <span class="text-xs text-gray-300">Isha:</span>
                            <UInput type="number" v-model="adjIsha" size="xs" :min="-60" :max="60" step="1"
                                :ui="{ color: { white: { outline: 'text-black' } } }" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style>
.form-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.25rem;
    align-items: center;
}

@media (min-width: 640px) {
    .form-row {
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
}

.form-label-cell {
    display: flex;
    align-items: center;
    justify-content: start;
    text-align: left;
    min-height: 2rem;
}

.form-label-cell > * {
    display: flex;
    align-items: center;
}

.form-input-cell {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-height: 2.5rem;
    width: 100%;
}

.form-input-cell > * {
    width: 100%;
}

.form-container {
    font-size: 1.125rem;
    line-height: 1.75rem;
}

.form-radio-group {
    display: flex;
    flex: 1 1 0px;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: end;
    align-items: center;
    margin: 0;
}

.form-radio-group input[type="radio"] {
    display: none;
    margin: 0;
}
</style>
