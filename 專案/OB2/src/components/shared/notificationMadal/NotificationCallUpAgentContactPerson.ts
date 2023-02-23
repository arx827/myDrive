import CommonUtil from "@/assets/config/CommonUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { default as ValidationUtil, default as VlidationUtil } from "@/assets/config/ValidationUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { FblColumnType } from "@/components/shared/data-grid/models";
import { Option } from "@/components/shared/form/callUpForm/model";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { AgentPersonModule } from '@/plugins/store/CallUpAgentModule';
import { callUpInfoModule } from "@/plugins/store/CallUpModule";
import { PackMatchModule } from "@/plugins/store/packMatchModule";
import { CasePackTelephoneListDto, CasePolicyLogDto, DialingDto, NotiAgentPersonInitDto, NotificationAgentDto, NotificationOtherAgentDto, OutputDto, ToAEPDTMFApiResponse } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { NotificationCallUpAgentContactPersonForm } from "./model";

@Component({
    components: { HiddenFolde, FblDataGrid }
})
export default class NotificationCallUpAgentContactPerson extends Vue {

    @Prop()
    public initData: NotificationAgentDto;

    @Prop({ default: 0 })
    public agentPickValue: number;

    @Prop()
    public initAgentData: NotificationOtherAgentDto;

    @Prop()
    public searchOtherAgentData: NotificationOtherAgentDto;

    @Prop()
    caseLogId: string;

    @Prop()
    caseNo: string;

    // @Prop()
    agentCallupInfo = {};

    // 是否有撥號成功過
    hasDialMobClicked: boolean = false;

    notiCallUpAgentContactPersonForm: NotificationCallUpAgentContactPersonForm = {
        packNo: '',
        agent: '',
        agentId: '',
        agentName: '',
        agentMob: '',
        agentOfficeTel: '',
        agentOfficeTelExt: '',
        callUpResultType: ''
    }

    // 撥號資料
    callUpData: CasePackTelephoneListDto;

    // 更新撥號資料
    updateCallUpData = {};

    // 案件包編號
    packNo: string = (!VlidationUtil.isEmpty(PackMatchModule.pickupResult) && !VlidationUtil.isEmpty(PackMatchModule.pickupResult.firstCasePack)) ? PackMatchModule.pickupResult.firstCasePack.packNo : "";

    // 撥號人員分機號碼
    dialerExtension: string;

    // 撥號所需要的資訊
    thisCodingNo: string = "";
    thisPackNo: string = "";
    thisSessionId: string = "";

    // 撥號結果Map
    callUpResultMap: Map<string, string> = new Map();

    // 本次撥號結果選項
    callUpResultOptions: Option[] = [];
    // 聯絡結果下拉選單
    selectContactResultTypeOptions: Option[] = [{ label: '', value: '' }];
    // 聯絡細項下拉選單
    selectContactResultDetailOptions: Option[] = [{ label: '', value: '' }];
    // 聯絡結果對應聯絡細項
    contactDetailMap = {}

    // 是否有撥號中
    isDialing: boolean = false;

    // 是否正在撥分機
    isDialingExtension: boolean = true;

    // 本次撥號結果下拉選單變化
    codingNoForSeqMap: Map<string, string> = new Map();

    gridData = {
        rowKey: 'seqNo',
        data: [],
        pagination: false,
        columns: [
            {
                type: FblColumnType.TEMPLATE,
                template: 'seqNoTemp',
                property: 'seqNo',
                title: '',
                width: 70
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'phoneNoTemp',
                property: 'phoneNo',
                title: this.$t('notificationCallUpAgentContactPerson_phoneNo').toString(), // 電話
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'dialTemp',
                property: 'dial',
                title: this.$t('callUpF_dial').toString(), // 撥號
                width: 100
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'extensionTemp',
                property: 'extension',
                title: this.$t('callUpF_extension').toString(), // 分機
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'extensionDialTemp',
                property: 'extensionDial',
                title: this.$t('callUpF_dial').toString(), // 撥號
                width: 100
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'callUpResultTemp',
                property: 'callUpResult',
                title: this.$t('notificationCallUpAgentContactPerson_callUpResult').toString(), // 撥號結果
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'contactResultTemp',
                property: 'contactResult',
                title: this.$t('notificationCallUpAgentContactPerson_contactResult').toString(), // 聯絡結果
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'contactDetailTemp',
                property: 'contactDetail',
                title: this.$t('notificationCallUpAgentContactPerson_contactDetail').toString(), // 聯絡細項
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'callUpRemarkTemp',
                property: 'callUpRemark',
                title: this.$t('callUpF_callUpRemark').toString(), // 通話內容
                width: 200,
            }
        ],
    }

