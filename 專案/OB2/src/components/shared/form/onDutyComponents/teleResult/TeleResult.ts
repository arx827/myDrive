import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import { default as ValidationUtil, default as VlidationUtil } from "@/assets/config/ValidationUtil";
import BlockHeader from '@/components/shared/block-header/BlockHeader.vue';
import CuntersignatureModal from "@/components/shared/countersignatureModal/CountersignatureModal.vue";
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { callUpInfoModule } from "@/plugins/store/CallUpModule";
import { ContinuePackMoudle } from "@/plugins/store/ContinuePackModule";
import { PackMatchModule, TeleResultAreaContactAnsObj, TeleResultAreaEachSelectAns } from "@/plugins/store/packMatchModule";
import { CasePackDto, GetContinueOptionsDto, GetTeleResultAreaInDto, GetTeleResultAreaOutDto, GetTeleResultMplusCheckInput, GetTeleResultMplusCheckOutput, Option, PickUpNextSaveDto, QuestAreaDto, TeleResultAreaAfterTel, TeleResultAreaInfo, TeleResultAreaSaveDto, TeleResultConfigCond } from '@fubonlife/obd-api-axios-sdk';
import { Modal, TimePicker } from "ant-design-vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { AxiosResponse } from "axios";
import moment from "moment";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { ReturnValidCloseCaseSave, TeleResultAreaValidateForm } from "./model";

import { QuestAllData } from "@/pages/onDuty/model";
// import { EventBus } from "@/pages/questArea/eventBus";

import NotificationModal from "@shared/notificationMadal/NotificationModal.vue";
import { NotiStep } from "@/pages/onDuty/model";

import MailLetterForm from "@/components/shared/form/mailLetter/mailLetterForm/MailLetterForm.vue";

/**
 * 聯絡結果異動使用 flag
 */
export enum ContResultChangFlagEnum{
    INIT="init",
    CUSTOMER_CHANGE="customer_change",
}

/**
 * 電訪結果區 reload flag
 */
export enum ReloadFromFlag{
    FROM_WATCH_CURRENT_PACK="FROM_WATCH_CURRENT_PACK", // 從監控
    FROM_CREATED="FROM_CREATED", // 從 created
    FROM_TO_SAVE_TELERESULT="FROM_TO_SAVE_TELERESULT", // 從儲存
    FROM_ON_DIALER_SAVE="FROM_ON_DIALER_SAVE", // 從撥號關閉
}

@Component({
    components: { FblDataGrid, BlockHeader, TimePicker, CuntersignatureModal, NotificationModal, MailLetterForm }
})
export default class TeleResult extends Vue{
    
    @Prop()
    currentPack : CasePackDto;

    @Prop()
    public questAreaData:QuestAreaDto; //問卷區塊資料

    @Prop()
    public questAllData: QuestAllData; //問卷所有區塊資料


    // 電訪結果資訊 loading
    isLoading: boolean = false;
    
    //是否點選過儲存按鈕
    hasTeleResultAreaSave: boolean = false;
    // 是否更動過問卷
    get haveChangeQuest():string{
        var resultVal:string = "N";
        if(this.questAllData != null && this.questAllData.commonData != null){
            resultVal = this.questAllData.commonData.questModify; // 取得更動問卷的狀態
        }
        return resultVal;
    }

    //撥號是否已儲存
    hasCallUpFormSave: boolean = false;

    //選取中的緒訪名單
    continuePackNo: string = "";

    //日期選擇器hover是否顯示
    isContactDateVisible: boolean = false;
    isTimeStartVisible: boolean = false;
    isTimeEndVisible: boolean = false;

    //時間選擇器是否顯示
    isConvenientContactStartOpen: boolean = false;
    isConvenientContactEndOpen: boolean = false;

    isTimePickerShow: boolean = false;

    //結果區表單驗證物件
    teleResultAreaValidateForm : TeleResultAreaValidateForm = {
        contactDate: { feedback: false, hoverVisible: false, msg: ""},
        convenientContactStartTime: { feedback: false, hoverVisible: false, msg: ""},
        convenientContactEndTime: { feedback: false, hoverVisible: false, msg: ""},
    }

    // 結果區欄位驗證
    teleResultAreaFormRules: { [key: string]: ValidationRule[] } = {
        convenientContactStartTime: [{ validator: this.validateTimeStart, trigger: "blur" }],
        convenientContactEndTime: [{ validator: this.validateTimeEnd, trigger: "blur" }],
    };

    //結果區表單資訊
    teleResultAreaForm = {
        contactDate: null,
        contactString: "",
        convenientContactStartTime: null,
        convenientContactEndTime: null,
        convenientContactStartString: "",
        convenientContactEndString: "",
    }

    //DatePicker民國年的格式
    formatter = this.$twDateFormatter;
    formatterDateTime = this.$twDateTimeFormatter
    //vue2 時間選擇器標題格式
    timeTitleFormat: string = MomentUtil.transTimePickerTitle(MomentUtil.default(new Date()));

    dataTimeRange: Array<any> = [];
    
    // 續訪 選項
    continueOpts = [];

    syncUpdateContResult:boolean = false; // 聯絡結果一併更新



    /************************************** modal param start ******************************************************* */
    // 會辦單發送 modal 開啟
    isCountersignatureFormVisible: boolean = false;
    // 會辦單發送 modal 需要參數
    cuntersignatureData:{caseNo:string; infStep:number; packNo:string} = {
        caseNo: '', infStep: 1, packNo: '' // 初始化
    };

    // 照會單發送 modal 開啟
    isNotificationFormVisible: boolean = false;
    // 照會單發送 modal 需要參數
    notificationData:{caseNo:string; notiStep:number} = {
        caseNo: '',
        notiStep: NotiStep.open
    }

    // 郵寄發送 modal 開啟
    isMailLetterFormVisible: boolean = false;
    // 郵寄發送 modal 需要參數
    mailLetterFormParam:{caseNo:string}={
        caseNo:'',
    }
    
    /************************************** modal param end ******************************************************* */

    // 歸戶提示訊息資料
    get followContactOption():Array<Option> {
        return PackMatchModule.transitionOption;
    }
    
    @Watch('followContactOption')
    followContactChange(val){

        this.continueOpts = VlidationUtil.isEmpty(val) ? [] : val;
    }

    @Watch('currentPack', { deep: true })
    watchCurrentPack(newVal: CasePackDto, oldVal: CasePackDto) {
        // 如果新的值不為空且新舊件名單不同在執行取值
        if (!VlidationUtil.isEmpty(newVal) && !newVal.packNo.match(oldVal.packNo)) {
            if(ValidationUtil.isEmpty(this.continueOpts)){
                this.continueInit();
            }
            this.reload(ReloadFromFlag.FROM_WATCH_CURRENT_PACK);
        }
    }

    // VL903-1283 問卷答項相關監控
    @Watch('questAreaData')
    watchQuestAreaData(newVal: QuestAreaDto, oldVal: QuestAreaDto){
        this.questAreaData = newVal;
    }
    
     /**
     * Hooks
     */
    created() {

        this.continueOpts = [];
        // 續訪下拉資料
        this.continueInit();
        this.reload(ReloadFromFlag.FROM_CREATED);
    }

    /**
     * @description 初始化資料
     * @param fromFlag:ReloadFromFlag 電訪結果區 reload flag
     * @version 2022/05/09
     * @author B1529
     */
    reload(fromFlag:ReloadFromFlag) {

        /**
         * 取得電訪結果值 localstorage 若有表示從本身儲存來，若無表示從 取件來(一開始為空)
         * VL903-1114
         */
        let localTeleResultAreaAns = JSON.parse(localStorage.getItem(PackMatchModule.TELE_RESULT_AREA_ANS));
        if(VlidationUtil.isEmpty(localTeleResultAreaAns)){
            // 取件來的 取得 取件資訊下 所有 名單下的所有案件(未結案)，組出資訊
            PackMatchModule.putTeleResultAreaSelectAns(PackMatchModule.pickupResult.casePolicyLogList);
            callUpInfoModule.clearCurrentCallUpData();
        }else{
            // 從本身儲存來 更新 localstorage
            PackMatchModule.putTeleResultAreaSelectAns(localTeleResultAreaAns);
        }
        
        // 從撥號關閉而來的 reload 不重新整理 方便聯絡時間
        if(fromFlag !== ReloadFromFlag.FROM_ON_DIALER_SAVE){
            this.reloadTeleResultAreaContactAns(true);
        }else{
            this.reloadTeleResultAreaContactAns(false);
        }

        this.getGridData();
    }

    /**
     * 重整方便聯絡時間
     * @param execute 
     */
    reloadTeleResultAreaContactAns(execute:boolean){
        if(execute){

            /**
             * 方便連絡時段-初始
             * VL903-1129
             ************************************************************************************************/
            let localTeleResultAreaContactAns = JSON.parse(localStorage.getItem(PackMatchModule.TELE_RESULT_AREA_CONTACT_ANS));
                    
            /**
             * 若整個 方便聯絡時間 localstorage 物件為空表示為 取件近來，塞好該取件所有續訪 packNo，透過vuex 塞回 localstorage
             * {"packNo1":{},"packNo2":{}...}
             * */ 
            if(ValidationUtil.isEmpty(localTeleResultAreaContactAns)){
                var tempTeleResultAreaContactAns:TeleResultAreaEachSelectAns = {};
                // 取得取件進來後的所有續訪 packNo 並組成物件
                PackMatchModule.pickupResult.casePackList.forEach((eachPack:any)=>{
                    var tempTeleResultAreaContactAnsObj: TeleResultAreaContactAnsObj = {};
                    tempTeleResultAreaContactAns[eachPack.packNo] = tempTeleResultAreaContactAnsObj;
                });
                PackMatchModule.putTeleResultAreaContactAns(tempTeleResultAreaContactAns);
            }
            // 若不是取件近來，可能為重新整理或更動續訪
            else{
                Object.keys(localTeleResultAreaContactAns).some((eachPackNo)=>{
                    // 取得當前名單 packNo
                    if(eachPackNo == PackMatchModule.pickupResult.firstCasePack.packNo){
                        // 若當前名單之 方便聯絡時間有值表示有儲存過時間，需取回並顯示
                        if(!ValidationUtil.isEmpty(localTeleResultAreaContactAns[eachPackNo])){
                            // 需使用 new Date 將 ISO time String 轉回 日期 物件
                            this.teleResultAreaForm.contactDate = new Date(localTeleResultAreaContactAns[eachPackNo].contactDate);
                            this.teleResultAreaForm.contactString = localTeleResultAreaContactAns[eachPackNo].contactString;
                            // 需使用 moment 將 ISO time String 轉回 time 物件
                            this.teleResultAreaForm.convenientContactStartTime = moment(localTeleResultAreaContactAns[eachPackNo].convenientContactStartTime);
                            this.teleResultAreaForm.convenientContactEndTime = moment(localTeleResultAreaContactAns[eachPackNo].convenientContactEndTime);
                            this.teleResultAreaForm.convenientContactStartString = localTeleResultAreaContactAns[eachPackNo].convenientContactStartString;
                            this.teleResultAreaForm.convenientContactEndString = localTeleResultAreaContactAns[eachPackNo].convenientContactEndString;
                            //自動轉為字串更新搜尋條件
                            this.onContactDateChange(this.teleResultAreaForm.contactDate);
                            //選擇時間(起)後，將時間更新
                            this.onConvenientContactStartTimeChange(null, this.teleResultAreaForm.convenientContactStartString, "FROM_LOCAL_STORAGE");
                            //選擇時間(迄)後，將時間更新
                            this.onConvenientContactEndTimeChange(null, this.teleResultAreaForm.convenientContactEndString);
                            return true;
                        }
                        // 若當前名單之 方便聯絡時間物件為空 表示為儲存過方便聯絡時間需清空回預設
                        else{
                            // 清除
                            this.clearContactDate();
                        }
                    }
                });
            }
            /************************************************************************************************/
        }
    }

