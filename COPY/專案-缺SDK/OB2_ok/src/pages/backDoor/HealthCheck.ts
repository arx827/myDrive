import LoadingUtil from "@/assets/config/LoadingUtil";
import { BackDoorHealCheckDto, BackDoorHealCheckOutput } from "@fubonlife/obd-api-axios-sdk";
import { List } from "ant-design-vue";
import { AxiosResponse } from "axios";
import moment from "moment";
import { Component, Vue } from "vue-property-decorator";
import BackDoorUtil from "./BackDoorUtil";

@Component({ components: { List } })
export default class HealthCheck extends Vue {

    tokenCountDown: string = "";

    isCountDown: boolean = true;

    UPDATE_PERIOD_SEC: number = 30; // 秒

    updatePeriod: number = this.UPDATE_PERIOD_SEC;

    updateTime: string = moment().format('YYYY/MM/DD HH:mm:ss');

    healthStatusData: BackDoorHealCheckDto[] = [];

    columns = [
        {
            title: '服務名稱',
            dataIndex: 'name',
            key: 'name',
            align: "center",
        },
        {
            title: '服務狀態',
            align: "center",
            scopedSlots: { customRender: 'status' },
        }
    ]

    theCustomRow(record: BackDoorHealCheckDto, index: number) {
        if (record) {
            if (record.success) {
                return {
                    style: {
                        "background-color": "#1890ff",
                        "color": "white"
                    }
                };
            }
        }
        return {
            style: {
                "background-color": "#ff4d4f",
                "color": "white"
            }
        };
    }

    /**
     * 開啟頁面
     */
    created() {
        // 檢查是否有有效的token
        if (!BackDoorUtil.checkToken()) {
            this.$router.push({
                name: 'BackDoorValidation',
                query: { from: 'HealthCheck' },
            }).catch(() => { });
            return;
        }

        this.reload();

        // 每秒定期更新秒數
        setInterval(() => {
            if (this.isCountDown) {
                if (this.updatePeriod > 0) {
                    this.updatePeriod = this.updatePeriod - 1;
                } else {
                    this.isCountDown = false;
                    this.reload();
                }
            }
            this.tokenCountDown = BackDoorUtil.showTokenExp();
        }, 1000);
    }

    /**
     * 刷新頁面資料
     */
    reload() {
        // 檢查是否有有效的token
        if (!BackDoorUtil.checkToken()) {
            this.$router.push({
                name: 'BackDoorValidation',
                query: { from: 'HealthCheck' },
            }).catch(() => { });
            return;
        }

        LoadingUtil.show();
        this.$backDoorSettingApi.healthCheckUsingPOST({ backDoorToken: BackDoorUtil.getBackDoorToken() }).then((resp: AxiosResponse<BackDoorHealCheckOutput>) => {
            if (resp && resp.data && resp.data.success) {
                this.healthStatusData = resp.data.backDoorHealCheckDtoList
                // 更新更新時間
                this.updateTime = moment().format('YYYY/MM/DD HH:mm:ss');
            } else {
                alert("更新時發生錯誤：" + resp.data.returnMessage);
            }
        }).catch(e => console.error(e))
            .finally(() => {
                LoadingUtil.close();
                this.updatePeriod = this.UPDATE_PERIOD_SEC;
                this.isCountDown = true;
            });
    }
}