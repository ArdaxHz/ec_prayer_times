<script setup>
import { calculateAdhanToday, calculateAdhanMonth } from '../../composables/adhantimes'

const props = defineProps({
    latitude: Number,
    longitude: Number
})

const emits = defineEmits(['prayer-room-update'])


const fajrAngle = ref(18);
const sightingCommittee = ref('MuslimWorldLeague');
const asrTime = ref('shafi');


const isLocationEmpty = computed(() => {
    console.log("DISABLED")
    return !props.latitude || !props.longitude;
});

function calculateMonth() {
    console.log("CALCULATE MONTH")
    const prayerTimes = calculateAdhanMonth(props.latitude, props.longitude, new Date(), { 'fajrAngle': fajrAngle.value, 'CalculationMethod': sightingCommittee.value, 'madhab': asrTime.value })
    emits('prayer-room-update', prayerTimes)
}

function calculateToday() {
    console.log("CALCULATE DAY")
    const prayerTimes = calculateAdhanToday(props.latitude, props.longitude, new Date(), { 'fajrAngle': fajrAngle.value, 'CalculationMethod': sightingCommittee.value, 'madhab': asrTime.value })
    emits('prayer-room-update', prayerTimes)
}


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
                <option value="MuslimWorldLeague">Muslim World League</option>
                <option value="Egyptian">Egyptian</option>
                <option value="Karachi">Karachi</option>
                <option value="UmmAlQura">Umm Al Qura</option>
                <option value="Dubai">Dubai</option>
                <option value="MoonsightingCommittee">Moonsighting Committee</option>
                <option value="NorthAmerica">North America</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Qatar">Qatar</option>
                <option value="Singapore">Singapore</option>
                <option value="Tehran">Tehran</option>
                <option value="Turkey">Turkey</option>
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

        <div class="button-group">
            <button type="submit" class="buttons" :disabled="isLocationEmpty" @click.prevent="calculateToday">Calculate
                Today</button>
            <button type="submit" class="buttons" :disabled="isLocationEmpty" @click.prevent="calculateMonth">Calculate
                Whole Month</button>
        </div>
    </form>
</template>


<style>
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
</style>../composables/adhantimes