    /**
     * 驗證是否為空 vue 使用
     * @param data 
     * @returns 
     */
    validIsEmpty(data){
        return VlidationUtil.isEmpty(data);
    }
    
    /**
     * 該列轉換顏色
     * @param record 
     * @param index 
     * @returns 
     */
    rowClassName(record,index) {
        if(record.isSaveFailure){
            return "rowColorRed";
        }
        // 目前不使用 用預設顏色
        // else{
        //     return "rowColorBlack";
        // }
    }

    // 電訪結果 內容
    public grid = {
        rowKey: 'rowKey',
        data: [],
        columns: [
            {
                dataIndex: 'businessType',
                title: this.$t('teleResultArea_grid_businessType').toString(), // 業務別
                width: 80,
                fixed: 'left',
            },
            {
                dataIndex: 'casePolicy',
                title: this.$t('teleResultArea_grid_casePolicy').toString(), // 保單號碼
                width: 120,
                fixed: 'left',
            },
            {
                dataIndex: 'custType',
                title: this.$t('teleResultArea_grid_custType').toString(), // 受訪者身分別
                width: 120,
                fixed: 'left',
            },
            {
                dataIndex: 'taskName',
                title: this.$t('teleResultArea_grid_taskName').toString(), // 電訪項目
                width: 180,
                fixed: 'left',
            },
            {
                dataIndex: 'questName',
                title: this.$t('teleResultArea_grid_questName').toString(), // 問卷名稱
                width: 260,
            },
            {
                dataIndex: 'contResultOpts',
                slots: { title: 'contactResultCustomerTitle' },  // 聯絡結果，需前端客製化 title
                scopedSlots: { customRender: 'contResultTemp' },
                width: 220,
            },
            {
                dataIndex: 'teleResultOpts',
                title: this.$t('teleResultArea_grid_teleResultOpts').toString(), // 電訪結果
                scopedSlots: { customRender: 'teleResultTemp' },
                width: 220,
                align: 'center',
            },
            {
                dataIndex: 'caseClosedReasonOpts',
                title: this.$t('teleResultArea_grid_caseClosedReasonOpts').toString(), // 結案原因
                scopedSlots: { customRender: 'caseClosedReasonTemp' },
                width: 150,
                align: 'center',
            },
            {
                dataIndex: 'afterTel',
                title: this.$t('teleResultArea_grid_afterTel').toString(), // 話後
                scopedSlots: { customRender: 'afterTelTemp' },
                width: 220,
                align: 'center',
            },
            {
                dataIndex: 'mplusCheckBox',
                title: this.$t('teleResultArea_grid_mplusCheckBox').toString(), // M+選取框
                scopedSlots: { customRender: 'mplusCheckBoxTemp' },
                width: 100,
                align: 'center',
            },
            {
                dataIndex: 'mplusMsg',
                title: this.$t('teleResultArea_grid_mplusMsg').toString(), // M+訊息內容
                scopedSlots: { customRender: 'mplusMsgTemp' },
                width: 500,
                align: 'center',
            },
        ]
    };

    /**
     * 取得 電訪結果
     */
    getGridData() {
        
        // 顯示 loading
        this.isLoading = true;

        // 整理參數
        var getTeleResultAreaInDto:GetTeleResultAreaInDto={};
        getTeleResultAreaInDto.packNo = this.currentPack.packNo;

        this.$teleResultAreaApi.getTeleResultAreaInfoNoPageUsingPOST(getTeleResultAreaInDto)
        .then((resp:AxiosResponse<GetTeleResultAreaOutDto>)=>{
            if(resp && resp.data){
                if(resp.data.success){
                    let getData = JSON.parse(JSON.stringify(resp.data.teleResultAreaInfoList));
                    getData.map((item)=>{
                        item.isSaveFailure = false; //驗證儲存失敗時 flag
                        item.isQuestPerformed = false; //問卷是否已執行
                        item.isQuestCompleted = false; //問卷是否已完成
                        item.isQuestHasNR = false; //問卷是否有包含N或R
                    });
                    this.grid.data = getData;
                        
                    /**
                     * 信任 localstorage 的電訪結果值 將原本從DB來的覆蓋
                     * VL903-1114
                     */
                    let localTeleResultAreaAns = JSON.parse(localStorage.getItem(PackMatchModule.TELE_RESULT_AREA_ANS));
                    this.grid.data.forEach((eachRow:any, index)=>{
                        // 僅未結案的可覆蓋
                        if(ValidationUtil.isEmpty(eachRow.caseCloseReasonCode)){
                            
                            localTeleResultAreaAns.some((eachItem:any, index)=>{
                                if(eachItem.caseNo === eachRow.caseNo){
                                    eachRow.selectedContRes = eachItem.selectedContRes;
                                    eachRow.selectedTeleRes = eachItem.selectedTeleRes;
                                    eachRow.selectedCaseClosedReason = eachItem.selectedCaseClosedReason;
                                    return true;
                                }
                            }); // localTeleResultAreaAns.some end
                        }
                    }); // grid.data.forEach end

                    // VL903-1291 M+ 儲存後需顯示，不管結不結案
                    this.grid.data.forEach((eachRow:any, index)=>{
                        localTeleResultAreaAns.some((eachItem:any, index)=>{
                            if(eachItem.caseNo === eachRow.caseNo){
                                eachRow.mplusCheckBox.show = !ValidationUtil.isEmpty(eachItem.mplusShow) ? eachItem.mplusShow : false;
                                eachRow.mplusCheckBox.checked = !ValidationUtil.isEmpty(eachItem.mplusChecked) ? eachItem.mplusChecked : false;
                                eachRow.mplusMsg = eachItem.mplusMsg;
                                return true;
                            }
                        });
                    })

                    
                    /**
                     * 撥號面板影響連動 電訪結果之連絡結果下拉選項
                     * VL903-1114
                     *********************************************** START *********************************************************************************/
                    // 取撥號面板資訊，有打開過撥號面板並關閉時會有值
                    var currCallUpData = callUpInfoModule.currCallUpData;
                    
                    // 是否所有撥號結果為空
                    var isEveryCullUpResultEmpty = currCallUpData.every((eachCullUpData)=> VlidationUtil.isEmpty(eachCullUpData.callUpResult));
                     // 是否所有撥號結果為空:否
                    if(!isEveryCullUpResultEmpty){

                        // 撥號結果是否有包含 本人接聽: 有撥號資訊且有本人接聽 : true / 有撥號資訊且未有本人接聽 : false / 沒有撥號資訊 undefined
                        var isCallUpResultInclude_IN_PERSON = currCallUpData.some((eachCullUpData)=>{
                            if(eachCullUpData.callUpResult === "IN_PERSON"){
                                return true;
                            }else{
                                return false;
                            }
                        });
                    }

                    // 撥號面板 更動畫面的電訪結果
                    this.grid.data.forEach((eachRow:any)=>{

                        if(isCallUpResultInclude_IN_PERSON !== undefined){
                            //有撥號資訊且有本人接聽
                            if(isCallUpResultInclude_IN_PERSON){
                                // 本次撥號結果 包含 本人接聽，結果區 聯絡結果 帶入 代碼開頭為 "A"，從DB 配置表 取第一個 A，若無表示配置表沒有
                                var contResultOptIncludeInPerson = eachRow.contResultOpts.find((eachOpt)=>eachOpt.label.startsWith("A"));
                                if(contResultOptIncludeInPerson !== undefined){
                                    eachRow.selectedContRes = contResultOptIncludeInPerson.label;
                                }
                            }else{
                                // 本次撥號結果 未包含 本人接聽，結果區 聯絡結果 帶入 代碼開頭為 "B"，從DB 配置表 取第一個 B，若無表示配置表沒有
                                var contResultOptIncludeCanotContact = eachRow.contResultOpts.find((eachOpt)=>eachOpt.label.startsWith("B"));
                                if(contResultOptIncludeCanotContact !== undefined){
                                    eachRow.selectedContRes = contResultOptIncludeCanotContact.label;
                                }
                            }
                        }

                    });
                    /*********************************************** END *********************************************************************************/

                    // 取的初始 聯絡結果 當作選擇 聯絡結果
                    this.grid.data.forEach((eachRow:any, index)=>{
                        this.changeContResult(ContResultChangFlagEnum.INIT, eachRow.selectedContRes, eachRow);
                    });

                }else{
                    console.log("查詢電訪結果資訊發生錯誤");
                }
            }
        })
        .catch((error)=>{
            console.error("查詢電訪結果資訊發生異常");
        })
        .finally(()=>{
            // 關閉 loading
            this.isLoading = false;
        });

    }

    /**
     * @description 續訪下拉選單
     * @author B1529
     * @version 2022/05/17
     */
    continueInit(){

        if(!ValidationUtil.isEmpty(this.followContactOption)) {
            
            this.continueOpts = Object.assign(this.followContactOption);
            this.continuePackNo = PackMatchModule.pickupResult.firstCasePack.packNo;

        } else {
            this.$teleResultAreaApi.getContinueOptionsUsingPOST({
                'packNo' : this.currentPack.packNo
            }).then((res:AxiosResponse<GetContinueOptionsDto>) => {
                
                if(!VlidationUtil.isEmpty(res.data.continueOptions)){
                    this.continueOpts = Object.assign(res.data.continueOptions);

                    // 預設當前 名單序號 到續訪下拉選項上
                    this.continueOpts.some((eachOpt:Option)=>{
                        if(eachOpt.value === this.currentPack.packNo){
                            this.continuePackNo = eachOpt.value
                            return;
                        }
                    });
                }
    
            }).catch((error) => {
                console.log(error);
            });
        }
    }


    // ========================================================================== EVENT =============================================================================================
    
