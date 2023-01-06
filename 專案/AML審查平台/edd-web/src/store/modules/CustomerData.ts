import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { getField, updateField } from 'vuex-map-fields';
import {
  PolicyVO, HistoryMainVO, CustomerDataResponseDto, ReportOptionVO, PolicyApplVO
} from "@fubonlife/edd-api-axios-sdk";

@Module({ namespaced: true })
class CustomerData extends VuexModule {
  customerdata = {
    amlInd: false,
    applRisk: [],
    policyData: [],
    riskInd: false,
    reportData: [],
    others: [],
    historyData: [],
    verifyItem: undefined,
    verifyMethodAg: undefined,
    verifyMethodTel: undefined,
    verifyMethodOw: undefined,
    verifyMethodVs: undefined,
  };
  selectedCheck = [];             // 主選項
  selectedOthers = [];            // 已選 其他選項
  otherForm = [];
  // ways_to_perform_verificationDataCheck:string[] = []; // 待確認格式 只有保福有先隱藏
  toFormData = {
    reportData: [],
    others: []
  };
  customerDataPageLoading: boolean = false;
  isCustomerUpdate: boolean = false;

  get getField() {
    return getField(this)
  }

  // 風險評級
  get riskLevel() {
    return this.customerdata.applRisk.map(item => {
      return `${item.name}：${ (item.riskLvl.length > 0) ? item.riskLvl : '無風險等級' }`
    }).join('；');
  }
  // 名單比對結果
  get matchResult() {
    return this.customerdata.applRisk.map((item)=>{
      return {
        name: item.name,
        type: (item.riskListType.length > 0) ? item.riskListType.join('；') : '無比中名單'
      }
    });
  }
  // 取得 審查原因 列舉
  get reviewReasonSuspectedOpts() {
    return this.customerdata.reportData.map(item => {
      return {
        key: item.id,
        value: item.name
      }
    })
  }
  // 取得 審查原因 必須鎖定的選項
  get reviewReasonSuspectedDefault() {
    const defaultOpts = this.customerdata.reportData.filter(item => {
      return item.dataFrom == 'S' && item.isChecked == true;
    });
    return defaultOpts.map(item => {
      return item.id;
    });
  }


  // 取得 審查原因 - 其他選項 預設的選項 轉文字顯示
  get reviewReasonOtherDefaultString() {
    let defaultObject = this.customerdata.others.filter(item => item.dataFrom == 'B' && item.isChecked == true);
    let $return = defaultObject.map(o=>o.name).join('; ');
    if(Object.keys(defaultObject).length > 0){
      $return += '; ';                               // 結尾再加一次分號
    }
    return $return;
  }

  // 取得 審查原因 - 其他選項 (篩選後)
  get filteredReviewReasonOtherOption() {
    // 下拉選單剔除系統預選的選項(系統預選的項目不能移除，會以文字方式呈現在畫面上)
    let filteredDefault = this.customerdata.others
    .filter(item => item.dataFrom != 'B')
    .map(item => {
      return {
        key: item.id,
        value: item.name
      }
    });
    // 從可手動選取 取得未選取選項
    return filteredDefault.filter(item => 
      !this.selectedOthers.includes(item.value)
    )
  }

  // 取得本次交易之保單資料
  get getPolicyData() {
    return this.customerdata.policyData;
  }

  // 取得 近三個月 AML審查紀錄 要保人資料 (刪除重複)
  get historyDataApplFname() {
    return this.customerdata.historyData
      .map(item => item.applFname.trim())
      .filter((item, index, arr) => arr.indexOf(item) === index)
      .join('、');
  }
  // 取得 近三個月 AML審查紀錄
  get gethistoryData() {
    return this.customerdata.historyData;
  }

  // 取得驗證項目 & 方式
  get verifyItem() {
    return this.customerdata.verifyItem;
  }

