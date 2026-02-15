<script setup>
import moment from "moment-timezone";

const props = defineProps({
    prayerTimes: Object,
    wallpaperOptions: {
        type: Object,
        default: () => ({})
    }
})

const opts = computed(() => props.wallpaperOptions || {});
const columns = computed(() => opts.value.columns || {
    date: true, hijri: true, fajr: true, sunrise: true,
    dhuhr: true, asr: true, maghrib: true, isha: true,
});

const headerFont = computed(() => opts.value.headerFont || 'Gilroy');
const timingsFont = computed(() => opts.value.timingsFont || 'Gilroy');
const headerBgColor = computed(() => opts.value.headerBgColor || '#FEC04A');
const headerTextColor = computed(() => opts.value.headerTextColor || '#011631');
const timingsTextColor = computed(() => opts.value.timingsTextColor || '#FFFFFF');
const headerFontScale = computed(() => opts.value.headerFontSize || 1.0);
const timingsFontScale = computed(() => opts.value.timingsFontSize || 1.0);
const todayColor = computed(() => opts.value.todayColor || '#FF0000');

const headerFontSize = computed(() => `${2.2 * headerFontScale.value}rem`);
const tdFontSize = computed(() => `${1.7 * timingsFontScale.value}rem`);

const headerStyle = computed(() => ({
    fontFamily: headerFont.value,
    backgroundColor: headerBgColor.value,
    color: headerTextColor.value,
    fontSize: headerFontSize.value,
}));

const tdStyle = computed(() => ({
    fontFamily: timingsFont.value,
    color: timingsTextColor.value,
    fontSize: tdFontSize.value,
}));

// Column definitions
const allColumns = [
    { key: 'date', label: 'Date' },
    { key: 'hijri', label: 'Hijri' },
    { key: 'fajr', label: 'Fajr' },
    { key: 'sunrise', label: 'Sunrise' },
    { key: 'dhuhr', label: 'Dhuhr' },
    { key: 'asr', label: 'Asr' },
    { key: 'maghrib', label: 'Maghrib' },
    { key: 'isha', label: 'Isha' },
];

const visibleColumns = computed(() =>
    allColumns.filter(col => columns.value[col.key] !== false)
);

// Day range filtering
const filteredPrayerTimes = computed(() => {
    if (!props.prayerTimes) return [];
    const days = Array.isArray(props.prayerTimes)
        ? props.prayerTimes
        : Object.values(props.prayerTimes);

    const range = opts.value.dayRange || 'full';
    if (range === 'full') return days;

    if (range === 'single') {
        const singleDay = opts.value.daySingle || 1;
        return days.filter((_, i) => i + 1 === singleDay);
    }

    // range
    const start = opts.value.dayRangeStart || 1;
    const end = opts.value.dayRangeEnd || 30;
    return days.filter((_, i) => i + 1 >= start && i + 1 <= end);
});

function getRowStyle(day, index) {
    const style = {};
    const today = moment().format('YYYY-MM-DD');
    const isToday = moment(day.date).format('YYYY-MM-DD') === today;

    if (isToday) {
        style.backgroundColor = todayColor.value;
        return style;
    }

    // White Days highlight (hijri 13, 14, 15) — full row
    if (opts.value.highlightWhiteDays && day.hijri && day.hijri.date) {
        const hijriDay = day.hijri.date.getDate();
        if (hijriDay === 13 || hijriDay === 14 || hijriDay === 15) {
            style.backgroundColor = opts.value.whiteDaysColor || '#059669';
            return style;
        }
    }

    // Monday/Thursday highlight — full row
    if (opts.value.highlightMondayThursday) {
        const dayOfWeek = new Date(day.date).getDay();
        if (dayOfWeek === 1 || dayOfWeek === 4) {
            style.backgroundColor = opts.value.mondayThursdayColor || '#2563EB';
            return style;
        }
    }

    // Alternating row colors
    if (opts.value.useAlternatingColors !== false) {
        style.backgroundColor = index % 2 === 0
            ? (opts.value.evenRowColor || 'rgba(255, 255, 255, 0.1)')
            : (opts.value.oddRowColor || 'rgba(0, 0, 0, 0.1)');
    }

    return style;
}

const timeFormat = computed(() => opts.value.use24Hour ? 'HH:mm' : 'h:mm A');

function getCellValue(day, colKey) {
    switch (colKey) {
        case 'date': return ("0" + moment(day.date).format('D')).slice(-2);
        case 'hijri': return ("0" + day.hijri.date.getDate()).slice(-2);
        case 'fajr': return moment(day.fajr).format(timeFormat.value);
        case 'sunrise': return moment(day.sunrise).format(timeFormat.value);
        case 'dhuhr': return moment(day.dhuhr).format(timeFormat.value);
        case 'asr': return moment(day.asr).format(timeFormat.value);
        case 'maghrib': return moment(day.maghrib).format(timeFormat.value);
        case 'isha': return moment(day.isha).format(timeFormat.value);
        default: return '';
    }
}
</script>


<template>
    <div class="prayer-times-table-container">
        <table v-if="prayerTimes" class="prayer-times-table">
            <thead>
                <tr class="prayer-times-table-header-row">
                    <th v-for="col in visibleColumns" :key="col.key" :style="headerStyle">{{ col.label }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(day, index) in filteredPrayerTimes" :key="index"
                    :style="getRowStyle(day, index)">
                    <td v-for="col in visibleColumns" :key="col.key" :style="tdStyle">
                        {{ getCellValue(day, col.key) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<style>
</style>
