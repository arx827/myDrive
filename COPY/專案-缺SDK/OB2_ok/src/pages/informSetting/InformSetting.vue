<template>
    <div>
        
        <a-row>
            <a-tabs type="card" default-active-key="1" :activeKey="activeKey"  @change="onTabChange" style="color:black;" >
                <a-tab-pane key="1" tab="會辦基本設定" >
                    <InformBasicSetting v-if="activeKey=='1'"></InformBasicSetting>
                </a-tab-pane>
                <a-tab-pane key="2" tab="通報類設定" >
                    <InfCommunicateSetting v-if="activeKey=='2'"></InfCommunicateSetting>
                </a-tab-pane>

                 <a-tab-pane key="3" tab="親訪類設定" >
                     <InfVisitPersonSetting v-if="activeKey=='3'"></InfVisitPersonSetting>
                </a-tab-pane>

                <a-tab-pane key="4" tab="通知類設定" >
                    <InfNotifySetting v-if="activeKey=='4'" ></InfNotifySetting>
                </a-tab-pane>
            </a-tabs>
        </a-row>
    </div>
</template>

<script src="./InformSetting.ts" lang="ts"></script>
<style>
</style>