    //離開
    onLeave(){
        if(this.validatePickUpNext(true)){  
            let errorMsg = [];
            let isCheckSavedSuccess = false;
            let isCheckInfAndNotiSuccess = false;
            //主名單與續訪名單
            let packNoList = this.getMainPackAndContinuePackNoList();
            LoadingUtil.show();
            //判斷是否皆已儲存電訪結果
            const checkNotSavedApi = this.$teleResultAreaApi.checkIsAllSavedTeleResultUsingPOST(packNoList).then((resp)=>{
                if(!resp.data.allCaseTeleResultSaved){
                    //有案件尚未儲存電訪結果
                    let notSavedMsg = this.generateTeleResultNotSaveErrorMsg(resp.data.notSavedInfo);
                    errorMsg.push(notSavedMsg);
                }
                isCheckSavedSuccess = true;
            });

            //檢核是否已送出照會/會辦單
            const checkInfAndNoti = this.$teleResultAreaApi.checkIsAllHasInfOrNotiUsingPOST(packNoList).then((resp)=>{
                if(!resp.data.allHasInf){
                    //有案件未開會辦作業單
                    let infMsg = this.getNotInfOrNotiMessage(resp.data.notHasInfInfo,true);
                    errorMsg.push(infMsg);
                }
                if(!resp.data.allHasNoti){
                    //有案件未開照會作業單
                    let notiMsg = this.getNotInfOrNotiMessage(resp.data.notHasNotiInfo,false);
                    errorMsg.push(notiMsg);
                }
                isCheckInfAndNotiSuccess = true;
            });

            Promise.all([checkNotSavedApi,checkInfAndNoti]).then(() => {
                LoadingUtil.close();
                if(!isCheckSavedSuccess){
                    // 確認電訪結果是否皆已儲存失敗
                    ErrorModalUtil.modalError(this.$t('teleResultArea_checkTeleResultSavedFailed').toString());
                }else if(!isCheckInfAndNotiSuccess){
                    // 確認照會/會辦單是否已開立失敗
                    ErrorModalUtil.modalError(this.$t('teleResultArea_checkNotiInfFailed').toString());
                }else if(errorMsg.length>0){
                    // 請確認！
                    errorMsg.push(this.$t('teleResultArea_pleaseConfirm').toString());
                    ErrorModalUtil.modalListError(errorMsg,null);
                }else{
                    LoadingUtil.show();
                    let pickUpNextSaveDto = this.getPickNextPackData(); //結果區資訊
                    let allCaseLogList = this.getAllCaseLogList();  //所有案件歷程代碼
                    let continuePackNoList = this.getMainPackAndContinuePackNoList();  //續訪名單資訊
                    let inputDto = {
                        teleResultAreaInfoList : pickUpNextSaveDto,
                        packNo: PackMatchModule.pickupResult.firstCasePack.packNo,
                        continuePackNoList: continuePackNoList,
                        allCaseLogList: allCaseLogList,
                        followPackNo: PackMatchModule.pickupResult.firstCasePack.followPackNo,
                        fromPublic: PackMatchModule.pickupResult.isPublic
                    }
                    this.$teleResultAreaApi.saveBeforeGetNextPackUsingPOST(inputDto)
                    .then((resp)=>{
                        LoadingUtil.close();
                        if(resp.data.success){
                            // 警告有些聯絡方式失敗(returnMessage有值表示有些聯絡方式失敗)
                            if (!VlidationUtil.isEmpty(resp.data.returnMessage)) {
                                MessageUtil.messageWarningWithNewLine(resp.data.returnMessage);
                            }
                            // 資料儲存成功
                            MessageUtil.messageSuccess(this.$t('teleResultArea_dataSavedSuccess').toString());
                            // 清除歸戶提示訊息紀錄
                            PackMatchModule.clearTrasitionResult();
                            PackMatchModule.clearTeleResultAreaSelectAns(); // VL903-1114 ，離開 清空 電訪結果 vuex & localstorage 資訊
                            PackMatchModule.clearTeleResultAreaContactAns(); // VL903-1129，離開 清除 電訪結果之方便聯絡時間 vuex & localStorage
                            this.$router.push("/pending-page");
                        }else{
                            // resp.data.success不為true，且returnMessage有值表示有caseNo的三種聯絡方式都失敗了
                            if (!VlidationUtil.isEmpty(resp.data.returnMessage)) {
                                if (resp.data.returnMessage.includes("\r\n")) {
                                    ErrorModalUtil.modalListError(resp.data.returnMessage.split("\r\n"), null);
                                } else {
                                    ErrorModalUtil.modalError(resp.data.returnMessage);
                                }
                            }else{
                                // 離開執行失敗
                                ErrorModalUtil.modalError(this.$t('teleResultArea_leaveFailed').toString());
                            }
                        }
                    }).catch((err)=>{
                        LoadingUtil.close();
                        // 離開執行失敗
                        ErrorModalUtil.modalError(this.$t('teleResultArea_leaveFailed').toString());
                    })
                }
            }).catch((err)=>{
                LoadingUtil.close();
            });
        }
    }

    
    /**
     * 準備電訪結果區儲存
     ***/
    readyTeleResultSave(){
        
        // 驗證有結案原因之案件的問卷
        var validateCloseCaseResultSave:ReturnValidCloseCaseSave = this.validateCloseCaseResultSave();
        if(!validateCloseCaseResultSave.success){
            ErrorModalUtil.modalListError(validateCloseCaseResultSave.errorMsg, 600);
            return; // 直接返回不儲存
        }
        
        // 驗證方便連絡時段
        var validateVisitDate = this.validateVisitDate();
        if(!validateVisitDate){
            return;
        }

        //整理案件對應填寫問卷之案件狀態
        this.caseStage_status_by_quest();

        //問卷資料存檔檢核，檢核成功才執行 電訪結果儲存
        this.$emit("saveAllQuest", "");

    }

    /**
     * 電訪結果區儲存
     */
    toSaveTeleResult(){
        let start = this.getContactDateTime(this.teleResultAreaForm.convenientContactStartTime,this.teleResultAreaForm.contactDate);
        let end = this.getContactDateTime(this.teleResultAreaForm.convenientContactEndTime,this.teleResultAreaForm.contactDate);
        let teleResultData : TeleResultAreaSaveDto = {
            //名單編號
            packNo: PackMatchModule.pickupResult.firstCasePack.packNo,
            //是否來自大眾池
            publicPool: PackMatchModule.pickupResult.isPublic,
            //方便連絡時段
            visitStartDate: start,
            visitEndDate: end,
            //結果區資訊
            teleResultList: this.getTeleAreaListData(),
        }
        
        /**
         * 若方便聯絡時間有值，將資料儲存至 localStorage
         * VL903-1129
         */
        if(!ValidationUtil.isEmpty(this.teleResultAreaForm.contactDate)){
            // 整理方便聯絡時間物件
            var tempTeleResultAreaContactAnsObj: TeleResultAreaContactAnsObj = {};
            tempTeleResultAreaContactAnsObj.contactDate = this.teleResultAreaForm.contactDate;
            tempTeleResultAreaContactAnsObj.contactString = this.teleResultAreaForm.contactString;
            tempTeleResultAreaContactAnsObj.convenientContactStartTime = this.teleResultAreaForm.convenientContactStartTime;
            tempTeleResultAreaContactAnsObj.convenientContactEndTime = this.teleResultAreaForm.convenientContactEndTime;
            tempTeleResultAreaContactAnsObj.convenientContactStartString = this.teleResultAreaForm.convenientContactStartString;
            tempTeleResultAreaContactAnsObj.convenientContactEndString = this.teleResultAreaForm.convenientContactEndString;
            // 取得目前方便聯絡時間 localstorage，初始化已配置好當前 所有續訪 的 packNo
            var tempLocalTeleResultAreaContactAns = JSON.parse(localStorage.getItem(PackMatchModule.TELE_RESULT_AREA_CONTACT_ANS));
            
            // mapping 僅儲存當前名單下的方便聯絡時間
            Object.keys(tempLocalTeleResultAreaContactAns).some((eachPackNo)=>{
                if(eachPackNo === PackMatchModule.pickupResult.firstCasePack.packNo){
                    tempLocalTeleResultAreaContactAns[eachPackNo] = tempTeleResultAreaContactAnsObj;
                    return true;
                }
            });
            // 整理儲存後方便聯絡時間物件，塞回 localstorage
            PackMatchModule.putTeleResultAreaContactAns(tempLocalTeleResultAreaContactAns);
        }
        

        /**
         * VL903-1114 
         *********************************************************************************************************/
        var teleAreaListDataToLocalTeleResultAreaSelectAns  = this.getTeleAreaListDataToLocalTeleResultAreaSelectAns(); // 整理準備傳入 localstorage 資訊
        PackMatchModule.updateTeleResultAreaSelectAns(teleAreaListDataToLocalTeleResultAreaSelectAns); // 塞入 localstorage
        callUpInfoModule.clearCurrentCallUpData(); // 清除撥號面板 vuex 資訊
        /*********************************************************************************************************/

        LoadingUtil.show();
        this.$teleResultAreaApi.saveTeleResultAreaInfoUsingPOST(teleResultData).then((resp)=>{
            LoadingUtil.close();
            
            // 儲存成功重整
            this.reload(ReloadFromFlag.FROM_TO_SAVE_TELERESULT);

            if(resp.data.success){
                // 電訪結果儲存成功
                if(resp.data.needReturnToPublic){
                    //此名單需回大眾池 跳出提示訊息告知使用者
                    Modal.warning({
                        class: "error-modal-util-class",
                        title: () => this.$t("teleResultArea_returnToPublicConfirmTitle").toString(),//提示訊息
                        //客戶方便聯絡時段不在您值班時段，執行「離開」或「取下一筆」後，此件將會退回大眾池。
                        content: () => this.$t('teleResultArea_returnToPublicConfirmMsg').toString(), 
                        okText: this.$t('global_ok').toString(), //確認
                        onOk: () => {},
                    })
                }

                //本次儲存是否有填方便連絡時段
                if((start != null && end != null) || resp.data.autoComputeVisitTime){
                    //更新此名單已儲存方便連絡時段
                    this.updateContiuePackVisitTimeInfo(true);
                    
                }else if((start == null || end == null ) && !resp.data.autoComputeVisitTime){
                    //更新此名單未儲存方便連絡時段
                    this.updateContiuePackVisitTimeInfo(false);
                }
                
                //VL903-1094 儲存 電訪結果成功，在判斷是否回寫400 失敗，失敗需在 儲存成功後的視窗
                Modal.success({
                    content: ()=> this.$t('teleResultArea_teleResultDataSavedSuccessed').toString(), //電訪結果儲存成功
                    okText: this.$t('global_ok').toString(), //確認
                    icon: 'check-circle', // 打勾圖示
                    onOk: () => {
                        // 若回寫 400 失敗，顯示確認畫面
                        if(!resp.data.overwrite400Success){
                            Modal.warning({
                                content: ()=> {return this.generateRewrite400FailedErrorMsg(resp.data.overwrite400FailPolicyNoList)},
                                okText: this.$t('global_ok').toString(), //確認
                                icon: 'info-circle', // 提醒圖示 !
                                onOk: () => {},
                            });
                        }
                    },
                });

                this.hasTeleResultAreaSave = true;
                // 儲存成功，將問卷的修改狀態，改回 "N"，會自動傳回父層，QuestArea 接到此物件也會被更動
                this.questAllData.commonData.questModify = "N"; 

                //存完資料後將問卷區有結案原因的問卷整個disable掉
                this.grid.data.some((eachRow:any, index)=>{
                    if(eachRow.selectedCaseClosedReason != null && eachRow.selectedCaseClosedReason != '0'){
                        for(let data of this.questAreaData.questDto){
                            if(eachRow.caseNo == data.caseNo){
                                data.closeCase = true;
                            }
                        }
                    }
                });

                //重新計算未完成openCaseCount
                this.$questMainApi.getOpenCaseCountUsingGET(PackMatchModule.pickupResult.firstCasePack.packNo)
                  .then((resp) => {
                    this.$emit("changeOpenCount", resp.data);
                  })
                  .catch((err) => {
                    //失敗其實沒差…所以記個log就好
                    console.log(err);
                  });

              
            }else{
                // 電訪結果儲存失敗
                ErrorModalUtil.modalError(this.$t('teleResultArea_teleResultDataSavedFailed').toString());
            }
        }).catch((err)=>{
            LoadingUtil.close();
            // 電訪結果儲存失敗
            ErrorModalUtil.modalError(this.$t('teleResultArea_teleResultDataSavedFailed').toString());
        });

        // 重新查詢歸戶提示訊息跟件數量
        this.$transitionApi.getTransitionCountUsingPOST({
            followPackNo : PackMatchModule.pickupResult.firstCasePack.followPackNo
        })
        .then((res:AxiosResponse<string>) => {

            if(res.data){
                this.$emit("changeTransitionMark", parseInt(res.data));
            }

        }).catch((err) => {
            console.log(err);
        });
    }

    //更新此名單已儲存/未儲存方便連絡時段
    updateContiuePackVisitTimeInfo(isSavedVisitData){
        let continuePackInfo= ContinuePackMoudle.continuePackInfo;
        if(continuePackInfo.detailInfo.find((item)=> item.packNo == PackMatchModule.pickupResult.firstCasePack.packNo) == null){
            continuePackInfo.detailInfo.push({
                packNo: PackMatchModule.pickupResult.firstCasePack.packNo,
                isSavedVisitData: isSavedVisitData
            })
        }else{
            continuePackInfo.detailInfo.find((item)=> item.packNo == PackMatchModule.pickupResult.firstCasePack.packNo).isSavedVisitData = isSavedVisitData;
        }
        ContinuePackMoudle.updateContinuePackInfo(continuePackInfo);
    }

