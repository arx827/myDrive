<template>
  <div>
    <a-row>
      <a-col>
        <a-tabs
          v-model="activeKey"
          hide-add
          type="editable-card"
          class="main__tabWrap"
          :tabBarGutter="4"
          @change="onTabChange"
          @edit="onEdit"
        >
          <a-tab-pane key="0" :closable="false" class="container-fluid scrollBar">
            <template #tab>
              <a-icon type="home" class="m-0" theme="filled" />
            </template>
            <IpkIndex ref="home" />
          </a-tab-pane>
          <template v-if="!isEmpty(getTabArray)">
            <a-tab-pane v-for="pane in getTabArray" :key="pane.key" :closable="true">
              <template #tab>
                <span class="text--ellipsis">{{ pane.title }}</span>
              </template>
            </a-tab-pane>
          </template>
        </a-tabs>
      </a-col>
    </a-row>
    <a-row v-show="showRouterView">
      <a-col class="container-fluid scrollBar">
        <Breadcrumb :breadcrumb="breadCrumb" />
        <!-- <component :is="view" /> -->
        <keep-alive :include="getKeepAliveList">
          <router-view :key="$route.path" />
        </keep-alive>
      </a-col>
    </a-row>
  </div>
</template>
<script src="./OuterTab.ts" lang="ts">
</script>

<style lang="scss" scoped>
::v-deep {
  .ant-tabs-bar {
    margin: 0 0 5px 0;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
    background: $COLOR-WHITE !important;
    // border-bottom: 3px solid $COLOR-MAIN2 !important;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    // background: $COLOR-WHITE;
    // border: 1px solid $COLOR-WHITE;
    border: none;
    background: #e4e4e4;
    margin-right: 4px;
  }
}
// 捲軸
.scrollBar {
  overflow: auto;
  margin: 0 -3px;
  height: calc(100vh - 114px);
  min-height: calc(100% - 73px);
}
// 字省略
.text--ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 150px;
  min-width: 150px;
  overflow: hidden;
  display: block;
  float: left;
}
</style>
