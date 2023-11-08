<template>
  <a-popconfirm
    placement="top"
    ok-text="確定"
    cancel-text="取消"
    icon=" "
    overlay-class-name="customPopConfirm"
    :disabled="disabled"
    @confirm="onHandleDelete"
  >
    <template slot="title">
      <div>
        <a-icon :type="iconType" />
        <span class="custom__popConfirm__title">{{ title }}</span>
      </div>
      <slot name="content" />
    </template>
    <!-- <template slot="content" /> -->
    <slot />
  </a-popconfirm>
</template>

<script lang="ts">
import {
	Vue, Component, Prop,
} from 'vue-property-decorator';

@Component({})
export default class CustomPopConfirm extends Vue {
  @Prop({ default: '確認刪除？' })
  title;

  @Prop({ default: 'exclamation-circle' })
  iconType;

  @Prop({ default: 'exclamation-circle' })
  iconColor;

  @Prop({ default: false })
  disabled;

  /**
   * Event
   */
  onHandleDelete(e) {
  	this.$emit('confirm');
  }
}
</script>

<style lang="scss">
.customPopConfirm {
  .ant-popover-inner-content {
    padding: 8px 11px 4px;
  }
  .ant-popover-message-title {
    padding-left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .anticon {
      color: #faad14;
      font-size: 14px;
    }
  }
  .custom__popConfirm__title {
    color: $COLOR-MAIN1;
    padding-left: 6px;
    font-size: 14px;
  }
  .ant-popover-buttons {
    display: flex;
    .ant-btn {
      flex: 1;
      margin-left: 0;
      padding: 0 16px;
      &:not(:first-child) {
        margin-left: 8px;
      }
      span {
        font-size: 13px;
      }
    }
    .ant-btn-primary {
      background-color: $COLOR-MAIN1;
      border-color: $COLOR-MAIN1;
    }
  }
}
</style>
