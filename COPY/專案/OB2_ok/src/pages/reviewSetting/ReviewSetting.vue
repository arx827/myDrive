<template>
    <div>
        
       
        <a-row>
            <a-tabs type="card" default-active-key="1" :activeKey="activeKey" @change="onTabChange" style="color:black;" >
                <a-tab-pane key="1" tab="要被覆核設定" >
                    <ReviewedSetting v-if="activeKey=='1'"></ReviewedSetting>
                </a-tab-pane>
                <a-tab-pane key="2" tab="可以覆核設定" >
                    <ReviewableSetting v-if="activeKey=='2'"></ReviewableSetting>
                </a-tab-pane>
            </a-tabs>
        </a-row>
    </div>
</template>

<script src="./ReviewSetting.ts" lang="ts"></script>
<style>
</style>