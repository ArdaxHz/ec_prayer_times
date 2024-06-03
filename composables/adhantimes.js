import moment from "moment-timezone";
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import HijrahDate from 'hijrah-date';

const HijriMonths = {
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

function checkTimeWithinRange(dateCheckedAgainst, dateToCheck, timeDifferenceToCheck) {
    const dateCheckedAgainstLowerBound = new Date(dateCheckedAgainst.getTime() - timeDifferenceToCheck * 60 * 1000);
    const dateCheckedAgainstUpperBound = new Date(dateCheckedAgainst.getTime() + timeDifferenceToCheck * 60 * 1000);
    const dateCheckedAgainstLowerBoundHours = dateCheckedAgainstLowerBound.getHours();
    const dateCheckedAgainstLowerBoundMinutes = dateCheckedAgainstLowerBound.getMinutes();
    const dateCheckedAgainstUpperBoundHours = dateCheckedAgainstUpperBound.getHours();
    const dateCheckedAgainstUpperBoundMinutes = dateCheckedAgainstUpperBound.getMinutes();

    const dateToCheckHours = dateToCheck.getHours();
    const dateToCheckMinutes = dateToCheck.getMinutes();
    const inRange = (dateCheckedAgainstLowerBoundHours < dateToCheckHours || dateCheckedAgainstLowerBoundHours == dateToCheckHours && dateCheckedAgainstLowerBoundMinutes <= dateToCheckMinutes) && (dateToCheckHours < dateCheckedAgainstUpperBoundHours || dateToCheckHours == dateCheckedAgainstUpperBoundHours && dateToCheckMinutes <= dateCheckedAgainstUpperBoundMinutes);
    return inRange
}

export function convertToHijri(date) {
    const hijriDate = new HijrahDate(date);
    return { "date": hijriDate, "month_long": HijriMonths.STANDALONEMONTH[hijriDate._monthOfYear - 1], "month_short": HijriMonths.SHORTMONTH[hijriDate._monthOfYear - 1] };
}

export function calculateAdhanTimesDay(latitude, longitude, date, customParams) {
    const coordinates = new Coordinates(latitude, longitude);

    const paramsToUse = CalculationMethod[customParams['CalculationMethod']] ? CalculationMethod[customParams['CalculationMethod']]() : CalculationMethod.MuslimWorldLeague();
    paramsToUse.fajrAngle = customParams['fajrAngle'] ? customParams['fajrAngle'] : 18;
    paramsToUse.madhab = customParams['madhab'] ? customParams['madhab'] : 'shafi';

    const prayerTimes = new PrayerTimes(coordinates, date, paramsToUse);
    if (checkTimeWithinRange(prayerTimes.fajr, prayerTimes.isha, 5)) {
        const newIshaTime = new Date(prayerTimes.maghrib.getTime() + 60 * 60 * 1000);
        prayerTimes.isha = newIshaTime;
    }

    const formattedDate = moment(date).tz("Europe/London").format('YYYY-MM-DD');
    const day = {}
    day[formattedDate] = { ...prayerTimes, 'hijri': convertToHijri(formattedDate) }
    return day;
}

export function calculateAdhanToday(latitude, longitude, date, customParams) {
    return calculateAdhanTimesDay(latitude, longitude, date, customParams);
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