    /**
     * 初始化
     */
     created() {

        this.gridData.data.push({
            seqNo: this.getGridRowKey(),
            isProp: false,
            isDataAdd: false,
            isCallup: false,
            codingNo: '',
            callUpResult: '',
            contactDetail: '',
            isResult: false,
            agentKey: this.agentPickValue
        });

        LoadingUtil.show();

        this.$notificationAgentApi.contactAgentPersonInitUsingPOST({})
            .then((res: AxiosResponse<NotiAgentPersonInitDto>) => {
                // 撥號人員分機號碼
                this.dialerExtension = res.data.extension;
                // 撥號結果選項
                this.callUpResultOptions = res.data.callUpResultOptions;
                // 聯絡結果
                this.selectContactResultTypeOptions = res.data.contactResultOptions;
                // 聯絡細項
                this.selectContactResultDetailOptions = res.data.contactDetailOptions;
                // 聯絡結果對應聯絡細項
                this.contactDetailMap = res.data.contactDetailMap;
            }).catch((err) => {
                console.error(err);
            }).finally(() => {
                LoadingUtil.close();
            });
    }

    @Watch('searchOtherAgentData', { deep: true })
    watchSearchOtherAgent(newVal, oldVal) {
        if (!VlidationUtil.isEmpty(newVal)) {
            if (this.agentPickValue == 0) {
                this.notiCallUpAgentContactPersonForm = {
                    agent: this.searchOtherAgentData.agent,
                    agentId: this.searchOtherAgentData.agentId,
                    agentName: this.searchOtherAgentData.agentName,
                    agentMob: this.searchOtherAgentData.agentMob,
                    agentOfficeTel: this.searchOtherAgentData.agentOfficeTel,
                    agentOfficeTelExt: this.searchOtherAgentData.ext
                }
                // 整理聯絡對象 Grid Data 資料
                this.pushAgentGridDate(this.notiCallUpAgentContactPersonForm);
            }
        }

    }

    @Watch('initAgentData', { deep: true })
    watchAgentPick(newVal: number, oldVal: number) {
        if (!VlidationUtil.isEmpty(newVal)) {
            this.notiCallUpAgentContactPersonForm = {
                agent: this.initAgentData[0].agent,
                agentId: this.initAgentData[0].agentId,
                agentName: this.initAgentData[0].agentName,
                agentMob: this.initAgentData[0].agentMob,
                agentOfficeTel: this.initAgentData[0].agentOfficeTel,
                agentOfficeTelExt: this.initAgentData[0].ext,
            }
            // 整理聯絡對象 Grid Data 資料
            this.pushAgentGridDate(this.notiCallUpAgentContactPersonForm);
        }
    }

    @Watch('initData', { immediate: true, deep: true })
    watchInitData(newVal: NotificationAgentDto, oldVal: NotificationAgentDto) {
        if (!VlidationUtil.isEmpty(newVal)) {
            this.packNo = newVal.packNo;
            this.notiCallUpAgentContactPersonForm = {
                packNo: newVal.packNo,
                agent: this.initData.agent1,
                callUpResultType: '',
            }
        }
    }

    @Watch('gridData.data', { immediate: true, deep: true })
    watchGridData(newVal: Array<any>, oldVal) {
        // 更新聯絡對象資訊
        AgentPersonModule.putAgentPerInfo(newVal);
        newVal.forEach(data => {
            // 紀錄每次撥號的對應結果
            if (!VlidationUtil.isEmpty(data.codingNo)) {

                let callUpInfo = {
                    codingNo: data.codingNo,
                    callUpResult: data.callUpResult,
                    contactResult: data.contactResult,
                    contactDetail: data.contactDetail,
                    callUpRemark: data.callUpRemark,
                    salesContactPersonId: this.notiCallUpAgentContactPersonForm.agentId,
                    salesContactPersonName: this.notiCallUpAgentContactPersonForm.agentName
                }
                // 存入已撥號結果資訊
                AgentPersonModule.putAgentCallUpInfo(callUpInfo);
            }
        });

    }

