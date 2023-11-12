<template>
  <div class="searchBlock">
    <a-collapse v-model="activeKey" expandIconPosition="right" :bordered="false">
      <template #expandIcon>
        <a-icon class="accordionArea__icon" type="caret-right" :rotate="isActive ? -90 : 90" />
      </template>
      <a-collapse-panel key="1">
        <template #header>
          <div class="accordionAreaControl d-flex align-items-center justify-content-end">
            <a-icon type="filter" />
            <span class="ms-1">篩選條件</span>
          </div>
        </template>
        <slot />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class AccordionArea extends Vue {
  activeKey = ['1'];

  get isActive() {
    return this.activeKey[0] === '1';
  }
}
</script>

<style lang="scss" scoped>
.searchBlock {
  background: #FFF;
  padding: 0 21px;
  border-radius: 4px;
  box-shadow: 0 0 12px #00000014;
  position: relative;
  z-index: 10;
  .ant-collapse-borderless {
    background-color: transparent;
    > .ant-collapse-item {
      border-bottom: 0;
    }
  }
}

.accordionAreaControl {
  color: $COLOR-MAIN11;
}
.accordionArea__icon {
  color: $COLOR-MAIN11 !important;
}
</style>
