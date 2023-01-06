<template functional>
  <a-sub-menu :key="props.menuInfo.key">
    <span slot="title">
      <!-- <a-icon :type="props.menuInfo.route || props.menuInfo.uri ? 'file' : 'folder'" /> -->
      <a-icon :type="props.menuInfo.iconName"/>
      <span>{{ props.menuInfo.title }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item v-if="!item.children" :key="item.key">
        <a-icon :type="item.route || item.uri ? 'file' : 'folder'" :style="{display: 'none'}"/>
        <span>{{ item.title }}</span>
      </a-menu-item>
      <sub-menu v-else :key="item.key" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>

<script>
export default {
  name: 'subMenu',
  props: ['menuInfo']
}
</script>

<style lang="scss" scoped>
.svg-menu-1{
  width: 16px;
  margin-right: 10px;
}
.ant-menu-item .anticon + span {
  color: #227FA8;
}
// .ant-menu-sub .ant-menu-item.ant-menu-item-selected {
//   background-color: #FFE58F;
// }
// 改為 hover 才變色
.ant-menu-sub .ant-menu-item {
  &:hover {
    background-color: #FFE58F;
  }
}
.ant-menu-sub .ant-menu-item.ant-menu-item-selected span {
  color: #227FA8;
}
</style>