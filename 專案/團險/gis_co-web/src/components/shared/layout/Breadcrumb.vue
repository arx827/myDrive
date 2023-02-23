<template>
  <div class="breadcrumb">
    <div class="container">
      <ol>
        <li>
          <img
            class="breadcrumb__home-icon"
            src="@/assets/image_home.svg"
            alt=""
          >
        </li>
        <li
          v-for="(b, index) in breadcrumb.list"
          :key="index"
          :class="{'breadcrumb--active': index === breadcrumb.list.length-1}"
        >
          {{ b }}
        </li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Breadcrumb extends Vue {
  @Prop()
  breadcrumb: {list: []; nowActive: number}
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  background: #F2F8FF;
  padding: 13px 0;
  color: #000000;
  font-size: 12px;
  ol {
    display: flex;
    align-items: center;
    line-height: 1;
    li {
      display: inline-flex;
      font-size: 12px;
      &.breadcrumb--active {
        font-weight: bold;
      }
      &::after {
        content: '';
        background: url(../../../assets/image_nextPage.svg) no-repeat;
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
