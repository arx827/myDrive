import DatePicker from 'vue-datepicker-next';

var locale = {
  months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  monthsShort: ['Jan', 'Feb', 'März', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  weekdaysShort: ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'],
  weekdaysMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  firstDayOfWeek: 1,
  firstWeekContainsDate: 4
};

const lang = {
    formatLocale: locale,
    yearFormat: 'YYYY',
    monthFormat: 'MMM',
    monthBeforeYear: true,
};
DatePicker.locale('de', lang);

export { lang as default };
