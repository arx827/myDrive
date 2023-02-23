<template>
  <div class="d-flex justify-content-end">
    <IconTextButton
      v-if="isLeader"
      class="ms-3"
      text="儲存"
      type="save"
      @click="handleClick('save')"
    />
    <IconTextButton
      v-if="isLeader"
      class="ms-3"
      text="上傳問卷"
      type="upload"
      @click="handleClick('upload')"
    />
    <IconTextButton
      class="ms-3"
      text="查看問卷"
      type="questionnaire"
      @click="handleClick('view')"
    />
    <IconTextButton
      v-if="isLeader"
      class="ms-3"
      text="下載檔案(word)"
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
export default class Questionnaire extends Vue {
  @Prop()
  isLeader: boolean

  handleClick(action) {
  	this.$emit('click', action);
  }
}
</script>
