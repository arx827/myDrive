import "@/assets/less/pendingPage.less";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { DataHubInput, ContentDto } from "@fubonlife/obd-api-axios-sdk";
import { Component, Vue, Prop } from "vue-property-decorator";
import { FblColumnType, FblPDataGridHolder } from "../../../data-grid/models";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import MomentUtil from "@/assets/config/MomentUtil";

@Component({
    components: { FblDataGrid }
})
export default class QuestionAnswer extends Vue {

    // DataHubInput
    @Prop()
    questionAnswerParam;

    // 載入畫面
    public loading: boolean = false;

    // 日期
    createDate: String = "";

    created() {
        this.reload();
    }

    //重整表單
    reload() {
        this.loading = true;
        let input: DataHubInput = {
            CASE_NO: this.questionAnswerParam.CASE_NO,
            GUID: this.questionAnswerParam.GUID,
        }
        this.$questionAnswerApi.getAnswerUsingPOST(input)
            .then((resp) => {
                if(resp.data.content){
                    this.grid.data = resp.data.content;
                    this.createDate = MomentUtil.transformRocYearMonthDayHHMMSS(resp.data.createDate);
                } else {
                    //	查無符合篩選條件之資料
                    ErrorModalUtil.modalError(this.$t('CUST_MARK_NOT_FOUND').toString())
                }
            }).catch((err) => {
                // 通話內容查詢失敗
                ErrorModalUtil.modalError(this.$t('questionAnswer_searchFailed').toString())
            }).finally(() => {
                this.getCount(this.grid.data.length);
                this.loading = false;
            })
        
    }

    // 通話內容查詢結果顯示
    grid: FblPDataGridHolder<ContentDto> = {
        rowKey: "id",
        data: [],
        scroll: { x: 500, y: 300 },
        columns: [
            {
                type: FblColumnType.PLAIN,
                property: "paragraph",
                title: this.$t('questionAnswer_paragraph').toString(), //段落
                width: 100,
            },
            {
                type: FblColumnType.PLAIN,
                property: "questContent",
                title: this.$t('questionAnswer_questContent').toString(), //電話內容
                width: 500,
            },
            {
                type: FblColumnType.PLAIN,
                property: "questAnswer",
                title: this.$t('questionAnswer_questAnswer').toString(), //答項
                width: 100,
            },
            {
                type: FblColumnType.PLAIN,
                property: "customerContent",
                title: this.$t('questionAnswer_customerContent').toString(), //保戶回答
                width: 200,
            },
        ]
    };

    // 將資料筆數回傳
    getCount(dataLength: number) {
        this.$emit("getCount", dataLength);
    }
}