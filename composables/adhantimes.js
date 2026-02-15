import moment from "moment-timezone";
import { Coordinates, CalculationMethod, PrayerTimes, HighLatitudeRule, Madhab, PolarCircleResolution, Shafaq, Rounding } from 'adhan';
import HijrahDate from 'hijrah-date';

export const HijriMonths = {
    "SHORTMONTH": [
        "Muh",
        "Saf",
        "Rab I",
        "Rab II",
        "Jum I",
        "Jum II",
        "Raj",
        "Sha",
        "Ram",
        "Shaw",
        "Dhuʻl-Q",
        "Dhuʻl-H"
    ],
    "STANDALONEMONTH": [
        "Muharram",
        "Safar",
        "Rabiʻ I",
        "Rabiʻ II",
        "Jumada I",
        "Jumada II",
        "Rajab",
        "Shaʻban",
        "Ramadan",
        "Shawwal",
        "Dhuʻl-Qiʻdah",
        "Dhuʻl-Hijjah"
    ]
}

export function convertToHijri(date) {
    const hijriDate = new HijrahDate(date);
    // getMonth() is 0-based: 0=Muharram, 7=Sha'ban, 8=Ramadan, 11=Dhul-Hijjah
    return { "date": hijriDate, "month_long": HijriMonths.STANDALONEMONTH[hijriDate.getMonth()], "month_short": HijriMonths.SHORTMONTH[hijriDate.getMonth()] };
}

export function calculateAdhanTimesDay(latitude, longitude, date, customParams) {
    const coordinates = new Coordinates(latitude, longitude);

    const paramsToUse = CalculationMethod[customParams['CalculationMethod']] ? CalculationMethod[customParams['CalculationMethod']]() : CalculationMethod.MuslimWorldLeague();

    if (customParams['fajrAngle'] != null) {
        paramsToUse.fajrAngle = customParams['fajrAngle'];
    }

    if (customParams['ishaAngle'] != null) {
        paramsToUse.ishaAngle = customParams['ishaAngle'];
    }

    if (customParams['maghribAngle'] != null) {
        paramsToUse.maghribAngle = customParams['maghribAngle'];
    }

    if (customParams['madhab']) {
        paramsToUse.madhab = customParams['madhab'] === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
    }

    if (customParams['highLatitudeRule']) {
        if (customParams['highLatitudeRule'] === 'recommended') {
            paramsToUse.highLatitudeRule = HighLatitudeRule.recommended(coordinates);
        } else if (HighLatitudeRule[customParams['highLatitudeRule']]) {
            paramsToUse.highLatitudeRule = HighLatitudeRule[customParams['highLatitudeRule']];
        }
    } else {
        paramsToUse.highLatitudeRule = HighLatitudeRule.recommended(coordinates);
    }

    if (customParams['polarCircleResolution'] && PolarCircleResolution[customParams['polarCircleResolution']]) {
        paramsToUse.polarCircleResolution = PolarCircleResolution[customParams['polarCircleResolution']];
    }

    if (customParams['shafaq'] && Shafaq[customParams['shafaq']]) {
        paramsToUse.shafaq = Shafaq[customParams['shafaq']];
    }

    if (customParams['rounding'] && Rounding[customParams['rounding']]) {
        paramsToUse.rounding = Rounding[customParams['rounding']];
    }

    if (customParams['adjustments']) {
        paramsToUse.adjustments = customParams['adjustments'];
    }

    const prayerTimes = new PrayerTimes(coordinates, date, paramsToUse);

    const formattedDate = moment(date).tz("Europe/London").format('YYYY-MM-DD');
    const day = {}
    day[formattedDate] = { ...prayerTimes, 'hijri': convertToHijri(formattedDate) }
    return day;
}

export function calculateAdhanMonth(latitude, longitude, date, customParams) {
    let month = {};
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        const dailyDate = new Date(date.getFullYear(), date.getMonth(), i, 12, 0);
        month = Object.assign(month, calculateAdhanTimesDay(latitude, longitude, dailyDate, customParams));
    }
    return month;
}

export function calculateAdhanHijriMonth(latitude, longitude, hijriYear, hijriMonth, customParams) {
    let month = {};
    const hijriStart = new HijrahDate(hijriYear, hijriMonth, 1);
    const daysInMonth = hijriStart.getMonthLength();

    for (let i = 0; i < daysInMonth; i++) {
        const hijriDay = new HijrahDate(hijriYear, hijriMonth, i + 1);
        const gregorianDate = hijriDay.toGregorian();
        gregorianDate.setHours(12, 0, 0, 0);
        month = Object.assign(month, calculateAdhanTimesDay(latitude, longitude, gregorianDate, customParams));
    }
    return month;
}

export function getNext12HijriMonths() {
    const today = new HijrahDate();
    // getMonth() is 0-based: 0=Muharram, 11=Dhul-Hijjah
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    const months = [];

    for (let i = 0; i < 12; i++) {
        months.push({
            hijriYear: currentYear,
            hijriMonth: currentMonth,
            label: `${HijriMonths.STANDALONEMONTH[currentMonth]} ${currentYear}`
        });

        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
    }
    return months;
}
