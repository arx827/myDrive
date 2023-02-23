<template>
    <div tabindex="-1">
        <a-row>
            <a-tabs type="card" v-model="tabActiveKey" style="color:black;" >
                <a-tab-pane key="1" tab="班別設定" v-if="authComponent.TAB_SHIFT.show">
                    <ShiftWork v-if="tabActiveKey=='1'"></ShiftWork>
                </a-tab-pane>
                <a-tab-pane key="2" tab="事件設定" v-if="authComponent.TAB_EVENT.show" >
                    <Event v-if="tabActiveKey=='2'"></Event>
                </a-tab-pane>
            </a-tabs>
        </a-row>
    </div>
</template>

<script src="./ShiftSettingAndAdjust.ts" lang="ts"></script>
<style>
</style>