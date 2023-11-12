import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { FblColumnType } from '@/components/shared/data-grid/models';
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { ImpairmentReviewHistoryDto, ReviewHistoryDto, TobdHearingNote, TSysCommonCode } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import MomentUtil from "@/assets/config/MomentUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { ReviewValidateForm } from "./model";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import LoadingUtil from "@/assets/config/LoadingUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import VlidationUtil from "@/assets/config/ValidationUtil";
import { PackMatchModule } from "@/plugins/store/packMatchModule";

@Component({
  components: { FblDataGrid }
})
export default class ImpairmentReview extends Vue {
  @Prop()
  isEdit: boolean;    // 編輯狀態

  @Prop()
  insetPolicy!: string;

  @Prop()
  reviewNo: string;

  @Prop()
  propPackNo?: string;

  form = {
    formData1: '',
  }

  // // 照會資訊 欄位驗證
  reviewformRules: { [key: string]: ValidationRule[] } = {
    reviewProcess: [{ validator: this.validateReviewRemark, trigger: "blur" }]
  };

  // //照會資訊表單驗證物件
  reviewValidateForm : ReviewValidateForm = {
    reviewProcess: { feedback: false, hoverVisible: false }
  }

  // 檔案列表 table
  // public gridFileData = {
  //   rowKey: 'rowkey',
  //   data: [],
  //   // pagination: false,
  //   columns: [
  //     {
  //       type: FblColumnType.TEMPLATE,
  //       property: 'handleTemp',
  //       template: 'handleTemp',
  //       width: 10,
  //     },
  //     // 檔案名稱
  //     {
  //       type: FblColumnType.PLAIN,
  //       property: 'fileName',
  //       title: this.$t('uploadFileForm_fileName').toString(),
  //     },
  //   ],
  // };

  // 欄位資料
  gridData = {
    rowKey: 'guid',
    data: [],
    pagination: false,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: 'createDate',
        width: 150,
        title: this.$t('proccessDate').toString(),       // 處理時間
      },
      {
        type: FblColumnType.PLAIN,
        property: 'divName',
        width: 150,
        title: this.$t('global_division').toString(),       // 科別
      },
      {
        type: FblColumnType.PLAIN,
        property: 'createName',
        width: 150,
        title: this.$t('person').toString(),       // 人員
      },
      {
        type: FblColumnType.PLAIN,
        property: 'processContent',
        width: 150,
        title: this.$t('proccessContent').toString(),       // 處理內容
      },
      {
        type: FblColumnType.PLAIN,
        property: 'reviewStatus',
        width: 150,
        title: this.$t('handleInfoForm_naMemoTrs').toString(),       // 處理結果
      },
      {
        type: FblColumnType.PLAIN,
        property: 'isAddNonHearing',
        width: 150,
        title: this.$t('IS_HEARING').toString(),       // 聽障
      },
      {
        type: FblColumnType.PLAIN,
        property: 'isAddNonLanguage',
        width: 150,
        title: this.$t('IS_LANGUAGE').toString(),       // 語障
      },
      {
        type: FblColumnType.PLAIN,
        property: 'isCancel',
        width: 150,
        title: this.$t('cancel_disabled').toString(),       // 註銷註記
      },
      {
        type: FblColumnType.PLAIN,
        property: 'cancelDisabledReason',
        width: 150,
        title: this.$t('cancel_disabled_reason').toString(),       // 註銷原因
      }
    ],
  };

  impairmentReviewHistory: ImpairmentReviewHistoryDto[];
  showimpairmentMarkReason: boolean;
  showimpairmentMarkReasoncode: boolean;
  tobdHearingNoteInfo: TobdHearingNote[];
  chkIsAddNonHearing: boolean;
  chkIsAddNonHearingrtn: string;
  chkisAddNonLanguage: boolean;
  chkisAddNonLanguagertn: string;
  impairmentMarkReasoncode: string;
  impairmentMarkReason: TSysCommonCode[];
  selectImpairmentMarkReasonOptions: any;
  

  
  /**
   * Event
   */
  // getGridData() {
  //   LoadingUtil.show();
  //   this.impairmentReviewHistoryAction();
  //   LoadingUtil.close();
  // }

  /**
   * Hooks
   */
  created() {
    // 取得 覆核歷程
    // this.getGridData();
    this.getFirstPackNo();

    this.impairmentReviewHistoryAction();

    LoadingUtil.close();
  }

  getGridData() {
    LoadingUtil.show();
    this.impairmentReviewHistoryAction();
    LoadingUtil.close();
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
    LoadingUtil.close();
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
    LoadingUtil.close();
    return validate;
  }

  //取聽語障歷程
  impairmentReviewHistoryAction() {
    LoadingUtil.show();
    this.$informApi.getImpairmentReviewHistoryUsingPOST(this.propPackNo)
        .then((res : AxiosResponse<ImpairmentReviewHistoryDto[]>) => {
        this.impairmentReviewHistory = res.data;
        this.gridData.data = res.data;
        this.showimpairmentMarkReason = true;
        this.showimpairmentMarkReasoncode = true;
        
    }).catch(e => {
      ErrorModalUtil.modalError("取聽語障歷程:" +e.toString); // 取聽語障歷程
      this.gridData.data=null;
    }).finally(() => LoadingUtil.close());
    LoadingUtil.close();
  }

  callCommonUtilFeild(fv: ValidateFormComponent){
    return CommonUtil.getFeildValid(fv);
  }

  callCommonUtilFeildVisibleChange(fv: ValidateFormComponent){
    CommonUtil.getFeildValidateVisibleChange(fv);
  }

  // 名單序號資訊(當前名單)
  getFirstPackNo() {
    if(VlidationUtil.isEmpty(this.propPackNo) != null && VlidationUtil.isEmpty(this.propPackNo) != null) {
      return this.propPackNo;
    }
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