    /**
     * 本次撥號結果下拉選單變化
     * @param data 
     */
    onCallUpResultCellChange(data) {
        data.isResult = !VlidationUtil.isEmpty(data.callUpResult);
        // 取得案件歷程代碼清單
        let casePolicyLogDtoList = this.getCaseLogIdList();

        // 更新件更新至DB
        this.updateCallUpData = {
            salesContactPersonId: this.notiCallUpAgentContactPersonForm.agentId,
            salesContactPersonName: this.notiCallUpAgentContactPersonForm.agentName,
            callUpResult: this.notiCallUpAgentContactPersonForm.callUpResultType,
            casePolicyLogDtoList: casePolicyLogDtoList,
        }

        // 撥號結果尚未儲存
        this.callResultSaved(false);

        // // 有選取撥號結果須打開業務員選取提供選擇
        // if (data.isResult) {
        //     this.$emit("isSaveCallUpResult", data.isResult);
        // }
    }

    // 下拉式選單變動時
    /**
     * @description 聯絡結果變動
     * 
     * @author B1529
     * @version 2022/09/28
     */
    selectContactResultChange(data) {

        data.contactDetail = '';
        this.selectContactResultDetailOptions = [{ label: '', value: '' }]; //全部
        this.selectContactResultDetailOptions = this.selectContactResultDetailOptions.concat(this.contactDetailMap[data.contactResult]);

        // 撥號結果尚未儲存
        this.callResultSaved(false);
    }

    /**
     * 撥號流程作業-手機
     * @param data 
     */
    onDialMobClick(data) {

        let validation = true;

        // 驗證撥號人員分機是否存在
        if (VlidationUtil.isEmpty(this.dialerExtension)) {
            ErrorModalUtil.modalError(this.$t('callUpF_sourceCaseNoOptions').toString());
            validation = false;
            return;
        }

        // 驗證 實際電訪電話輸入 欄位
        if (VlidationUtil.isEmpty(data.phoneNo)) {
            ErrorModalUtil.modalError(this.$t('notificationCallUpAgentContactPerson_mobRequired').toString()); // 電話 欄位必填
            validation = false;
            return;
        }
        if (!VlidationUtil.numberValidation(data.phoneNo)) {
            ErrorModalUtil.modalError(this.$t('notificationCallUpAgentContactPerson_mobNumbersInputOnly').toString()); // 電話 欄位僅可輸入數字
            validation = false;
            return;
        }
        if (data.length > 20) {
            ErrorModalUtil.modalError(this.$t('notificationCallUpAgentContactPerson_mobNoLengthOver20').toString()); // 電話 欄位最多20個字元
            validation = false;
            return;
        }

        // 取得案件歷程代碼清單
        let casePolicyLogDtoList = this.getCaseLogIdList();
        this.callUpData = {
            packNo: this.packNo,
            phoneNo: data.phoneNo,
            casePolicyLogDtoList: casePolicyLogDtoList,
        }

        if (validation) {
            this.dialingMob(data);
        }
    }

    /**
     * 撥號-手機
     * @param data 
     */
    dialingMob(data) {
        this.isDialing = true;
        this.notiCallUpAgentContactPersonForm.callUpResultType = '';

        // 取得案件歷程代碼清單
        let casePolicyLogDtoList = this.getCaseLogIdList();
        this.callUpData = {
            packNo: this.packNo,
            phoneNo: data.phoneNo,
            casePolicyLogDtoList: casePolicyLogDtoList,
        }
        console.log("手機撥號前(業務員) callUpInfoModule.callUpInfo", callUpInfoModule.callUpInfo);
        LoadingUtil.show();
        this.$callUpApi.dialingSalesUsingPOST(this.callUpData, this.dialerExtension).then((resp: AxiosResponse<DialingDto>) => {
            if (resp.data) {
                this.thisCodingNo = resp.data.codingNo;
                this.thisPackNo = resp.data.packNo;
                this.thisSessionId = resp.data.sessionId;
                let codingNoList = callUpInfoModule.callUpInfo.previousCodingNoList;
                codingNoList.push(this.thisCodingNo);
                data.codingNo = resp.data.codingNo;
                data.isCallup = true;
                callUpInfoModule.setCallUpInfo({ codingNo: resp.data.codingNo, sessionId: resp.data.sessionId, previousCodingNoList: codingNoList });
                console.log("手機撥號後(業務員) callUpInfoModule.callUpInfo", callUpInfoModule.callUpInfo);
                // 撥號結果尚未儲存
                this.callResultSaved(false);
                this.$emit("codingNo", this.thisCodingNo);
                LoadingUtil.close();
            } else {
                LoadingUtil.close();
                // 錄音系統發生問題，則無法撥號且出現提示訊息【錄音系統異常，目前無法外撥，請通知負責人員。】
                ErrorModalUtil.modalError(this.$t('onDutyPage_vendorSystemProblem').toString());
                this.hangingDialingExtension();
            }
        }).catch(e => {
            LoadingUtil.close();
            console.error("打電話發生錯誤：" + e);
            this.hangingDialing();
        });
    }

