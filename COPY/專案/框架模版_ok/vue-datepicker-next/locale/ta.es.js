import DatePicker from 'vue-datepicker-next';

var locale = {
  months: ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டெம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'],
  monthsShort: ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டெம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'],
  weekdays: ['ஞாயிற்றுக்கிழமை', 'திங்கட்கிழமை', 'செவ்வாய்கிழமை', 'புதன்கிழமை', 'வியாழக்கிழமை', 'வெள்ளிக்கிழமை', 'சனிக்கிழமை'],
  weekdaysShort: ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'],
  weekdaysMin: ['ஞா', 'தி', 'செ', 'பு', 'வி', 'வெ', 'ச'],
  firstDayOfWeek: 0,
  firstWeekContainsDate: 6
};

const lang = {
    formatLocale: locale,
    yearFormat: 'YYYY',
    monthFormat: 'MMM',
    monthBeforeYear: true,
};
DatePicker.locale('ta', lang);

export { lang as default };
