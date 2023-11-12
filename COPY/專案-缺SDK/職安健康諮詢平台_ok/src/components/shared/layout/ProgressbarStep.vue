<template>
  <ul class="progressbar d-flex justify-content-between">
    <li
      v-for="(st, index) in stepArr"
      :key="index"
      class="progressbar__list"
      :class="{ 'progressbar__list--active': now == index + 1, 'progressbar__list--complete': now > index + 1 }"
    >
      <div class="step__text__group">
        <div class="step__number">
          <a-icon
            type="check"
            class="step__number-icon"
          />
        </div>
        <div class="step__wrap">
          <span class="step__str" />
          <span class="step__name">{{ st }}</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';

@Component({})
export default class ProgressbarStep extends Vue {
  @Prop()
  stepArr: string[];

  @Prop()
  now: string | number;
}
</script>

<style lang="scss" scoped>
  .progressbar {
    counter-reset: step;
    margin: 0 auto;
    width: 100%;
    @include rwd-sm {
      max-width: 720px;
    }
  }
  .progressbar__list {
    counter-increment: step;
    flex: 1;
    display: flex;
    .step__text__group {
      display: flex;
      flex-direction: column;
      @include rwd-sm {
        flex-direction: row;
      }
    }
    .step__number {
      border-radius: 50vh;
      border: 1px solid $COLOR-GRAY3;
      width: 18px;
      min-width: 18px;
      height: 18px;
      display: flex;
      align-content: center;
      justify-content: center;
      color: $COLOR-GRAY3;
      font-size: 12px;
      margin: 0 auto;
      @include rwd-sm {
        margin: 0;
        width: 32px;
        min-width: 32px;
        height: 32px;
        font-size: 14px;
      }
      &:before {
        content: counter(step);
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .step__number-icon {
        display: none;
        align-items: center;
      }
    }
    &:after {
      content: '';
      flex: 1;
      margin-top: 8px;
      border-top: 1px solid $COLOR-GRAY3;
      margin-left: -10px;
      margin-right: -10px;
      @include rwd-sm {
        margin-top: 16px;
        margin-left: 0;
        margin-right: 0;
      }
    }
    &:last-child {
      flex: 0;
      &:after {
        content: none;
      }
    }
    .step__wrap {
      margin-left: 10px;
      margin-right: 5px;
      margin-top: 5px;
      text-align: center;
      @include rwd-sm {
        margin-top: 0;
        text-align: left;
      }
    }
    .step__str {
      display: block;
      font-weight: 600;
      white-space: nowrap;
      font-size: 12px;
      line-height: 1.2;
      @include rwd-sm {
        font-size: 16px;
        line-height: 2;
      }
      &::before {
        content: 'Step 'counter(step);
      }
    }
    .step__name{
      display: block;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      @include rwd-sm {
        font-size: 14px;
      }
    }
  }
  .progressbar__list--active {
    .step__number {
      color: $COLOR-WHITE;
      border: 1px solid $COLOR-MAIN13;
      background: $COLOR-MAIN13;
    }
  }
  .progressbar__list--complete {
    .step__number {
      color: $COLOR-MAIN13;
      border: 1px solid $COLOR-MAIN13;
      &:before {
        content: none;
      }
      .step__number-icon {
        display: flex;
        ::v-deep svg {
          font-size: 11px;
           @include rwd-sm {
             font-size: initial;
           }
        }
      }
    }
    &:after {
      border-top: 1px solid $COLOR-MAIN13;
    }
  }
</style>
