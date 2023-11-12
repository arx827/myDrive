<template>
  <div class="float-end">
    <IconTextButton
      v-show="isAuditor"
      class="ms-3"
      text="新增"
      type="add"
      @click="handleClick('add')"
    />
    <IconTextButton
      v-show="isLeader"
      class="ms-3"
      text="儲存"
      type="save"
    />
    <IconTextButton
      v-show="isAuditor"
      class="ms-3"
      text="匯入調閱清單"
      type="import"
      @click="handleClick('import')"
    />
    <IconTextButton
      class="ms-3"
      text="下載檔案"
      type="download"
      @click="handleClick('download')"
    />
    <IconTextButton
      class="ms-3"
      text="上一頁"
      type="return"
      @click="handleClick('return')"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';

@Component({
	components: {
		IconTextButton,
	},
})
export default class ActionBar extends Vue {
  @Prop()
  isAuditor: boolean

  @Prop()
  isLeader: boolean

  handleClick(action) {
  	this.$emit('click', action);
  }
}
</script>
