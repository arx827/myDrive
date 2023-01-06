import { format, parse } from 'date-format-parse';

// Specify a file with the types you want to augment
// Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
    // 3. Declare augmentation for Vue
    interface Vue {
        $twDateTimeFormatter: any,
        $twDateFormatter: any,
        $adDateTimeFormatter: any,
        $adDateFormatter: any,
        $adDateTimeLocale: any,
    }
}
export default new (class TwDateFormatter {
    public install(Vue) {
        Vue.prototype.$twDateTimeFormatter = {
            stringify: (date) => {
                if (!date) {
                    return "";
                }
                const yearStr = format(date, "YYYY");
                const twYear = parseInt(yearStr, 10) - 1911;
                // return format(date, `民國 ${twYear}/MM/DD HH:mm:ss`);
                return format(date, `${twYear}/MM/DD HH:mm`);
            },
            parse: (value) => {
                if (!value) {
                    return null;
                }
                const regex = /(\d+)(\/\d+\/\d+ \d+:\d+:\d+)/;
                const matches = value.match(regex);
                if (!matches) {
                    return null;
                }
                const twYear = parseInt(matches[1]);
                const norm = `${(twYear + 1911)}${matches[2]}`
                // const date = parse(norm, 'YYYY/MM/DD HH:mm:ss');
                const date = parse(norm, 'YYYY/MM/DD HH:mm');
                return date;
            },
        };

        Vue.prototype.$twDateFormatter = {
            stringify: (date) => {
                if (!date) {
                    return "";
                }
                const yearStr = format(date, "YYYY");
                const twYear = parseInt(yearStr, 10) - 1911;
                return format(date, `${twYear}/MM/DD`);
            },
            parse: (value: string) => {
                if (!value) {
                    return null;
                }
                const regex = /(\d+)(\/\d+\/\d+)/;
                const matches = value.match(regex);
                if (!matches) {
                    return null;
                }
                const twYear = parseInt(matches[1]);
                const norm = `${(twYear + 1911)}${matches[2]}`
                const date = parse(norm, 'YYYY/MM/DD');
                return date;
            },
        };

        Vue.prototype.$adDateTimeFormatter = {
            stringify: (date) => {
                if (!date) {
                    return "";
                }
                return format(date, `YYYY/MM/DD HH:mm`);
            },
            parse: (value) => {
                if (!value) {
                    return null;
                }
                const date = parse(value, 'YYYY/MM/DD HH:mm');
                return date;
            },
        };

        Vue.prototype.$adDateFormatter = {
            stringify: (date) => {
                if (!date) {
                    return "";
                }
                return format(date, 'YYYY/MM/DD');
            },
            parse: (value: string) => {
                if (!value) {
                    return null;
                }
                const date = parse(value, 'YYYY/MM/DD');
                return date;
            },
        };

        Vue.prototype.$adDateTimeLocale = {
            yearFormat: (year) => `${year} 年`
        };
    }
})();