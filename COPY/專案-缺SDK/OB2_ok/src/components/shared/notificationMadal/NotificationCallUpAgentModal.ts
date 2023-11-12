import ValidationUtil from "@/assets/config/ValidationUtil";
import { NotificationAgentDto, NotificationOtherAgentDto, ContactAgentDto, ContactAgentDtoEmailContactPersonEnum, ContactAgentDtoEmailProcessEnum, ContactAgentDtoMplusContactPersonEnum, ContactAgentDtoMplusProcessEnum, ContactAgentDtoProcessEnum, PageOfNotificationOtherAgentDto, OutputDto } from "@fubonlife/obd-api-axios-sdk";
import { Modal } from "ant-design-vue";
import { AxiosResponse } from "axios";
import { Component, Prop, Vue } from "vue-property-decorator";
import NotificationAgentSearchModal from "./NotificationAgentSearchModal.vue";
import NotificationCallUpAgentContactPerson from "./NotificationCallUpAgentContactPerson.vue";
import NotificationCallUpAgentContactResult from "./NotificationCallUpAgentContactResult.vue";
import NotificationCallUpAgentInfo from "./NotificationCallUpAgentInfo.vue";
import LoadingUtil from "@/assets/config/LoadingUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil from "@/assets/config/CommonUtil";
import { AgentPersonModule } from '@/plugins/store/CallUpAgentModule';


@Component({
    components: { NotificationAgentSearchModal, NotificationCallUpAgentContactPerson, NotificationCallUpAgentContactResult, NotificationCallUpAgentInfo }
})
export default class NotificationCallUpAgentModal extends Vue {

    @Prop({ default: false })
    isFromOnDuty: boolean;

    @Prop()
    caseNo: string;

    @Prop()
    notiInfoId: string; // 照會作業單號

    @Prop()
    propCaseLogId: string;  // 案件歷程代碼

    // 查詢其他業務員所選的業務員清單
    pickedAgentList: NotificationOtherAgentDto[] = [];

    // 查詢其他業務員彈窗顯示
    searchOtherAgentShow: boolean = false;

    // 資料載入畫面
    isSalesmanInfoLoading: boolean = false;

    // 業務員資訊
    notificationAgentDto: NotificationAgentDto = null;

    // 選定的業務員序號
    pickedAgentRadioValue: number = 1; // 預設資料帶入第一順位業務員聯絡資訊

    // 預設業務員資料
    initAgentData: NotificationOtherAgentDto[] = [];

    // 選擇其他業務員資料
    searchOtherAgentData: NotificationOtherAgentDto = null;

    notificationAgentSearchInput = {
        agentId: "",
        agentName: "",
        agentUnitId: "",
    }

    // 撥號流水號
    thisCodingNo: string = "";
    codingNoList: Array<string> = [];

    // 是否點選撥號結果
    isSaveCallUpResult: boolean = false;

    // 是否發送訊息
    isSendMessage: boolean = false;

    // 儲存業務員資料
    contactAgentData: ContactAgentDto = null;

    // 儲存聯絡結果資料
    updateCallUpData = {};

    // 查詢其他業務員時所需的資訊
    page: number = 0;
    size: number = 1;

    // 禁選業務員
    isDisableAgent = false;
    // 目前選取的業務員
    selectAgent: number = 1;
    // agentCallupMap = {};

    /**
     * 初始化
     */
    created() {
        this.pickedAgentList = [];
        if (!ValidationUtil.isEmpty(this.caseNo)) {
            console.log("this.caseNo", this.caseNo);
            this.isSalesmanInfoLoading = true;
            this.$notificationAgentApi.initNotiAgentUsingGET(this.caseNo)
                .then((resp: AxiosResponse<NotificationAgentDto>) => {
                    this.notificationAgentDto = resp.data;

                    // 預設資料帶入第一順位業務員聯絡資訊
                    this.onAgentPick({ target: { value: 1 } });
                })
                .catch(e => console.error(e))
                .finally(() => this.isSalesmanInfoLoading = false);
        }
    }

    /**
     * 查詢其他業務員
     * @param data 
     */
    pickAgent(data: NotificationOtherAgentDto) {
        console.log("選擇其他業務員：", data);
        let hasPickedAgentList = this.pickedAgentList.some(p => p.agentId == data.agentId);
        if (!hasPickedAgentList) {
            this.pickedAgentList.push(data);
        }
        console.log("目前選過的業務員有：", this.pickedAgentList);

        this.searchOtherAgentShow = false;

        // // 紀錄業務員撥號資訊
        // const agentCallupInfos = AgentPersonModule.agentPersonInfo;
        // this.agentCallupMap[this.pickedAgentRadioValue] = agentCallupInfos;

        // this.pickedAgentRadioValue = 0; // 重設業務員單選表單
        // this.selectAgent = this.pickedAgentRadioValue;
        // 選擇剛選的其他業務員
        this.pickedAgentRadioValue = 4 + this.pickedAgentList.length;
        this.searchOtherAgentData = data;
        this.selectAgent = this.pickedAgentRadioValue;
        this.onAgentPick({ target: { value: this.pickedAgentRadioValue } });
    }

