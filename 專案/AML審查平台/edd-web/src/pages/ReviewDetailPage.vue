<template>
  <div class="container">
    <a-row class="spin__wrap" v-if="getLoading">
      <a-spin
        :spinning="getLoading"
        tip="資料處理中，請稍候..."
        :delay="200"
        class="spin"
      >
      </a-spin>
    </a-row>
    <div class="userInfo">
      <UserInfoTable @getMergeWindowElement = "getMergeWindow"/>
    </div>
    <a-tabs
      class="card-container"
      type="card"
      :tabBarGutter="1.5"
      defaultActiveKey="1"
      @tabClick="tabCallback"
    >
      <a-tab-pane key="1" tab="客戶資料">
        <CustomerDataPage @merge-aml-data="showMergeAmlData" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="交易紀錄">
        <TransactionRecordPage />
      </a-tab-pane>
      <a-tab-pane key="3" tab="財務與職業資訊">
        <FinancialAndJobInfoPage />
      </a-tab-pane>
      <a-tab-pane key="4" tab="疑似洗錢或資恐交易態樣">
        <SuspectLaunderingPage/>
      </a-tab-pane>
      <a-tab-pane key="5" tab="佐證資料">
        <EvidenceData ref="evidenceData"/>
      </a-tab-pane>
      <a-tab-pane key="6" tab="審查歷程">
        <ReviewHistory />
      </a-tab-pane>
      <a-tab-pane key="7" tab="態樣來源" v-if="getDeptSectionConfig.dataSourcePage.isShow">
        <DataSource />
      </a-tab-pane>
    </a-tabs>
    <div class="review-bottom">
      <ReviewBottom
        :mergeAmlData="mergeAmlData"
        @close="destroyedBeforeunloadHandler"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Watch} from "vue-property-decorator";
import UserInfoTable from "@/components/shared/review-assignment/UserInfoTable.vue";
import ReviewBottom from "@/components/shared/review-assignment/ReviewBottom.vue";
import CustomerDataPage from "@/pages/CustomerDataPage.vue";
import TransactionRecordPage from "@/pages/TransactionRecordPage.vue";
import FinancialAndJobInfoPage from "@/pages/FinancialAndJobInfoPage.vue";
import SuspectLaunderingPage from "@/pages/SuspectLaunderingPage.vue";
import EvidenceData from "@/pages/ReviewEvidenceData.vue";
import ReviewHistory from "@/pages/ReviewHistory.vue";
import DataSource from "@/pages/ReviewDataSource.vue";
import { Modal } from "ant-design-vue";
import Global from "@/plugins/global";
import {
  Getter,
  Action,
  State,
  namespace } from 'vuex-class';

const CustomerData = namespace('CustomerData');
const SuspectLaundering = namespace('SuspectLaundering');
const FinanceJobInfo = namespace('FinanceJobInfo');

@Component({
  components: {
    UserInfoTable,
    ReviewBottom,
    CustomerDataPage,
    TransactionRecordPage,
    FinancialAndJobInfoPage,
    SuspectLaunderingPage,
    EvidenceData,
    ReviewHistory,
    DataSource,
  },
})
export default class ReviewDetailPage extends Vue {
  mergeAmlData = [];
  mainAmlId: string;
  @Action public setLoading: (payload: boolean) => void;
  h = this.$createElement;

//   if (FunctionSet.isMobile()) {
//    import('./assets/css/mobile.scss');
//  }else {
//    import('./assets/css/pc.scss');
//  }
  public loadingComplete:boolean = false;

  @Getter isConfirm!: boolean;
  @Getter getLoading;

  // 拿取已儲存之[疑似洗錢或資恐交易態樣]版本號
  @SuspectLaundering.State verCode!: string
  // 儲存[疑似洗錢或資恐交易態樣]版本號
  @SuspectLaundering.Action("onStoreVerCode") onStoreVerCode
  // 更新[疑似洗錢或資恐交易態樣]資料
  @SuspectLaundering.Action("onUpdateDatas") onUpdateDatas

  // 取得[財務與職業資訊]初始值
  @FinanceJobInfo.Action("fetchInitDatas") fetchFinanceJobInfoInitDatas
  @CustomerData.Action("updateDataAsync") updateDataAsync

  mergeWindowElement = undefined;

