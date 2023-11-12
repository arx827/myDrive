import { Vue } from "vue-property-decorator";
import validationUtil from "@/assets/config/ValidationUtil"

export default class I18nUtil extends Vue {

    /**
     * 設定語言
     * @param locale
     * @returns 
     */
    setLang(locale: string) {

        if (validationUtil.isEmpty(localStorage.getItem('language')) || localStorage.getItem('language') != locale) {
            localStorage.setItem("language", locale);
            return history.go(0);
        }
    }

}