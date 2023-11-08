import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import {
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
  } from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { GetLetterValidAbnormalDetailInput, GetLetterValidAbnormalDetailOutput, LetterValidAbnormalDetailGrid } from "@fubonlife/obd-api-axios-sdk";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import axios, {AxiosResponse} from 'axios';
import LoadingUtil from "@/assets/config/LoadingUtil";


@Component({
    components:{
        FblDataGrid
    }
})
export default class LetterValidateAbnormalModal extends Vue{

    @Prop()
    propLetterDate:string; // 產信日期

    // ===================================== Grid ========================================================

    letterValidateAbnormalGrid: FblPDataGridHolder<LetterValidAbnormalDetailGrid>={
        rowKey: "mailByPostId",
        data:[],
        //不需要分頁
        // pagination:{
        //     showSizeChanger: true,
        //     pageSizeOptions: ['15', '30', '50'],
        //     current: 1,
        //     pageSize: 15,
        //     total: 0,
        //     locale: { items_per_page: "" },
        //     showTotal: true,
        // },
        // scroll: { x: 500, y: 600 },
        columns:[
            {
                type: FblColumnType.PLAIN,
                property: "mailByPostId",
                title: this.$t('letterValidate_abnor_grid_mailByPostId').toString(), //郵寄編號
                width: 120,
                template: "alink_mailByPostId_Template",
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "letterDate",
                title: this.$t('letterValidate_abnor_grid_letterDate').toString(),   //產信日期
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "mailByPostDate",
                title: this.$t('letterValidate_abnor_grid_mailByPostDate').toString(),   //郵寄日期
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "casePolicy",
                title: this.$t('letterValidate_abnor_grid_casePolicy').toString(),   //保單號碼
                width: 110,
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "receiver",
                title: this.$t('letterValidate_abnor_grid_receiver').toString(), //收件人
                width: CommonUtil.countColumnWidth(5),
            },
            {
                type: FblColumnType.PLAIN,
                property: "addressTypeName",
                title: this.$t('letterValidate_abnor_grid_addressTypeName').toString(),  //地址類型
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "address",
                title: this.$t('letterValidate_abnor_grid_address').toString(),  //郵寄地址
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "manualLetterStatus",
                title: this.$t('letterValidate_abnor_grid_manualLetterStatus').toString(),   //信函狀態
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "untiName",
                title: this.$t('letterValidate_abnor_grid_untiName').toString(), //科別
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "userName",
                title: this.$t('letterValidate_abnor_grid_userName').toString(), //電訪員
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "abnormalReason",
                title: this.$t('letterValidate_abnor_grid_abnormalReason').toString(), //異常原因
                width: 110,
            },
        ]
    }

    // ===================================== 初始  ========================================================    
    created(){
        // 取得異常件明細
        this.getLetterValidateAbnormalDetail();
    }

    // ===================================== ajax  ========================================================   
    
    /**
     * 取得異常件明細
     */
    getLetterValidateAbnormalDetail(){
        var getLetterValidAbnormalDetailInput:GetLetterValidAbnormalDetailInput={};
        getLetterValidAbnormalDetailInput.letterDate = this.propLetterDate;

        LoadingUtil.show();
        this.$mailValidateApi.getLetterValidateAbnormalDetailUsingPOST(getLetterValidAbnormalDetailInput)
        .then((resp:AxiosResponse<GetLetterValidAbnormalDetailOutput>)=>{
            if(resp.data.success){
                this.letterValidateAbnormalGrid.data = resp.data.letterValidAbnormalDetailGridList;
            }else{
                //取得異常件明細發生異常
                ErrorModalUtil.modalError(this.$t('letterValidate_abnor_grid_error').toString());
            }
            LoadingUtil.close();
        })
        .catch((error)=>{
            //取得異常件明細發生異常
            ErrorModalUtil.modalError(this.$t('letterValidate_abnor_grid_error').toString());
            LoadingUtil.close();
        })
        ;
    }

}