    // /**
    //  * 撥號流程作業-公司電話
    //  * @param data 
    //  */
    // onDialOffiecTelClick(data: string) {
    //     // 撥號前驗證
    //     let validation = true;

    //     // 驗證撥號人員分機是否存在
    //     if (VlidationUtil.isEmpty(this.dialerExtension)) {
    //         ErrorModalUtil.modalError(this.$t('callUpF_sourceCaseNoOptions').toString());
    //         validation = false;
    //         return;
    //     }

    //     // 驗證 實際電訪電話輸入 欄位
    //     if (VlidationUtil.isEmpty(data)) {
    //         ErrorModalUtil.modalError(this.$t('notificationCallUpAgentContactPerson_officeTelRequired').toString()); // 公司電話 欄位必填
    //         validation = false;
    //         return;
    //     }
    //     if (!VlidationUtil.numberValidation(data)) {
    //         ErrorModalUtil.modalError(this.$t('notificationCallUpAgentContactPerson_officeTelNumbersInputOnly').toString()); // 手機 欄位僅可輸入數字
    //         validation = false;
    //         return;
    //     }
    //     if (data.length > 20) {
    //         ErrorModalUtil.modalError(this.$t('notificationCallUpAgentContactPerson_officeTelNoLengthOver20').toString()); // 手機 欄位最多20個字元
    //         validation = false;
    //         return;
    //     }

    //     // 撥號前驗證完畢後
    //     if (validation) {
    //         this.dialingOffiecTel(data);
    //     }
    // }

    // /**
    //  * 撥號
    //  * @param data 
    //  */
    // dialingOffiecTel(data: string) {
    //     // this.isDialingOffiecTel = true;
    //     this.isDialing = true;
    //     this.callUpData = {
    //         packNo: this.packNo,
    //         phoneNo: data,
    //     }
    //     console.log("公司電話撥號前(業務員) callUpInfoModule.callUpInfo", callUpInfoModule.callUpInfo);
    //     LoadingUtil.show();
    //     this.$callUpApi.dialingSalesUsingPOST(this.callUpData, this.dialerExtension).then((resp: AxiosResponse<DialingDto>) => {
    //         if (resp.data) {
    //             this.thisCodingNo = resp.data.codingNo;
    //             this.thisPackNo = resp.data.packNo;
    //             this.thisSessionId = resp.data.sessionId;
    //             let codingNoList = callUpInfoModule.callUpInfo.previousCodingNoList;
    //             codingNoList.push(this.thisCodingNo);
    //             this.isDialingExtension = false;
    //             this.$emit("codingNo", this.thisCodingNo);
    //             callUpInfoModule.setCallUpInfo({ codingNo: resp.data.codingNo, sessionId: resp.data.sessionId, previousCodingNoList: codingNoList });
    //             console.log("公司電話撥號後(業務員) callUpInfoModule.callUpInfo", callUpInfoModule.callUpInfo);
    //             // 儲存按鈕顯示
    //             this.hasDialMobClicked = true;
    //             AgentPersonModule.setShouldSaveIsSave(false);
    //             LoadingUtil.close();
    //         } else {
    //             LoadingUtil.close();
    //             // 錄音系統發生問題，則無法撥號且出現提示訊息【錄音系統異常，目前無法外撥，請通知負責人員。】
    //             ErrorModalUtil.modalError(this.$t('onDutyPage_vendorSystemProblem').toString());
    //             this.hangingDialingExtension();
    //         }
    //     }).catch(e => {
    //         LoadingUtil.close();
    //         console.error("打電話發生錯誤：" + e);
    //         this.hangingDialing();
    //     });
    // }

    /**
     * 掛電話
     */
    hangingDialing() {
        this.isDialing = false;
    }

