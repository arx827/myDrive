import LoadingUtil from "@/assets/config/LoadingUtil";
import { BackDoorBatchIutput, BackDoorBatchIutputBackDoorBatchEnumEnum, OutputDto } from "@fubonlife/obd-api-axios-sdk";
import { Table } from "ant-design-vue";
import { AxiosResponse } from "axios";
import { Component, Vue } from "vue-property-decorator";
import BackDoorUtil from "./BackDoorUtil";

@Component({ components: { Table } })
export default class HealthCheck extends Vue {

    data = [
        {
            rowKey: 1,
            functionName: BackDoorBatchIutputBackDoorBatchEnumEnum.AS400FGLCALE0ToOutBoundSchedule,
            description: "公司日曆匯入作業",
        },
        {
            rowKey: 2,
            functionName: BackDoorBatchIutputBackDoorBatchEnumEnum.IntraSyncSchedule,
            description: "intra_db資料更新使用者",
        },
        {
            rowKey: 3,
            functionName: BackDoorBatchIutputBackDoorBatchEnumEnum.SeqResetSchedule,
            description: "流水號重置",
        },
    ]

    columns = [
        {
            title: '服務名稱',
            dataIndex: 'functionName',
            key: 'functionName',
            align: "center",
        },
        {
            title: '服務描述',
            dataIndex: 'description',
            key: 'description',
            align: "center",
        },
        {
            title: '動作',
            dataIndex: 'reset',
            key: 'reset',
            align: "center",
            scopedSlots: { customRender: 'reset' },
        },
    ]

    /**
     * 開啟頁面
     */
    created() {
        // 檢查是否有有效的token
        if (!BackDoorUtil.checkToken()) {
            this.$router.push({
                name: 'BackDoorBatch',
                query: { from: 'HealthCheck' },
            }).catch(() => { });
            return;
        }
    }

    /**
     * 批次直接執行
     */
    reset(functionName: BackDoorBatchIutputBackDoorBatchEnumEnum) {
        let backDoorBatchIutput: BackDoorBatchIutput = {
            backDoorBatchEnum: functionName,
            backDoorToken: BackDoorUtil.getBackDoorToken()
        }
        LoadingUtil.show();
        this.$backDoorSettingApi.backDoorBatchUsingPOST(backDoorBatchIutput)
            .then((resp: AxiosResponse<OutputDto>) => {
                if (resp && resp.data) {
                    if (resp.data.success) {
                        alert("批次成功執行完畢");
                    } else {
                        alert(resp.data.returnMessage);
                    }
                }
            })
            .catch(e => console.error(e))
            .finally(() => LoadingUtil.close());
    }
}