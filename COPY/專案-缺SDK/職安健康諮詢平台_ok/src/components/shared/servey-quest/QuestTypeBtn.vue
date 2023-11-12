<template>
  <div class="btn__icon__wrap">
    <a-button
      type="dashed"
      size="large"
      class="questTypeBtn"
      @click="handleChooseType(btnItem.key)"
    >
      <div class="questTypeBtn__icon">
        <i
          class="icon-button"
          :class="btnItem.className"
        />
      </div>
      <div class="questTypeBtn__label">
        {{ btnItem.val }}
      </div>
    </a-button>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';

@Component({ components: {} })
export default class QuestType extends Vue {
  @Prop()
  btnItem

  /**
     * Event
     */
  // 點擊按鈕，『選擇題型』
  handleChooseType(key) {
  	this.$emit('addQuestItem', key);
  }
}
</script>

<style lang="scss" scoped>
.questTypeBtn {
  display: flex;
  align-items: center;
  padding: 0;
  color: $COLOR-GRAY1;
  border-radius: 4px;
  width: 100%;
  &:focus, &:hover {
    background-color: #E6F7FF;
  }
  @include rwd-xl {
    width: 150px;
  }
  .questTypeBtn__icon {
    background-color: $BUTTON-MAIN;
    border-radius: 3px 0 0 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .questTypeBtn__label {
    white-space: initial;
    text-align: left;
    line-height: 1.5;
    padding: 10px;
  }
}
.btn__icon__wrap {
  margin-top: 10px;
}
</style>
