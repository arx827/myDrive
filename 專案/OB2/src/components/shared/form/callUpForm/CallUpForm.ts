import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import VlidationUtil from "@/assets/config/ValidationUtil";
import { Option } from "@/components/shared/form/callUpForm/model";
import { LoginModule } from "@/plugins/store/LoginModule";
import { PackMatchModule } from "@/plugins/store/packMatchModule";
import { CasePackTelephoneListDto, DialingDto, ToAEPDTMFApiResponse, UserDto } from "@fubonlife/obd-api-axios-sdk";
import { Modal } from 'ant-design-vue';
import { AxiosResponse } from "axios";
import { Component, Vue } from "vue-property-decorator";
import { FblColumnType } from "../../data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { callUpInfoModule } from "@/plugins/store/CallUpModule";
import CommonUtil from "@/assets/config/CommonUtil";

// 待新增列判別開頭字
const MINUS_ROW_ID: string = "minus";
@Component({
    components: { FblDataGrid }
})
export default class CallUpForm extends Vue {

    // 案件包編號
    packNo: string = VlidationUtil.isEmpty(PackMatchModule.matchedCasePack) != null ? PackMatchModule.matchedCasePack.packNo : "";

    // 撥號人員分機號碼
    dialerExtension: string;

    // 撥號完撥分機前所需要的資訊
    thisCodingNo: string = "";
    thisPackNo: string = "";
    thisSessionId: string = "";

    // 尚未打過電話儲存至DB的暫時資料
    tempData: CasePackTelephoneListDto[] = [];

    // 取用原則Map
    useReasonMap: Map<string, string> = new Map();

    // 取用來源Map
    useSourceMap: Map<string, string> = new Map();

    // 撥號結果Map
    callUpResultMap: Map<string, string> = new Map();

    // 來源(保單/案號)選項Map
    sourceCaseNoMap: Map<string, string> = new Map();

    // 本次撥號結果選項
    callUpResultOptions: Option[] = [];

    // 來源(保單/案號)選項
    sourceCaseNoOptions: Option[] = [];

    // 是否正在撥分機
    isDialingExtension: boolean = false;

    // 本次撥過號的SeqNos
    haveDialedSeqNos: string[] = [];

    // 目前正在撥號的SeqNo
    currentDialingSeqNo: string = "";

    // 是否有撥號中
    isDialing: boolean = false;

    // 本次撥號結果下拉選單變化
    codingNoForSeqMap: Map<string, string> = new Map();

    // 欄位資料
    gridData = {
        rowKey: 'seqNo',
        data: [],
        pagination: false,
        columns: [
            {
                type: FblColumnType.TEMPLATE,
                template: 'seqNoTemp',
                property: 'seqNo',
                title: this.$t('callUpF_seqNo').toString(), // 順序
                width: CommonUtil.countColumnWidth(2),
                align: 'center',
            },
            // {
            //     type: FblColumnType.TEMPLATE,
            //     template: 'useReasonTemp',
            //     property: 'useReason',
            //     title: this.$t('callUpF_useReason').toString(), // 取用原則
            // },
            {
                type: FblColumnType.PLAIN,
                property: 'useReason',
                title: this.$t('callUpF_useReason').toString(), // 取用原則
                formatter: (data: CasePackTelephoneListDto) => {
                    return this.useReasonMap.has(data.useReason) ? this.useReasonMap.get(data.useReason) : data.useReason;
                },
                width: CommonUtil.countColumnWidth(4),
                align: 'center',
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'sourceCaseNoTemp',
                property: 'sourceCaseNo',
                title: this.$t('callUpF_sourceCaseNo').toString(), // 來源(保單/變更案號)
                width: CommonUtil.countColumnWidth(8),
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: 'contTel',
                title: this.$t('callUpF_contTel').toString(), // 電訪電話清單
                width: CommonUtil.countColumnWidth(6),
                align: 'center',
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'phoneNoTemp',
                property: 'phoneNo',
                title: this.$t('callUpF_phoneNo').toString(), // 實際電訪電話
                width: CommonUtil.countColumnWidth(6),
                align: 'center',
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'dialTemp',
                property: 'dial',
                title: this.$t('callUpF_dial').toString(), // 撥號
                width: CommonUtil.countColumnWidth(2),
                align: 'center',
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'extensionTemp',
                property: 'extension',
                title: this.$t('callUpF_extension').toString(), // 分機
                width: CommonUtil.countColumnWidth(2),
                align: 'center',
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'extensionDialTemp',
                property: 'extensionDial',
                title: this.$t('callUpF_dial').toString(), // 撥號
                width: CommonUtil.countColumnWidth(2),
                align: 'center',
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'callUpRemarkTemp',
                property: 'callUpRemark',
                title: this.$t('callUpF_callUpRemark').toString(), // 通話內容
                width: CommonUtil.countColumnWidth(20),
                align: 'center',
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'callUpResultTemp',
                property: 'callUpResult',
                title: this.$t('callUpF_callUpResult').toString(), // 本次撥號結果
                width: CommonUtil.countColumnWidth(6),
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: 'lastCallUpResult',
                title: this.$t('callUpF_lastCallUpResult').toString(), // 前次撥號結果
                formatter: (data: CasePackTelephoneListDto) => {
                    if (data) {
                        return this.callUpResultMap.get(data.lastCallUpResult)
                    }
                },
                width: CommonUtil.countColumnWidth(6),
                align: 'center',
            },
        ],
    };