    /**
     * 選擇業務員
     */
    onAgentPick(e) {
        console.log('radio checked', e.target.value);

        // 切換業務員驗證有撥號無聯絡結果與細項
        const validatePeson = AgentPersonModule.validateContactInfo;
        if (!validatePeson.success) {
            this.pickedAgentRadioValue = this.selectAgent;
            ErrorModalUtil.modalListError(validatePeson.errMsg, null);
        } else {

            // e.target.value=1 帶入第一順位業務員聯絡資訊
            // e.target.value=2 帶入第一順位業務員主管聯絡資訊
            // e.target.value=3 帶入共招業務員聯絡資訊
            // e.target.value=4 帶入共招業務員主管聯絡資訊

            // 紀錄業務員撥號資訊
            // if (ValidationUtil.isEmpty(e.target.init)) {
            // const agentCallupInfos = AgentPersonModule.agentPersonInfo;
            // this.agentCallupMap[this.selectAgent] = agentCallupInfos;
            // }

            this.selectAgent = e.target.value;
            this.isSalesmanInfoLoading = true;
            this.pickedAgentRadioValue = e.target.value;

            if (e.target.value == '1') {
                this.notificationAgentSearchInput = {
                    agentId: this.notificationAgentDto.agentId1,
                    agentName: '',
                    agentUnitId: '',
                }
            } else if (e.target.value == '2') {
                this.notificationAgentSearchInput = {
                    agentId: this.notificationAgentDto.managerId1,
                    agentName: '',
                    agentUnitId: '',
                }
            } else if (e.target.value == '3') {
                this.notificationAgentSearchInput = {
                    agentId: this.notificationAgentDto.agentId2,
                    agentName: '',
                    agentUnitId: '',
                }
            } else if (e.target.value == '4') {
                this.notificationAgentSearchInput = {
                    agentId: this.notificationAgentDto.managerId2,
                    agentName: '',
                    agentUnitId: '',
                }
            } else {
                let index = e.target.value - 5; // 這裡的"5"是上面的"4" + 1
                let pickedAgent: NotificationOtherAgentDto = this.pickedAgentList[index];
                if (pickedAgent) {
                    this.notificationAgentSearchInput = {
                        agentId: pickedAgent.agentId,
                        agentName: '',
                        agentUnitId: '',
                    }
                }
            }

            this.$notificationAgentApi.searchNotiAgentUsingGET(
                this.notificationAgentSearchInput.agentId,
                this.notificationAgentSearchInput.agentName,
                this.notificationAgentSearchInput.agentUnitId,
                this.page,
                this.size
            )
                .then((resp: AxiosResponse<PageOfNotificationOtherAgentDto>) => {
                    if (resp.data && resp.data.content && resp.data.content.length > 0) {
                        this.initAgentData = resp.data.content;
                        console.log("onAgentPick:" + e.target.value, this.initAgentData);
                    } else {
                        this.initAgentData = [{
                            agent: this.notificationAgentDto.agent1,
                            agentId: this.notificationAgentDto.agentId1,
                            agentName: this.notificationAgentDto.agentName1,
                            agentMob: "",
                            agentOfficeTel: "",
                            ext: "",
                        }];
                        Modal.warning({
                            content: this.$t('notificationCallUpAgent_noAgentData').toString(), //無業務員資訊，請點選查詢其他業務員
                            okText: this.$t('global_ok').toString(), // 確定
                            centered: true
                        });
                    }
                })
                .catch(e => console.error(e))
                .finally(() => this.isSalesmanInfoLoading = false);
        }

    }

    // 取得codingNo並存入codingNoList內
    getCodingNo(data: string) {
        this.thisCodingNo = data;
        this.codingNoList.push(this.thisCodingNo);
        this.isDisableAgent = true;
        console.log('thisCodingNo: ', data);
        console.log('codingNoList: ', this.codingNoList);
    }

    // 取得是否已選取撥號結果
    getIsSaveCallUpResult(data: any) {
        this.isSaveCallUpResult = data;
        this.isDisableAgent = !data;
    }

    // 取得更新聯絡結果資料
    // getUpdateCallUpData(data: any){
    //     this.updateCallUpData= {
    //         contDetails: data.contDetails,
    //         contactResult: data.contactResult,
    //         callUpRemark: data.callUpRemark,
    //     }

