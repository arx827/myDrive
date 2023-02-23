<template>
  <div class="btnGroup tabline">
    <div class="event__block form__title pb-3">
      共用loading
      <span class="ms-3">
        <button class="btn__main btn__main--primary" @click="showLoading">
          顯示loading
        </button>
      </span>
    </div>
    <div class="setting__desc" style="width: 100%">
      <div>
        使用方法：
      </div>
      <ul class="form__content">
        <li>import { Action } from 'vuex-class';</li>
        <li>@Action('setLoading') setLoading;</li>
        <li>在要顯示loading的流程中寫this.setLoading(true);</li>
        <li>在要關閉的流程中寫this.setLoading(false);</li>
        <div>
          <img src="~@images/example.png" width="50%">
        </div>
      </ul>
    </div>
  </div>
</template>

<script src="./Loading.ts" lang="ts">
</script>

<style lang="scss" scoped>
li {
  margin: 10px 0;
}
// 表單標題
.form__title {
    color: #2F6A9A;
    font-size: 20px;
    font-weight: 700;
}
.setting__desc {
  border: 1px solid gray;
  padding: 15px;
  border-radius: 15px;
  margin-bottom: 15px;
  width: 550px;
}
.form__content {
  list-style: decimal;
}
.text--bold {
  font-weight: bold;
  line-height: 1.5;
}
.event__block {
  margin-top: 20px;
}
</style>