    /**
     * 初始化
     */
    created() {
        LoadingUtil.show();
        // 取得撥號人員分機號碼
        const getUserPromise = this.$userApi.getUserUsingGET(LoginModule.loginState.me.id).then((resp: AxiosResponse<UserDto>) => {
            this.dialerExtension = resp.data.extensionNo;
        });
        // 取用來源映射
        const getUseSourceMapPromise = this.$callUpApi.getUseSourceMapUsingGET().then((resp: AxiosResponse<Option[]>) => {
            resp.data.forEach(d => this.useSourceMap.set(d.value, d.label));
        }).catch((e) => {
            LoadingUtil.close();
            ErrorModalUtil.modalError(this.$t('callUpF_useSourceMap').toString() + e); // 取用來源映射
        });
        // 取用原則映射
        const getUseReasonOptionsPromise = this.$callUpApi.getUseReasonOptionsUsingGET().then((resp: AxiosResponse<Option[]>) => {
            resp.data.forEach(d => this.useReasonMap.set(d.value, d.label));
        }).catch((e) => {
            LoadingUtil.close();
            ErrorModalUtil.modalError(this.$t('callUpF_useReasonMap').toString() + e); // 取用原則映射
        });
        // 本次撥號結果選項
        const getCallUpResultOptionsPromise = this.$callUpApi.getCallUpResultOptionsUsingGET().then((resp: AxiosResponse<Option[]>) => {
            this.callUpResultOptions = this.callUpResultOptions.concat(resp.data);
            resp.data.forEach(d => this.callUpResultMap.set(d.value, d.label));
        }).catch((e) => {
            LoadingUtil.close();
            ErrorModalUtil.modalError(this.$t('callUpF_callUpResultOptions').toString() + e); // 本次撥號結果選項
        });
        // 來源(保單/案號)選項
        const getSourceCaseNoOptionsPromise = this.$callUpApi.getSourceCaseNoOptionsUsingGET().then((resp: AxiosResponse<Option[]>) => {
            this.sourceCaseNoOptions = this.sourceCaseNoOptions.concat(resp.data);
            resp.data.forEach(d => this.sourceCaseNoMap.set(d.value, d.label));
        }).catch((e) => {
            LoadingUtil.close();
            ErrorModalUtil.modalError(this.$t('callUpF_sourceCaseNoOptions').toString() + e); // 來源(保單/案號)選項
        });

        // 密戶件判斷和獲得提示訊息
        const getSecretCasePromptPromise = this.$callUpApi.getSecretCasePromptUsingGET(this.packNo).then((resp: AxiosResponse<string>) => {
            if (resp.data) {
                Modal.info({
                    okText: this.$t('callUpForm_confirm').toString(), // 確認
                    title: this.$t('callUpForm_promptMessage').toString(), // 提示訊息
                    content: resp.data
                });
            }
        });
        Promise.all([getUserPromise,
            getUseSourceMapPromise,
            getUseReasonOptionsPromise,
            getCallUpResultOptionsPromise,
            getSourceCaseNoOptionsPromise,
            getSecretCasePromptPromise
        ])
            .then(() => {
                this.reload().then(() => {
                    LoadingUtil.close();
                });
            })
            .catch(err => {
                console.error(err);
                LoadingUtil.close();
            })
    }

