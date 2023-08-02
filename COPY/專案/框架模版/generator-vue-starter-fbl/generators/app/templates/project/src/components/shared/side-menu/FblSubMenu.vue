<template functional>
  <a-sub-menu :key="props.menuInfo.key" style="text-align: left">
    <span slot="title">
      <div>
        <slot
          :name="'renderer'"
          v-bind:data="props.menuInfo.data"
        ></slot>
      </div>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item v-if="!item.children" :key="item.key">
        <div>
          <slot :name="'renderer'" v-bind:data="item.data"></slot>
        </div>
      </a-menu-item>
      <sub-menu v-else :key="item.key" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>

<script>
export default {
  name: "subMenu",
  props: ["menuInfo"],
};
</script>