  @CustomerData.Action("setCustomerDataPageLoading") setCustomerDataPageLoading;
  @FinanceJobInfo.Action("setFinanceJobinfoPageLoading") setFinanceJobinfoPageLoading;
  @SuspectLaundering.Action("setSupectPageLoading") setSupectPageLoading;

  // 目前明細頁 AML審查檔號
  currentAmlId: string = '';

  // 設定當前部門顯示規則設定
  @Action public setDeptSectionConfig: (payload: string) => void;
  @Getter public getDeptSectionConfig;
/**
 * Hook
 */
  created(){
    this.createBeforeunloadHandler();
    // 從本視窗專屬的 sessionStorage 得知審查檔號後，拋到 localStorage 來讓母視窗監聽器知悉
    this.extractMainAmlIdToLocalStorage();
    
    //網頁所有資源都已經載入完成後才會觸發
    onload = this.onloadHandler;

    // 關閉/重整畫面時，清除 localStorage&sessionStorage
    onunload = this.clearBrowserStorageHandler;
  }

  mounted() {
    this.currentAmlId = sessionStorage["review_assignment_page"];
    this.setDeptSectionConfig(this.currentAmlId.substring(0,2));
    Global.timeOut(30, this.beforeunloadHandler);//分
    this.stopRefresh();
    // 承辦取件進入時出彈跳提醒訊息「以下區塊之資料已異動:【頁籤】之【項目】中【欄位】及說明請確認審查結果是否要調整!」
    this.hasChangeDataMessage();

    this.getCustomerData();
    this.getFinanceJobInfoData();
    this.getSuspectLaunderingData();
  }

/**
 * Func
 */
  // 更新SoftLock
  updateSoftLock(key) {
    this.setLoading(true);
    this.$reviewApi.updateSoftLockInReviewUsingPOST({
      "efileNo": sessionStorage["review_assignment_page"],
      "softLock": key
    })
    .then(resp => {
      if(resp.data.data == 1) {
        // console.log(`${key}-${resp.data.data}`)
      }else{
        let $case = '';
        switch(key){
          case 'Y':
            $case = '人員取件失敗';
            break;
          case 'N':
            $case = '案件釋放失敗';
            break;
        }
        if($case) {
          Modal.error({
            title: $case,
            okType: 'green',
            okText: "確定",
            icon: () =>
              this.h("a-icon", {
                props: {
                  type: "close-circle",
                  theme: "filled",
                },
              }),
            onOk: async () => {
              window.close();
            },
          });
        }
      }
    })
    .catch(() => {
      let $case = '';
      switch(key){
        case 'Y':
          $case = '人員取件失敗';
          break;
        case 'N':
          $case = '案件釋放失敗';
          break;
      }
      if($case) {
        Modal.error({
          title: $case,
          okType: 'green',
          okText: "確定",
          icon: () =>
            this.h("a-icon", {
              props: {
                type: "close-circle",
                theme: "filled",
              },
            }),
          onOk: async () => {
            window.close();
          },
        });
      }
    })
    .finally(() => {
      this.setLoading(false);
    })
  }

  async beforeDestroy() {
    // 在 beforeDestroy 鉤子移除beforeunload事件
    this.destroyedBeforeunloadHandler();
    await this.updateSoftLock('N');
  }

  // 添加beforeunload監聽事件
  createBeforeunloadHandler() {
    window.addEventListener("beforeunload", this.beforeunloadHandler, {
      capture: true,
    });
  }

  // 移除beforeunload事件
  destroyedBeforeunloadHandler() {
    console.log("destroyedBeforeunloadHandler");
    window.removeEventListener("beforeunload", this.beforeunloadHandler, {
      capture: true,
    });
    if(this.mergeWindowElement) {
      this.mergeWindowElement.close();
    }
  }

  // beforeunload監聽事件
  async beforeunloadHandler(e) {
    // Cancel the event
    e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    // Chrome requires returnValue to be set
    e.returnValue = "";
    await this.updateSoftLock('N');
    if(this.mergeWindowElement) {
      this.mergeWindowElement.close();
    }
  }

  showMergeAmlData(mergeAmlData) {
    this.mergeAmlData = mergeAmlData;
    // console.log("ReviewDetailPage", this.mergeAmlData);
  }

