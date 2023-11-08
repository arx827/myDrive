<template>
  <div>
    <IconTextButton
      v-if="currentRole.id == 'ROLE_Auditor'"
      class="ms-3"
      text="送出覆核"
      type="edit"
      @click="$emit('click', 'submit')"
    />
    <IconTextButton
      v-if="currentRole.id == 'ROLE_Auditor'"
      class="ms-3"
      text="暫存"
      type="save"
    />
    <IconTextButton
      v-if="currentRole.id == 'ROLE_Audit_Team_Head' || currentRole.id == 'ROLE_Audit_Department_Head'"
      class="ms-3"
      text="通過"
      type="enter"
      @click="$emit('click', 'pass')"
    />
    <IconTextButton
      v-if="currentRole.id == 'ROLE_Audit_Team_Head' || currentRole.id == 'ROLE_Audit_Department_Head'"
      class="ms-3"
      text="退回"
      type="feedback"
      @click="$emit('click', 'reject')"
    />
    <IconTextButton
      class="ms-3"
      text="下載檔案"
      type="download"
    />
    <IconTextButton
      class="ms-3"
      text="上一頁"
      type="return"
      @click="$emit('click', 'back')"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';

import { RoleDto } from '@fubonlife/iams-api-axios-sdk';

@Component({
	components: {
		IconTextButton,
	},
})
export default class ConfirmForm extends Vue {
  @Prop()
  currentRole: RoleDto;
}
</script>

<style lang="scss" scoped>
</style>
