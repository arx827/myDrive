<template>
  <!-- 查核依據 -->
  <div>
    <a-form-model
      ref="formRef"
      :model="tabsDataSync"
      :hide-required-mark="true"
      :wrapper-col="{ span: 18, offset: 6 }"
    >
      <!-- :rules="formRules" -->
      <a-form-model-item
        prop="member"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-textarea
          v-model="tabsDataSync.textarea"
          class="w-100"
          :auto-size="{minRows:10}"
          :disabled="!isLeader"
        />
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, PropSync, Watch,
} from 'vue-property-decorator';

@Component({})
export default class Reference extends Vue {
  @Prop()
  role: string;

  @PropSync('tabsData')
	tabsDataSync;

  // 只有領隊才可以編輯
  @Prop()
  isLeader: boolean;

	// 可否編輯
	// get isEdit() {
	// 	return true;
	// }

	// form = {
	// 	reference: '',
	// }
}
</script>

<style lang="scss" scoped>
</style>