  extractMainAmlIdToLocalStorage() {
    this.mainAmlId = sessionStorage["review_assignment_page"];
    if (!this.mainAmlId) {
      Modal.error({
        title: "異常操作行為！",
        okText: "確定",
        onOk: () => {
          this.$router.replace({ name: "ReviewDetailError" });
        },
      });
      return;
    }
    let data = localStorage["review_assignment_page"];
    localStorage["review_assignment_page"] =
      `@${this.mainAmlId}` + (data ? data : "");
  }

  // 方法名稱加上Handler是代表在特定時機下會被其他方法觸發
  clearBrowserStorageHandler() {
    let data = localStorage["review_assignment_page"];
    localStorage["review_assignment_page"] = data.replaceAll(
      `@${this.mainAmlId}`,
      ""
    );
    sessionStorage.clear(); // 搭配重整畫面後觸發[異常操作行為]訊息
  }

  async onloadHandler() {
    //所有資源載入完後才打SoftLock =Y(避免打了案件鎖定api後，當其他api執行中關閉視窗的話會來不及發送解鎖案件api)
    await this.updateSoftLock('Y');
  }

  stopRefresh() {
    document.onkeydown = (e: any) => {
      var code = e.keyCode || e.which;
      if (code == 116) {
        // 禁止 F5 刷新
        if (e.preventDefault) {
          this.$notification.error({
            message: "禁止 F5 重新載入",
            description: "避免造成該案件資料異常!",
            duration: 2,
          });
          e.preventDefault();
        } else {
          e.keyCode = 0;
          e.returnValue = false;
        }
      } else if (e.ctrlKey && code == 82) {
        // 禁用 ctrl+R 刷新
        this.$notification.error({
          message: "禁止 ctrl+R 重新載入",
          description: "避免造成該案件資料異常!",
          duration: 2,
        });
        return false;
      }
    };
    // 禁止用右鍵重新載入
    document.oncontextmenu = (e: any) => {
      this.$notification.error({
        message: "禁止右鍵功能",
        description: "避免造成該案件資料異常!",
        duration: 2,
      });
      e.returnValue = false;
    };
  }

  tabCallback(tabKey) {
    let vm = this;
    let testControl = true;
    let _amlID = sessionStorage["review_assignment_page"];
    // let _amlID = 'VP110073000001';     // TEST:
    let isRenew = JSON.parse(sessionStorage["review_assignment_data"]).renew.code == "Y";
    let isCase5Or9OrA = JSON.parse(sessionStorage["review_assignment_data"]).custTypes.some((item) => item.code === '5' || item.code === '9' || item.code === "A");

    switch (tabKey) {
      // case "4":
      //   /* TODO: 點選此頁籤時，如有新版的【疑似洗錢或資恐交易態樣表】，需要於重新抓取最新版本內容併清空原已填寫內容，若案件已有審查人員，要出訊息提醒。

      //     打API 後 疑似洗錢或資恐交易態樣 版本號有變動，觸發彈窗並覆蓋資料
      //   */
      //   this.setLoading(true);
      //   this.$reviewApi.getReviewTransactionRecordInReviewUsingGET(_amlID).then((resp)=>{
      //     const verCode = resp.data.data.verCode; // 疑似洗錢或資恐交易態樣 版本號
      //     const data = resp.data.data;
      //     if (verCode !== this.verCode) {
      //         // 與之前儲存之版本號不同->跳更新提醒視窗
      //         if (this.verCode.length !== 0) {
      //           Modal.warning({
      //             title: vm.h(
      //               "p",
      //               {
      //                 attrs: { style: "font-size: 20px" },
      //               },
      //               "提醒"
      //             ),
      //             content: vm.h(
      //               'p',
      //               "本件之【疑似洗錢或資恐交易態樣表】內容已更新，請重新審視。"
      //             ),
      //             okType: "green",
      //             okText: "確定",
      //             icon: () =>
      //               vm.h("a-icon", {
      //                 props: {
      //                   type: "exclamation-circle",
      //                   theme: "filled",
      //                 },
      //                 style: { fontSize: "30px" },
      //               }),
      //           });
      //         }
      //         // 更新最新版號
      //         this.onStoreVerCode(verCode);
      //         // 拿取最新資料
      //         this.onUpdateDatas(data.amlReportData.map((el)=>{
      //             return  {
      //               "ansFlag": el.ansFlag.length > 0 ? el.ansFlag:undefined, //問項選擇是否符合
      //               "content": el.content, //內容
      //               "key": el.key, //版本內容順序
      //               "title": el.title //標題
      //             }
      //           })
      //         );
      //     }
      //   })
      //   .finally(() => {
      //     this.setLoading(false);
      //   })
      // break
      case "5":
        /* 交易件且案件類型為”5”或”9”或”A”，點選本頁籤時，
        出提示訊息，「請注意!需自行上傳電訪紀錄單」
        */
        if(!this.isConfirm && !isRenew && isCase5Or9OrA) {
          Modal.warning({
            title: vm.h(
              "p",
              { attrs: { style: "font-size: 20px" }, },
              "提醒"
            ),
            content: vm.h(
              'p',
              "請注意!需自行上傳電訪紀錄單"
            ),
            okType: "green",
            okText: "確定",
            icon: () =>
              vm.h("a-icon", {
                props: {
                  type: "exclamation-circle",
                  theme: "filled",
                },
                style: { fontSize: "30px" },
              }),
          });
        }
      break;
    }
  }

