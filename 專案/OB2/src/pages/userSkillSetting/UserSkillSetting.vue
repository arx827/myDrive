<template>
    <div>
        
        <div style="height:18px"></div>
        <a-row>
            <a-tabs type="card" v-model="tabActiveKey" style="color:black;" >
                <a-tab-pane key="1" :tab="$t('usertask_setting')" >
                    <UserSkillTaskSetting v-if="tabActiveKey=='1'"></UserSkillTaskSetting>
                </a-tab-pane>
                <a-tab-pane key="2" :tab="$t('userskill_setting')" >
                    <PolicyTagSetting v-if="tabActiveKey=='2'"></PolicyTagSetting>
                </a-tab-pane>
            </a-tabs>
        </a-row>
    </div>
</template>

<script src="./UserSkillSetting.ts" lang="ts"></script>
<style>
</style>