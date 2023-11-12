<template>
    <div style="margin-left:20px;">
        <!-- 親愛的 XXX 同仁您好: -->
        <h1>{{$t('infReplySearch_title_1')}}&nbsp;<b class="username_span">{{username}}</b>&nbsp;{{$t('infReplySearch_title_2')}}</h1>
        <!-- 待處理案件共 X 筆 -->
        <h1>{{$t('infReplySearch_title_3')}}&nbsp;<b class="infInfoCount_span">{{infInfoCount}}</b> &nbsp;{{$t('infReplySearch_title_4')}}</h1>

        <div class="fbl-table">
            <FblDataGrid
                :rowKey="infReplyPageGrid.rowKey"
                :columns="infReplyPageGrid.columns"
                :data="infReplyPageGrid.data"
                :pagination="infReplyPageGrid.pagination"
                :scroll="infReplyPageGrid.scroll"
                size="middle"
                @tableChange="onPageChange($event)"
                @handleEllipsisClick="handleEllipsisClick"
                @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
                ref="CaseSearchGrid"
            >
                <!-- 點擊會辦單號 -->
                <template v-slot:alink_infInfoId_Template="slotProps">
                    <a @click="clickInfInfoId(slotProps.data)">{{slotProps.data.infInfoId}}</a>
                </template>

            </FblDataGrid>

        </div>
        
        <!-- 會辦回覆 modal -->
        <a-modal
            v-model="isCountersignatureFormVisible"
            :title="$t('infReplySearch_modal_infInfo_title')"
            width="70%"
            :closable="true"
            :maskClosable="false"
            :keyboard="false"
            :footer="null"
            :destroyOnClose="true"
            @cancel="getQueryReplyInform()"
        >
            <CuntersignatureModal
                :step="cuntersignatureData.infStep"
                :propCaseNo="cuntersignatureData.caseNo"
                :propInfInfoId="cuntersignatureData.infInfoId"
                :propInfTypeId="cuntersignatureData.infTypeId"
                @onLeave="onCloseModal('isCountersignatureFormVisible');getQueryReplyInform()"
            />
        </a-modal>
    </div>
</template>

<script src="./InfReplySearch.ts" lang="ts"></script>

<style lang="less" scoped>

// 登入者 字體顏色
.username_span{
    color: @COLOR-MAIN4;
}
.infInfoCount_span{
    color: @COLOR-MAIN4;
}

.fbl-table {
    padding-left: 24px;
    padding-right: 12px;
    margin: 10px 0;
}
</style>


