<template>
  <div
    v-if="breadcrumbList"
    class="breadcrumb"
  >
    <div>
      <ol>
        <li
          v-for="(b, index) in breadcrumbList"
          :key="index"
          :class="{'breadcrumb--active': index === breadcrumbList.length-1}"
        >
          {{ b }}
        </li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';

@Component({})
export default class Breadcrumb extends Vue {
  @Prop()
  breadcrumb;

  /**
   * computed
   */
  get breadcrumbList() {
    return this.breadcrumb.split('/');
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  // background: $COLOR-WHITE;
  color: $COLOR-GRAY20;
  font-size: 12px;
  margin-bottom: 0;
  min-height: 12px;
  align-items: center;
  // padding-top: 13px;
  ol {
    display: flex;
    align-items: center;
    line-height: 1;
    padding: 0;
    margin-bottom: 0;
    li {
      display: inline-flex;
      font-size: 12px;
      &.breadcrumb--active {
        font-weight: bold;
      }
      &::after {
        content: '>';
        display: inline-block;
        margin: 0 3px 0 5px;
        padding: 0 5px;
      }
      &:last-child {
        &::after {
          display: none;
        }
      }
    }
  }
  .breadcrumb__home-icon {
    margin-top: -1px;
  }
}
</style>
