<script setup>
import moment from "moment-timezone";

const props = defineProps({
    prayerTimes: Object
})

</script>


<template>
    <div class="prayer-times-table-container">
        <table v-if="prayerTimes" class="prayer-times-table">
            <thead>
                <tr class="prayer-times-table-header-row">
                    <th>Date</th>
                    <th>Hijri</th>
                    <th>Fajr</th>
                    <th>Sunrise</th>
                    <th>Dhuhr</th>
                    <th>Asr</th>
                    <th>Maghrib</th>
                    <th>Isha</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(day, index) in prayerTimes" :class="{'today' : moment(day.date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')}">
                    <td>{{ ("0" + moment(day.date).format('D')).slice(-2) }}</td>
                    <td>{{ ("0" + moment(day.hijri.date._dayOfMonth)).slice(-2) }}</td>
                    <td>{{ moment(day.fajr).format('LT') }}</td>
                    <td>{{ moment(day.sunrise).format('LT') }}</td>
                    <td>{{ moment(day.dhuhr).format('LT') }}</td>
                    <td>{{ moment(day.asr).format('LT') }}</td>
                    <td>{{ moment(day.maghrib).format('LT') }}</td>
                    <td>{{ moment(day.isha).format('LT') }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<style>
.today {
    background-color: red !important;
}

</style>