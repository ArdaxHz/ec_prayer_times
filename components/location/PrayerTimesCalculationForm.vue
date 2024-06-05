<script setup>
import { calculateAdhanMonth } from '../../composables/adhantimes';
const { notify } = useNotification();

const props = defineProps({
    latitude: Number,
    longitude: Number
})

const emits = defineEmits(['prayer-room-update'])

const fajrAngle = ref(18);
const sightingCommittee = ref('MuslimWorldLeague');
const asrTime = ref('shafi');
const month = ref(new Date().getMonth());
const year = ref(new Date().getFullYear());

const sightingCommitteeList = [{ "id": "MuslimWorldLeague", "name": "Muslim World League" }, { "id": "Egyptian", "name": "Egyptian" }, { "id": "Karachi", "name": "Karachi" }, { "id": "UmmAlQura", "name": "Umm Al Qura" }, { "id": "Dubai", "name": "Dubai" }, { "id": "MoonsightingCommittee", "name": "Moonsighting Committee" }, { "id": "NorthAmerica", "name": "North America" }, { "id": "Kuwait", "name": "Kuwait" }, { "id": "Qatar", "name": "Qatar" }, { "id": "Singapore", "name": "Singapore" }, { "id": "Tehran", "name": "Tehran" }, { "id": "Turkey", "name": "Turkey" }];
const formMonthSelect = ref(0);
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
    console.log("GET MONTH AND YEAR")
    month.value = months.value[formMonthSelect.value].index;
    year.value = months.value[formMonthSelect.value].year;
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
    const prayerTimes = calculateAdhanMonth(props.latitude, props.longitude, date, { 'fajrAngle': fajrAngle.value, 'CalculationMethod': sightingCommittee.value, 'madhab': asrTime.value })
    emits('prayer-room-update', prayerTimes)
}

function autoCalculate() {
    calculateMonth()
}

watch(() => props.latitude, () => {
    autoCalculate()
})

onMounted(() => {
    if (props.latitude && props.longitude) {
        console.log("FORM MOUNTED WITH LOCATION")
        autoCalculate()
    }
})
</script>

<template>
    <form class="form-container">
        <div class="form-group">
            <label for="fajrAngle">Fajr Angle:</label>
            <input type="number" id="fajrAngle" v-model="fajrAngle">
        </div>
        <div class="form-group">
            <label for="sightingCommittee">Sighting Committee:</label>
            <select id="sightingCommittee" v-model="sightingCommittee">
                <option disabled value="">Please select one</option>

                <option v-for="sightingCom of sightingCommitteeList" :value="sightingCom.id">{{ sightingCom.name }}
                </option>
            </select>
        </div>

        <div class="form-group">
            <label for="asrTime">Asr Time:</label>
            <div>
                <label class="radio-option">
                    <input type="radio" value="shafi" v-model="asrTime">
                    <span class="radio-text"><span>Early</span></span>
                </label>
                <label class="radio-option">
                    <input type="radio" value="hanafi" v-model="asrTime">
                    <span class="radio-text"><span>Late</span></span>
                </label>
            </div>
        </div>

        <div class="form-group">
            <label for="month">Month:</label>
            <select id="month" v-model="formMonthSelect">
                <option disabled value="">Please select one</option>
                <option v-for="(month, index) in months" :key="month.index" :value="index">{{ month.name }}
                </option>
            </select>
        </div>

        <div class="button-group">
            <button type="submit" class="buttons" @click.prevent="calculateMonth">Calculate
                Month</button>
        </div>
    </form>
</template>


<style>
#sightingCommittee {
    border-radius: 5px;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 15px;

    font-size: 1.125rem;
    line-height: 1.75rem;
}

.form-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.form-group input[type="number"] {
    width: 100px;

}

.form-group select {
    width: fit-content;
}

.form-group input[type="number"],
.form-group select {
    border: 0;
    border-radius: 0.25rem;
    padding: 0.175rem;
}

.form-group div {
    display: flex;
    gap: 10px;
}

.radio-option {
    display: inline-block;
    cursor: pointer;
}

.radio-option input[type="radio"] {
    display: none;
}

.radio-option .radio-text {
    padding: 0.175rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    background-color: lightblue;
}

.radio-option .radio-text span {
    color: black;
}

.radio-option input[type="radio"]:checked+.radio-text {
    border-color: green;
}

.radio-option input[type="radio"]:checked+.radio-text span {
    color: green;
}

.button-group button:disabled {
    cursor: not-allowed;
    pointer-events: none;
}

.button-group button[type="submit"] {
    width: 100%;
}
</style>../composables/adhantimes