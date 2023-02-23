import { Vue, Component, Prop, Watch, } from "vue-property-decorator";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import { Modal } from "ant-design-vue";
import { PackMatchModule } from '@/plugins/store/packMatchModule';
@Component
export default class InterViewerRemarkForm extends Vue {

    interViewerRemarkForm = {
        remark: null
    }

    created() {

        this.$telDataApi.getCasePackByPackNoUsingGET(PackMatchModule.matchedCasePack$.packNo).then(
            (resp) => {
                const casePack = resp.data;
                this.interViewerRemarkForm.remark = casePack.remark;
            }
        ).catch(err => {
            ErrorModalUtil.modalError(this.$t("GET_CASE_PACK_REMARK_FAILURE").toString());
        })
    }
    /**
     * 
     * 送出訪員備註
     */
    submit(packNo: string) {

        this.validateRemark(null, this.interViewerRemarkForm.remark, () => { });
        const remarkValidation = this.interViewerRemarkValidateForm.remark.state == "success" ? true : false;

        if (remarkValidation) {
            this.$telDataApi.updateInterViewerRemarkUsingPOST(packNo, this.interViewerRemarkForm.remark)
                .then(() => {
                    MessageUtil.messageInfo(this.$t("save_interViewer_success").toString());

                    this.$emit("reloadData");
                }).catch(err => {
                    ErrorModalUtil.modalError(this.$t("save_interViewer_failed").toString());
                })
        } else {
            return
        }

    }

    // ============================驗證validate section start============================
    interViewerRemarkValidateForm = {
        remark: {
            hover: "",
            feedback: false,
            state: "",
            content: "",
        },
    }
    isInterViewerRemarkVisible: boolean = false;
    /**
* 訪員備註原因不可超過500字。
* @param rule 驗證規則 
* @param value textArea輸入值
* @param callback 回乎函數，不帶參數表示驗證成功。
* @returns 
*/
    validateRemark(rule, value, callback) {

        this.interViewerRemarkValidateForm.remark.feedback = true;
        this.interViewerRemarkValidateForm.remark.hover = "";
        if (value == null || value == "") {
            this.interViewerRemarkValidateForm.remark.feedback = false;
            this.interViewerRemarkValidateForm.remark.state = "success";
        }
        if (value != null && value != "" && value.length > 500) {
            this.interViewerRemarkValidateForm.remark.content = this.$t("Over500words_not_saved").toString()
            this.interViewerRemarkValidateForm.remark.hover = "hover";
            this.interViewerRemarkValidateForm.remark.state = "error";
            this.interViewerRemarkValidateForm.remark.feedback = true;
            callback(false);
        } else {
            this.interViewerRemarkValidateForm.remark.feedback = false;
            this.interViewerRemarkValidateForm.remark.state = "success";
        }
    }

    interViewerRemarkMouseOver() {
        if (this.interViewerRemarkValidateForm.remark.state == "error") {
            this.isInterViewerRemarkVisible = true;
        } else {
            this.isInterViewerRemarkVisible = false;
        }

    }

    onRemarkChange(){
        if (this.interViewerRemarkValidateForm.remark.state == "error"){
        this.validateRemark(null, this.interViewerRemarkForm.remark, () => { });
        }
    }























    // ============================驗證validate section end============================
}