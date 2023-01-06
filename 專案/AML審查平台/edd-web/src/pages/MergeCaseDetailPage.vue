<template>
  <div class="userInfo">
    <a-row type="flex" align="middle">
      <a-col :span="12">
        <div class="title" v-if="!isConfirm">AML審查案件作業 > 待審查 > 併件/多客戶資訊</div>
        <div class="title" v-else>AML審查案件作業 > 待覆核 > 併件/多客戶資訊</div>
      </a-col>
      <a-col :span="12">
        <div class="updateDate" v-if="data[0]">
          更新時間: <span>{{ data[0].updDate }}</span>
        </div>
      </a-col>
    </a-row>
    <div class="collapse__box" v-if="this.collapseModalData.length > 0">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="modal__collapse__body"
        :class="{ 'collapse__box-show': collapseModalData[index].isShow }"
      >
        <div @click="onModalCollapseTitle(index)">
          <a-row class="collapse__tittle-group" type="flex" align="middle">
            <a-icon
              class="collapse__icon"
              :type="
                collapseModalData[index].isShow ? 'minus-square' : 'plus-square'
              "
              theme="twoTone"
              two-tone-color="#0090FF"
            />
            <a-col class="collapse__tittle">
              <span>{{ `AML審查檔號: ${item.efileNo}` }}</span>
            </a-col>
          </a-row>
        </div>
        <div
          class="collapse__info"
          :style="{
            display: collapseModalData[index].isShow ? 'block' : 'none',
          }"
        >
          <a-row type="flex" :gutter="[0, 10]">
            <a-col :span="5">要保人姓名 : {{ item.applFname }}</a-col>
            <a-col :span="5">要保人ID : {{ item.applId }}</a-col>
            <a-col :span="5">被保險人姓名 : {{ item.insName }}</a-col>
            <a-col :span="5">被保險人ID : {{ item.insId }}</a-col>
            <a-col :span="4"></a-col>
            <a-col :span="5">系統別 : {{ item.sysType.code }}</a-col>
            <a-col :span="5"
              >保單號碼 : {{ item.policyNo + "-" + item.policySeq }}</a-col
            >
            <a-col :span="5">交易案號 : {{ item.caseNo }}</a-col>
            <a-col :span="5">作業別 : {{ `${item.operType.code} ${item.operType.description}` }}</a-col>
            <a-col :span="4">來源 : {{ item.renew.description }}</a-col>
          </a-row>
          <a-row
            type="flex"
            :gutter="[0, 5]"
            v-for="(item, index) in item.customer"
            :key="index"
            :class="{
              rowMarginTop: index == 0,
            }"
          >
            <a-col :span="5">客戶姓名 : {{ item.chiName }}</a-col>
            <a-col :span="5">客戶ID : {{ item.custId }}</a-col>
            <a-col :span="5">保單角色 : {{ item.roleId }}</a-col>
            <a-col :span="5">出生日期 : {{ item.birthDt }}</a-col>
            <a-col :span="4">國籍 : {{ item.nation }}</a-col>
          </a-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Getter } from 'vuex-class';
@Component
export default class MergeCaseDetailPage extends Vue {
  @Getter public isConfirm: boolean;

  data = [];
  collapseModalData :{amlId: string, isShow: boolean,}[] = [];


/**
 * Func
 */
  // 創建控制器
  createCollapseModalData() {
    this.collapseModalData = this.data.map((item) => {
      return {
        amlId: item.efileNo,
        isShow: true,
      }
    });
  }


/**
 * Event
 */
  onModalCollapseTitle(key: string) {
    this.collapseModalData[key].isShow = !this.collapseModalData[key].isShow;
  }


/**
 * Hook
 */
  async created() {
    let amlId = sessionStorage["review_assignment_page"];
    // TEST: 併案／多客戶資料測試
    // let amlId = 'VP110073000030';
    if(!this.isConfirm){
      // 待審查
      await this.$reviewApi
      .getCustomerBasicDataMainInReviewUsingGET(amlId, 'detail')
      .then(resp => {
        if(resp.data.success === true) {
          let getData = resp.data.data;
          this.data = getData;
        }
      })
    }else{
      // 待覆核
      await this.$confirmApi
      .getCustomerBasicDataMainInConfirmUsingGET(amlId, 'detail')
      .then(resp => {
        if(resp.data.success === true) {
          let getData = resp.data.data;
          this.data = getData;
        }
      })
    }
    this.createCollapseModalData();
  }
}
</script>

<style lang="scss" scoped>
.userInfo {
  background: #fff;
  padding: 30px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  flex-wrap: nowrap;
}

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
  margin-top: 16px;
}
.collapse__tittle-group {
  padding: 24px;
  border-bottom: 0;
  cursor: pointer;
  &:hover {
    background: #e6f7ff;
  }
  .collapse__box-show & {
    border-bottom: 1px solid #e8e8e8;
  }
}
.collapse__icon {
  font-size: 22px !important;
}
.collapse__tittle {
  margin-left: 25px;
}
.collapse__info {
  padding: 15px 15px 15px 55px;
  border-bottom: 1px solid #e8e8e8;
  background: #eeeeee;
}

.rowMarginTop {
  margin-top: 20px !important;
}
.modal__collapse__body {
  & + & {
    border-top: 1px solid #e8e8e8;
  }
}

.updateDate {
  text-align: right;
  color: #227fa8;
  span + span {
    margin-left: 15px;
  }
}
</style>
