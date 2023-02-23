import { PolicyBeforeDto, RiskControlDetailsDto, TelDataDto } from "@fubonlife/obd-api-axios-sdk";
import { Component, Prop, Vue } from "vue-property-decorator";
import { FblColumnType } from "../../data-grid/models";
import DragModal from '@/components/shared/dragModal/DragModal.vue';
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { List } from "ant-design-vue";

@Component({ components: { DragModal, FblDataGrid } })
export default class RiskControl extends Vue {

    // 變更作業名稱
    nestedChangeEventDescList: any = null;

    // 案件包編號
    packNo: string = "220112000042";

    @Prop()
    riskControlDetailsShowData: TelDataDto;

    @Prop()
    theRiskControlDetailsData: RiskControlDetailsDto;

    @Prop()
    theBusinessTypeCode: string;

    @Prop()
    isPolicyBasicDateChanged: boolean;

    @Prop()
    thePolicyBasicBackupData: PolicyBeforeDto;

    // 縮合面板預設全開
    activeKey: string[] = ['1', '2', '3', '4', '5', '6', '7', '8'];

    // 業務別包
    businessTypeNbGpDs = ['NB', 'GP', 'DS']

    // 樣式選擇
    layoutStyle: string = "vertical";
    columnStyle: number = 4;
    sizeStyle: string = "small"
    beforeChangeStyle: string = "";
    afterChangeStyle: string = "border-left: 2px solid rgba(128, 128, 128, 0.5 );  border-collapse: collapse;";

    // 一對一資料的彈窗
    // 實際繳款人資訊
    realPayerInfoShow: boolean = false;
    // 應繳未繳資訊
    shouldPayNoPayInfoShow: boolean = false;
    // 繳付資訊:繳付清單
    paymentInformationPaymentChecklistShow: boolean = false;
    // 見證人資訊
    illIteracyShow: boolean = false;

    // 一對多資料的彈窗
    // 要保人指定匯款帳戶
    applicantDesignatedRemittanceAccountShow: boolean = false;
    public applicantDesignatedRemittanceAccountData = {
        rowKey: 'payBeneAccountId',
        data: [],
        columns: [
            {
                type: FblColumnType.PLAIN,
                property: 'payBeneAccountName',
                title: this.$t('riskControl_payBeneAccountName').toString(), // 銀行戶名
            },
            {
                type: FblColumnType.PLAIN,
                property: 'payBenePayBankAbbreviation',
                title: this.$t('riskControl_payBenePayBankAbbreviation').toString(), // 銀行簡稱
            },
            {
                type: FblColumnType.PLAIN,
                property: 'payBeneAccountId',
                title: this.$t('riskControl_payBeneAccountId').toString(), // 帳號
            },
        ],
    };

    // 變更後受益人清單
    listOfBeneficiariesAfterChangeShow: boolean = false;
    public listOfBeneficiariesAfterChangeData = {
        rowKey: 'benefitBeneName',
        data: [],
        columns: [
            {
                type: FblColumnType.PLAIN,
                property: 'benefitBeneName',
                title: this.$t('riskControl_benefitBeneName').toString(), // 受益人
            },
            {
                type: FblColumnType.PLAIN,
                property: 'benefitBeneTel',
                title: this.$t('riskControl_benefitBeneTel').toString(), // 聯絡電話
            },
            {
                type: FblColumnType.PLAIN,
                property: 'benefitBeneMobile',
                title: this.$t('riskControl_policyPherMob').toString(), // 行動電話
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'benefitBeneAddrTemp',
                title: this.$t('riskControl_benefitBeneAddr').toString(), // 聯絡地址
            },
        ],
    };

    // 電話清單
    telListShow: boolean = false;
    public telListData = {
        rowKey: 'listSeqNo',
        data: [],
        columns: [
            {
                type: FblColumnType.TEMPLATE,
                template: 'policyPolicyNoTemp',
                title: this.$t('riskControl_policyCasePolicy').toString(), // 保單號碼
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'policyCustNameTemp',
                title: this.$t('riskControl_policyCustName').toString(), // 受訪者姓名
            },
            {
                type: FblColumnType.PLAIN,
                property: 'listSeqNo',
                title: this.$t('riskControl_listSeqNo').toString(), // 順序
            },
            {
                type: FblColumnType.PLAIN,
                property: 'listUseReason',
                title: this.$t('riskControl_listUseReason').toString(), // 取用原則
            },
            {
                type: FblColumnType.PLAIN,
                property: 'listContTel',
                title: this.$t('riskControl_benefitBeneTel').toString(), // 聯絡電話
            },
            {
                type: FblColumnType.PLAIN,
                property: 'listSourceCaseNo',
                title: this.$t('riskControl_listSourceCaseNo').toString(), // 來源(保單/受理案號)
            },
        ],
    };

