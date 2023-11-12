<template>
<div>
    <!--常見問題選單-->
    <div class="menu">
        <a-menu
            :inlineIndent="15"
            id="commonQUestionId"
            style="width: 250px"
            mode="inline"
            :openKeys="openKeys"
            @openChange="onOpenChange"
            @click="itemClick($event)"
        >
            <a-sub-menu v-for="itParent in commonData" :key="itParent.missionType">
                <span slot="title">
                    <span>{{itParent.missionTypeDesc}}</span>
                </span>
                <a-menu-item v-for="itChild in itParent.commonQuestionChildDto" :key="itParent.missionType+':'+itChild.questionType">
                    <span>{{itChild.questionTypeDesc}}</span>
                </a-menu-item>
            </a-sub-menu>
        </a-menu>
    </div>
    <!--常見問題顯示內容-->
    <div class="content">
        <a-row>
            <a-col :span="8" :xl="7" :xxl="18" style="padding: 5px 5px 5px 0px">
                <a-input type="text" v-model="queryText" :maxLength="50" @keyup.enter="queryClick('query')"></a-input>
            </a-col> 
            <a-col :span="8" :xl="7" :xxl="6" style="padding: 5px 5px 0px 0px">
                <a-button type="primary" @click="queryClick('query')"> 查詢 </a-button>
            </a-col>
        </a-row>
        <a-collapse v-model="activeKey" @change="handleCollapseChange()">
            <a-collapse-panel v-for="commonContent in commonContentData" :key="commonContent.questionID" :header="commonContent.questionContent" :show-arrow="commonContent.questionAnswer !=''" >
                <p v-html="commonContent.questionAnswer"></p>
            </a-collapse-panel>
        </a-collapse>
    </div>
</div>
</template>
<script src="./CommonQuestionForm.ts" lang="ts"></script>

<style lang="less" scoped>
.menu {
     display: inline-block;
     width: 260px;
     height: 350px;
     overflow-y: auto;
 }
 .content {
     display: inline-block;
     vertical-align: top;
     width: 500px;
     height: 350px;
     overflow-y: auto;
 }
 </style>

