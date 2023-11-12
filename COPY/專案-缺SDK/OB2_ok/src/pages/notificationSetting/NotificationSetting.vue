<template>
    <div>
        
        <a-row>
            <a-tabs type="card" default-active-key="1" :activeKey="activeKey"  @change="onTabChange" style="color:black;" >
                <a-tab-pane key="1" tab="照會基本設定" >
                    <NotificationBasicSetting v-if="activeKey=='1'"></NotificationBasicSetting>
                </a-tab-pane>
                <a-tab-pane key="2" tab="電訪照會碼設定" >
                   <NotiSetting v-if="activeKey=='2'"></NotiSetting>
                </a-tab-pane>

                 <a-tab-pane key="3" tab="照會回覆窗口設定" >
                     <NotiReplyPersonSetting v-if="activeKey=='3'"></NotiReplyPersonSetting>
                   
                </a-tab-pane>

            </a-tabs>
        </a-row>
    </div>
</template>

<script src="./NotificationSetting.ts" lang="ts"></script>
<style>
</style>