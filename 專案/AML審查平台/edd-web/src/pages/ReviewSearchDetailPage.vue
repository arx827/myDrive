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
      <!-- 只有保服有，先隱藏 -->
      <!-- <a-tab-pane key="7" tab="態樣來源">
        <DataSource />
      </a-tab-pane> -->
    </a-tabs>
    <div class="review-bottom">
      <ReviewSearchBottom
        :mergeAmlData="mergeAmlData"
        @close="destroyedBeforeunloadHandler"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Watch} from "vue-property-decorator";
import UserInfoTable from "@/components/shared/review-search/UserInfoTable.vue";
import ReviewSearchBottom from "@/components/shared/review-search/ReviewSearchBottom.vue";
import CustomerDataPage from "@/components/shared/review-search/CustomerDataPage.vue";
import TransactionRecordPage from "@/pages/TransactionRecordPage.vue";
import FinancialAndJobInfoPage from "@/components/shared/review-search/FinancialAndJobInfo.vue";
import SuspectLaunderingPage from "@/components/shared/review-search/SuspectLaunderingPage.vue";
import EvidenceData from "@/components/shared/review-search/EvidenceData.vue";
import ReviewHistory from "@/components/shared/review-search/ReviewHistory.vue";
import DataSource from "@/components/shared/review-search/DataSource.vue";
import { Modal } from "ant-design-vue";
import Global from "@/plugins/global";
import {
  Getter,
  Action,
  State,
  namespace } from 'vuex-class';
import { uuid } from "vue-uuid";

const CustomerData = namespace('CustomerData');
const SuspectLaundering = namespace('SuspectLaundering');
const FinanceJobInfo = namespace('FinanceJobInfo');

@Component({
  components: {
    UserInfoTable,
    ReviewSearchBottom,
    CustomerDataPage,
    TransactionRecordPage,
    FinancialAndJobInfoPage,
    SuspectLaunderingPage,
    EvidenceData,
    ReviewHistory,
    DataSource,
  },
})
export default class ReviewSearchDetailPage extends Vue {
  mergeAmlData = ['test'];
  mainAmlId: string;

  @Action public setLoading: (payload: boolean) => void;
  h = this.$createElement;

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

/**
 * Hook
 */
  created(){
    this.createBeforeunloadHandler();
    // 從本視窗專屬的 sessionStorage 得知審查檔號後，拋到 localStorage 來讓母視窗監聽器知悉
    this.extractMainAmlIdToLocalStorage();
    // 關閉/重整畫面時，清除 localStorage&sessionStorage
    onunload = this.clearBrowserStorageHandler;
  }
  mounted() {
    Global.timeOut(30, this.beforeunloadHandler);//分
    this.getCustomerData();
    this.getFinanceJobInfoData();
    this.getSuspectLaunderingData();
  }


/**
 * Func
 */
  beforeDestroy() {
    // 在 beforeDestroy 鉤子移除beforeunload事件
    this.destroyedBeforeunloadHandler();
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
    localStorage["review_search_page"] = uuid.v4(); //讓每次取件時觸發localStorage，清掉母視窗的sessionStorage
  }

  // // 方法名稱加上Handler是代表在特定時機下會被其他方法觸發
  clearBrowserStorageHandler() {
    sessionStorage.clear(); // 搭配重整畫面後觸發[異常操作行為]訊息
  }


  // 取得頁籤_客戶資料
  async getCustomerData(){
    this.setCustomerDataPageLoading(true);
    const amlID = sessionStorage["review_assignment_page"];
    await this.$searchAMLReviewDataApi
    .getCustomerDataInSearchUsingGET(amlID)
    .then(resp => {
      const respData = resp.data.data;
      this.updateDataAsync(respData);
    })
    .finally(() => {
      this.setCustomerDataPageLoading(false);
    })
  }

    // 取得頁籤_財務資料
  async getFinanceJobInfoData(){
    this.setFinanceJobinfoPageLoading(true);
    const amlID = sessionStorage["review_assignment_page"];
    await this.$searchAMLReviewDataApi
    .getFnDataInSearchUsingGET(amlID)
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
    this.$searchAMLReviewDataApi.getSearchTransactionRecordInSearchUsingGET(amlID).then( resp => {
        const vm = this;
        const currVerCode = resp.data.data.currVerCode; // 疑似洗錢或資恐交易態樣 目前 版本號
        const newVerCode = resp.data.data.newVerCode; // 疑似洗錢或資恐交易態樣 新 版本號
        const data = resp.data.data;
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
