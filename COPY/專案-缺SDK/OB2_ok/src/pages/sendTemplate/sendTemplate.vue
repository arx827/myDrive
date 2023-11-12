<template>
    <div>
        
        <a-row>
            <a-tabs type="card" default-active-key="1" :activeKey="activeKey"  @change="onTabChange" style="color:black;" >
                <a-tab-pane key="1" tab="簡訊" >
                    <sendSMSTemplateSetting v-if="activeKey=='1'"></sendSMSTemplateSetting>
                </a-tab-pane>
                <a-tab-pane key="2" tab="Email" >
                   <sendEmailTemplateSetting v-if="activeKey=='2'"></sendEmailTemplateSetting>
                </a-tab-pane>

                <a-tab-pane key="3" tab="M+" >
                    <sendMPLUSTemplateSetting v-if="activeKey=='3'"></sendMPLUSTemplateSetting>
                </a-tab-pane> 

            </a-tabs>
        </a-row>
    </div>
</template>

<script src="./sendTemplate.ts" lang="ts"></script>
<style>
</style>