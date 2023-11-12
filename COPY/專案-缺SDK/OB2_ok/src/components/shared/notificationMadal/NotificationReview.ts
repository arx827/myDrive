import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { FblColumnType } from '@/components/shared/data-grid/models';
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { ReviewHistoryDto } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import MomentUtil from "@/assets/config/MomentUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { ReviewValidateForm } from "./model";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";

@Component({
  components: { FblDataGrid }
})
export default class NotificationReview extends Vue {
  @Prop()
  isEdit: boolean;    // 編輯狀態

  @Prop()
  insetPolicy!: string;

  @Prop()
  reviewNo: string;

  form = {
    formData1: '',
  }

  emitData = {
    reviewLoading : false,
    intereviewData : null
  }

  // 照會資訊 欄位驗證
  reviewformRules: { [key: string]: ValidationRule[] } = {
    reviewProcess: [{ validator: this.validateReviewRemark, trigger: "blur" }]
  };

  //照會資訊表單驗證物件
  reviewValidateForm : ReviewValidateForm = {
    reviewProcess: { feedback: false, hoverVisible: false }
  }

  // 檔案列表 table
  public gridFileData = {
    rowKey: 'rowkey',
    data: [],
    // pagination: false,
    columns: [
      {
        type: FblColumnType.TEMPLATE,
        property: 'handleTemp',
        template: 'handleTemp',
        width: 10,
      },
      // 檔案名稱
      {
        type: FblColumnType.PLAIN,
        property: 'fileName',
        title: this.$t('uploadFileForm_fileName').toString(),
      },
    ],
  };

  // 欄位資料
  gridData = {
    rowKey: 'rowkey',
    data: [],
    pagination: false,
    columns: [
      // 處理時間
      {
        type: FblColumnType.PLAIN,
        property: 'createDate',
        title: this.$t('proccessDate').toString(),
        formatter:(data:ReviewHistoryDto) => {
          return MomentUtil.transformRocWithoutSec(data.createDate);
        }
      },
      // 單位名稱
      {
        type: FblColumnType.PLAIN,
        property: 'divName',
        title: this.$t('pedding_agentUnitName').toString(),
      },
      // 人員
      {
        type: FblColumnType.PLAIN,
        property: 'createName',
        title: this.$t('person').toString(),
      },
      // 處理內容
      {
        type: FblColumnType.PLAIN,
        property: 'processContent',
        title: this.$t('proccessContent').toString(),
      },
      // 處理結果
      {
        type: FblColumnType.PLAIN,
        property: 'reviewStatus',
        title: this.$t('handleInfoForm_naMemoTrs').toString(),
      },
    ],
  };
  
  /**
   * Event
   */
  getGridData() {

    this.$reviewCaseApi.reviewHistoryUsingPOST(this.reviewNo).then((resp:AxiosResponse<ReviewHistoryDto[]>) => {
      const getApiData = JSON.parse(JSON.stringify(resp.data)); 
      getApiData.map((item, index) => {
        item.rowkey = index + 1;
      });
      this.gridData.data = getApiData;
    })
    .catch((error) => console.error(error))
    .finally(() =>{
        this.emitData.reviewLoading = true;
        this.$emit('emitItemInfo',this.emitData);
    })

  }

  /**
   * Hooks
   */
  created() {
    // 取得 覆核歷程
    this.getGridData();
  }

  callCommonUtilFeild(fv: ValidateFormComponent){
    return CommonUtil.getFeildValid(fv);
  }

  callCommonUtilFeildVisibleChange(fv: ValidateFormComponent){
    CommonUtil.getFeildValidateVisibleChange(fv);
  }

  //覆核意見檢核
  validateReviewRemark(rule, value, callback){
    CommonUtil.feildValidateWithVisible(this.reviewValidateForm.reviewProcess, false, '', false);
    if (ValidationUtil.isEmpty(this.form.formData1)) {
      // 覆核意見 必填
      CommonUtil.feildValidateWithVisible(this.reviewValidateForm.reviewProcess, true, this.$t('reviewContentNotNull').toString(), false);
      callback(() => { });
    }
    callback();
  }

  //結案表單送出前驗證
  validateReviewSubmit(){
    let validate = true;

    //結案備註
    this.validateReviewRemark(null,this.form.formData1,()=>{
      if(this.reviewValidateForm.reviewProcess.feedback){
        validate = false;
      }
    });

    return validate;
  }

  /**
   * 監聽
   */
  // 更新父層資料
  @Watch('form', { deep: true })
  watchForm(newVal) {
    this.$emit('emitFormData',  {
      review: newVal
    });
  }
}