<template>
  <div class="description-form" :class="themeColor">
    <a-row :key="item.key" v-for="item in initData">
    <a-row class="description-div">
      <ul class="description-ul">
        <!-- 身分證字號 -->
        <li class="description-li"><span>{{$t('global_idNumber')}}:</span><span>{{item.CUST_ID}}</span></li>
        <!-- 重複碼 -->
        <li class="description-li"><span>{{$t('policyMark_dupId')}}:</span><span>{{item.DUP_ID}}</span></li>
        <!-- 姓名 -->
        <li class="description-li"><span>{{$t('global_humanName')}}:</span><span>{{item.CUST_NAME}}</span></li>
        <!-- 名單類別 -->
        <li class="description-li"><span>{{$t('policyMark_listType')}}:</span><span>{{item.LIST_TYPE}}</span></li>
        <!-- 註記類別 (經需求拔除)-->
        <!-- <li v-if="name=='custMark'" class="description-li"><span>{{$t('policyMark_sysSource')}}:</span><span>{{item.SYS_SOURCE}}</span></li> -->
        <!-- 次層 -->
        <li class="description-li"><span>{{$t('policyMark_lv2')}}:</span><span>{{item.LVL2}}</span></li>
        <!-- 子層 -->
        <li class="description-li"><span>{{$t('policyMark_lv3')}}:</span><span>{{item.LVL3}}</span></li>
        <!-- 建置人員 -->
        <li class="description-li"><span>{{$t('policyMark_create_name')}}:</span><span>{{item.CREATE_NAME}}</span></li>
        <!-- 有效區間 -->
        <li class="description-li"><span>{{$t('policyMark_effDate')}}:</span><span>{{item.EFF_START_DATE}}~{{item.EFF_END_DATE}}</span></li>
      </ul>
    </a-row>
    <a-row class="policy-content d-flex" :gutter="15" justify="space-between">
      <a-col class="flex-column d-flex" :span="12">
        <!-- 住記內容 -->
        <div class="policy-mark-title">{{$t('policyMark_memo')}}</div>
        <div class="policy-mark-memo flex-1">{{item.MEMO}}</div>
      </a-col>
      <a-col class="flex-column d-flex" :span="12">
        <!-- 處理方式 -->
        <div class="policy-mark-title">{{$t('policyMark_action')}}</div>
        <div class="policy-mark-memo flex-1">{{item.ACTION}}</div>
      </a-col>
    </a-row>
    </a-row>
  </div>
</template>
<script src="./DescriptionsForm.ts" lang="ts"></script>
<style lang="less" scoped>
// 灰底
.description-div {
  background-color: #efefef;
  margin-top: 2px;
}
/deep/.ant-descriptions-item > .ant-descriptions-item-label {
  font-weight: bold;
}
/deep/.ant-descriptions-item-content {
  color: #096dd9;
}
.policy-mark-title {
  color: white;
  text-align: center;
  font-weight: 400;
  padding: 2px;
}
.policy-content {
  margin-top: 2px;
}
.description-ul {
  display: flex;
  padding-left: 0;
  flex-wrap: wrap;
  margin-bottom: 0px;
  padding: 5px 10px;
  list-style: none;
      line-height: 1.7;
}
// 客製化li前方小圓點、文字換行不跑版
.description-li {
  display: flex;
  width: 25%;
  color:black;
  span {
    &:nth-of-type(1) {
      color: #000;
      font-weight: 600;
      margin-right: 10px;
      word-break: keep-all;
    }
  }
  &::before {
    content: "●";
    color: var(--theme-color);
    font-size: 18px;
    margin-right: 5px;
    line-height: 1;
  }
}
.policy-mark-memo{
  border: #e4e4e2 2px solid;
  letter-spacing: 2px;
  padding: 10px;
}
.description-form{
  padding-bottom: 10px;
}
.theme1{
  --theme-color:@theme1;
  .policy-mark-title{
    background-color: var(--theme-color);
    .text-white-format();
  }
}
.theme2{
  --theme-color:@theme2;
  .policy-mark-title{
    background-color: var(--theme-color);
    .text-white-format();
  }
}
// .theme4{
//   background-color: @theme4;
//   .text-white-format();
// }
</style>