    created() {
        console.log(this.riskControlDetailsShowData.caseNo);
        // 要保人指定匯款帳戶
        this.applicantDesignatedRemittanceAccountData.data = this.theRiskControlDetailsData.payBeneAccounts;
        // 變更後受益人清單
        this.listOfBeneficiariesAfterChangeData.data = this.theRiskControlDetailsData.benefitBeneInfos;
        // 電話清單
        this.telListData.data = this.theRiskControlDetailsData.listTelInfos;
        // 變更作業名稱
        let col_num = 4; // 規格規定
        let row_num = Math.ceil(this.theRiskControlDetailsData.changeEventDescList.length / col_num);
        let index = 0;
        let nestedChangeEventDescArray = new Array(row_num);
        for (let row = 0; row < row_num; row++) {
            nestedChangeEventDescArray[row] = new Array(col_num);
            for (let col = 0; col < col_num; col++) {
                nestedChangeEventDescArray[row][col] = this.theRiskControlDetailsData.changeEventDescList[index];
                index++;
            }
        }
        this.nestedChangeEventDescList = nestedChangeEventDescArray;
    }

    // onSwitch(checked) {
    //     if (checked) {
    //         this.layoutStyle = "horizontal ";
    //     } else {
    //         this.layoutStyle = "vertical";
    //     }
    // }

    /**
     * @Author B1843
     * @description 取得 實際繳款人資訊 是否有資料
     * @version 2022/10/20
     */
    get realPayerInfoFlag(): boolean {
        if(this.theRiskControlDetailsData.nbPayerName ||
            this.theRiskControlDetailsData.nbPayerId ||
            this.theRiskControlDetailsData.nbPayerBitrhday ||
            this.theRiskControlDetailsData.nbPayerRelate ||
            this.theRiskControlDetailsData.nbPayerLegalName ||
            this.theRiskControlDetailsData.nbPayerLegalId ||
            this.theRiskControlDetailsData.nbFirstAuthKind ||
            this.theRiskControlDetailsData.nbFirstAuthBankName ||
            this.theRiskControlDetailsData.nbPayerTel ||
            this.theRiskControlDetailsData.nbPayerOfficeTel ||
            this.theRiskControlDetailsData.nbPayerMob) {
                return true;
            } else {
                return false;
            }
    }

    /**
     * @Author B1843
     * @description 取得 應繳未繳資訊 是否有資料
     * @version 2022/10/20
     */
    get shouldPayNoPayInfoFlag(): boolean {
        if(this.theRiskControlDetailsData.rnGracePeriodEndDate ||
            this.theRiskControlDetailsData.rnAplDate ||
            this.theRiskControlDetailsData.rnStopEffectiveDate) {
                return true;
            } else {
                return false;
            }
    }

    /**
     * @Author B1843
     * @description 取得 繳付資訊：繳付清單 是否有資料
     * @version 2022/10/20
     */
    get paymentInformationPaymentChecklistFlag(): boolean {
        if(this.theRiskControlDetailsData.detallPaySeq ||
            this.theRiskControlDetailsData.detallPayCasePolicy ||
            this.theRiskControlDetailsData.detallPayInsuId ||
            this.theRiskControlDetailsData.detallPayInsuName ||
            this.theRiskControlDetailsData.detallPayPolicyholderName ||
            this.theRiskControlDetailsData.detallPayRelation ||
            this.theRiskControlDetailsData.detallPayItem ||
            this.theRiskControlDetailsData.detallActualPayTotal) {
                return true;
            } else {
                return false;
            }
    }

    /**
     * @Author B1843
     * @description 取得 見證人資訊 是否有資料
     * @version 2022/10/20
     */
    get illIteracyFlag(): boolean {
        if(this.riskControlDetailsShowData.isSignatureHand ||
            this.riskControlDetailsShowData.isItacy ||
            this.riskControlDetailsShowData.witnessNameOne != "-" ||
            this.riskControlDetailsShowData.witnessIDOne != "-"||
            this.riskControlDetailsShowData.witnessNameTwo != "-"||
            this.riskControlDetailsShowData.witnessIDTwo!= "-") {
                return true;
            } else {
                return false;
            }
    }

}