    /**
     * 整理案件對應填寫問卷之案件狀態
     * 
     */
    caseStage_status_by_quest(){

        // VL903-1283 整理 每筆 case 的問卷每題答項是否顯示並是否需要驗證
        var caseQuestIsShowObj = {};
        this.questAreaData.questDto.forEach((eachQuest:any)=>{
            var eachCaseQuestIsShowObj = {};
            eachQuest.questContDto.forEach((eachContDto:any)=>{
                eachCaseQuestIsShowObj[eachContDto.itemCode] = eachContDto.isShow;
            });
            caseQuestIsShowObj[eachQuest.caseNo] = eachCaseQuestIsShowObj;
        });
        // 輔助查看
        // console.log("caseQuestIsShowObj: ....", JSON.stringify(caseQuestIsShowObj));


        for(var i=0; i < this.grid.data.length; i++){
            var eachRow = this.grid.data[i];

            // 取得案件對應問卷，需要複製出來，避免動到原本傳入的 問卷資料
            var eachCaseQuestAns = JSON.parse(JSON.stringify(this.questAllData.answer.quest[eachRow.caseNo]));
            // 取得案件對應問卷每題答項是否顯示，需要複製出來，避免動到原本傳入的 問卷資料
            var eachCaseQuestShow = JSON.parse(JSON.stringify(caseQuestIsShowObj[eachRow.caseNo]));

            // 整理該案件問卷之答案，準備驗證之物建
            var currentCaseQuestAnsArr = [];

            // VL903-1283 排除答項 false (不顯示即不需驗證)
            Object.keys(eachCaseQuestAns).forEach((eachAnsKey)=>{
                Object.keys(eachCaseQuestShow).some((eachQuestShowKey)=>{
                    if(eachAnsKey === eachQuestShowKey && eachCaseQuestShow[eachQuestShowKey] === false){
                        delete eachCaseQuestAns[eachAnsKey];
                        return;
                    }
                });
            });

            // 滾出每個案件對應問卷之答案
            Object.values(eachCaseQuestAns).forEach((eachAns:any)=>{
                // 答項有 remark (點選問答項)
                if("remark" in eachAns){
                    Object.values(eachAns.remark).some((remark:any)=>{
                        if("cont" in remark && undefined !== remark.cont){
                            currentCaseQuestAnsArr.push(remark.cont);
                            currentCaseQuestAnsArr.push(remark.value);
                        }else{
                            currentCaseQuestAnsArr.push(remark.value);
                        }
                    });
                }else{
                    // 答項為多選
                    if(eachAns.value.includes(":")){
                        var splitArr = eachAns.value.split(":");
                        splitArr.forEach((split:any)=>{
                            currentCaseQuestAnsArr.push(split);
                        });
                    }
                    // 答項單選
                    else{
                        currentCaseQuestAnsArr.push(eachAns.value);
                    }
                }
            });

            //問卷是否已完成 isQuestCompleted: false,
            //問卷是否有包含N或R isQuestHasNR: false,
            //問卷是否已執行 isQuestPerformed: false,
              
            //   問卷未執行->題目答項全為空值
            var isALlEmpt = currentCaseQuestAnsArr.every((currValue) => VlidationUtil.isEmpty(currValue));
            if(isALlEmpt){
                eachRow.isQuestPerformed = false;
                eachRow.isQuestCompleted = false;
                eachRow.isQuestHasNR = false;
                console.log(eachRow.caseNo + " status: 問卷未執行 arrange questans : " +  JSON.stringify(currentCaseQuestAnsArr));
                continue; //執行下一迴圈
            }
            
            // 題目答項全部都有值
            var isAllAns = currentCaseQuestAnsArr.every((currValue) => !VlidationUtil.isEmpty(currValue));
            if(isAllAns){
                // 問卷答項有 N開頭(否)或R(未作答/拒答)
                var isNR = currentCaseQuestAnsArr.some((currValue) => new RegExp('^N.*$').test(currValue) || currValue === "R");
                // 沒有找到 N R 完成
                if(!isNR){
                    //完成
                    eachRow.isQuestPerformed = true;
                    eachRow.isQuestCompleted = true;
                    eachRow.isQuestHasNR = false;

                    console.log(eachRow.caseNo + " status: 完成問卷(無 NR) arrange questans : " +  JSON.stringify(currentCaseQuestAnsArr));
                    continue; //執行下一迴圈
                }
                // 找到 N R 未完成
                if(isNR){
                    eachRow.isQuestPerformed = true;
                    eachRow.isQuestCompleted = true;
                    eachRow.isQuestHasNR = true;

                    console.log(eachRow.caseNo + " status: 完成問卷 (有NR)  arrange questans : " +  JSON.stringify(currentCaseQuestAnsArr));
                    continue; //執行下一迴圈
                }

            }
            
            // 任一答項有值，非全部有值
            var findOneIsEmpt = currentCaseQuestAnsArr.some((currValue)=> {return VlidationUtil.isEmpty(currValue)});
            if(findOneIsEmpt){
                eachRow.isQuestPerformed = true;
                eachRow.isQuestCompleted = false;
                eachRow.isQuestHasNR = false;
                console.log(eachRow.caseNo + " status: 問卷未完成  arrange questans : " +  JSON.stringify(currentCaseQuestAnsArr));
                continue; //執行下一迴圈
            }
        }

        this.grid.data.forEach((eachRow:any)=>{
            console.log(
                "eachRow.isQuestPerformed : " + eachRow.isQuestPerformed + " , " +
                "eachRow.isQuestCompleted : " + eachRow.isQuestCompleted + " , " +
                "eachRow.isQuestHasNR : " + eachRow.isQuestHasNR 
            );
        })

    }

    //取得結果區資料
    getTeleAreaListData(){
        let list = [];
        this.grid.data.filter((row)=> VlidationUtil.isEmpty(row.caseCloseReasonCode)).forEach((row)=>{
            list.push({
                //案件編號
                caseNo: row.caseNo,
                //電訪項目代碼
                taskId: row.taskId,
                //案件歷程代碼
                logUuid: PackMatchModule.pickupResult.casePolicyLogList.find((logInfo)=> logInfo.caseNo == row.caseNo).guid,
                //連絡結果
                contactResultId: (row.selectedContRes == "0") ? null : row.selectedContRes,
                //電訪結果
                teleResultId: (row.selectedTeleRes == "0") ?  null : row.selectedTeleRes,
                //結案原因
                caseCloseReasonCode: (row.selectedCaseClosedReason == "0")? null : row.selectedCaseClosedReason,
                //問卷是否已執行
                questPerformed: row.isQuestPerformed,
                //問卷是否已完成
                questCompleted: row.isQuestCompleted,
                //問卷是否有包含N或R
                questHasNR: row.isQuestHasNR,
            })
        })
        return list;
    }

    /**
     * 整理準備傳入 localstorage 電訪結果 資訊
     * VL903-1114
     * @returns 
     */
    getTeleAreaListDataToLocalTeleResultAreaSelectAns(){
        let list = [];
        // this.grid.data.filter((row)=> VlidationUtil.isEmpty(row.caseCloseReasonCode)).forEach((row)=>{
        //     list.push({
        //         //案件編號
        //         caseNo: row.caseNo,
        //         //連絡結果
        //         selectedContRes: (row.selectedContRes == "0") ? null : row.selectedContRes,
        //         //電訪結果
        //         selectedTeleRes: (row.selectedTeleRes == "0") ?  null : row.selectedTeleRes,
        //         //結案原因
        //         selectedCaseClosedReason: (row.selectedCaseClosedReason == "0")? null : row.selectedCaseClosedReason,
        //     });
        // });
        // 整理 localstorage 電訪結果資訊 不需要 排除結案 不 結案的問題，全部更新到 localstorage
        this.grid.data.forEach((row)=>{
            list.push({
                //案件編號
                caseNo: row.caseNo,
                //連絡結果
                selectedContRes: (row.selectedContRes == "0") ? null : row.selectedContRes,
                //電訪結果
                selectedTeleRes: (row.selectedTeleRes == "0") ?  null : row.selectedTeleRes,
                //結案原因
                selectedCaseClosedReason: (row.selectedCaseClosedReason == "0")? null : row.selectedCaseClosedReason,
                //VL903-1291 M+ 
                mplusShow: row.mplusCheckBox.show,
                mplusChecked: row.mplusCheckBox.checked,
                mplusMsg: row.mplusMsg,
            });
        });


        return list;
    }
    

    //取下一筆
    pickUpNext(){
        if(this.validatePickUpNext(false)){
            let errorMsg = [];
            let isCheckSavedSuccess = false;
            let isCheckInfAndNotiSuccess = false;
            //主名單與續訪名單
            let packNoList = this.getMainPackAndContinuePackNoList();
            LoadingUtil.show();
            //判斷是否皆已儲存電訪結果
            const checkNotSavedApi = this.$teleResultAreaApi.checkIsAllSavedTeleResultUsingPOST(packNoList).then((resp)=>{
                if(!resp.data.allCaseTeleResultSaved){
                    //有案件尚未儲存電訪結果
                    let notSavedMsg = this.generateTeleResultNotSaveErrorMsg(resp.data.notSavedInfo);
                    errorMsg.push(notSavedMsg);
                }
                isCheckSavedSuccess = true;
            });

            //檢核是否已送出照會/會辦單
            const checkInfAndNoti = this.$teleResultAreaApi.checkIsAllHasInfOrNotiUsingPOST(packNoList).then((resp)=>{
                if(!resp.data.allHasInf){
                    //有案件未開會辦作業單
                    let infMsg = this.getNotInfOrNotiMessage(resp.data.notHasInfInfo,true);
                    errorMsg.push(infMsg);
                }
                if(!resp.data.allHasNoti){
                    //有案件未開照會作業單
                    let notiMsg = this.getNotInfOrNotiMessage(resp.data.notHasNotiInfo,false);
                    errorMsg.push(notiMsg);
                }
                isCheckInfAndNotiSuccess = true;
            });

            Promise.all([checkNotSavedApi,checkInfAndNoti]).then(() => {
                LoadingUtil.close();
                if(!isCheckSavedSuccess){
                    // 確認電訪結果是否皆已儲存失敗
                    ErrorModalUtil.modalError(this.$t('teleResultArea_checkTeleResultSavedFailed').toString());
                }else if(!isCheckInfAndNotiSuccess){
                    // 確認照會/會辦單是否已開立失敗
                    ErrorModalUtil.modalError(this.$t('teleResultArea_checkNotiInfFailed').toString());
                }else if(errorMsg.length>0){
                    // 請確認！
                    errorMsg.push(this.$t('teleResultArea_pleaseConfirm').toString());
                    ErrorModalUtil.modalListError(errorMsg,null);
                }else{
                    LoadingUtil.show();
                    let pickUpNextSaveDto = this.getPickNextPackData(); //結果區資訊
                    let allCaseLogList = this.getAllCaseLogList();  //所有案件歷程代碼
                    let continuePackNoList = this.getMainPackAndContinuePackNoList();  //續訪名單資訊
                    let inputDto = {
                        teleResultAreaInfoList : pickUpNextSaveDto,
                        packNo: PackMatchModule.pickupResult.firstCasePack.packNo,
                        continuePackNoList: continuePackNoList,
                        allCaseLogList: allCaseLogList,
                        followPackNo: PackMatchModule.pickupResult.firstCasePack.followPackNo,
                        fromPublic: PackMatchModule.pickupResult.isPublic
                    }
                    // 勾選要發送M+的話，就要填M+發送內容，不然就要跳出警訊。
                    inputDto.teleResultAreaInfoList.forEach(tel => {
                        if (tel.checkedMPlus && ValidationUtil.isEmpty(tel.mplusMsg)){
                            ErrorModalUtil.modalError(this.$t('teleResultArea_mPlusMesgIsBlank').toString()); // M+發送內容為空白
                            return;
                        }
                    });
                    this.$teleResultAreaApi.getNextPackUsingPOST(inputDto)
                    .then((resp)=>{
                        LoadingUtil.close();
                        if(!resp.data.success){
                            if(ValidationUtil.isEmpty(resp.data.returnMessage)){
                                ErrorModalUtil.modalError(this.$t('packMatch_query_packNoFailed').toString());
                            }else{
                                // resp.data.success不為true，且returnMessage有值表示有caseNo的三種聯絡方式都失敗了
                                if (resp.data.returnMessage.includes("\r\n")) {
                                    ErrorModalUtil.modalListError(resp.data.returnMessage.split("\r\n"), null);
                                } else {
                                    ErrorModalUtil.modalError(resp.data.returnMessage);
                                }
                            }
                        }else{
                            // 警告有些聯絡方式失敗(returnMessage有值表示有些聯絡方式失敗)
                            if (!VlidationUtil.isEmpty(resp.data.returnMessage) && resp.data.returnMessage.includes("\r\n")) {
                                MessageUtil.messageWarningWithNewLine(resp.data.returnMessage);
                            }
                            if(resp.data.firstCasePack!= null){
                                //關閉所有前一名單開啟的相關表單
                                this.$emit('clossAllFormByTeleResultArea');
                                //更新取件資訊
                                PackMatchModule.updatePickpResult(resp.data);
                                PackMatchModule.updateMatchedCasePack(resp.data.firstCasePack);
                                PackMatchModule.clearTeleResultAreaSelectAns(); // VL903-1114 ，取下一件 清空 電訪結果 vuex & localstorage 資訊
                                PackMatchModule.clearTeleResultAreaContactAns(); // VL903-1129，取下一件 清除 電訪結果之方便聯絡時間 vuex & localStorage
                                //撥號資訊初始化
                                callUpInfoModule.setCallUpInfo({ codingNo: "", sessionId: "", previousCodingNoList: [] });
                                //結果區表單初始化
                                this.resetTeleResultForm();
                                this.isTimePickerShow = false;
                                // 清除歸戶提示訊息紀錄
                                PackMatchModule.clearTrasitionResult();
                                //名單方便連絡時段是否儲存資訊初始化
                                ContinuePackMoudle.initContinuePackInfo();
                                // 續訪下拉資料初始化
                                this.continuePackNo = resp.data.firstCasePack.packNo;
                                this.continueOpts = [];
                            }else{
                                Modal.info(
                                    {
                                        class: "error-modal-util-class",
                                        title: () => this.$t("global_information").toString(),//提示訊息
                                        content: () => this.$t('packMatch_query_noMatchedPack').toString(), //撮合結果:無符合之電訪案件可派發!
                                        onOk: () => {
                                            //撮合不到名單，導頁至待電訪頁面
                                            this.$router.push("/pending-page");
                                        }
                                    }
                                )
                            }
                        }
                    }).catch((err)=>{
                        LoadingUtil.close();
                        // 取下一筆執行失敗
                        ErrorModalUtil.modalError(this.$t('teleResultArea_pickUpNextPackFailed').toString());
                    })
                }
            }).catch((err)=>{
                LoadingUtil.close();
            });
        }
    }

