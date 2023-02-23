<template functional>
  <a-sub-menu :key="props.menuInfo.key" class="text-left">
    <span slot="title">
      <div :class="{'nuActive': props.selectedKeysEmpty || props.selectKey !== props.menuInfo.key}">
        <slot
          :name="'renderer'"
          :data="props.menuInfo.data"
        />
      </div>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item v-if="!item.children" :key="item.key" :dataKey="item.key">
        <div>
          <slot :name="'renderer'" :data="item.data" />
        </div>
      </a-menu-item>
      <sub-menu v-else :key="item.key" :menu-info="item">
        <template v-slot:renderer="slotProp">
          <slot :name="'renderer'" :data="slotProp.data" />
        </template>
      </sub-menu>
    </template>
  </a-sub-menu>
</template>

<script>
export default {
  name: 'SubMenu',
  props: ['menuInfo', 'selectKey', 'selectedKeysEmpty'],
};
</script>
<style lang="scss" scoped>
  .nuActive {
    ::v-deep img {
      filter: grayscale(100%);
      opacity: 0.8;
    }
  }
</style>
