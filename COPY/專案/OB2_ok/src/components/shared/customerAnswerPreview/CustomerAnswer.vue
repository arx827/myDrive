<template>
  <div>
    <div class="arrowDiv" :style="style">
      <div :class="getBtnClass()" ref="arrowBtn" @click="onCustAnsClick">
        <i class="arrow right"></i>
      </div>
    </div>
    
    <div v-if="isDisplay" class="textAreaDiv" :style="position">
      <a-textarea class="textAreaTop" :value="custHisAnswer" read-only></a-textarea>
      <a-textarea class="textAreaBottom" :value="custAnswer" @blur="setCustAnswer" :max-length="1000"></a-textarea>
    </div>
  </div>
</template>
<script src="./CustomerAnswer.ts" lang="ts"></script>

<style scoped>
  .textAreaDiv {
    width: 500px;
    height: 335px;
    background: #FFFFFF 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #999999;
    border: 3px solid #13C2C2;
    border-radius: 5px;
    opacity: 1;
    z-index: 999;
    position: fixed;
  }

  .textAreaTop {
    height: 65%;
    resize: none;
    border: 0px;
    border-radius: 5px 5px 0px 0px;
  }

  .textAreaBottom {
    height: 35%;
    resize: none;
    border: 0px;
    border-top: 1px solid #13C2C2;
    border-radius: 0px 0px 5px 5px;
  }

  .arrowDiv {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(0px, -22px);
  }

  .arrow {
    border: solid #ffffff;
    border-width: 0 4px 4px 0;
    display: inline-block;
    padding: 4px;
    margin-bottom: -2px;
    margin-right: 6px;
    border-radius: 2px;
    pointer-events: none;
  }
  .right {
    transform: rotate(-45deg);
  }
  .left {
    transform: rotate(135deg);
    margin-right: -6px;
  }

  .switchBtn {
    width: 25px;
    height: 44px;
    display: inline-block;
    border-radius: 5px 0px 0px 5px;
    background: #61C0C1 0% 0% no-repeat padding-box;
    opacity: 1;
    cursor: pointer;
    font-size: 20px;
    line-height: 40px;
    text-align: center;
    color: #FFF;
  }

  .switchRedBtn {
    width: 25px;
    height: 44px;
    display: inline-block;
    border-radius: 5px 0px 0px 5px;
    background: #ff0000 0% 0% no-repeat padding-box;
    opacity: 1;
    cursor: pointer;
    font-size: 20px;
    line-height: 40px;
    text-align: center;
    color: #FFF;
  }

  /* * {
  outline: 1px solid red;
  } */
</style>