    //結果區表單初始化
    resetTeleResultForm(){
        this.teleResultAreaForm = {
            contactDate: null,
            contactString: "",
            convenientContactStartTime: null,
            convenientContactEndTime: null,
            convenientContactStartString: "",
            convenientContactEndString: "",
        }
        this.hasTeleResultAreaSave = false;
    }

    //主名單與續訪名單
    getMainPackAndContinuePackNoList(){
        let packNoList = [];
        packNoList.push(PackMatchModule.pickupResult.firstCasePack.packNo);
        this.continueOpts.forEach((option)=>{
            if(!VlidationUtil.isEmpty(option.label) && option.value != PackMatchModule.pickupResult.firstCasePack.packNo){
                packNoList.push(option.value);
            }
        })
        return packNoList;
    }

    //取得所有案件歷程代碼清單
    getAllCaseLogList(){
        let list = [];
        let logInfoList = PackMatchModule.pickupResult.casePolicyLogList;
        logInfoList.forEach((logInfo)=>{
            list.push(logInfo.guid);
        })
        return list;
    }

    //整理電訪結果區資料(取下一筆/離開 用)
    getPickNextPackData(){
        let pickUpNextSaveDto : PickUpNextSaveDto[] = [];
        console.log(this.grid.data)
        this.grid.data.forEach((row)=>{
            let caseLogInfo = PackMatchModule.pickupResult.casePolicyLogList.find(c => c.caseNo == row.caseNo);
            pickUpNextSaveDto.push({
                // 名單編號
                packNo: PackMatchModule.pickupResult.firstCasePack.packNo,
                //案件編號
                caseNo: row.caseNo,
                //是否勾選M+
                checkedMPlus: row.mplusCheckBox.checked,
                //M+訊息內容
                mplusMsg: row.mplusMsg,
                // 案件歷程代碼
                caseLogId: caseLogInfo != null ? caseLogInfo.guid : "",
            })
            
        })
        return pickUpNextSaveDto;
    }

    //是否進行取下一筆(離開)的驗證
    validatePickUpNext(isLeave){
        let validate = true;

        //是否已點選電訪結果儲存
        if(!this.hasTeleResultAreaSave){
            validate = false;
            // 請先執行儲存再執行離開  請先執行儲存再執行取下一件
            ErrorModalUtil.modalError(isLeave? this.$t('teleResultArea_pleaseSavedFirstLeave').toString():this.$t('teleResultArea_pleaseSavedFirstPickUp').toString());
        }
        //撥號是否已儲存
        else if(!this.hasCallUpFormSave){
            validate = false;
            // 撥號面板尚未點選關閉按鈕!!
            ErrorModalUtil.modalError(this.$t('teleResultArea_pleaseCliceCloseCallup').toString());
        }
        // 問卷是否有異動
        else if(this.haveChangeQuest === "Y"){
            validate = false;
            // 問卷有異動，請先請先執行儲存再執行離開  問卷有異動，請先執行儲存再執行取下一件
            ErrorModalUtil.modalError(isLeave? this.$t('teleResultArea_plsSavedToLeavAftChangeQuest').toString():this.$t('teleResultArea_plsSavedToPickAftChangeQuest').toString());
        }

        if(validate){
            //驗證所有續訪名單此次是否皆已儲存過方便連絡時段資訊

            //主名單與續訪名單
            let packNoList = this.getMainPackAndContinuePackNoList();
            let notSavedPackNoList = [];
            let continuePackInfo= ContinuePackMoudle.continuePackInfo;
            packNoList.forEach((item)=>{
                let isPushThisRecord = false;
                if(continuePackInfo.detailInfo.find((detail)=>item == detail.packNo) == null){
                    //從未儲存過方便連絡時段
                    notSavedPackNoList.push(item);
                    isPushThisRecord = true;
                }else if(!continuePackInfo.detailInfo.find((detail)=>item == detail.packNo).isSavedVisitData){
                    //儲存過但又清除了方便連絡時段
                    notSavedPackNoList.push(item);
                    isPushThisRecord = true;
                }

                if(isPushThisRecord && item == PackMatchModule.pickupResult.firstCasePack.packNo){
                    //判斷名單的所有案件是否已結案
                    let isAllCosed = true;
                    this.grid.data.forEach((row)=>{
                        if(ValidationUtil.isEmpty(row.caseCloseReasonCode)){
                            isAllCosed = false;
                        }
                    })
                    if(isAllCosed){
                        //若案件全數已結案 無須卡控方便連絡時段必填
                        notSavedPackNoList.pop();
                    }
                }
            })
            if(!ValidationUtil.isEmpty(notSavedPackNoList)){
                validate = false;
                // 以上名單尚未儲存過方便連絡時段，請確認！
                notSavedPackNoList.push(this.$t('teleResultArea_notSavedVisitDateInfo').toString())
                ErrorModalUtil.modalListError(notSavedPackNoList,null);
            }
        }

        return validate;
    }

    //變更撥號是否已儲存的Flag
    changeCallUpFormSaveFlag(isSave){
        this.hasCallUpFormSave = isSave;
    }

    //取得尚未儲存過電訪結果的案件
    generateTeleResultNotSaveErrorMsg(caseInfoList){
        let msg = [];
        for (let i = 0; i < caseInfoList.length; i++) {
            let temp = "";
            // 未有儲存資料
            temp = temp + caseInfoList[i].casePolicy + "_" + caseInfoList[i].questName + " " + this.$t('teleResultArea_notSaved').toString();
            if(i!=caseInfoList.length-1){
                temp = temp + "、";
            }
            msg.push(temp);
        }
        return msg;
    }

    //取得會寫400異常錯誤訊息
    generateRewrite400FailedErrorMsg(policyNoList){
        let msg = "保單號碼";
        for (let i = 0; i < policyNoList.length; i++) {
            let temp = "";
            temp = temp + policyNoList[i];
            if(i!=policyNoList.length-1){
                temp = temp + "、";
            }
            msg = msg + temp;
        }
        msg = msg + "回寫400異常"
        return msg;
    }

    //取得尚未送出照會/會辦單的錯誤訊息
    getNotInfOrNotiMessage(caseInfoList, isInf){
        let msg = [];
        for (let i = 0; i < caseInfoList.length; i++) {
            let temp = "";
            temp = temp + caseInfoList[i].casePolicy + "_" + caseInfoList[i].questName + " ";
            if(isInf){
                // 尚未送出會辦單
                temp = temp + this.$t('teleResultArea_notInf').toString();
            }else{
                // 尚未送出會辦單
                temp = temp + this.$t('teleResultArea_notNoti').toString();
            }
            
            if(i!=caseInfoList.length-1){
                temp = temp + "、";
            }
            msg.push(temp);
        }
        return msg;
    }

    //續訪下拉選單選項異動
    onContinueChange(){
        let firstPackNo = PackMatchModule.pickupResult.firstCasePack.packNo;
        let codingNoList = callUpInfoModule.callUpInfo.previousCodingNoList;
        if(!ValidationUtil.isEmpty(this.continuePackNo)&& firstPackNo != this.continuePackNo){
            LoadingUtil.show();
            //判斷本次是否有撥號紀錄但無撥號結果
            this.$historyApi.checkHasCallUpHistoryButResultIsNullUsingPOST(codingNoList).then((resp)=>{
                LoadingUtil.close();
                if(resp.data){
                    // 尚未選取本次撥號結果!!
                    ErrorModalUtil.modalError(this.$t("teleResultArea_notSelectCallUpResult").toString());
                    this.continuePackNo = "";
                }else{
                    Modal.confirm(
                        {
                            class: "error-modal-util-class",
                            title: () => this.$t("global_information").toString(),//提示訊息
                            content: () => this.$t("teleResultArea_confirmDataIsSaved").toString(), //請確認是否已完成資料儲存
                            okText: this.$t("teleResultArea_sureContinueNextPack").toString(), //確認續訪
                            cancelText: this.$t("global_cancel").toString(), //取消
                            onOk: () => this.goToContinuePack(),
                            onCancel: () => {
                                this.continuePackNo = firstPackNo
                            },
                        }
                    )
                }
            }).catch((err)=>{
                LoadingUtil.close();
                ErrorModalUtil.modalError("撥號記錄查詢失敗");
            })
        }
    }

