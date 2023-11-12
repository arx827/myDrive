<template functional>
  <a-sub-menu :key="props.menuInfo.key" style="text-align: left">
    <template slot="title">
      <slot :name="'renderer'" :data="props.menuInfo.data" />
    </template>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item v-if="!item.children" :key="item.key" style="padding-left: 35px">
        <slot :name="'subrenderer'" :data="item.data" />
      </a-menu-item>
      <sub-menu v-else :key="item.key" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>

<script>
export default {
  name: 'SubMenu',
  props: ['menuInfo'],
};
</script>