    /**
     * 新增列
     */
    addRow() {
        // 新增列
        this.gridData.data.push({
            packNo: this.packNo,
            seqNo: "add",
            useReason: "",
            sourceCaseNo: "",
            contTel: "",
            phoneNo: "",
            extension: "",
            callUpRemark: "",
            callUpResult: "",
            lastCallUpResult: "",
        });
    }

    /**
     * 新增新增列
     * @param data 
     */
    onAddRow(data: CasePackTelephoneListDto) {
        data.seqNo = MINUS_ROW_ID + (new Date()).getTime();
        data.useReason = "8"; // 8：電訪
        this.gridData.data[this.gridData.data.length - 1] = data;
        // 新增列新增
        this.addRow();
    }

    /**
     * 移除列
     * @param data 
     */
    onRemoveRow(data: CasePackTelephoneListDto) {
        this.gridData.data = this.gridData.data.filter(d => d.seqNo != data.seqNo);
    }

    /**
     * 判斷該列是否為新增列
     * @param data 
     * @returns 
     */
    isDataRow(data: CasePackTelephoneListDto) {
        return VlidationUtil.numberValidation(data.seqNo);
    }

    /**
     * 判斷該列順序欄位是否為待新增列
     * @param data 
     * @returns 
     */
    isAddedRow(data: CasePackTelephoneListDto) {
        return data.seqNo.startsWith(MINUS_ROW_ID);
    }

    /**
     * 本次撥號結果下拉選單變化
     * @param data 
     */
    onCallUpResultCellChange(data: CasePackTelephoneListDto) {
        LoadingUtil.show();
        // 更新件更新至DB
        console.log("tthis.codingNoForSeqMap.get(data.seqNo)", this.codingNoForSeqMap.get(data.seqNo));
        console.log("data", data);
        data.casePolicyLogDtoList = PackMatchModule.pickupResult.firstCasePack.casePolicyLogInfoList;
        if (this.codingNoForSeqMap.has(data.seqNo)) {
            this.$callUpApi.updatePhoneListUsingPOST(data, this.codingNoForSeqMap.get(data.seqNo), data.uuId)
                .then((resp: AxiosResponse<CasePackTelephoneListDto>) => {
                    this.hangingDialingExtension();
                    this.hangingDialing();
                    // this.reload();
                }).catch(e => console.error(e)).finally(() => LoadingUtil.close());
        }
    }

    /**
     * 撥號流程作業
     * @param data 
     */
    onDialClick(data: CasePackTelephoneListDto) {
        // 將本次撥號結果清除
        data.callUpResult = null;

        // 驗證撥號人員分機是否存在
        if (VlidationUtil.isEmpty(this.dialerExtension)) {
            ErrorModalUtil.modalError(this.$t('callUpF_dialerExtensionIsEmpty').toString()); //撥號人員未設定分機號碼
            return;
        }
        // 驗證 來源(保單/案號) 欄位
        if (VlidationUtil.isEmpty(data.sourceCaseNo)) {
            ErrorModalUtil.modalError(this.$t('callUpF_sourceCaseNoIsEmpty').toString()); // 來源(保單/案號) 欄位為必填
            return;
        }
        // 驗證 實際電訪電話輸入 欄位
        if (VlidationUtil.isEmpty(data.phoneNo)) {
            ErrorModalUtil.modalError(this.$t('callUpF_phoneNoIsEmpty').toString()); // 實際電訪電話輸入 欄位必填
            return;
        }
        if (!VlidationUtil.numberValidation(data.phoneNo)) {
            ErrorModalUtil.modalError(this.$t('callUpF_phoneNoNumberValidation').toString()); // 實際電訪電話輸入 欄位僅可輸入數字
            return;
        }
        if (data.phoneNo.length > 20) {
            ErrorModalUtil.modalError(this.$t('callUpF_phoneNoLengthOver20').toString()); // 實際電訪電話輸入 欄位最多20個字元
            return;
        }

        // 判斷撥號列是否有正常seqNo(有為DB資料；否為剛新增資料。)
        if (data.seqNo.startsWith(MINUS_ROW_ID)) {
            // 撥號列seqNo賦值(找目前grid data中seqNo編號最大值在加1)
            data.seqNo = (Math.max.apply(Math, this.gridData.data.map(d => {
                if (Number(d.seqNo)) {
                    return parseInt(d.seqNo, 10)
                } else {
                    return 0;
                }
            })) + 1).toString();
            data.dataType = "I"; // 資料類型(上游 : U / 使用者新增 : I)
            // 新增件儲存至DB
            this.$callUpApi.insertPhoneListUsingPOST(data).then((resp: AxiosResponse<CasePackTelephoneListDto>) => {
                data.uuId = resp.data.uuId;
                this.dialing(data);
            });
        } else {
            // 更新件更新至DB
            data.casePolicyLogDtoList = PackMatchModule.pickupResult.firstCasePack.casePolicyLogInfoList;
            this.$callUpApi.updatePhoneListUsingPOST(data, "", data.uuId).then((resp: AxiosResponse<CasePackTelephoneListDto>) => {
                data.uuId = resp.data.uuId;
                this.dialing(data);
            });
        }

    }

