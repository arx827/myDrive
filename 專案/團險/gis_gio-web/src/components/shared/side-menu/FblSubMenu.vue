<template functional>
  <a-sub-menu
    :key="props.menuInfo.key"
    style="text-align: left"
  >
    <span slot="title">
      <div>
        <slot
          :name="'renderer'"
          :data="props.menuInfo.data"
        />
      </div>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item
        v-if="!item.children"
        :key="item.key"
      >
        <div>
          <slot
            :name="'renderer'"
            :data="item.data"
          />
        </div>
      </a-menu-item>
      <sub-menu
        v-else
        :key="item.key"
        :menu-info="item"
      />
    </template>
  </a-sub-menu>
</template>

<script>
export default {
  name: 'SubMenu',
  props: ['menuInfo'],
};
</script>
