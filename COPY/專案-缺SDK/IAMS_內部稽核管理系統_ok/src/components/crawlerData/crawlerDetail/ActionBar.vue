<template>
  <div>
    <!-- 查核人員(已認列處理中) -->
    <template v-if="roleId && confirmStatus">
      <template v-if="roleId === 'ROLE_Auditor' && confirmStatus === 'A'">
        <CustomPopConfirm
          title="確認覆核？"
          @confirm="$emit('click', 'submitReview')"
        >
          <IconTextButton
            class="m-2"
            text="送出覆核"
            type="edit"
          />
        </CustomPopConfirm>
        <IconTextButton
          class="m-2"
          text="暫存"
          type="save"
          @click="$emit('click', 'save')"
        />
        <IconTextButton
          class="m-2"
          text="非本組認列"
          type="close"
          @click="$emit('click', 'notInGroup')"
        />
      </template>
      <!-- 組長 -->
      <template v-if="roleId === 'ROLE_Audit_Team_Head'">
        <!-- 狀態 已認列(處理中) -->
        <template v-if="confirmStatus === 'A'">
          <!-- 資料確認人員為自己 -->
          <template v-if="confirmIsMe">
            <CustomPopConfirm
              title="確認送出？"
              @confirm="$emit('click', 'submitReview')"
            >
              <IconTextButton
                class="m-2"
                text="送出"
                type="edit"
              />
            </CustomPopConfirm>
            <IconTextButton
              class="m-2"
              text="暫存"
              type="save"
              @click="$emit('click', 'save')"
            />
          </template>
          <IconTextButton
            class="m-2"
            text="認列送出"
            type="enter"
            @click="$emit('click', 'inGroup')"
          />
          <IconTextButton
            class="m-2"
            text="非本組認列"
            type="close"
            @click="$emit('click', 'notInGroup')"
          />
        </template>
        <!-- 狀態 覆核確認 已認列(覆核中) -->
        <template v-if="confirmStatus === 'B'">
          <IconTextButton
            class="m-2"
            text="通過"
            type="enter"
            @click="$emit('click', 'sussess')"
          />
          <IconTextButton
            class="m-2"
            text="退回"
            type="feedback"
            @click="$emit('click', 'reject')"
          />
        </template>
      </template>
      <!-- 部主管 -->
      <template v-if="roleId === 'ROLE_Audit_Department_Head'">
        <!-- 覆核 不認列組別通過退回 -->
        <template>
          <IconTextButton
            class="m-2"
            text="通過"
            type="enter"
            @click="$emit('click', 'sussess')"
          />
          <IconTextButton
            class="m-2"
            text="退回"
            type="feedback"
            @click="$emit('click', 'reject')"
          />
        </template>
      </template>
    </template>
    <IconTextButton
      class="m-2"
      text="上一頁"
      type="return"
      @click="$emit('click', 'back')"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';

import { Action, namespace } from 'vuex-class';

const detailModule = namespace('crawlerDataDetailVuex');

@Component({
	components: { IconTextButton,	CustomPopConfirm },
})
export default class ConfirmForm extends Vue {
	@detailModule.Getter('getDetailData') getDetailData;

	@detailModule.Getter('getAccountAgentList') getAccountAgentList;

	get roleId() {
  	return this.$global.getCurrentRoleId();
	}

	// 資料確認人員是否為自己 或 代理人角色
	get confirmIsMe() {
  	const domainId = this.$user.getMe().employee.domainId;
  	const confirmUser = this.getDetailData.confrimUser;
  	return [domainId, ...this.getAccountAgentList].includes(confirmUser);
	}

	// 資料認列狀態
	// A:已認列(處理中) 、 B:已認列(覆核中) 、 C:已認列(已覆核)
	get confirmStatus() {
  	return this.getDetailData.groupStatus;
	}
}
</script>

<style lang="scss" scoped>
</style>
