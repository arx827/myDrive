<template>
  <div>
    <!-- <IconTextButton
      v-if="role == 'ROLE_Audit_Team_Head'"
      text="人力統計表"
      type="manpower"
      @click="$router.push({ name: 'HumanResourcePlanning' })"
    />
    <IconTextButton
      v-if="role == 'ROLE_Audit_Team_Head'"
      class="ms-3"
      text="新增計畫內"
      type="add"
      @click="actionHandler('addInsidePlan')"
    />
    <IconTextButton
      v-if="role == 'ROLE_Audit_Team_Head'"
      class="ms-3"
      text="新增計畫外"
      type="add"
      @click="actionHandler('addOutsidePlan')"
    /> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';

@Component({
	components: { IconTextButton	},
})
export default class ConfirmForm extends Vue {
  @Prop()
  role: string;

  actionHandler(item) {
  	switch (item) {
  	// case 'humanResourcePlanning':
  	// 	this.$emit('openModal', 'humanResourcePlanning');
  	// 	break;
  	case 'addInsidePlan':
  		this.$emit('openModal', 'addInsidePlan');
  		break;
  	case 'addOutsidePlan':
  		this.$emit('openModal', 'addOutsidePlan');
  		break;
  	}
  }
}
</script>

<style lang="scss" scoped>
</style>
