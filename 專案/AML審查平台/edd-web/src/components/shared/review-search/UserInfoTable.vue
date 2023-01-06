<template>
  <div>
    <a-row type="flex" align="middle">
      <a-col :span="12">
        <div class="title">AML審查查詢</div>
      </a-col>
      <a-col :span="12">
        <div class="updateDate" v-if="data[0]">
          更新時間: <span>{{ data[0].updDate }}</span>
        </div>
      </a-col>
    </a-row>
    <div
      class="collapse__box"
      :class="{ 'collapse__box-show': isShowCollapseInfo }"
    >
      <div @click="onCollapseTitle">
        <a-row class="collapse__tittle-group" type="flex" align="middle">
          <a-icon
            class="collapse__icon"
            :type="isShowCollapseInfo ? 'minus-square' : 'plus-square'"
            theme="twoTone"
            two-tone-color="#0090FF"
          />
          <a-col class="collapse__tittle">
            <span v-if="data[0]">{{ `AML審查檔號: ${data[0].efileNo}` }}</span>
            <a
              class="collapse__tittle-multiple-link"
              v-if="mergeCaseTxt != ''"
              @click.stop="openMergeCasePage()"
              >{{ mergeCaseTxt }}</a
            >
          </a-col>
        </a-row>
      </div>

      <div class="collapse__info" v-show="isShowCollapseInfo">
        <a-row type="flex" :gutter="[5, 10]" v-if="data[0]">
          <a-col :span="4">要保人姓名 : {{ data[0].applFname }}</a-col>
          <a-col :span="5">要保人ID : {{ data[0].applId }}</a-col>
          <a-col :span="5">被保險人姓名 : {{ data[0].insName }}</a-col>
          <a-col :span="5">被保險人ID : {{ data[0].insId }}</a-col>
          <a-col :span="4"></a-col>
          <a-col :span="4">系統別 : {{ data[0].sysType.code }}</a-col>
          <a-col :span="5"
            >保單號碼 : {{ data[0].policyNo + "-" + getPolicySeq(data[0].policySeq) }}</a-col
          >
          <a-col :span="5">交易案號 : {{ data[0].caseNo }}</a-col>
          <a-col :span="5">作業別 : {{ `${data[0].operType.code} ${data[0].operType.description}` }}</a-col>
          <a-col :span="5">來源 : {{ data[0].renew.description }}</a-col>
          <a-col :span="4"
            >客戶姓名 : {{ data[0].customer[0].chiName }}
            <span v-if="data[0].customer.length > 1"> 等</span></a-col
          >
          <a-col :span="5"
            >客戶ID : {{ data[0].customer[0].custId }}
            <span v-if="data[0].customer.length > 1"> 等</span>
          </a-col>
          <a-col :span="5"
            >保單角色 : {{ data[0].customer[0].roleId }}</a-col
          >
          <a-col :span="5"
            >出生日期 : {{ data[0].customer[0].birthDt }}</a-col
          >
          <a-col :span="4">國籍 : {{ data[0].customer[0].nation }}</a-col>
        </a-row>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Getter } from 'vuex-class';
import Global from "@/plugins/global";
@Component
export default class UserInfoTable extends Vue {
  public mergeCaseWindowCheck: any = null;

  data = [];
  isShowCollapseModal: boolean = false;
  isShowCollapseInfo: boolean = true;         // NOTE: 初始化預設為 展開
  mergeCaseTxt = '';


/**
 * Func
 */
  // 判斷是否為 併案/多客戶
  setMergeCaseTxt() {
    if(this.data.length > 1 || Object.keys(this.data[0].customer).length > 1){
      this.mergeCaseTxt = "併案/多客戶資訊";
    }else{
      this.mergeCaseTxt = "";
    }
  }
  getPolicySeq(num) {
    return Global.padLeftZero(num, 2);
  }


/**
 * Event
 */
  // 基本資料區 - 收合控制器
  onCollapseTitle() {
    this.isShowCollapseInfo = !this.isShowCollapseInfo;
  }
  // 開啟 併案/多客戶 詳細資料
  openMergeCasePage() {
    if (!this.mergeCaseWindowCheck || this.mergeCaseWindowCheck.closed) {
      this.mergeCaseWindowCheck = window.open(
        this.$router.resolve({ name: "MergeCaseDetailPage" }).href
      );
      this.$emit('getMergeWindowElement', this.mergeCaseWindowCheck);
    } else {
      this.mergeCaseWindowCheck.focus();
    }
  }


/**
 * Hook
 */
  async created() {
    let amlId = sessionStorage["review_assignment_page"];
    // TEST:
    // let amlId = 'VP110073000030';
    await this.$searchAMLReviewDataApi.getCustomerBasicDataMainInSearchUsingGET(amlId, 'detail')
    .then(resp => {
      if(resp.data.success === true) {
        let getData = resp.data.data;
        this.data = getData;
      }
    })
    
    this.setMergeCaseTxt();
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 18px;
  color: #227fa8;
}
.table-row {
  background-color: #e6f7ff;
}

.collapse__box {
  font-size: 16px;
  color: #555;
}
.collapse__tittle-group {
  margin-top: 2px;
  padding: 5px 12px;
  border-bottom: 0;
  cursor: pointer;
  &:hover {
    background: #e6f7ff;
  }
  .collapse__box-show & {
    border-bottom: 1px solid #e8e8e8;
  }
  + .collapse__tittle-group {
    border-top: 1px solid #e8e8e8;
  }  
}
.collapse__icon {
  font-size: 22px !important;
}
.collapse__tittle {
  margin-left: 15px;
}
.collapse__tittle-multiple-link {
  text-decoration: underline;
  margin-left: 25px;
}
.collapse__info {
  padding: 10px 0px 10px 48px;
  line-height: 1.3;
}

.updateDate {
  text-align: right;
  color: #227fa8;
  span + span {
    margin-left: 15px;
  }
}
</style>