    //確認執行續訪
    goToContinuePack(){
        let codingNo = ValidationUtil.isEmpty(callUpInfoModule.callUpInfo) || ValidationUtil.isEmpty(callUpInfoModule.callUpInfo.codingNo) ?  "" :callUpInfoModule.callUpInfo.codingNo as string ;
        let continuePack = PackMatchModule.pickupResult.casePackList.find((pack)=> pack.packNo == this.continuePackNo);
        if(VlidationUtil.isEmpty(continuePack) || continuePack == null){
            //中途掉件 重新取得名單資訊(包含歷程代碼)
            this.$packMatchApi.getContinuePackInfoUsingPOST(this.continuePackNo)
            .then((resp)=>{
                let pickupResult = PackMatchModule.pickupResult;
                pickupResult.casePackList.push(resp.data);
                resp.data.casePolicyLogInfoList.forEach((logInfo)=>{
                    pickupResult.casePolicyLogList.push(logInfo);
                })
                PackMatchModule.updateMatchedCasePack(pickupResult);
                continuePack = resp.data;
                this.changeCureentPackInfo(continuePack, codingNo);
            })
        }else{
            //跟件資訊已存在
            this.changeCureentPackInfo(continuePack, codingNo);
        }
    }

    //更新撥號續訪關聯表、更新第一包名單資訊
    changeCureentPackInfo(continuePack, codingNo){
        let casePolicyLogList = continuePack.casePolicyLogInfoList;
        if(!ValidationUtil.isEmpty(codingNo)){
            LoadingUtil.show();
            this.$historyApi.continuePackDataSaveUsingPOST(codingNo,this.continuePackNo,casePolicyLogList).then((resp)=>{
                LoadingUtil.close();
                let pickUpResult =Object.assign(PackMatchModule.pickupResult);
                pickUpResult.firstCasePack = continuePack;
                PackMatchModule.updatePickpResult(pickUpResult);
                PackMatchModule.updateMatchedCasePack(continuePack);
                this.continuePackNo = PackMatchModule.pickupResult.firstCasePack.packNo;
                //清除驗證成功的撥號流水號
                let callUpInfo = callUpInfoModule.callUpInfo;
                callUpInfoModule.setCallUpInfo({ codingNo: callUpInfo.codingNo, sessionId: callUpInfo.sessionId, previousCodingNoList: [] })
            })
            .catch((err)=>{
                LoadingUtil.close();
                // 續訪關聯記錄儲存失敗
                ErrorModalUtil.modalError(this.$t("teleResultArea_continuePackDataSavedFailed").toString())
            })
        }else{
            let pickUpResult =Object.assign(PackMatchModule.pickupResult);
            pickUpResult.firstCasePack = continuePack;
            PackMatchModule.updatePickpResult(pickUpResult);
            PackMatchModule.updateMatchedCasePack(continuePack);
            this.continuePackNo = PackMatchModule.pickupResult.firstCasePack.packNo;
            this.hasCallUpFormSave = false;
        }
        
        this.continuePackNo = "";
        this.resetTeleResultForm();
        this.continueInit();
        //關閉所有已開啟的表單
        this.$emit('clossAllFormByTeleResultArea');
    }

    /******* 聯絡結果下拉 start***********************************************/

     /**
     * 勾選聯絡結果 一併處理
     */
    handleUpdateContact(e) {
        if(e.target.checked) {
            this.syncUpdateContResult = true;
        }else{
            this.syncUpdateContResult = false;
        }
    }

     /**
     * 變更單列聯絡結果
     * @param selectedContRes 
     * @param currRowData 
     */
      changeContResult(flag, selectedContRes, currRowData){

        // 變更選擇之單列的 聯絡結果，響應到該列前端下拉上
        this.grid.data.some((eachRow:any, index)=>{
            if(eachRow.rowKey == currRowData.rowKey){
                if(selectedContRes == undefined || selectedContRes == null){
                    eachRow.selectedContRes = "0";
                }else{
                    eachRow.selectedContRes = selectedContRes
                }
                //更動聯絡結果 連帶 查詢 電訪結果下拉選單
                this.contResultToGetTeleResult(flag, eachRow.selectedContRes, currRowData);
                //更動聯絡結果 連帶 查詢 M+選取框是否顯示
                this.contResultToGetMplus(flag, eachRow.selectedContRes, currRowData);
                return true;
            }
        });

      
        // 是否勾選一併更新
        if(this.syncUpdateContResult){
            this.updateContResultToSync(flag, selectedContRes);
        }

    }

    /**
     * 一併更新 聯絡結果
     * @param selectedContRes 
     */
    updateContResultToSync(flag, selectedContRes){

        this.grid.data.forEach((eachRow:any, i)=>{
            // 僅結果原因是空白可被更改
            if(VlidationUtil.isEmpty(eachRow.caseCloseReasonCode)){
                // 找每列的配置中有相對應選擇之 聯絡結果，才能被一併更新
                eachRow.contResultOpts.forEach((eachOpt:any, index)=>{
                    if(eachOpt.label == selectedContRes){
                        if(selectedContRes == undefined || selectedContRes == null){
                            eachRow.selectedContRes = "0";
                        }else{
                            eachRow.selectedContRes = selectedContRes
                        }
                        //更動聯絡結果 連帶 查詢 電訪結果下拉選單
                        this.contResultToGetTeleResult(flag, selectedContRes, this.grid.data[i]);
                        //更動聯絡結果 連帶 查詢 M+選取框是否顯示
                        this.contResultToGetMplus(flag, selectedContRes, this.grid.data[i]);
                        return true;
                    }
                });
            }
        });
    }

    /******* 聯絡結果下拉 end ***********************************************/


    /******* 電訪結果下拉 start ***********************************************/

    /**
     * 更動聯絡結果 連帶 查詢 電訪結果下拉選單
     * @param selectedContRes 
     * @param currRowData 
     */
    contResultToGetTeleResult(flag, selectedContRes, currRowData){

        // 更新 電訪結果下拉
        var teleResultConfigCond:TeleResultConfigCond = {};
        teleResultConfigCond.taskId = currRowData.taskId;
        teleResultConfigCond.contactResultId = selectedContRes;
        this.$teleResultAreaApi.getTeleResultOptByCondUsingPOST(teleResultConfigCond)
        .then((resp:AxiosResponse<Option[]>)=>{
            if(resp != null){
                this.grid.data.some((eachRow:any, index)=>{
                    if(eachRow.rowKey == currRowData.rowKey){
                        // 將依條件搜尋到的 電訪結果下拉 塞到對應列的 電訪結果下拉
                        eachRow.teleResultOpts = resp.data;
                        
                        // 為初始查詢時
                        if(flag === ContResultChangFlagEnum.INIT){
                            // 初始查詢時的 聯絡結果為空，就預設電訪結果為空，反之 初始查詢有 聯絡結果，就依照已查詢後的值為主(不做事)
                            if(eachRow.selectedTeleRes == null || eachRow.selectedTeleRes == undefined || eachRow.selectedTeleRes == "0"){
                                eachRow.selectedTeleRes = "0"; // 重查後，下拉給預設 "0"
                            }
                        }
                        // 為手動更新 聯絡結果 改電訪結果選擇到 空白
                        else if(flag === ContResultChangFlagEnum.CUSTOMER_CHANGE){
                            eachRow.selectedTeleRes = "0"; // 重查後，下拉給預設 "0"
                        }
                        
                        return true;
                    }
                });
                //選擇 聯絡結果 & 電訪結果 查詢 結案原因 下拉選單
                this.contResAndTeleResToGetClosedRes(flag, currRowData);
                //選擇 聯絡結果 & 電訪結果 查詢 話後設定 button 顯示
                this.contResAndTeleResToGetAfterTelInfo(currRowData);
            }

        })
        .catch((error)=>{
            console.error("查詢電訪結果下拉發生異常");
        })

    }

    /**
     * 變更單列 電訪結果
     * @param selectedTeleRes 
     * @param currRowData 
     */
    changeTeleResult(flag, selectedTeleRes, currRowData){

        this.grid.data.some((eachRow:any, index)=>{
            if(eachRow.rowKey == currRowData.rowKey){
                
                if(selectedTeleRes == undefined || selectedTeleRes == null){
                    eachRow.selectedTeleRes = "0";
                }else{
                    eachRow.selectedTeleRes = selectedTeleRes
                }
                 //選擇 聯絡結果 & 電訪結果 查詢 結案原因 下拉選單
                 this.contResAndTeleResToGetClosedRes(flag, currRowData);
                 //選擇 聯絡結果 & 電訪結果 查詢 話後設定 button 顯示
                 this.contResAndTeleResToGetAfterTelInfo(currRowData);
                 return true;
            }
        });
    }

    /******* 電訪結果下拉 end ***********************************************/


    /******* 結案原因下拉 start ***********************************************/

    /**
     * 選擇 聯絡結果 & 電訪結果 查詢 結案原因 下拉選單
     * 原本 結案原因下拉 function，OBD2UAT-78 修改為不需要下拉顯示，故此 function 不需要
     * @param currRowData 
     */
    /************************************************************************************************************
    contResAndTeleResToGetClosedRes(flag, currRowData){
        // 整理條件
        var teleResultConfigCond:TeleResultConfigCond = {};
        teleResultConfigCond.taskId = currRowData.taskId;
        teleResultConfigCond.contactResultId = currRowData.selectedContRes;
        teleResultConfigCond.teleResultId = currRowData.selectedTeleRes;

        // 查詢結案原因下拉
        this.$teleResultAreaApi.getClosedReasonOptByCondUsingPOST(teleResultConfigCond)
        .then((resp:AxiosResponse<Option[]>)=>{
            if(resp != null){
                this.grid.data.some((eachRow:any, index)=>{
                    if(eachRow.rowKey == currRowData.rowKey){
                         // 將依條件搜尋到的 結案原因下拉 塞到對應列的 結案原因下拉
                        eachRow.caseClosedReasonOpts = resp.data;

                        // 為初始查詢時
                        if(flag === ContResultChangFlagEnum.INIT){
                            // 初始查詢時的 結果原因為空，就預設結果原因為空，反之 初始查詢有 結果原因，就依照已查詢後的值為主(不做事)
                            if(eachRow.selectedCaseClosedReason == null || eachRow.selectedCaseClosedReason == undefined || eachRow.selectedCaseClosedReason == "0"){
                                eachRow.selectedCaseClosedReason = "0"; // 重查後，下拉給預設 "0"
                            }
                        }
                        else if(flag === ContResultChangFlagEnum.CUSTOMER_CHANGE){
                            eachRow.selectedCaseClosedReason =  "0"; //重查後，下拉給預設 "0"
                        }
                        
                        return true;
                    }
                });
            }   
        })
        .catch((error)=>{
            console.error("查詢結案原因下拉發生異常");
        })

    }
    ************************************************************************************************************/

    /**
     * 變更單列 結案原因
     * 原本結案原因下拉變更 function，OBD2UAT-78 修改為不需要下拉顯示，
     * 故此 function vue 不需要，但 監聽事件 下方有使用到
     * @param selectedCaseClosedReason 
     * @param currRowData 
     */
    
     changeCaseClosedReason(selectedCaseClosedReason, currRowData){
        this.grid.data.forEach((eachRow:any, index)=>{
            if(eachRow.rowKey == currRowData.rowKey){
                eachRow.selectedCaseClosedReason = selectedCaseClosedReason;
                return true;
            }
        });
    }
    

