import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import {
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import {LetterValidVerifySamplingInput, LetterValidVerifySamplingOutput, SaveToVerifySampleInput, SaveToVerifySampleOutput, LetterValidSampleDto, ReviewSamplingMailPostLetterInput, ResponseEntity} from "@fubonlife/obd-api-axios-sdk";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import axios, { AxiosResponse } from 'axios';
import LoadingUtil from "@/assets/config/LoadingUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import { Modal, message } from "ant-design-vue";


/**
 * 打 ajax 前端使用回傳值 
 */
 export enum EnumAjaxFunRetunr {
    SUCCESS = "SUCCESS",
    FAIL = "FAIL",
}
@Component({
    components: {
        FblDataGrid
    }
})
export default class LetterValidateSamplingModal extends Vue {

    // ===================================== 傳入參數 ========================================================
    @Prop()
    letterDate: { letterStartDate: string; letterEndDate: string; }; // 產信日期

    // ===================================== Grid ========================================================
    public letterValidateSamplingGrid = {
        rowKey: 'letterValidSamplePk',
        data: [],
        columns: [
            {
                dataIndex: 'letterValidSampleCheckBoxDto',
                title: this.$t('letterValidSample_grid_1').toString(), // 選取
                scopedSlots: { customRender: 'cehckBoxTemp' },
                width: 50,
                align: 'center',
            },
            {
                dataIndex: 'letterDate',
                title: this.$t('letterValidSample_grid_2').toString(), // 產信日期
                width: 100,
            },
            {
                dataIndex: 'letterValidSampleCasePolicyDto',
                title: this.$t('letterValidSample_grid_3').toString(), // 保單號碼
                scopedSlots: { customRender: 'casePolicyTemp' },
                width: 100,
            },
            {
                dataIndex: 'verifyAbnormalRemark',
                title: this.$t('letterValidSample_grid_4').toString(), // 信函異常註記
                scopedSlots: { customRender: 'verifyAbnormalRemarkTemp' },
                width: 260,
                align: 'center',
            },
        ]
    }


    // ===================================== 初始  ========================================================    
    created() {
        // 信函驗證抽樣
        this.letterValidateVerifySampling();
    }


    // ===================================== Grid click 事件  ========================================================    

    /**
     * 選取 驗證撰寫 信函異常註記
     * @param e 
     * @param currRowData 
     */
    onCheckedChange(e, currRowData) {

        this.letterValidateSamplingGrid.data.forEach((eachRow: any, index) => {
            if (eachRow.letterValidSamplePk === currRowData.letterValidSamplePk) {
                eachRow.letterValidSampleCheckBoxDto.checked = e.target.checked;
                // 取消勾選後 清空 信函異常註記
                if (!e.target.checked) {
                    eachRow.verifyAbnormalRemark = "";
                }
                return true;
            }
        })
    }

    /**
     * 保單號碼
     * @param e 
     * @param currRowData 
     */
    clickCasePolicy(e, currRowData) {

        this.letterValidateSamplingGrid.data.some((eachRow: any, index) => {
            if (eachRow.letterValidSamplePk === currRowData.letterValidSamplePk) {
                this.reviewSamplingMailPostLetter(currRowData)
                // 預覽 pdf 有成功才壓 有 點擊 過保單號碼
                .then((res:EnumAjaxFunRetunr)=>{
                    if(res === EnumAjaxFunRetunr.SUCCESS){
                        eachRow.letterValidSampleCasePolicyDto.clicked = true;
                    }
                })
                return true;
            }
        });
    }


    /**
     * 另開視窗預覽
     * @param resData 
     */
    dealDownLoadPdfPreview(resData) {
        try {
          let blob;
          if (resData instanceof Blob) {
            blob = resData;
          } else {
            blob = new Blob([resData], { type: resData.type });
          }
          var url = window.URL.createObjectURL(blob);
          window.open(url + "#toolbar=0", "Inf", "config='height=500px,width=500px'"); // 開啟的預覽不能提供驗證
        } catch (e) {
          console.error(e);
    
        }
      }

    // ===================================== 驗證  ========================================================    

    /**
     * 判斷 儲存
     * @returns 
     */
    validateSubmit(): boolean {
        var validateOutput: boolean = true;

        // 勾選驗證失敗時判斷信函異常註記
        if (validateOutput) {
            validateOutput = this.validateVerifyAbnormalRemark();
        }

        // 驗證 保單號碼是否經確認
        if (validateOutput) {
            validateOutput = this.validateIsClickedEveryCasePolicy();
        }

        return validateOutput;
    }

    /**
     * 勾選驗證失敗時判斷信函異常註記
     * @returns 
     */
    validateVerifyAbnormalRemark(): boolean {
        var validateOutput: boolean = true; // 先預設為成功
        var verifyAbnormalRemarkError:Array<string> = []; //錯誤時整理的error msg (array)

        this.letterValidateSamplingGrid.data.forEach((eachRow: any) => {
            if (eachRow.letterValidSampleCheckBoxDto.show && eachRow.letterValidSampleCheckBoxDto.checked) {
                if (ValidationUtil.isEmpty(eachRow.verifyAbnormalRemark)) {
                    // 驗證失敗，信函異常註記為必填 
                    verifyAbnormalRemarkError.push(eachRow.letterValidSampleCasePolicyDto.casePolicy + this.$t('letterValidSample_valid_eror_1').toString());
                    validateOutput = false && validateOutput; // 有一個為 false 就回傳為false
                    
                } else {
                    if (!ValidationUtil.onlyHalfEngChnNumSymbol(eachRow.verifyAbnormalRemark)) {
                        // 驗證失敗，信函異常註記僅可輸入中/英文、數字、符號 
                        verifyAbnormalRemarkError.push(eachRow.letterValidSampleCasePolicyDto.casePolicy + this.$t('letterValidSample_valid_eror_2').toString());
                        validateOutput = false && validateOutput; // 有一個為 false 就回傳為false
                    }
                }
            }
        });

         // 驗證失敗跳出訊息
         if(!validateOutput){
            ErrorModalUtil.modalListError(verifyAbnormalRemarkError, null);
        }

        return validateOutput;
    }

    /**
     * 驗證 保單號碼是否經確認
     * @returns 
     */
    validateIsClickedEveryCasePolicy(): boolean {
        var validateOutput: boolean = true; // 先預設為成功
        var policyNotCheck:Array<string> = []; // 錯誤時整理的error msg (array)

        // 滾出每一條來比對是否有點選過，沒點選過就整理訊息
        this.letterValidateSamplingGrid.data.forEach((eachRow: any, index) => {
            if (!eachRow.letterValidSampleCasePolicyDto.clicked) {
                policyNotCheck.push(eachRow.letterValidSampleCasePolicyDto.casePolicy + this.$t('letterValidSample_valid_eror_3').toString()); // xxx 保單號未經確認!
                validateOutput = false && validateOutput; // 有一個為 false 就回傳為false
            }
        });

        // 驗證失敗跳出訊息
        if(!validateOutput){
            ErrorModalUtil.modalListError(policyNotCheck, null);
        }

        return validateOutput;
    }

    // ===================================== click 事件  ========================================================    

    /**
     * 儲存
     */
    submit() {

        // 驗證 儲存
        if (this.validateSubmit()) {
            // 信函驗證抽樣 儲存
            this.saveToVerifySampling();
        }
    }


    // ===================================== ajax ========================================================

    /**
     * 信函驗證抽樣
     */
    letterValidateVerifySampling() {

        var letterValidVerifySamplingInput:LetterValidVerifySamplingInput={};
        letterValidVerifySamplingInput.letterStartDate = this.letterDate.letterStartDate;
        letterValidVerifySamplingInput.letterEndDate = this.letterDate.letterEndDate;

        LoadingUtil.show();
        this.$mailValidateApi.letterValidateVerifySamplingUsingPOST(letterValidVerifySamplingInput)
        .then((resp: AxiosResponse<LetterValidVerifySamplingOutput>) => {
            if (resp.data && resp.data.success) {
                this.letterValidateSamplingGrid.data = resp.data.letterValidSampleDtoList;
                LoadingUtil.close();
            } else {
                if (!ValidationUtil.isEmpty(resp.data.warningMessage)) {
                    Modal.warning({
                        // title: "", // 不需要
                        content: this.$t('letterValidSample_eror_1').toString(), //該產信日期無可驗證項目 
                        okText: this.$t('global_ok').toString(), // 確定
                        centered: true,
                        onOk: () => { this.$emit("closeModal"); } // 關閉 信函驗證 modal
                    });
                    LoadingUtil.close();
                } else {
                    throw "system error";
                }
            }
        })
        .catch((error) => {
            ErrorModalUtil.modalError(this.$t("letterValidSample_eror_2").toString()); // 信函驗證發生異常
            LoadingUtil.close();
        })

    }
    
    /**
     * 信函驗證抽樣 儲存
     */
    saveToVerifySampling() {

        var saveToVerifySampleInput:SaveToVerifySampleInput={};
        saveToVerifySampleInput.letterValidSampleDtoList = JSON.parse(JSON.stringify(this.letterValidateSamplingGrid.data));

        LoadingUtil.show();
        this.$mailValidateApi.saveToVerifySamplingUsingPOST(saveToVerifySampleInput)
        .then((resp: AxiosResponse<SaveToVerifySampleOutput>) => {
            if (resp.data && resp.data.success) {

                Modal.success({
                    // title: "", // 不需要
                    content: this.$t('letterValidSample_success_1').toString(), //儲存信函驗證結果成功 
                    okText: this.$t('global_ok').toString(), // 確定
                    centered: true,
                    onOk: () => { this.$emit("reloadSearchLetterValidate"); } // 回父層，委外函證查詢，即關閉 信函驗證 modal
                })
            } else {
                if (!ValidationUtil.isEmpty(resp.data.warningMessage)) {
                    ErrorModalUtil.modalError(resp.data.warningMessage);
                } else {
                    throw "system error";
                }
            }

            LoadingUtil.close();
        })
        .catch((error) => {
            ErrorModalUtil.modalError(this.$t("letterValidSample_eror_3").toString()); // 儲存信函驗證結果發生異常 
            LoadingUtil.close();
        })

    }
    

    /**
     * 信函預覽
     * @param currRowData 
     * @returns 
     */
     async reviewSamplingMailPostLetter(currRowData){
        var reviewSamplingResult: EnumAjaxFunRetunr = EnumAjaxFunRetunr.SUCCESS;

        var reviewSamplingMailPostLetterInput:ReviewSamplingMailPostLetterInput = {};
        reviewSamplingMailPostLetterInput.caseNo = currRowData.caseNo;
        reviewSamplingMailPostLetterInput.mailByPostId = currRowData.mailByPostId;
        reviewSamplingMailPostLetterInput.casePolicy = currRowData.letterValidSampleCasePolicyDto.casePolicy;

        LoadingUtil.show();
        await this.$mailValidateApi.reviewSamplingMailPostLetterUsingPOST(reviewSamplingMailPostLetterInput, { responseType: 'blob' })
        .then((resp:AxiosResponse<ResponseEntity>)=>{
            if(resp){
                if(resp.headers){
                    const headersMap = new Headers(resp.headers);
                    let noData = headersMap.get("no-data");
                    let fileId = headersMap.get('file-id');
                    if(noData){
                        throw "system error";
                    }else{
                        if(!ValidationUtil.isEmpty(fileId) && (resp.data as Blob).size){
                            this.dealDownLoadPdfPreview(resp.data);
                        }else{
                            throw "system error";
                        }
                    }
                }else{
                    throw "system error";
                }

            }else{
                throw "system error";
            }
        })
        .catch((error)=>{
            ErrorModalUtil.modalError(this.$t('letterValidSample_eror_4').toString()); // 信函驗證預覽發生異常
            reviewSamplingResult = EnumAjaxFunRetunr.FAIL;
        })
        .finally(()=>{
            LoadingUtil.close();
        })

        return reviewSamplingResult;

    }

}