    /**
     * 撥號
     * @param data 
     */
    dialing(data: CasePackTelephoneListDto) {
        this.isDialing = true;
        this.currentDialingSeqNo = data.seqNo;
        this.haveDialedSeqNos.push(data.seqNo);
        console.log("撥號前 callUpInfoModule.callUpInfo", callUpInfoModule.callUpInfo);
        LoadingUtil.show();
        this.$callUpApi.dialingUsingPOST(data, this.dialerExtension).then((resp: AxiosResponse<DialingDto>) => {
            if (resp.data) {
                this.thisCodingNo = resp.data.codingNo;
                this.thisPackNo = resp.data.packNo;
                this.thisSessionId = resp.data.sessionId;
                let codingNoList = callUpInfoModule.callUpInfo.previousCodingNoList;
                codingNoList.push(resp.data.codingNo);
                callUpInfoModule.setCallUpInfo({ codingNo: resp.data.codingNo, sessionId: resp.data.sessionId, previousCodingNoList: codingNoList });
                // 每本次撥號結果盡情選擇時用的
                this.codingNoForSeqMap.set(data.seqNo, resp.data.codingNo);
                console.log("撥號後 callUpInfoModule.callUpInfo", callUpInfoModule.callUpInfo);
                LoadingUtil.close();
            } else {
                // 錄音系統發生問題，則無法撥號且出現提示訊息【錄音系統異常，目前無法外撥，請通知負責人員。】
                ErrorModalUtil.modalError(this.$t('onDutyPage_vendorSystemProblem').toString());
                this.hangingDialing();
                this.reload().then(() => {
                    LoadingUtil.close();
                });
            }
        }).catch(e => {
            console.error("打電話發生錯誤：" + e);
            this.hangingDialing();
            this.reload().then(() => {
                LoadingUtil.close();
            });
        })
    }

    /**
     * 掛電話
     */
    hangingDialing() {
        this.currentDialingSeqNo = "";
        this.isDialing = false;
    }

    /**
     * 分機撥號流程作業
     * @param data 
     */
    onExtensionDialClick(data: CasePackTelephoneListDto) {
        // 撥分機前驗證
        if (VlidationUtil.isEmpty(data.extension)) {
            ErrorModalUtil.modalError(this.$t('callUpF_extensionIsEmpty').toString()); // 分機 欄位不可為空
            return;
        }
        if (!VlidationUtil.numberValidation(data.extension)) {
            ErrorModalUtil.modalError(this.$t('callUpF_extensionNumberValidation').toString()); // 分機 欄位僅可輸入數字
            return;
        }
        if (data.extension.length > 20) {
            ErrorModalUtil.modalError(this.$t('callUpF_extensionNumberLengthOver20').toString()); // 分機 欄位最多20個字元
            return;
        }
        // 更新件更新至DB
        LoadingUtil.show();
        data.casePolicyLogDtoList = PackMatchModule.pickupResult.firstCasePack.casePolicyLogInfoList;
        this.$callUpApi.updatePhoneListUsingPOST(data, this.thisCodingNo, data.uuId)
            .then((resp: AxiosResponse<CasePackTelephoneListDto>) => {
                this.dialingExtension(data);
            }).catch(e => console.error(e)).finally(() => LoadingUtil.close());

    }