    /**
     * 選擇 聯絡結果 & 電訪結果 查詢 結案原因
     * OBD2UAT-78 修改為不需要下拉顯示，直接呈現結案原因
     * @param flag 
     * @param currRowData 
     */
    contResAndTeleResToGetClosedRes(flag, currRowData){
        // 整理條件
        var teleResultConfigCond:TeleResultConfigCond = {};
        teleResultConfigCond.taskId = currRowData.taskId;
        teleResultConfigCond.contactResultId = currRowData.selectedContRes;
        teleResultConfigCond.teleResultId = currRowData.selectedTeleRes;

        // 查詢結案原因下拉
        this.$teleResultAreaApi.getClosedReasonOptByCondUsingPOST(teleResultConfigCond)
        .then((resp:AxiosResponse<Option[]>)=>{
            if(resp != null){
                this.grid.data.some((eachRow:any, index)=>{
                    if(eachRow.rowKey == currRowData.rowKey){
                         // 將依條件搜尋到的 結案原因下拉 塞到對應列的 結案原因下拉
                        eachRow.caseClosedReasonOpts = resp.data;

                        // 為初始查詢時
                        if(flag === ContResultChangFlagEnum.INIT){
                            // 初始查詢時的 結果原因為空，就預設結果原因為空，反之 初始查詢有 結果原因，就依照已查詢後的值為主(不做事)
                            if(eachRow.selectedCaseClosedReason == null || eachRow.selectedCaseClosedReason == undefined || eachRow.selectedCaseClosedReason == "0"){
                                eachRow.selectedCaseClosedReason = "0"; // 重查後，下拉給預設 "0"
                            }
                        }
                        else if(flag === ContResultChangFlagEnum.CUSTOMER_CHANGE){
                            // eachRow.selectedCaseClosedReason =  "0"; //重查後，下拉給預設 "0"
                            // 後端取得 結案原因 數量 大於 1 表示，除了預設的 "0" 之外 還有一項 結案原因 (配置表也應該只能配置到一項 結案原因)
                            if(eachRow.caseClosedReasonOpts.length > 1){
                                // 取得 該結案原因 (非"0") => lable: 0001、0002...
                                eachRow.selectedCaseClosedReason = eachRow.caseClosedReasonOpts.find((eachOpts, i)=>{return i==1}).label;
                            }else{
                                eachRow.selectedCaseClosedReason =  "0";
                            }
                        }
                        
                        return true;
                    }
                });
            }   
        })
        .catch((error)=>{
            console.error("查詢結案原因下拉發生異常");
        })

    }

    /**
     * OBD2UAT-78 修改為不需要下拉顯示，前端顯示結案原因 function
     * @param slotProps 
     * @param selectedClosedReasonLabel 
     * @returns 
     */
    showSelectCaseClosedReason(slotProps, selectedClosedReasonLabel){
        var resultCaseClosedReason = "";
        if(selectedClosedReasonLabel != "0" && !ValidationUtil.isEmpty(selectedClosedReasonLabel)){
            resultCaseClosedReason = slotProps.find((eachOpts)=>{return eachOpts.label == selectedClosedReasonLabel;}).value;
        }else{
            resultCaseClosedReason = "";
        }
        return resultCaseClosedReason;
    }

    /******* 結案原因下拉 end ***********************************************/

    
    /******* 話後 start ***********************************************/

    /**
     *  選擇 聯絡結果 & 電訪結果 查詢 話後設定 button 顯示
     * @param currRowData 
     */
    contResAndTeleResToGetAfterTelInfo(currRowData){
        
        var teleResultConfigCond:TeleResultConfigCond = {};
        teleResultConfigCond.taskId = currRowData.taskId;
        teleResultConfigCond.contactResultId = currRowData.selectedContRes;
        teleResultConfigCond.teleResultId = currRowData.selectedTeleRes;

        this.$teleResultAreaApi.getAfterTelInfoUsingPOST(teleResultConfigCond)
        .then((resp:AxiosResponse<TeleResultAreaAfterTel>)=>{
            if(resp != null){
                this.grid.data.some((eachRow:any, index)=>{
                    if(eachRow.rowKey == currRowData.rowKey){
                        eachRow.afterTel = resp.data;
                        return true;
                    }
                });
            }
        })
        .catch((error)=>{
            console.log("查詢話後設定發生異常");            
        });
    }
    // 點擊該列照會
    clickHasNoti(currRowData){
        this.notificationData.caseNo = currRowData.caseNo;
        this.isNotificationFormVisible = true;
    }
    // 點擊該列會辦
    clickHasInf(currRowData){
        this.isCountersignatureFormVisible = true;
        this.cuntersignatureData.caseNo = currRowData.caseNo;
        this.cuntersignatureData.packNo = currRowData.packNo;
    }
    // 點擊該列郵寄
    clickHasSendIntLet(currRowData){
        this.isMailLetterFormVisible = true;
        this.mailLetterFormParam.caseNo = currRowData.caseNo;
    }
    /******* 話後 end ***********************************************/

    /******* mpluse start ***********************************************/

    /**
     * 更動聯絡結果 連帶 查詢 M+選取框是否顯示
     * @param flag 
     * @param selectedContRes 
     * @param currRowData 
     */
    contResultToGetMplus(flag, selectedContRes, currRowData){
        
        var getTeleResultMplusCheckInput:GetTeleResultMplusCheckInput={};
        getTeleResultMplusCheckInput.contResultId = selectedContRes;
        getTeleResultMplusCheckInput.caseNo = currRowData.caseNo;
        getTeleResultMplusCheckInput.taskId = currRowData.taskId;

        this.$teleResultAreaApi.getTeleResultMplusCheckUsingPOST(getTeleResultMplusCheckInput)
        .then((resp:AxiosResponse<GetTeleResultMplusCheckOutput>)=>{
            if(resp && resp.data.success){
                this.grid.data.some((eachRow:any, index)=>{
                    if(eachRow.rowKey == currRowData.rowKey){
                        // VL903-1291 M+ 儲存後需顯示，不管結不結案。ContResultChangFlagEnum.INIT : 包含結案的案件和不結案的案件
                        if(flag === ContResultChangFlagEnum.INIT){
                            console.log("do'not change any m+ info...");
                        }
                        // 手動的依照手動的更新
                        else if(flag === ContResultChangFlagEnum.CUSTOMER_CHANGE){
                            eachRow.mplusCheckBox.show = resp.data.mplusCheckBox.show;
                            eachRow.mplusCheckBox.checked = resp.data.mplusCheckBox.checked;
                            eachRow.mplusMsg = undefined;
                        }

                        return true;
                    }
                });
            }
        })
        .catch((error)=>{
            console.error("查詢M+選取框是否顯示發生異常");
        })
        

    }

    /**
     * 變更單列 m+ 選取框
     * @param e (e.target.checked 控制是否勾選 true/false)
     * @param currRowData 
     */
    changeMplusCheckBox(e, currRowData){

        this.grid.data.forEach((eachRow:any, index)=>{
            if(eachRow.rowKey == currRowData.rowKey){
                eachRow.mplusCheckBox.checked = e.target.checked;
                if(!e.target.checked){
                    eachRow.mplusMsg = "";
                }
                return true;
            }
        });

        
    }

    /******* mpluse end ***********************************************/

    onCloseModal(modalName){
        this[modalName] = false;
    }

    //========================共用驗證相關物件開始===================================

    //取得驗證feedback綁定的參數
    callCommonUtilFeildFeedback(fv: ValidateFormComponent){
        return CommonUtil.getFeildValidateFeedback(fv);
    }

    //取得驗證status綁定的參數
    callCommonUtilFeildStatus(fv: ValidateFormComponent){
        return CommonUtil.getFeildValidateStatus(fv);
    }

    //取得hover content綁定的參數
    callCommonUtilFeildMsg(fv: ValidateFormComponent){
        return CommonUtil.getFeildValidateHoverMsg(fv);
    }

    //取得hover trigger綁定的參數
    callCommonUtilFeildTrigger(fv: ValidateFormComponent){
        CommonUtil.getFeildVaildateTrigger(fv);
    }

    //取得hover hoverVisivle綁定的參數
    callCommonUtilFeildHoverVisible(fv: ValidateFormComponent){
        return CommonUtil.getFeildVaildateHoverVisible(fv);
    }

    //變更hover hoverVisivle參數
    callCommonUtilFeildVisibleChange(fv: ValidateFormComponent){
        CommonUtil.getFeildValidateVisibleChange(fv);
    }

    //========================共用驗證相關物件結束===================================

    //===========================方便連絡日 相關方法 start ==========================================

    //自動轉為字串更新搜尋條件
    onContactDateChange(date){
        this.hasTeleResultAreaSave = false;
        this.teleResultAreaForm.contactString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.isContactDateVisible = false;
        CommonUtil.feildValidate(this.teleResultAreaValidateForm.contactDate,false,"success","","");
        if(ValidationUtil.isEmpty(this.teleResultAreaForm.contactString)){
            this.isTimePickerShow = false;
        }else{
            this.isTimePickerShow = true;
            this.validateTimeStart();
        }
    }
  
