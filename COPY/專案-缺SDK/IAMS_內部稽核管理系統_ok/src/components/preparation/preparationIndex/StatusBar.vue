<template>
  <div class="status-bar d-flex">
    <div class="status-bar__item">
      <div class="status-bar__item__circle status-bar__item__circle--undo" />
      <div class="status-bar__item__text">
        待處理/未完成
      </div>
    </div>
    <div class="status-bar__item">
      <div class="status-bar__item__circle status-bar__item__circle--delay" />
      <div class="status-bar__item__text">
        逾期
      </div>
    </div>
    <div class="status-bar__item">
      <div class="status-bar__item__circle status-bar__item__circle--none" />
      <div class="status-bar__item__text">
        尚未進行
      </div>
    </div>
    <div class="status-bar__item">
      <div class="status-bar__item__circle status-bar__item__circle--done" />
      <div class="status-bar__item__text">
        已完成
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
	components: {},
})
export default class StatusBar extends Vue {
}
</script>

<style lang="scss" scoped>
.status-bar {
	padding-left: 48px;
}
.status-bar__item {
	display: flex;
	align-items: center;
  + .status-bar__item {
    margin-left: 20px;
  }
}

.status-bar__item__text{
	padding-left: 6px;
	line-height: 1em;
}
</style>