    /**
     * 分機撥號流程作業
     * @param data 
     */
    onExtensionDialClick(extension: string) {
        // 撥分機前驗證
        let validation = true;
        extension = extension ? extension.trim() : extension;
        if (VlidationUtil.isEmpty(extension)) {
            ErrorModalUtil.modalError(this.$t('callUpF_extensionIsEmpty').toString()); // 分機 欄位不可為空
            validation = false;
            return;
        } else if (!VlidationUtil.numberValidation(extension)) {
            ErrorModalUtil.modalError(this.$t('callUpF_extensionNumberValidation').toString()); // 分機 欄位僅可輸入數字
            validation = false;
            return;
        } else if (extension.length > 20) {
            ErrorModalUtil.modalError(this.$t('callUpF_extensionNumberLengthOver20').toString()); // 分機 欄位最多20個字元
            validation = false;
            return;
        } else {
            // 更新件更新至DB
            LoadingUtil.show();

            // 取得案件歷程代碼清單
            let casePolicyLogDtoList = this.getCaseLogIdList();
            this.updateCallUpData = {
                extension: this.notiCallUpAgentContactPersonForm.agentOfficeTelExt,
                casePolicyLogDtoList: casePolicyLogDtoList,
            }

            this.dialingExtension(extension);
        }
    }

    /**
     * 撥分機
     * @param data 
     */
    dialingExtension(data: string) {
        // 分機撥號時將分機輸入欄為關閉
        this.isDialingExtension = true;
        // 模擬打分機中~~~
        console.log("打分機");
        LoadingUtil.show();
        this.$callUpApi.dialingExtensionUsingPOST({
            sessionId: this.thisSessionId,
            codingNo: this.thisCodingNo,
            packNo: this.thisPackNo,
        }, data)
            .then((resp: AxiosResponse<ToAEPDTMFApiResponse>) => {
                if (!resp.data.apiStatus) {
                    LoadingUtil.close();
                    console.log("打分機發生錯誤：" + resp.data.result);
                    // 錄音系統發生問題，則無法撥號且出現提示訊息【錄音系統異常，目前無法外撥，請通知負責人員。】
                    ErrorModalUtil.modalError(this.$t('onDutyPage_vendorSystemProblem').toString());
                    this.hangingDialingExtension();
                } else {
                    console.log("分機打出去了");
                    LoadingUtil.close();
                }
            })
            .catch(e => {
                LoadingUtil.close();
                console.log("打分機發生錯誤：" + e);
                this.hangingDialingExtension();
            });
    }

    /**
     * 掛分機
     */
    hangingDialingExtension() {
        this.isDialingExtension = false;
        console.log("掛分機");
    }

    /**
     * 撥號作業儲存
     */
    validateSubmit() {
        let validate = false;
        // 是否有撥號流水號
        if (!VlidationUtil.isEmpty(this.thisCodingNo)) {
            validate = true;
        }
        // 是否有撥號結果
        if (!VlidationUtil.isEmpty(this.notiCallUpAgentContactPersonForm.callUpResultType)) {
            validate = true;
        }
        return validate;
    }

    /**
     * 判斷本次撥號結果是否撥號過
     */
    wasTheOderDialed(data: string) {
        return VlidationUtil.isEmpty(data);
    }

    /**
     * 強制分機輸入為數字
     */
    onExtensionChange(data: CasePackTelephoneListDto) {
        if (data.extension && !/^[0-9]+$/.test(data.extension)) {
            data.extension = "";
        }
    }

    /**
     * @description 取得案件歷程代碼清單
     * @returns 
     * 
     * @author B1529
     * @version 2022/08/26
     */
    getCaseLogIdList(): Array<CasePolicyLogDto> {
        // 取得案件歷程代碼清單
        let result: Array<CasePolicyLogDto> = [];
        if (!VlidationUtil.isEmpty(this.caseLogId)) {
            result.push({
                caseNo: this.caseNo,
                guid: this.caseLogId
            });
        } else {
            result = PackMatchModule.pickupResult.firstCasePack.casePolicyLogInfoList;
        }

        return result;
    }

    /**
     * @description 判斷是否撥號
     * @param data 
     * @returns 
     * 
     * @author B1529
     * @version 2022/09/19
     */
    isCodingNo(data) {
        return !VlidationUtil.isEmpty(data.codingNo);
    }

