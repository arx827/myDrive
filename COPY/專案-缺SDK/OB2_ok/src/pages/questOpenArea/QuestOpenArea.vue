<template>
  <div>
    <div class="openContArea">
      <div v-html="form.openCont"></div>
      <div v-html="form.consultCont"></div>
    </div>

    <a-row type="flex" justify="center" style="margin-top: 5px;">
      <a-popover v-for="(data, index) in openAnswerBtn" :key="index" placement="topLeft" :trigger="(data.key=='N')? 'hover':''" :content="tipMsg">
        <a-button :class="'block-btn block-btn--next ' + data.class" @click="clickOpenAnswer(index, data.key)">
          {{data.cont}}
        </a-button>
      </a-popover>
    </a-row>
  </div>
</template>
<script src="./QuestOpenArea.ts" lang="ts"></script>

<style lang="less" scoped>
/* 內容區塊 */
.openContArea {
  padding-right: 20px;
  text-align: justify; /* 左右對齊 */
  text-justify: auto;  /* 左右對齊(IE) */
}

/* 答案按鈕 */
.selected {
  background-color:#56B4B5 !important;
  color:#FFF;
}
.default {
  background-color:#EEEEEE !important;
}
.block-btn {
    min-width: 130px;
    min-height: 37px;
    border-radius: 20px;
    &--save {
        background-color: @BUTTON-BG-GREEN;
        .text-white-format()
    }
    &--next {
        background-color: @BUTTON-BG-LIGHT-GRAY;
        margin-left: 15px;
    }
}
</style>