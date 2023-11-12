<template>
  <div>
    <IconTextButton
      v-if="isCheckProgram"
      class="my-1"
      text="公版查核程式"
      type="version"
      @click="$emit('openModal', { type: 'checkProgram' })"
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

  get isCheckProgram() {
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