    /**
     * 判斷該列順序欄位是否為待新增列
     * @param data 
     * @returns
     * 
     * @author B1529
     * @version 2022/09/19
     */
    isAddedRow(data) {
        return !data.isProp && data.isDataAdd;
    }

    /**
     * 移除列
     * @param data
     * 
     * @author B1529
     * @version 2022/09/19
     */
    onRemoveRow(data) {
        this.gridData.data = this.gridData.data.filter(d => d.seqNo != data.seqNo);
    }

    /**
     * 新增新增列
     * @param data 
     * 
     * @author B1529
     * @version 2022/09/19
     */
    onAddRow(data) {

        data.isDataAdd = true;

        this.gridData.data.push({
            seqNo: this.getGridRowKey(),
            isProp: false,
            isDataAdd: false
        });
    }

    /**
     * @description 加入聯絡對象 GridDate
     * @param date 
     */
    pushAgentGridDate(date: NotificationCallUpAgentContactPersonForm) {
        this.gridData.data = [];
        this.gridData.data.push({
            seqNo: this.getGridRowKey(),
            phoneNo: date.agentMob,
            isProp: true,
            isDataAdd: false,
            isCallup: false,
            isResult: false,
            agentkey: this.agentPickValue,
            contactDetail: ''
        });
        if (!VlidationUtil.isEmpty(date.agentOfficeTel)) {
            this.gridData.data.push({
                seqNo: this.getGridRowKey(),
                phoneNo: date.agentOfficeTel,
                extension: date.agentOfficeTelExt,
                isProp: true,
                isDataAdd: false,
                isCallup: false,
                isResult: false,
                agentkey: this.agentPickValue,
                contactDetail: ''
            });
        }
        this.gridData.data.push({
            seqNo: this.getGridRowKey(),
            isProp: false,
            isDataAdd: false,
            isCallup: false,
            isResult: false,
            agentkey: this.agentPickValue,
            contactDetail: ''
        });

        // 取得暫存的撥號資訊
        if (!VlidationUtil.isEmpty(this.agentCallupInfo)) {
            const agentPersonGridMap = this.agentCallupInfo[String(this.agentPickValue)];
            if (!VlidationUtil.isEmpty(agentPersonGridMap)) {
                this.gridData.data = agentPersonGridMap;
            }
        }

    }

    /**
     * @description 取得 Rowkey 流水號
     * @returns 
     * 
     * @author B1529
     * @version 2022/09/26
     */
    getGridRowKey() {
        const rowkeyList = this.gridData.data.map(data => data.seqNo);
        const rowkey = rowkeyList.reduce((total, data) => total + data, 1);
        return rowkey;
    }

    /**
     * 儲存撥號資訊
     */
    saveCallInfo() {
        this.agentCallupInfo[String(this.agentPickValue)] = this.gridData.data;
        // 取得案件歷程代碼
        let newCaseLogId = ValidationUtil.isEmpty(this.caseLogId) ? CommonUtil.getCaseLogId(this.caseNo) : this.caseLogId;

        // 驗證有撥號無聯絡結果與細項
        const validatePeson = AgentPersonModule.validateContactInfo;
        if (!validatePeson.success) {
            ErrorModalUtil.modalListError(validatePeson.errMsg, null);
        } else {
            // 如果有撥號 儲存聯絡結果
            const callupInfos = AgentPersonModule.allAgentCallupInfo;
            if (!ValidationUtil.isEmpty(callupInfos)) {
                LoadingUtil.show();
                // 儲存後重置撥號狀態
                AgentPersonModule.resetAllAgentCallupInfo();
                this.$callUpApi.updateCallUpAgentDataUsingPOST({
                    caseNo: this.caseNo,
                    caseLogId: newCaseLogId,
                    agentCallUpInfos: callupInfos
                }).then((res: AxiosResponse<OutputDto>) => {
                    if (res.data.success) {
                        // 撥號結果儲存
                        this.callResultSaved(true);
                        console.log("聯絡業務員 更新聯絡結果 成功");
                    } else {
                        console.log(res.data.returnMessage);
                    }
                })
                    .catch(e => console.error(e))
                    .finally(() => LoadingUtil.close());
            }
        }
    }

    /**
     * 撥號結果儲存
     */
    callResultSaved(isSaved: boolean) {
        // 儲存按鈕顯示
        this.hasDialMobClicked = !isSaved;
        AgentPersonModule.setShouldSaveIsSave(isSaved);
        this.$emit("isSaveCallUpResult", isSaved);
    }
}