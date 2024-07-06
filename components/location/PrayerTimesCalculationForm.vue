<script setup>
import moment from 'moment';
import { calculateAdhanMonth } from '~/composables/adhantimes';
const { notify } = useNotification();

const props = defineProps({
    latitude: Number,
    longitude: Number,
    gregorianDate: Object
})

const emits = defineEmits(['updatePrayerTimetable'])

const fajrAngle = ref(18);
const sightingCommittee = ref('MuslimWorldLeague');
const madhabMethod = ref('shafi');
const month = ref(new Date().getMonth());
const year = ref(new Date().getFullYear());

const formMonthSelect = ref(month.value);
const madhabs = [{ "value": "shafi", "label": "Early" }, { "value": "hanafi", "label": "Late" }];
const sightingCommitteeList = [{ "id": "MuslimWorldLeague", "name": "Muslim World League" }, { "id": "Egyptian", "name": "Egyptian" }, { "id": "Karachi", "name": "Karachi" }, { "id": "UmmAlQura", "name": "Umm Al Qura" }, { "id": "Dubai", "name": "Dubai" }, { "id": "MoonsightingCommittee", "name": "Moonsighting Committee" }, { "id": "NorthAmerica", "name": "North America" }, { "id": "Kuwait", "name": "Kuwait" }, { "id": "Qatar", "name": "Qatar" }, { "id": "Singapore", "name": "Singapore" }, { "id": "Tehran", "name": "Tehran" }, { "id": "Turkey", "name": "Turkey" }];
const months = ref((function () {
    const monthsNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const d = new Date();
    const currentYear = d.getFullYear();
    const nextYear = currentYear + 1;
    const rest = monthsNames.slice(d.getMonth()).map((month, _) => {
        return { index: monthsNames.indexOf(month), name: `${month} ${currentYear}`, year: currentYear };
    });
    const gone = monthsNames.slice(0, d.getMonth()).map((month, _) => {
        return { index: monthsNames.indexOf(month), name: `${month} ${nextYear}`, year: nextYear };
    });

    const monthsMap = rest.concat(gone);
    return monthsMap;
})());

const isLocationEmpty = computed(() => {
    return !props.latitude || !props.longitude;
});

function getMonthAndYear() {
    console.log("GET MONTH AND YEAR");
    const selectedOption = months.value.find(option => option.index === formMonthSelect.value);

    if (!selectedOption) {
        console.log("NO SELECTED OPTION")
        return
    }

    month.value = selectedOption.index;
    year.value = selectedOption.year;
}

function calculateMonth() {
    if (isLocationEmpty.value) {
        console.log("LOCATION IS EMPTY")
        notify({
            title: "Location not found.",
            text: "Cannot calculate prayer times without location. Please provide a location.",
            type: "warn"
        });
        return
    }

    console.log("CALCULATE MONTH")
    getMonthAndYear();
    const date = new Date();
    date.setMonth(month.value);
    date.setFullYear(year.value);
    const prayerTimes = calculateAdhanMonth(props.latitude, props.longitude, date, { 'fajrAngle': fajrAngle.value, 'CalculationMethod': sightingCommittee.value, 'madhab': madhabMethod.value })
    emits('updatePrayerTimetable', prayerTimes)
}

function autoCalculate() {
    calculateMonth();
}

watch([fajrAngle, sightingCommittee, madhabMethod, formMonthSelect], ([newA, newB, newC, newD], [prevA, prevB, prevC, prevD]) => {
    calculateMonth();
});

watch(() => props.latitude, () => {
    autoCalculate()
})

onMounted(() => {
    if (props.latitude && props.longitude) {
        console.log("FORM MOUNTED WITH LOCATION");
        autoCalculate();
    }
})
</script>

<template>
    <div class="form-container flex gap-4 flex-col">
        <div class="grid grid-cols-2 text-center justify-center">
            <div class="grid gap-y-10 sm:gap-y-5 items-center">
                <div class="inner-div-text">
                    <UFormGroup label="Fajr Angle:" :ui="{ label: { base: 'text-xl text-white font-semibold' } }" />
                </div>
                <div class="inner-div-text">
                    <UFormGroup label="Sighting Committee:"
                        :ui="{ label: { base: 'text-xl text-white font-semibold' } }" />
                </div>
                <div class="inner-div-text">
                    <UFormGroup label="Asr Time:" :ui="{ label: { base: 'text-xl text-white font-semibold' } }" />
                </div>
                <div class="inner-div-text">
                    <UFormGroup label="Month:" :ui="{ label: { base: 'text-xl text-white font-semibold' } }" />
                </div>
            </div>
            <div class="grid gap-y-10 sm:gap-y-5 justify-end">
                <div>
                    <UInput type="number" v-model="fajrAngle" size="md"
                        :ui="{ rounded: 'rounded-lg', wrapper: 'max-w-[20rem]', color: { white: { outline: 'text-black' } } }" />
                </div>
                <div>
                    <UInputMenu v-model="sightingCommittee" :options="sightingCommitteeList" value-attribute="id"
                        option-attribute="name" size="md" :ui="{ wrapper: 'max-w-[20rem]', }" />
                </div>

                <div class="flex w-max flex-end ml-auto">
                    <div class="form-radio-group ">
                        <URadio v-for=" madhab of madhabs " :key="madhab.value" v-model="madhabMethod" v-bind="madhab"
                            :label="madhab.label" class="flex radio-option group" :ui="{
                        label: `flex cursor-pointer text-md px-3 py-1 rounded-lg hover:shadow-lg text-whtie
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
                <div>
                    <UInputMenu v-model="formMonthSelect" :options="months" value-attribute="index"
                        option-attribute="name" size="md" variant="outline" />
                </div>
            </div>
        </div>
        <!-- <p v-if="gregorianDate && moment(gregorianDate).isDST()" class="text-red-500">*Check your local masjid for Isha
            time.*</p> -->
    </div>
</template>


<style>
.inner-div-text>* {
    display: flex;
    justify-content: start;
    text-align: left;
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
    margin: 0;
}

.form-radio-group input[type="radio"] {
    display: none;
    margin: 0;
}
</style>