    /**
     * 撥分機
     * @param data 
     */
    dialingExtension(data: CasePackTelephoneListDto) {
        // 分機撥號時將分機輸入欄為關閉
        this.isDialingExtension = true;
        // 模擬打分機中~~~
        console.log("打分機");
        LoadingUtil.show();
        this.$callUpApi.dialingExtensionUsingPOST({
            sessionId: this.thisSessionId,
            codingNo: this.thisCodingNo,
            packNo: this.thisPackNo,
        }, data.extension)
            .then((resp: AxiosResponse<ToAEPDTMFApiResponse>) => {
                if (!resp.data.apiStatus) {
                    console.log("打分機發生錯誤：" + resp.data.result);
                    // 錄音系統發生問題，則無法撥號且出現提示訊息【錄音系統異常，目前無法外撥，請通知負責人員。】
                    ErrorModalUtil.modalError(this.$t('onDutyPage_vendorSystemProblem').toString());
                    this.hangingDialingExtension();
                    this.reload().then(() => {
                        LoadingUtil.close();
                    });
                } else {
                    this.thisCodingNo = "";
                    this.thisPackNo = "";
                    this.thisSessionId = "";
                    console.log("分機打出去了");
                    LoadingUtil.close();
                }
            })
            .catch(e => {
                console.log("打分機發生錯誤：" + e);
                this.hangingDialingExtension();
                this.reload().then(() => {
                    LoadingUtil.close();
                });
            })
    }

    /**
     * 掛分機
     */
    hangingDialingExtension() {
        this.isDialingExtension = false;
    }

    /**
     * 撥號作業儲存
     */
    onDialerSave() {
        let emitCheck = true;
        // 本次撥號結果有空白者不得關閉
        if (this.haveDialedSeqNos && this.haveDialedSeqNos.length > 0) {
            (this.gridData.data as CasePackTelephoneListDto[]).forEach(data => {
                if (this.haveDialedSeqNos.includes(data.seqNo) && !data.callUpResult) {
                    ErrorModalUtil.modalError(this.$t('onDutyPage_callUpResultCanNotBeEmpty').toString());
                    emitCheck = false;
                }
            });
        }
        if (emitCheck) {
            this.$emit('dialerValue',
                (this.gridData.data as CasePackTelephoneListDto[]).filter(d => d.seqNo != "add"));
        }
    }

    /**
     * 判斷本次撥號結果是否撥號過
     */
    wasTheOderDialed(seqNo: string) {
        return this.haveDialedSeqNos.includes(seqNo);
    }

    /**
     * 重新整理
     */
    async reload() {
        // 電訪電話清單
        return this.$callUpApi.getPhoneListUsingGET(this.packNo).then((resp: AxiosResponse<CasePackTelephoneListDto[]>) => {
            // 將尚未儲存的資料暫存起來
            this.saveTempData();
            this.gridData.data = resp.data;
            this.gridData.data = this.autoFillInContactInfo(this.gridData.data);
            this.gridData.data.sort((a, b) => parseInt(a.seqNo, 10) - parseInt(b.seqNo, 10));
            // 將暫時資料抓回來
            if (this.tempData && this.tempData.length > 0) {
                this.gridData.data = this.gridData.data.concat(this.tempData);
            }
            console.log("this.gridData.data: ", this.gridData.data);
        }).catch(e => {
            ErrorModalUtil.modalError(this.$t('callUpF_getPhoneListCatch').toString() + e);
        }).finally(() => {
            // 新增列新增
            this.addRow();
        });
    }

    /**
     * 儲存暫時資料
     */
    saveTempData() {
        // 將尚未儲存的資料暫存起來
        this.tempData = [];
        this.gridData.data.filter(d => d.seqNo.startsWith(MINUS_ROW_ID))
            .forEach(d => { this.tempData.push(d); });
    }

    /**
     * 預設帶入聯絡資訊
     * @param data 
     */
    autoFillInContactInfo(data: CasePackTelephoneListDto[]): CasePackTelephoneListDto[] {
        data.map(d => {
            if (VlidationUtil.isEmpty(d.phoneNo) && !VlidationUtil.isEmpty(d.contTel)) {
                d.phoneNo = d.contTel;
            }
            if (VlidationUtil.isEmpty(d.extension) && !VlidationUtil.isEmpty(d.contTelExt)) {
                d.extension = d.contTelExt;
            }
        });
        return data;
    }

    /**
     * 強制分機輸入為數字
     */
    onExtensionChange(data: CasePackTelephoneListDto) {
        if (data.extension && !/^[0-9]+$/.test(data.extension)) {
            data.extension = "";
        }
    }
}