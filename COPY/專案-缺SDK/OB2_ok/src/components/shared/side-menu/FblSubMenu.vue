<template functional>
  <a-sub-menu :key="props.menuInfo.key" :class="{'always-open__menuItem': props.menuInfo.key === 'OUTBOUND'}">
    <span slot="title">
      <span class="menuItem__Title">
        <a-icon type="appstore" theme="filled" filled-color="black" />
        {{ props.menuInfo.title }}
      </span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item
        v-if="!item.children"
        :key="item.key"
        style="margin-top: 0px; margin-bottom: -5px; padding-left: 44px"
      >
        <div style="height:30px;position:relative">
          <span style="font-size: 16px">
            {{ item.title }}
          </span>
            <!-- 急件badge -->
            <a-badge class="is-cont-badge" :count="item.emergencyCase" :offset="[-5,-3]" :overflow-count="99"/>
            <p class="case-count-badge" v-if="item.casesCount!=null" >
            {{item.casesCount}}
          </p>
        </div>
      </a-menu-item>
      <sub-menu
        v-else
        :key="item.key"
        :subMenuItem="item"
        style="margin-top: 0px; margin-bottom: -5px"
      />
    </template>
  </a-sub-menu>
</template>

<script lang="ts" >
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({
  components: {},
})
export default class FblSubMenu extends Vue {
  @Prop()
  menuInfo: null;
}
</script>
<style lang="less" scoped>
.case-count-badge {
  position:absolute;
  top:10px;
  left:110px;
  color: #1A8C8C;
  border-radius: 8px;
  text-align: right;
  background-color:transparent;
  width: 60px;
  height: 20px;
  border: 1px solid #1A8C8C;
  line-height:20px;
  padding-right: 10px;
  font-weight: bold;
  font-size:12px;
  font-style: Impact;
  /* opacity:0.2 */
}
/deep/ .ant-menu-submenu-title {
  text-align: left;
}
.menuItem__Title {
  font-size: 16px;
  font-weight: bold;
}
.always-open__menuItem {
  &.ant-menu-submenu-active,
  &.ant-menu-submenu-selected {
    color: black;
  }
  /deep/ .ant-menu-submenu-title {
    &:hover {
      cursor: auto;
      color: black;
    }
    .ant-menu-submenu-arrow {
      display: none;
    }
  }
}
// 調整急件style
/deep/ .is-cont-badge > sup {
    border-color: red;
    background-color: transparent;
    border-style: solid;
    color: red;
    font-weight: 600;
    border-width: thin;
}
</style>