  get verifyMethodCheckedOptions() {
    const checked = [];
    if (this.customerdata.verifyMethodAg === 'Y') {
      checked.push('VERIFY_METHOD_AG');
    }
    if (this.customerdata.verifyMethodTel === 'Y') {
      checked.push('VERIFY_METHOD_TEL');
    }
    if (this.customerdata.verifyMethodOw === 'Y') {
      checked.push('VERIFY_METHOD_OW');
    }
    if (this.customerdata.verifyMethodVs === 'Y') {
      checked.push('VERIFY_METHOD_VS');
    }
    return checked;
  }

  
  @Mutation
  updateField(options: {path: string; value: unknown}) {
    return updateField(this, options)
  }

  @Mutation
  UPDATE_DATA(Data) {
    this.customerdata = Data;
    this.selectedCheck = this.customerdata.reportData.filter(item => item.isChecked).map(e => e.id);
    this.selectedOthers = this.customerdata.others.filter(item => item.dataFrom == 'M' && item.isChecked == true).map(e => e.name);

    // console.log(this.customerdata)
    // TEST:
    // 新增近三個月AML審查紀錄 假資料
    // this.customerdata.historyData = [
    //   {
    //     "applFname": "要保人姓名",
    //     "applId": "要保人ID",
    //     "caseNo": "交易案號",
    //     "clients": [
    //       {
    //         "applType": [
    //           {
    //             "additionalProp1": {},
    //             "additionalProp2": {},
    //             "additionalProp3": {}
    //           }
    //         ],
    //         "bithday": [
    //           "客戶生日"
    //         ],
    //         "custId": "客戶ID",
    //         "custName": "客戶姓名",
    //         "listType": [
    //           {
    //             "additionalProp1": {},
    //             "additionalProp2": {},
    //             "additionalProp3": {}
    //           }
    //         ],
    //         "national": [
    //           "客戶國籍"
    //         ],
    //         "riskLvl": "風險評級代碼"
    //       },
    //       {
    //         "applType": [
    //           {
    //             "additionalProp1": {},
    //             "additionalProp2": {},
    //             "additionalProp3": {}
    //           }
    //         ],
    //         "bithday": [
    //           "客戶生日"
    //         ],
    //         "custId": "客戶ID",
    //         "custName": "客戶姓名",
    //         "listType": [
    //           {
    //             "additionalProp1": {},
    //             "additionalProp2": {},
    //             "additionalProp3": {}
    //           }
    //         ],
    //         "national": [
    //           "客戶國籍"
    //         ],
    //         "riskLvl": "風險評級代碼"
    //       }
    //     ],
    //     "combineNo": "併入AML審查檔號",
    //     "custTypes": [
    //       {
    //         "code": "1",
    //         "description": "案件類型"
    //       }
    //     ],
    //     "efileNo": "MC00039",
    //     "fileStat": "案件狀態",
    //     "idDup": "重複碼",
    //     "imgIdxId": "審查表歸檔案號",
    //     "reportName": "AML審查表",
    //     "operType": {
    //       "code": "1",
    //       "description": "保全變更"
    //     },
    //     "policyNo": "保單號碼",
    //     "policySeq": 0,
    //     "renew": "來源",
    //     "rptDate": "101/10/26",
    //     "sysType": {
    //       "code": "1",
    //       "description": "系統別"
    //     },
    //   },
    //   {
    //     "applFname": "要保人姓名2",
    //     "applId": "要保人ID",
    //     "caseNo": "交易案號",
    //     "clients": [
    //       {
    //         "applType": [
    //           {
    //             "additionalProp1": {},
    //             "additionalProp2": {},
    //             "additionalProp3": {}
    //           }
    //         ],
    //         "bithday": [
    //           "客戶生日"
    //         ],
    //         "custId": "客戶ID",
    //         "custName": "客戶姓名",
    //         "listType": [
    //           {
    //             "additionalProp1": {},
    //             "additionalProp2": {},
    //             "additionalProp3": {}
    //           }
    //         ],
    //         "national": [
    //           "客戶國籍"
    //         ],
    //         "riskLvl": "風險評級代碼"
    //       }
    //     ],
    //     "combineNo": "併入AML審查檔號",
    //     "custTypes": [
    //       {
    //         "code": "1",
    //         "description": "案件類型"
    //       }
    //     ],
    //     "efileNo": "MC00036",
    //     "fileStat": "案件狀態",
    //     "idDup": "重複碼",
    //     "imgIdxId": null,
    //     "reportName": null,
    //     "operType": {
    //       "code": "1",
    //       "description": "保全變更"
    //     },
    //     "policyNo": "保單號碼",
    //     "policySeq": 0,
    //     "renew": "來源",
    //     "rptDate": "101/10/27",
    //     "sysType": {
    //       "code": "1",
    //       "description": "系統別"
    //     }
    //   }
    // ];
    // 增加 近三個月AML審查紀錄 控制按鈕

    const main = JSON.parse(sessionStorage["review_assignment_data"]);
    const applId = main.applId;
    const efileNo = main.efileNo;
    const depId = efileNo.substring(0, 2);
    const custIds = main.clients.map((i)=>i.custId);

    if(this.customerdata.historyData.length > 0) {
      this.customerdata.historyData.map(item => {
        const tempCustIds = item.clients.map((i)=>i.custId);
        const intersectionOfCustId = custIds.filter(element => tempCustIds.includes(element));
        // 針對客利部、保服部、保費部、核保部案件
        // 與本案之 [要保人ID]相同

        // 針對理賠部案件
        // 作業別=CL、與本案之 [要保人ID]相同 OR 與本案之 [客戶ID]相同
        if (((depId == "VP" || depId == "MC" || depId == "RN" || depId == "NB") && applId == item.applId) || (depId == "CL" && (applId == item.applId || intersectionOfCustId.length > 0))) {
          if(item.fileStat == '結案' && (item.combineNo == '' || item.combineNo == item.efileNo) ) {
            item.caseHandle = '匯入資料';
            item.caseLink = 'import';
          } else if (item.fileStat == '結案' && (item.combineNo == '' || item.combineNo != item.efileNo)) {
            item.caseHandle = '已併件';
            item.caseLink = 'merged';
          }else{
            item.caseHandle = '';
            item.caseLink = '';
          }
        }

        // <AML_MAIN的FILE_STAT>＝1(待審查)/2(審查中)/20(退回重審)、<AML_MAIN的COMBINE_NO> is BLANK
        if ((item.fileStat == "待審查" || item.fileStat == "審查中" || item.fileStat == "退回重審") && item.combineNo == '') {          
          // 針對保服部案件
          // 同一作業別
          // 同一來源(AML_MAIN的RENEW)
          // 同一要保人ID
          if ((depId == "MC" && main.operType == item.operType && main.renew == item.renew && main.applId == item.applId)) {
            item.caseHandle = '併件';
            item.caseLink = 'merge';
          } 

          // 針對保費部案件
          // 作業別=DC
          // 同一交易案號<AML_MAIN的CASE_NO>
          if (depId == "RN" && item.operType == "DC" && main.caseNo == item.caseNo) {
            item.caseHandle = '併件';
            item.caseLink = 'merge';
          }

          // 作業別=CL
          // 態樣來源=RCLAML30 / RCLAML32 / AML-ADD
          // 相同事故人ID 
          if (depId == "CL" && (item.operType == "CL" && (item.caseFrom == "RCLAML30" || item.caseFrom == "RCLAML32" || item.caseFrom == "AML-ADD") && item.accidId == main.accidId)) {
            // 相同要保人ID
            // 相同客戶ID
            // 相同保單類別(主案件)
            if (applId == item.applId && intersectionOfCustId > 0 && main.policyType == item.policyType) {
              item.caseHandle = '併件';
              item.caseLink = 'merge';
            }
            
            // 相同理賠案號
            // 相同保單號碼
            if (item.caseNo == main.caseNo && (item.policyNo == main.policyNo && item.policySeq == main.policySeq && item.idDup == main.idDup)) {
              item.caseHandle = '併件';
              item.caseLink = 'merge';
            }
          }
        } else if (item.combineNo != '') {
          // 若有併件，無論母案、子案，都不顯示【併件】按鈕而改顯示【已併件】按鈕，但此按鈕無作用且不給按
          item.caseHandle = '已併件';
          item.caseLink = 'merged';
        }
      });
    }

    this.isCustomerUpdate = true;
  }
  @Action
  updateDataAsync(payload) {
    this.context.commit("UPDATE_DATA", payload);
  }

// (更新送參) 疑似洗錢或資恐交易態樣 選項
  @Mutation
  UPDATE_SUSPECTEDOTHERFORM() {
    // 原始資料
    let originData = JSON.parse(JSON.stringify(this.customerdata.reportData));
    // 丟到欲傳送的object 並變動check
    originData.map(item => {
      if (item.dataFrom === 'M') {
        if (this.selectedCheck.includes(item.id)){
          item.isChecked = true;
        } else {
          item.isChecked = false;
        }
      }
    });
    this.toFormData.reportData = JSON.parse(JSON.stringify(originData));
  }
  @Action
  updateSuspectedform() {
    this.context.commit("UPDATE_SUSPECTEDOTHERFORM");
  }

// 疑似洗錢或資恐交易態樣 其他選項
  @Mutation
  UPDATE_OTHERFORM() {
    // 處理 審查原因 其他選項 代碼轉換
    this.otherForm = this.customerdata.others.filter(o => {
      return this.selectedOthers.includes(o.name)
    }).map(o => o.id);
    let defaultObject = this.customerdata.others.filter(item => item.dataFrom == 'B' && item.isChecked == true);
    
    // 處理 『其他』子選項 勾選 時 連動父選項
    if(this.selectedOthers.length > 0 || defaultObject.length > 0) {
      if(!this.selectedCheck.includes('F')){
        this.selectedCheck = this.selectedCheck.concat(...this.selectedCheck, 'F');
      }
    }else{
      if(this.selectedCheck.includes('F')){
        this.selectedCheck.splice(this.selectedCheck.indexOf('F'), 1);
      }
    }

    // 原始資料
    let originData = JSON.parse(JSON.stringify(this.customerdata.others));
    // 丟到欲傳送的object 並變動check
    originData.map(item => {
      if (item.dataFrom === 'M') {
        if(this.otherForm.includes(item.id)) {
          item.isChecked = true;
        } else {
          item.isChecked = false;
        }
      }
    });
    this.toFormData.others = JSON.parse(JSON.stringify(originData));
  }
  @Action
  updateSuspectedotherform() {
    this.context.commit("UPDATE_OTHERFORM");
  }

  @Mutation
  UPDATE_POLICYDATA(payload) {
    this.customerdata.policyData = payload;
  }
  @Action
  updatePolicydata(payload) {
    this.context.commit("UPDATE_POLICYDATA", payload);
  }

  // page loading
  get getCustomerDataPageLoading() {
    return this.customerDataPageLoading;
  }
  @Mutation
  SET_CUSTOMERDATAPAGELOADING (payload: boolean) {
    this.customerDataPageLoading = payload;
  }
  @Action
  setCustomerDataPageLoading(payload) {
    this.context.commit("SET_CUSTOMERDATAPAGELOADING", payload);
  }

  @Action
  updateVerifyMethod(checkedList) {
    this.customerdata.verifyMethodAg = checkedList.includes('VERIFY_METHOD_AG') ? "Y" : "N"
    this.customerdata.verifyMethodOw = checkedList.includes('VERIFY_METHOD_TEL') ? "Y" : "N"
    this.customerdata.verifyMethodTel = checkedList.includes('VERIFY_METHOD_VS') ? "Y" : "N"
    this.customerdata.verifyMethodVs = checkedList.includes('VERIFY_METHOD_OW') ? "Y" : "N"
  }
}
export default CustomerData