    //清除日期
    clearContactDate(){
        CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.contactDate,false,"",false);
        this.isContactDateVisible = false;
        this.teleResultAreaForm.contactString = "";
        this.teleResultAreaForm.contactDate = null;
        this.teleResultAreaForm.convenientContactStartString = "";
        this.teleResultAreaForm.convenientContactStartTime = null;
        this.teleResultAreaForm.convenientContactEndString = "";
        this.teleResultAreaForm.convenientContactEndTime = null;
        CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactStartTime,false,"",false);
        CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactEndTime,false,"",false);
        this.isTimePickerShow = false;
    }
  
    /**
     * 手動輸入開始日期時檢查日期是否符合曆法
     * @param data 
     */
     checkManualInputContactDate(data: any) {
        this.isContactDateVisible = false;
        CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.contactDate,false,"",false);
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.contactDate,false,"",false);
        } else {
            this.isContactDateVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.contactDate,true,this.$t('global_dateError').toString(),false);
        }
        this.teleResultAreaForm.contactDate = parseDate ? parseDate : this.teleResultAreaForm.contactDate;
        this.teleResultAreaForm.contactString = parseDate ?
        MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.teleResultAreaForm.contactDate.toString()))) :
        data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }
  
    /**
     * 確保Tooltip在日期正確時確實隱藏
     */
     eventMouseOverContactDate() {
        if (this.teleResultAreaValidateForm.contactDate.feedback) {
            this.isContactDateVisible = true;
        } else {
            this.isContactDateVisible = false;
        }
    }

    //日期選擇器，可選擇範圍限定於系統日之後
    disabledDate(value) {
        const rangeStart = moment().add(-1,'days');
        if (!value || !rangeStart) {
            return false;
        }
        return (value.valueOf() < rangeStart.valueOf());
    }

    //===========================方便連絡日 相關方法 end ==========================================
  
    //===========================時間選擇器 相關方法 start ==========================================
  
    clickConvenientContactStartTimePicker(open){
        this.isConvenientContactStartOpen = open;
    }
  
    clickConvenientContactEndTimePicker(open){
        this.isConvenientContactEndOpen = open;
    }
  
    /**
     * 選擇時間(起)後，將時間更新 
     * @param date 
     * @param timeString 
     * @param flag : FROM_LOCAL_STORAGE (從localStorage來)
     */
    onConvenientContactStartTimeChange(date, timeString, flag) {
        this.hasTeleResultAreaSave = false;
        this.isTimeStartVisible = false;
        CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactStartTime,false,"",false);
        this.teleResultAreaForm.convenientContactStartString = timeString;
        /**
         * VL903-1129 續訪切換名單後，不將迄日直接 = 起日
         * 只有從畫面按下的修改才會將 將迄日直接 = 起日
         * *******************************************************************************************************/
        if("FROM_LOCAL_STORAGE" !== flag){
            this.teleResultAreaForm.convenientContactEndTime = this.teleResultAreaForm.convenientContactStartTime;
            this.teleResultAreaForm.convenientContactEndString = this.teleResultAreaForm.convenientContactStartString;
        }
        /********************************************************************************************************/

        this.validateTimeStart();
    }
    
    //選擇時間(迄)後，將時間更新
    onConvenientContactEndTimeChange(date, timeString) {
        this.hasTeleResultAreaSave = false;
        this.isTimeEndVisible = false;
        CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactEndTime,false,"",false);
        this.teleResultAreaForm.convenientContactEndString = timeString;
        this.validateTimeEnd();
    }
  
    //手動關閉時間選擇器(起)
    closeConvenientContactStartTimePicker() {
        this.isConvenientContactStartOpen = false;
    }
  
    //手動關閉時間選擇器(迄)
    closeConvenientContactEndTimePicker() {
        this.isConvenientContactEndOpen = false;
    }
  
    //===========================時間選擇器 相關方法 end =========================================
  
    //判斷時間是否小於現在時間
    validateTimeStart() {
        CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactStartTime,false,"",false);
        CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactEndTime,false,"",false);
        let selectDate = MomentUtil.transferMomentToTimestamp(moment(this.teleResultAreaForm.contactDate).startOf("dates"));
        let today = MomentUtil.transferMomentToTimestamp(moment(new Date()).startOf("dates"));
        if(selectDate == today){
            if (!ValidationUtil.isEmpty(this.teleResultAreaForm.convenientContactStartString)) {
                let start = moment(this.teleResultAreaForm.convenientContactStartTime).add(1,"minutes").startOf("minutes");
                if( MomentUtil.transferMomentToTimestamp(start) < MomentUtil.transferMomentToTimestamp(moment())){
                    CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactStartTime,true,this.$t('pedding_mark_time_before_now').toString(),false); // 時間不可小於現在時間
                    CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactEndTime,true,this.$t('pedding_mark_time_before_now').toString(),false);   // 時間不可小於現在時間
                }
            }
        }
    }
  
    //判斷時間起訖與範圍
    validateTimeEnd() {
        CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactStartTime,false,"",false);
        CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactEndTime,false,"",false);
        if (!ValidationUtil.isEmpty(this.teleResultAreaForm.convenientContactEndString)) {
            if( MomentUtil.transferMomentToTimestamp( this.teleResultAreaForm.convenientContactEndTime) < MomentUtil.transferMomentToTimestamp(this.teleResultAreaForm.convenientContactStartTime)){
                //起訖時間有誤
                CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactStartTime,true,this.$t('pedding_start_and_end_error').toString(),false);
                CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactEndTime,true,this.$t('pedding_start_and_end_error').toString(),false);
            }else{
                let start = moment(this.teleResultAreaForm.convenientContactStartTime) ;
                if( start.add(480,"minutes").isBefore(this.teleResultAreaForm.convenientContactEndTime)){
                    // 起訖不得超過八小時
                    CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactStartTime,true,this.$t('pedding_mark_time_over').toString(),false);
                    CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactEndTime,true,this.$t('pedding_mark_time_over').toString(),false);
                }
                start = moment(this.teleResultAreaForm.convenientContactStartTime).add(1,"minutes").startOf("minutes");
                let selectDate = MomentUtil.transferMomentToTimestamp(moment(this.teleResultAreaForm.contactDate).startOf("dates"));
                let today = MomentUtil.transferMomentToTimestamp(moment(new Date()).startOf("dates"));
                if(selectDate == today){
                    if( MomentUtil.transferMomentToTimestamp(start) < MomentUtil.transferMomentToTimestamp(moment())){
                    // 時間不可小於現在時間
                    CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactStartTime,true,this.$t('pedding_mark_time_before_now').toString(),false);
                    CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactEndTime,true,this.$t('pedding_mark_time_before_now').toString(),false);
                    }
                }
            }
        }
    }

    //取得方便連絡時段時間
    getContactDateTime(time, date){
        if(time == null){
            return null
        }else{
            return moment(date).set('hour',time.hour()).set('minute',time.minute()).format("YYYY-MM-DD HH:mm");
        }
    }

    /**
     * 驗證方便連絡時段
     * @returns 
     */
    validateVisitDate(){
        let validate = true;

        //方便聯絡時間驗證
        if(!ValidationUtil.isEmpty(this.teleResultAreaForm.contactString) &&(ValidationUtil.isEmpty(this.teleResultAreaForm.convenientContactStartString) || ValidationUtil.isEmpty(this.teleResultAreaForm.convenientContactEndString))){
            // 時間起迄皆不可為空值
            CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactStartTime,true,this.$t('pedding_mark_time_required').toString(),false);
            CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactEndTime,true,this.$t('pedding_mark_time_required').toString(),false);
            validate = false;
        }

        //方便聯絡時間驗證
        if(!ValidationUtil.isEmpty(this.teleResultAreaForm.contactString)){
            let start = this.getContactDateTime(this.teleResultAreaForm.convenientContactStartTime,this.teleResultAreaForm.contactDate);
            let end = this.getContactDateTime(this.teleResultAreaForm.convenientContactEndTime,this.teleResultAreaForm.contactDate);
            if(start == end){
                validate = false;
                // 起訖時間有誤
                CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactStartTime,true,this.$t('pedding_start_and_end_error').toString(),false);
                CommonUtil.feildValidateWithVisible(this.teleResultAreaValidateForm.convenientContactEndTime,true,this.$t('pedding_start_and_end_error').toString(),false);
            }
            if(this.teleResultAreaForm.convenientContactStartTime.feedback || this.teleResultAreaForm.convenientContactEndTime.feedback){
                validate = false;
            }
        }

        return validate;
    }

    /**
     * 驗證有結案原因之案件的問卷
     * @returns returnValidCloseCaseSave 驗證回傳
     */
    validateCloseCaseResultSave(){

        // 初始驗證回傳
        var returnValidCloseCaseSave:ReturnValidCloseCaseSave = {success: true, errorMsg: []};

        // 初始驗證失敗物件
        var validateObjec = [];

        var empt = (currValue) => VlidationUtil.isEmpty(currValue); // 驗證是否為空
        var validateNorR = (currValue) => new RegExp('^N.*$').test(currValue) || currValue === "R"; // 驗證是否包含 "N" (N開頭) / "R" (未答/拒答)

        // 輔助查看
        console.log("quest_answer", JSON.stringify(this.questAllData.answer.quest));
        // console.log("questAreaData", JSON.stringify(this.questAreaData));

        // VL903-1283 整理 每筆 case 的問卷每題答項是否顯示並是否需要驗證
        var caseQuestIsShowObj = {};
        this.questAreaData.questDto.forEach((eachQuest:any)=>{
            var eachCaseQuestIsShowObj = {};
            eachQuest.questContDto.forEach((eachContDto:any)=>{
                eachCaseQuestIsShowObj[eachContDto.itemCode] = eachContDto.isShow;
            });
            caseQuestIsShowObj[eachQuest.caseNo] = eachCaseQuestIsShowObj;
        });
        // 輔助查看
        // console.log("caseQuestIsShowObj: ....", JSON.stringify(caseQuestIsShowObj));


        this.grid.data.forEach((eachRow:any, index)=>{
            
            var flag = true;
            var retMsg = "";

            // 取得案件對應問卷，需要複製出來，避免動到原本傳入的 問卷資料
            var eachCaseQuestAns = JSON.parse(JSON.stringify(this.questAllData.answer.quest[eachRow.caseNo]));
            // 取得案件對應問卷每題答項是否顯示，需要複製出來，避免動到原本傳入的 問卷資料
            var eachCaseQuestShow = JSON.parse(JSON.stringify(caseQuestIsShowObj[eachRow.caseNo]));
            
            // 僅驗證 有答項的問卷 & 電訪結果有選結案原因 且為 "完成電訪" (code: 0003)
            if(!VlidationUtil.isEmpty(eachCaseQuestAns) && !VlidationUtil.isEmpty(eachRow.selectedCaseClosedReason) && eachRow.selectedCaseClosedReason === "0003"){
                
                 // 整理該案件問卷之答案，準備驗證之物建
                var currentCaseQuestAnsArr = [];

                // VL903-1283 排除答項 false (不顯示即不需驗證)
                Object.keys(eachCaseQuestAns).forEach((eachAnsKey)=>{
                    Object.keys(eachCaseQuestShow).some((eachQuestShowKey)=>{
                        if(eachAnsKey === eachQuestShowKey && eachCaseQuestShow[eachQuestShowKey] === false){
                            delete eachCaseQuestAns[eachAnsKey];
                            return;
                        }
                    });
                });
                
                // 滾出每個案件對應問卷之答案
                Object.values(eachCaseQuestAns).forEach((eachAns:any)=>{
                    // 答項有 remark (點選問答項)
                    if("remark" in eachAns){
                        Object.values(eachAns.remark).some((remark:any)=>{
                            // "其他" 的 cont 不為 undefiend，不輸入為 ""
                            if("cont" in remark && undefined !== remark.cont){
                                currentCaseQuestAnsArr.push(remark.value);
                                currentCaseQuestAnsArr.push(remark.cont);
                            }else{
                                currentCaseQuestAnsArr.push(remark.value);
                            }
                        });
                    }else{
                        // 答項為多選
                        if(eachAns.value.includes(":")){
                            var splitArr = eachAns.value.split(":");
                            splitArr.forEach((split:any)=>{
                                currentCaseQuestAnsArr.push(split);
                            });
                        }
                        // 答項單選
                        else{
                            currentCaseQuestAnsArr.push(eachAns.value);
                        }
                    }
                });
                
                // 輔助查看
                console.log(eachRow.caseNo + " arrange questans : " +  JSON.stringify(currentCaseQuestAnsArr) +  ", total ans: " + currentCaseQuestAnsArr.length);
                
                // A、電訪案件對應之問卷的問卷答案需全部點選
                // C、電訪案件對應之問卷的答項點選問答項時，該欄位不得為空值
                var isempt = currentCaseQuestAnsArr.some(empt);
                if(isempt){
                    flag = false;
                    retMsg = "問卷答案需全部點選";
                }
                // B、電訪案件對應之問卷的問卷答案不得點選背端參數為『N』或『R』(未答/拒答)的選項
                var isNorR = currentCaseQuestAnsArr.some(validateNorR);
                if(flag && isNorR){
                    flag = false;
                    retMsg = "不得點選 未答/拒答 選項";
                }

                // 失敗紀錄物件
                if(!flag){
                    var temp = {caseNo: eachRow.caseNo, casePolicy: eachRow.casePolicy, questName: eachRow.questName, errMsg: retMsg};
                    validateObjec.push(temp);
                }
            }

        }); // foreach end

        // 輔助查看
        console.log(JSON.stringify(validateObjec));

        // 先將所有 電訪結果 顏色 改為預設
        this.grid.data.some((eachRow:any, index)=>{
            eachRow.isSaveFailure = false;
        });

        // 若驗證失敗物件不為空表示要彈跳視窗提示 及 grid 文字變色
        if(!VlidationUtil.isEmpty(validateObjec)){
            console.log("error", JSON.stringify(validateObjec));
            
            // 彈跳視窗需要文字
            var msgAr = [];
            validateObjec.forEach((eachCase:any, index)=>{
                msgAr.push(eachCase.casePolicy + "_" + eachCase.questName);
            });
            msgAr[msgAr.length] = this.$t('teleResultArea_validateCloseCaseResultSave_1').toString(); //問卷答案不符合電訪結果，請確認！


            // 變更顏色
            this.grid.data.some((eachRow:any, index)=>{
                validateObjec.forEach((eachCase:any, index)=>{
                    if(eachRow.caseNo == eachCase.caseNo){
                        // 需刪除 對應到的 list 之 element，避免顏色互蓋及錯亂
                        delete validateObjec[index];
                        eachRow.isSaveFailure = true;
                        return true;
                    }
                });
            })


            // 驗證失敗
            returnValidCloseCaseSave.success = false;
            returnValidCloseCaseSave.errorMsg = msgAr;
        }else{
            // 驗證成功
            returnValidCloseCaseSave.success = true;
        }

        return returnValidCloseCaseSave;
    }

    mounted() {
        // 監聽事件
        // EventBus.$on("setValueMsg", (value) => {
        //     console.log(value);
        //     this.grid.data.some((eachRow:any, index)=>{
        //         if(eachRow.caseNo == value.caseNo){
        //             this.changeContResult(ContResultChangFlagEnum.INIT, "A001", eachRow);
        //             this.changeTeleResult(ContResultChangFlagEnum.INIT, value.teleResult, eachRow);
        //             this.changeCaseClosedReason(value.closedReason, eachRow);
        //         } 
        //     });
        // });
    }

    beforeDestroy(){
        // EventBus.$off('setValueMsg');
    }
}