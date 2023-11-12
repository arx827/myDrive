<template>
    <div>
        <div class="fbl-table">
            <FblDataGrid
                :rowKey="grid.rowKey"
                :columns="grid.columns"
                :data="grid.data"
                :pagination="false"
                :scroll="grid.scroll"
                size="middle"
                @handleEllipsisClick="handleEllipsisClick"
                @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
            >
                <template v-slot:notiOrInfInfoIdTemplate="slotProps">
                    <a href="javascript:void(0)" @click="notiOrInfInfoIdClick(slotProps.data)">{{slotProps.data.notiOrInfInfoId}}</a>
                </template>
                <template v-slot:casePolicyTemplate="slotProps">
                    <a href="javascript:void(0)" @click="casePolicyClick(slotProps.data)">{{slotProps.data.casePolicy}}</a>
                </template>
            </FblDataGrid>
        </div>
        <!-- 會辦單表單 -->
        <DragModal
            class="c-section c-section--else pointer-events-none"
            :visible="isInfFormVisible"
            title="會辦單"
            width="85%"
            :visibleFooter="false"
            :closable="true"
            :isMasked="false"
            :removeCancelButton="true"
            :okText="$t('onDutyPage_close')"
            @ok="onCloseModal('isInfFormVisible')"
            @cancel="onCloseModal('isInfFormVisible')"
        >
            <CountersignatureModal
                :step="infFormData.infStep"
                :propCaseNo="infFormData.caseNo"
                :propInfInfoId="infFormData.infInfoId"
                :isShowReviewButton="false"
                :propPackNo="infFormData.packNo"
                :caseType="infFormData.caseType"
                :isNotCloseNotify="true"
                @onLeave="onCloseModal('isInfFormVisible')"
            />
        </DragModal>
        <!-- 照會單表單 -->
        <DragModal
            class="c-section c-section--else pointer-events-none"
            :visible="isNotiFormVisible"
            title="照會單"
            width="85%"
            :visibleFooter="false"
            :closable="true"
            :isMasked="false"
            :removeCancelButton="true"
            :okText="$t('onDutyPage_close')"
            @ok="onCloseModal('isNotiFormVisible')"
            @cancel="onCloseModal('isNotiFormVisible')"
        >
            <NotificationModal
                :step="notiFormDate.notiStep"
                :propCaseNo="notiFormDate.caseNo"
                :propNotiInfoId="notiFormDate.notiInfoId"
                :reOpen="true"
                :isShowReviewButton="false"
                :propPackNo="notiFormDate.packNo"
                :caseLogId="notiFormDate.caseLogId"
                :isNotCloseNotify="true"
                @onLeave="onCloseModal('isNotiFormVisible')"
            />
        </DragModal>
    </div>
</template>
<script src="./NotiInfNotCloseRemind.ts" lang="ts"></script>