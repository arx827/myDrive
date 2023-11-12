<template>
  <div v-if="!isTodoShow">
    <IconTextButton
      class="me-3"
      text="新增"
      type="add"
      @click="handleClick('add')"
    />
    <IconTextButton
      text="匯出"
      type="export"
      @click="handleClick('export')"
    />
  </div>
  <div v-else>
    <a-tooltip
      :trigger="selectRowIds.length == 0 ? 'hover' : ''"
      placement="top"
      :overlay-class-name="'whiteTooltip'"
    >
      <template slot="title">
        <a-icon
          class="tip__icon"
          type="exclamation-circle"
        />
        <span class="tip__text">請先勾選</span>
      </template>
      <IconTextButton
        class="me-3"
        text="通過"
        type="enter"
        @click="selectRowIds.length > 0 ? handleClick('pass') : ''"
      />
    </a-tooltip>
    <a-tooltip
      :trigger="selectRowIds.length == 0 ? 'hover' : ''"
      placement="top"
      :overlay-class-name="'whiteTooltip'"
    >
      <template slot="title">
        <a-icon
          class="tip__icon"
          type="exclamation-circle"
        />
        <span class="tip__text">請先勾選</span>
      </template>
      <icon-text-button
        class="me-3"
        text="退回"
        type="close"
        @click="selectRowIds.length > 0 ? handleClick('reject') : ''"
      />
    </a-tooltip>
    <IconTextButton
      text="上一頁"
      type="return"
      @click="handleClick('goback')"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';

@Component({
	components: {
		IconTextButton,
	},
})
export default class ActionBar extends Vue {
	@Prop()
	isTodoShow: boolean;

	@Prop()
	selectRowIds: string[];

	handleClick(action) {
		this.$emit('click', action);
	}
}
</script>
