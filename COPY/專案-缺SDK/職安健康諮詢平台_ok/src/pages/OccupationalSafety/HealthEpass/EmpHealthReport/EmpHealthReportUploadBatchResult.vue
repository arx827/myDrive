<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? '檢核上傳成功':'檢核上傳失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          親愛的護理同仁您好，
          <br>
          您的檔案已上傳成功，資料建立結果待後續 mail 通知，謝謝。
        </div>
        <div v-else>
          <div>
            親愛的護理同仁您好，
            <br>
            您的檔案上傳失敗，請確認檔案格式，再次嘗試上傳，謝謝。
          </div>
        </div>
        <!-- <div v-if="result === 'fail' && errDataList">
          親愛的護理同仁您好，<br>
          您欲上傳的檔案資料有{{ errDataList.length }}筆錯誤
          <span class="font-gray">，請將所有錯誤項目更正後，再次嘗試上傳，謝謝您！</span>
        </div> -->
        <!-- <div v-if="checkHasMsg(errDataList)">
          <a-divider dashed />
          <p
            class="table__title"
            :style="{color: result === 'success' ? '#23C4A8' : '#CB5B4D'}"
          >
            檢核{{ result === 'success' ? '重複':'錯誤' }}內容
          </p>
          <div>
            <div class="table__header">
              <span class="table__header__cell">筆數編號</span>
              <span class="table__header__cell">項目</span>
              <span class="table__header__cell">描述</span>
            </div>
            <div class="table__body">
              <div
                v-for="(item, index) in errDataList"
                :key="index"
                class="table__body__row"
              >
                <div
                  class="table__cell-fixed"
                  :style="{color: result === 'success' ? '#23C4A8' : '#CB5B4D'}"
                >
                  {{ autoAddComdify(item.index) }}
                </div>
                <div class="table__cell-detail">
                  <div
                    :class="(item.length > 1) ?'cell_border':null "
                    class="table__cell-inner"
                  >
                    <p>{{ item.itemName }}</p>
                    <p>{{ item.errorDesc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> -->
      </template>
      <template v-slot:buttons>
        <router-link to="/occupationSafety/HealthCheck/empHealthReport/list">
          <a
            class="btn__radius--primary"
            href="#"
          >返回資料維護</a>
        </router-link>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

interface errDetail {
  category: string;
  description: string;
}

interface errDataList {
  countNo: string;
  detail: Array<errDetail>;
}

@Component({ components: { Result } })
export default class EmpHealthReportUploadBatchResult extends Vue {
  result: 'success' | 'fail' = null;

  // 錯誤訊息
  msg = '';

  // 筆數
  count = '';

  errDataList: errDataList[] = null;

  created() {
  	if (this.$global.getParam() === null) {
  		this.$router.push({ path: '/' }).catch((err) => { err; });
  		return;
  	}
  	const query = this.$global.getQuery();
  	this.result = query.result;
  	if (this.result === 'success') {
  		this.count = query.data[0].count;
  		this.errDataList = query.data;
  	} else if (this.result === 'fail') {
  		if (query.reason === 'check') {
  			this.errDataList = query.data;
  		} else {
  			this.msg = query.message.join('、');
  		}
  	}
  }

  // 轉千分位
  autoAddComdify(val) {
  	if (!val) return val;
  	const rgx = /(\d)(?=(?:\d{3})+$)/g;
  	const c = val.toString().replace(rgx, '$1,');
  	return c;
  }

  updated() {
  	window.parseWord();
  }

  checkHasMsg(arr) {
  	return arr.some((el) => el.errorDesc !== null);
  }
}
</script>

<style lang="scss" scoped>
.table__title{
  // color: #CB5B4D;
  font-size: 18px;
  font-weight: bold;

}
  .table__header{
    display:flex;
    padding: 11px 34px;
    background-color: #F5F8FC;
    font-weight: bold;
    .table__header__cell:nth-child(1){
      width: 18.5%;
    }
    .table__header__cell:nth-child(2){
      width: 25.8%;
    }
    .table__header__cell:nth-child(3){
      width: 55%;
    }
  }
  .table__body p{
    margin: 0px;
  }
  .table__body__row{
    padding-left: 34px;
    display: flex;
    border-bottom: 1px solid #00000017;
  }
  .table__cell-fixed{
     width: 17.5%;
     padding: 11px 0px;
    //  color: #CB5B4D;
  }
  .table__cell-inner{
    padding: 11px 0px;
    display: flex;
    width: 100%;
    p:nth-child(1){
      width: 30%;
    }
    p:nth-child(2){
      padding-right: 34px;
    }
  }
  .cell_border{
    border-bottom: 1px solid #00000017;
  }
  .table__cell-detail{
    width: 82%;
    display: flex;
    flex-direction: column;
    .table__cell-inner:nth-last-child(1){
      border-bottom:none;
    }
  }
  .font-gray{
    color: #363636;
  }

</style>
