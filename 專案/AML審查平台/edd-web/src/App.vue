<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Modal } from "ant-design-vue";
import ConfigProvider from "ant-design-vue/lib/config-provider";
import zhTW from "ant-design-vue/es/locale/zh_TW.js";
import locale from "ant-design-vue/es/date-picker/locale/zh_TW";
Vue.component(ConfigProvider.name, ConfigProvider);

@Component
export default class App extends Vue {
  locale: locale = zhTW;
  mounted() {
    this.locale.Pagination.items_per_page = "筆/頁";
    
    // TEST: // 若有已取件資料異動，於審查人員第一次進入時彈跳提醒訊息提醒。 確定後即不再彈
    // API: 打API 取得是否有已取資料異動，若要區分異動檔號，到時再改 is_modal_showed_xxxxxx : showed
    // NOTE: Modal 裡的 content 斷行解法為 script lang 改為 tsx, content 改為 jsx 寫法，變數寫法<p>測試{s}</p>
    // let showModal :boolean = true;
    // let txts :string[] = [
    //   '「客戶資料」之「1.審查原因」中「風險評級」由中變高風險。',
    //   '「客戶資料」之「1.審查原因」中「疑似洗錢或資恐交易態樣」增加「名單確認」選項。',
    //   '「客戶資料」之「4.名單比對結果」增加「國內PEP」。',
    //   '「交易紀錄」之「7.本次審查客戶各項主要交易紀錄如下：(2)一年內有借∕還款紀錄如下表」中增加一筆借款紀錄。',
    //   '請確認審查結果是否要調整！',
    // ]
    // if(showModal && sessionStorage["is_modal_showed"] != 'showed') {
    //   Modal.warning({
    //     title: "以下區塊之資料已異動",
    //     content: (<div>
    //         <p>「客戶資料」之「1.審查原因」中「風險評級」由中變高風險。</p>
    //         <p>「客戶資料」之「1.審查原因」中「疑似洗錢或資恐交易態樣」增加「名單確認」選項。</p>
    //         <p>「客戶資料」之「4.名單比對結果」增加「國內PEP」。</p>
    //         <p>「交易紀錄」之「7.本次審查客戶各項主要交易紀錄如下：(2)一年內有借∕還款紀錄如下表」中增加一筆借款紀錄。</p>
    //         <p>請確認審查結果是否要調整！</p>
    //       </div>),
    //     okText: "確定",
    //     onOk: () => {
    //       sessionStorage["is_modal_showed"] = 'showed';
    //     },
    //   });
    // }
  }
  @Watch('$route', {immediate: true, deep: true})
  watchRoute(newVal){
    document.title = 'AML審查作業平台';
    if(newVal.meta.title){
      document.title += `_${newVal.meta.title}`
    }

    // detail頁才需考慮是否加審查檔號
    if(new RegExp('detail',"ig").test(newVal.path)){
      if(sessionStorage.getItem('review_assignment_page')){
        document.title += `-@${sessionStorage.getItem('review_assignment_page')}`;
      }
    }
  }
}
</script>

<style lang="less">
@import "./assets/font/font.css";

#app {
  font-family: Noto_Sans_TC, Helvetica, Arial, sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  letter-spacing: 0.8px !important;
}

.ant-input,
.ant-select-selection {
  border: 1px solid #227fa8;
}

.ant-divider-horizontal {
  margin: 16px 0;
}

.fbl-table {
  margin-bottom: 24px;
  .ant-table-thead {
    background: #13c2c2;
    line-height: 42px;
    tr {
      th .ant-table-column-sorter .ant-table-column-sorter-inner {
        color: white;
      }
      th
        .ant-table-column-sorter
        .ant-table-column-sorter-inner
        .ant-table-column-sorter-down.on {
        color: #1a8c8c;
      }
      th
        .ant-table-column-sorter
        .ant-table-column-sorter-inner
        .ant-table-column-sorter-up.on {
        color: #1a8c8c;
      }
    }
  }

  .ant-table-column-title {
    color: white;
    font-size: 16px;
  }

  .ant-table-small {
    .ant-table-content {
      .ant-table-body {
        margin: 0px;
        .ant-table-tbody {
          tr {
            height: 50px;
          }
        }
      }
    }
  }
}
label {
  font-size: 16px !important;
}
// .card--title{
//   // background: white;
//   // padding: 24px;
//   // border-radius: 2px;

//   .ant-form-item {
//     margin-bottom: 18px;
//   }
// }
</style>
