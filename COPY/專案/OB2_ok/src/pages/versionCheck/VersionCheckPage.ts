import { Vue, Component } from "vue-property-decorator";

@Component({
    components: {}
})
export default class VersionCheckPage extends Vue {


    // 版本變數
    frontendVersion: string = "";
    backendVersion: string = "";
    batchVersion: string = "";

    created() {
        // 取得環境變數裡的前端版本號
        this.frontendVersion = process.env.VUE_APP_VERSION
        // 取得API版本
        this.getApiVersion();
        //  取得BATCH版本
        this.getBatchVersion();

    }
    /**
     * 取得API版本
     * @returns 
     */
    getApiVersion() {
        this.$versionCheckApi.apiVersionUsingGET().then((resp) => {
            this.backendVersion = resp.data;
        })
    }
    /**
     * 取得BATCH版本
     * @returns 
     */
    getBatchVersion() {
        this.$versionCheckApi.batchVersionUsingGET().then((resp) => {
            this.batchVersion = resp.data;
        })
    }


}