    //     if(this.updateCallUpData.contactResult == 'B001'){
    //         this.isSendMessage = true;
    //     } else {
    //         this.isSendMessage = false;
    //     }
    // }

    // 是否發送訊息
    getIsSendMessage(data: any) {
        this.isSendMessage = data;
    }

    // 取得儲存時的資料
    getContactAgentData(data: any) {

        // 取得案件歷程代碼
        let caseLogId = ValidationUtil.isEmpty(this.propCaseLogId) ? CommonUtil.getCaseLogId(this.caseNo) : this.propCaseLogId;

        // 撥號資訊
        this.contactAgentData = {
            caseLogId: caseLogId,
            caseNo: this.caseNo,
            casePolicy: data.casePolicy,
            codingNo: this.thisCodingNo,
            content: data.emailContent,
            custName: data.custName,
            custPhone: data.custMobChang,
            emailContactPerson: ContactAgentDtoEmailContactPersonEnum.SALES,
            emailProcess: ContactAgentDtoEmailProcessEnum.A,
            mplusContactPerson: ContactAgentDtoMplusContactPersonEnum.SALES,
            mplusProcess: ContactAgentDtoMplusProcessEnum.A,
            packNo: this.notificationAgentDto.packNo,
            policyNo: data.policyNo,
            policySeq: data.policySeq,
            process: ContactAgentDtoProcessEnum.N,
            subject: data.emailSubject,
            visitEndDate: data.visitStartDate,
            visitStartDate: data.visitEndDate,
            notiInFoId: this.notiInfoId,
            agentId: data.agentId,
            email: data.email,
        }
    }

    // 送出前檢核
    validateSubmit() {
        let validate = true;

        // 發送訊息
        if (!this.isSendMessage) {
            ErrorModalUtil.modalError(this.$t('notificationCallUpAgentInfo_checkSendMesgFirst').toString()); // 若要發送 請先選擇訊息發送
            validate = false;
            return;
        } else {
            if (!(this.$refs.NotificationCallUpAgentInfo as any).validateSubmit()) {
                validate = false;
            }
        }

        // 驗證有撥號無聯絡結果與細項
        const validatePeson = AgentPersonModule.validateContactInfo;
        if (!validatePeson.success) {
            ErrorModalUtil.modalListError(validatePeson.errMsg, null);
            validate = false;
        }

        return validate;
    }

    // // 表單送出
    // onFormSubmit() {
    //     LoadingUtil.show();
    //     if (this.validateSubmit()) {
    //         // 如果有撥號 儲存聯絡結果
    //         const callupInfos = AgentPersonModule.allAgentCallupInfo;
    //         if (!ValidationUtil.isEmpty(callupInfos)) {

    //             this.$callUpApi.updateCallUpAgentDataUsingPOST({
    //                 caseNo: this.contactAgentData.caseNo,
    //                 caseLogId: this.contactAgentData.caseLogId,
    //                 agentCallUpInfos: callupInfos
    //             }).then((res: AxiosResponse<OutputDto>) => {
    //                 if (res.data.success) {
    //                     console.log("聯絡業務員 更新聯絡結果 成功");
    //                 } else {
    //                     console.log(res.data.returnMessage);
    //                 }
    //             })
    //                 .catch(e => console.error(e))
    //                 .finally(() => LoadingUtil.close());
    //         }

    //         console.log('儲存聯絡業務員前的資料', this.contactAgentData);

    //         // 儲存聯絡業務員資料
    //         this.$notificationAgentApi.contactAgentUsingPOST(this.contactAgentData)
    //             .then((resp) => {
    //                 if (resp.data.success) {
    //                     this.$emit("closeForm", false);
    //                     Modal.success({
    //                         title: this.$t('textMessage_sendTextMsg_success').toString(), // 發送成功!
    //                         content: resp.data.returnMessage, //提示哪個尚未發送成功的訊息
    //                         okText: this.$t('global_ok').toString(), // 確定
    //                         centered: false
    //                     });
    //                 } else {
    //                     ErrorModalUtil.modalError(resp.data.returnMessage);
    //                 }
    //             }).catch((err) => {
    //                 console.error(err);
    //             }).finally(() => {
    //                 LoadingUtil.close();
    //             })

    //     }
    // }

    /**
     * @description 查詢其他業務員
     * 
     * @author B1529
     * @version 2022/10/05
     */
    onSearchOtherAgent() {
        // 驗證有撥號無聯絡結果與細項
        const validatePeson = AgentPersonModule.validateContactInfo;
        if (!validatePeson.success) {
            ErrorModalUtil.modalListError(validatePeson.errMsg, null);
        } else {
            this.searchOtherAgentShow = true
        }
    }
}