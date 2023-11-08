<template>
    <div class="block-header" :class="themeColor" name="blockHeader">
        <!-- 區塊標題 -->
        <div :class="(!showTipIcon)? 'block-title':'block-title titleTip'">{{ blockTitle }}</div>
        <!-- 標題後方提示訊息 -->
         <p v-if='isHeaderTextShow' :style="headerTextStyle">{{ headerText }}</p>
        <!-- 頁籤選單 -->
        <div class="tabBar" v-if="tabsArray">
            <a-tabs :default-active-key="defaultTabKey"  :activeKey="$props.tabKey" @change="handleChange">
                <a-tab-pane  
                    :key="item.key"  
                    v-for="item in tabsArray" 
                    :tab="item.label"
                    
                />
            </a-tabs>
        </div>
        <!-- 提示訊息 -->
        <div class="tipMsg" v-if="tipMessage != ''" v-html="tipMessage"></div>

        <!-- 置右的區塊 -->
        <div class="d-flex ml-auto">
            <div class="right-item" v-if="countNum">
                <p>總筆數：</p> 
                <p class="txt--num">{{countNum}}</p> 
            </div>
            <div class="right-item" v-if="displayAll && countNum">
                <p class="txt--displayAll">顯示全部</p>
                <i
                    class="odp-icon odp-icon__displayAll"
                    @click="openAll($event, blockName)"
                />
            </div>
            <div class="right-item" v-if="collapse">
                <p ref="collapse" class="txt--collapse" @click="collapseChange($event)">
                    {{collapseMsg}}<i class="arrow up"></i>
                </p>
            </div>
        </div>
    </div>
</template>

<script src="./BlockHeader.ts" lang="ts"></script>

<style lang="less" scoped>
/deep/ .ant-tabs-nav,
/deep/ .ant-tabs-tab {
    padding: 3px 16px;
}

.arrow {
  border: solid #0099CC;
  border-width: 0 1px 1px 0;
  display: inline-block;
  padding: 3px;
  margin-left: 7px;
}
.up {
  transform: rotate(-135deg);
}
.down {
  transform: rotate(45deg);
  margin-bottom: 3px;
}
.odp-icon{
    cursor: pointer;
}

/* 標題提示icon */
.titleTip::after {
  content: "★";
  color: #FAAD14;
  font-size: 20px;
  margin-left: 2px;
  position: absolute;
  top: -1px;
  text-shadow: 0 0 5px currentColor;
}

// .ant-tabs-content {
//     display: none;
// }

</style>