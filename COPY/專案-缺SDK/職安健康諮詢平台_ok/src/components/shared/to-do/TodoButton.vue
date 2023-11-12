<template>
  <button
    class="note__block"
    @click="openTodoModal"
  >
    <i class="note-white-icon" />
    <span class="note__txt">待辦</span>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class TodoButton extends Vue {
	openTodoModal() {
		this.$emit('openTodoModal');
	}
}
</script>

<style lang="scss" scoped>
  // 待辦按鈕
  .note__block {
    display: none;
    position: fixed;
    top: 210px;
    right: 0;
    border-radius: 4px 0 0 4px;
    border: 0;
    background: $COLOR-MAIN1;
    width: 50px;
    padding: 8px;
    box-shadow: 1px 1px 7px rgba(0, 0, 0, 0.3);
    z-index: 10;
    cursor: pointer;
    @include rwd-xl {
      display: block;
    }
    .note-white-icon {
      display: block;
      margin: 0 auto;
      width: 24px;
      height: 24px;
      background-repeat: no-repeat;
	    background-position: center;
    }
    .note__txt {
      display: block;
      margin: 4px auto 0;
      writing-mode: tb;
      color: $COLOR-WHITE;
      letter-spacing: 3px;
    }
  }
</style>
