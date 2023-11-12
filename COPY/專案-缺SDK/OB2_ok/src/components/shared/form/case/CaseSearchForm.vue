<template>
    <div>
        <div class="d-flex">
            <button
                class="header-button"
                @click="handleExport"
            >
                匯出
            </button>
        </div>
        <div class="result__table">
            <FblDataGrid
                :themeColor="'theme2'"
                :rowKey="grid.rowKey"
                :columns="grid.columns"
                :data="grid.data"
                :pagination="grid.pagination"
                :scroll="grid.scroll"
                size="middle"
                @tableChange="onPageChange($event)"
                ref="CaseSearchGrid"
            >
                <template v-slot:alinkTemplate="slotProps">
                    <a href="">{{slotProps.data.data3}}</a>
                </template>
                <template v-slot:policyNumLinkTemplate="slotProps">
                    <a href="">{{slotProps.data.data6}}</a>
                </template>
            </FblDataGrid>
        </div>
    </div>
</template>


<script src="./CaseSearchForm.ts" lang="ts"></script>

<style lang="less" scoped>
.header-button {
    margin-right: auto;
    padding: 6px 10px;
    background-color: @ICON-BUTTON-BG-BLUE;
    color: @COLOR-WHITE;
    border-radius: 4px;
    border: 0;
    min-width: 33px;
    min-height: 33px;
    text-align: center;
    cursor: pointer;
}
.result__table {
    margin-top: 0.5rem !important;
}
</style>