  // 顯示異動資料訊息
  hasChangeDataMessage() {
    this.setLoading(true);
    const amlID = sessionStorage["review_assignment_page"];
    // API:
    this.$reviewApi.getUpdatedInfoInReviewUsingGET(amlID)
    .then(resp => {
      const getData = resp.data.data;
      let updatedMsg: string[] = [];
      
      Object.keys(getData).map(item => {
        switch(item){
          case 'customerData':
            // F
            getData[item].map(ele => {
              function changeNull(str) {
                return (str == null || str == 'null')? '空值' : str;
              }
              updatedMsg.push(`「客戶資料」之「${ele.fieldName}」中[${ele.id}]由${changeNull(ele.dataBefore)}變${changeNull(ele.dataAfter)}`)
            })
            break;
          case 'transactionRecord':
            // H
            getData[item].map(ele => {
              updatedMsg.push(`「交易紀錄」之「${ele.fieldName}」有變動`)
            })
            break;
          case 'fnOccp':
            // R
            getData[item].map(ele => {
              updatedMsg.push(`「職業與財務狀況影像及系統資料」之「${ele.fieldName}」有變動`)
            })
            break;
          case 'imageData':
            // A 不顯示身份證號
            getData[item].map(ele => {
              function changeNull(str) {
                return (str == null || str == 'null')? '空值' : str;
              }
              updatedMsg.push(`「系統佐證影像資料」之「${ele.fieldName}」由${changeNull(ele.dataBefore)}變${changeNull(ele.dataAfter)}`)
            })
            break;
        }
      });
      if(updatedMsg.length > 0) {
        Modal.success({
          title: this.h('p', {
            attrs: { style: 'font-size: 20px'}
          }, '已異動資料如下：'),
          okType: 'green',
          okText: '確定',
          width: 600,
          icon: ()=>this.h('a-icon',{
            props: {
              type: 'check-circle',
              theme: 'filled'
            },
            style: {fontSize: '30px'}
          }),
          content: this.h('ul', {
            attrs: { class: 'list-with-border'}
          }, updatedMsg.map(x => this.h('li', x))) ,
        });
      }
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 取得頁籤_客戶資料
  async getCustomerData() {
    this.setCustomerDataPageLoading(true);
    const amlID = sessionStorage["review_assignment_page"];
    await this.$reviewApi
    .getCustomerDataInReviewUsingGET(amlID)
    .then(resp => {
      const respData = resp.data.data;
      this.updateDataAsync(respData);
    })
    .finally(() => {
      this.setCustomerDataPageLoading(false);
    })
  }

  // 取得頁籤_財務資料
  async getFinanceJobInfoData() {
    this.setFinanceJobinfoPageLoading(true);
    const amlID = sessionStorage["review_assignment_page"];
    await this.$reviewApi
    .getFnDataInReviewUsingGET(amlID)
    .then((resp)=>{
      // 更新VUEX
      this.fetchFinanceJobInfoInitDatas(resp.data.data);
    })
    .finally(() => {
      this.setFinanceJobinfoPageLoading(false);
    })
  }

  // 取得頁籤_疑似洗錢或資恐交易態樣
  async getSuspectLaunderingData() {
    this.setSupectPageLoading(true);
    const amlID = sessionStorage["review_assignment_page"];
    if(!this.isConfirm) {
      this.$reviewApi.getReviewTransactionRecordInReviewUsingGET(amlID)
      .then((resp)=>{
        const vm = this;
        const currVerCode = resp.data.data.currVerCode; // 疑似洗錢或資恐交易態樣 目前 版本號
        const newVerCode = resp.data.data.newVerCode; // 疑似洗錢或資恐交易態樣 新 版本號
        const data = resp.data.data;
        if(JSON.parse(sessionStorage['review_assignment_data']).fileStat !== '待審查') {
          if (currVerCode !== newVerCode) {
            Modal.warning({
              title: vm.h(
                "p",
                {
                  attrs: { style: "font-size: 20px" },
                },
                "提醒"
              ),
              content: vm.h(
                'p',
                "本件之【疑似洗錢或資恐交易態樣表】內容已更新，請重新審視。"
              ),
              okType: "green",
              okText: "確定",
              icon: () =>
                vm.h("a-icon", {
                  props: {
                    type: "exclamation-circle",
                    theme: "filled",
                  },
                  style: { fontSize: "30px" },
                }),
            });
          }
        }
        // 更新最新版號
        this.onStoreVerCode(newVerCode);
        // 拿取最新資料
        this.onUpdateDatas(data.amlReportData.map((el)=>{
            return  {
              "ansFlag": el.ansFlag ? el.ansFlag : undefined, //問項選擇是否符合
              "content": el.content, //內容
              "key": el.key, //版本內容順序
              "title": el.title //標題
            }
          })
        );
      })
      .finally(() => {
        this.setSupectPageLoading(false);
      })
    }else{
      this.$confirmApi.getConfirmTransactionRecordInConfirmUsingGET(amlID).then( resp => {
        const vm = this;
        const currVerCode = resp.data.data.currVerCode; // 疑似洗錢或資恐交易態樣 目前 版本號
        const newVerCode = resp.data.data.newVerCode; // 疑似洗錢或資恐交易態樣 新 版本號
        const data = resp.data.data;
        // if (currVerCode !== newVerCode) {
        //   Modal.warning({
        //     title: vm.h(
        //       "p",
        //       {
        //         attrs: { style: "font-size: 20px" },
        //       },
        //       "提醒"
        //     ),
        //     content: vm.h(
        //       'p',
        //       "本件之【疑似洗錢或資恐交易態樣表】內容已更新，請重新審視。"
        //     ),
        //     okType: "green",
        //     okText: "確定",
        //     icon: () =>
        //       vm.h("a-icon", {
        //         props: {
        //           type: "exclamation-circle",
        //           theme: "filled",
        //         },
        //         style: { fontSize: "30px" },
        //       }),
        //   });
        // }
        // 更新最新版號
        // this.onStoreVerCode(newVerCode);
        // 拿取最新資料
        this.onUpdateDatas(data.amlReportData.map((el)=>{
            return  {
              "ansFlag": el.ansFlag ? el.ansFlag : '', //問項選擇是否符合
              "content": el.content, //內容
              "key": el.key, //版本內容順序
              "title": el.title //標題
            }
          })
        );
      })
      .finally(() => {
        this.setSupectPageLoading(false);
      })
    }
  }

  // 取得 併案/多客戶資訊 物件 (另開的頁面)
  getMergeWindow(win) {
    this.mergeWindowElement = win;
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
  height: 100vh;
  flex-wrap: nowrap;
}
.userInfo {
  z-index: 100;
  background: #fff;
  padding: 10px 16px 3px;
}

.card-container {
  flex: 4;
  min-height: 200px;
  background: #fff;
  margin: 10px;
  display: flex;
  flex-direction: column;
  ::v-deep {
    .ant-tabs-bar {
      position: sticky !important;
      top: 0;
      z-index: 200;
      margin-bottom: 0;
    }
    > .ant-tabs-content {
      overflow-y: scroll;
      padding-top: 15px;
      min-height: calc(100% - 40px);
    }
  }
}

.review-bottom {
  background: #e6fffb;
  padding: 10px 16px;
  z-index: 1;
  // flex: 1;
}

::v-deep {
  .fbl-table {
    .ant-table-thead {
      line-height: 26px;
    }
  }
}
</style>
