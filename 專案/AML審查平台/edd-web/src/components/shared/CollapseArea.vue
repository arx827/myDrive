<template>
  <div>
    <!-- 1.【查詢條件】收合 searchArea-->
    <div class="hidden-area" v-if="searchArea" :class="{'padding--close':!isOpenSearch}">
      <div
        class="btn float-r searchPage--cover d-flex"
        v-on:click.prevent="toggle"
      >
        <div v-if="isOpenSearch">收起</div>
        <div v-if="!isOpenSearch">展開</div>
        <div>
          <a class="down" :class="{ rotate: isTransform }"></a>
        </div>
      </div>
      <!-- <a-icon type="filter" /> -->
      <slot name="escape"></slot>
      <transition name="fade">
        <template class="hide-temp">
          <div v-show="isOpenSearch">
            <slot name="area"></slot>
          </div>
        </template>
      </transition>
    </div>
    <!-- 2.【更多條件】收合 searchMore-->
    <div class="hidden-area" v-if="searchMore">
      <div
        v-if="!isOpenMore"
        class="btn more-btn"
        :class="{ line_bottom: !isOpenMore }"
        v-on:click.prevent="isOpenMore = !isOpenMore"
      >
        <p class="mb-1">更多條件</p>
        <a class="down" :class="{ rotate: !isTransform }"></a>
      </div>
      <transition name="fade">
        <template class="hide-temp" v-if="isOpenMore">
          <slot></slot>
        </template>
      </transition>
      <div
        v-if="isOpenMore"
        class="btn more-btn"
        :class="{ line_top: isOpenMore }"
        v-on:click.prevent="isOpenMore = !isOpenMore"
      >
        <a class="down" :class="{ rotate: isTransform }"></a>
        <p class="mt-1 mb-0">更少條件</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
      // 控制【更多條件】的 template
      isOpenMore: false,
      isTransform: false,
    };
  },
  props: {
    // 控制【查詢條件】的 template
    isOpenSearch: Boolean,
    // 【查詢條件】收合
    searchArea: Boolean,
    // 【更多條件】收合
    searchMore: Boolean,
  },
  methods: {
    toggle(){
      this.$emit('toggle');
      this.isTransform = !this.isTransform;
    }
  }
};
</script>

<style lang="css" scoped>
.hidden-area {
  overflow: hidden;
}
.btn {
  cursor: pointer;
  color: #0090ff;
  font-size: 14px;
}
.float-r {
  float: right;
}
.d-flex {
  display: flex;
  position: absolute;
  right: 15px;
}
.down {
  background-color: #ffffff;
  border: solid #0090ff;
  border-width: 0 1px 1px 0;
  display: inline-block;
  padding: 4px;
  transform: rotate(225deg) translateY(-8px);
  margin: 0 7px;
  transition: all 0.5s;
  transform-origin: 7px 2px;
}
.rotate {
  transform: rotate(45deg);
}
.more-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgb(34, 127, 168);
}
.line_top {
  border-top: 1px solid rgb(34 127 168 / 34%);
  padding-top: 10px;
}
.line_bottom {
  border-bottom: 1px solid rgb(34 127 168 / 34%);
  padding-bottom: 10px;
}

.more-btn > a {
  border-color: rgb(34, 127, 168);
  border-width: 0 2px 2px 0;
}
.more-btn > p {
  font-weight: bold;
}

.searchPage--cover{
  user-select: none;
  z-index: 500;
}
</style>
