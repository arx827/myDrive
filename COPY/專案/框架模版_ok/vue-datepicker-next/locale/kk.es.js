import DatePicker from 'vue-datepicker-next';

var locale = {
  months: ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'],
  monthsShort: ['қаң', 'ақп', 'нау', 'сәу', 'мам', 'мау', 'шіл', 'там', 'қыр', 'қаз', 'қар', 'жел'],
  weekdays: ['жексенбі', 'дүйсенбі', 'сейсенбі', 'сәрсенбі', 'бейсенбі', 'жұма', 'сенбі'],
  weekdaysShort: ['жек', 'дүй', 'сей', 'сәр', 'бей', 'жұм', 'сен'],
  weekdaysMin: ['жк', 'дй', 'сй', 'ср', 'бй', 'жм', 'сн'],
  firstDayOfWeek: 1,
  firstWeekContainsDate: 7
};

const lang = {
    formatLocale: locale,
    yearFormat: 'YYYY',
    monthFormat: 'MMM',
    monthBeforeYear: true,
};
DatePicker.locale('kk', lang);

export { lang as default };
