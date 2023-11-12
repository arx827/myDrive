<template>
  <div>
    <IconTextButton
      v-if="isSettingAuditItems"
      class="me-3 my-1"
      text="查核項目設定"
      type="set_up"
      @click="$emit('click', { type: 'setAuditItems' })"
    />
    <IconTextButton
      class="me-3 my-1"
      text="匯出"
      type="export"
      @click="$emit('click', { type: 'export' })"
    />
    <!-- 送出覆核、暫存出現條件 => 查核人員／組長＋yapStatus A 或 B -->
    <template
      v-if="(role.id === 'ROLE_Auditor' || role.id === 'ROLE_Audit_Team_Head')
        && (yapStatus === 'A' || yapStatus === 'B' || (yapStatus === 'C' && isBeenRejectedAuditItem))"
    >
      <!-- 組長＋狀態A不能有送出覆核的按鈕 -->
      <IconTextButton
        v-if="!(role.id === 'ROLE_Audit_Team_Head' && yapStatus === 'A')"
        class="me-3 my-1"
        text="送出覆核"
        type="edit"
        @click="$emit('click', { type: 'submitReview' })"
      />
      <IconTextButton
        class="me-3 my-1"
        text="暫存"
        type="save"
        @click="$emit('click', { type: 'save' })"
      />
    </template>

    <IconTextButton
      v-if="isShowReturnBtn"
      class="me-3 my-1"
      text="退回"
      type="feedback"
      @click="$emit('click', { type: 'return'})"
    />
    <!-- 行政組組長送出按鈕   -->
    <template v-if="role.id === 'ROLE_Audit_Team_Head' && role.roleUnits[0].auditorTeamCode === 'D' && yapStatus === 'D'">
      <CustomPopConfirm
        v-if="role.id === 'ROLE_Audit_Team_Head'"
        title="請確認以下事項"
        @confirm="$emit('click', { type: 'caseClose' })"
      >
        <template slot="content">
          <div class="close-info">
            <div class="close-info close-info__item">
              1. 已送金控
            </div>
            <div class="close-info close-info__item">
              2. 已送董事會
            </div>
            <div class="close-info close-info__item">
              3. 已報檢查局
            </div>
          </div>
        </template>
        <IconTextButton
          class="me-3 my-1"
          text="結案"
          type="closed"
        />
      </CustomPopConfirm>
    </template>
    <IconTextButton
      text="編制歷程"
      type="course"
      @click="$emit('click', { type: 'history' })"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import { RoleDto } from '@fubonlife/iams-api-axios-sdk';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';

@Component({
	components: { IconTextButton, CustomPopConfirm	},
})
export default class ActionBar extends Vue {
  @Prop()
	role: RoleDto;

  @Prop()
  yapStatus: string;

  @Prop()
  isConfirmUser: string;

  @Prop()
  isSettingAuditItems: boolean;

  @Prop()
  isSupervisor: boolean;

  @Prop()
  isBeenRejectedAuditItem: boolean;

  @Prop()
  reviewFlag: boolean

  get isShowReturnBtn() {
  	if (this.role.id === 'ROLE_Audit_Team_Head'
	    && this.role.roleUnits[0].auditorTeamCode === 'D'
	    && this.yapStatus === 'D') return true;
	  if (this.yapStatus === 'C' && this.isSupervisor && this.reviewFlag) return true;

  	return false;
  }
}
</script>

<style lang="scss" scoped>
.close-info__item{
  font-size: 14px;
  padding-left: 7px;
}

</style>
