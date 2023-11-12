<script setup lang="ts">
interface ProgressbarStepProp {
  stepArr: string[]
  now?: number
}
const $props = withDefaults(defineProps<ProgressbarStepProp>(), {
  stepArr: () => [],
  now: 0,
})

const progressbarListClass = (index: number): string => {
  switch (true) {
    case $props.now == index + 1:
      return 'progressbar__list--active'
    case $props.now > index + 1:
      return 'progressbar__list--complete'
    default:
      return ''
  }
}
</script>

<template>
  <ul class="progressbar [counter-reset: step] flex w-full justify-center pr-[5px]">
    <li
      v-for="(st, index) in $props.stepArr"
      :key="index"
      class="progressbar__list flex flex-1"
      :class="[progressbarListClass(index)]"
    >
      <div class="step__text__group flex flex-col">
        <div
          class="step__number mx-auto flex h-[20px] w-[20px] items-center justify-center rounded-full border border-neutral-entry text-[10px] text-neutral-entry before:flex before:items-center before:justify-center before:content-[counter(step)] lg:text-base"
        >
          <check-outlined class="step__number-icon hidden items-center text-sm" />
        </div>
        <div class="step__wrap ml-[10px] mr-[5px] mt-[5px] text-center text-sm text-neutral lg:text-base">
          <span class="step__name block whitespace-nowrap text-sm font-semibold lg:text-base">{{ st }}</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.progressbar__list {
  counter-increment: step;
}
/* 預設值 */
.progressbar__list:last-child {
  @apply flex-none;
}

.progressbar__list:not(:last-child)::after {
  @apply -mx-[10px] mt-2 flex-1 border-t border-t-neutral-entry content-[''];
}

/* active */
.progressbar__list--active .step__number {
  @apply border-primary bg-primary text-white;
}
.progressbar__list--active .step__wrap {
  @apply text-black;
}

/* complete */
.progressbar__list--complete .step__number {
  @apply border-primary text-primary;
}
.progressbar__list--complete .step__number:before {
  @apply content-none;
}
.progressbar__list--complete .step__number .step__number-icon {
  @apply flex;
}

/* 作用中的線條，目前用不到 先隱藏 */
/* .progressbar__list:not(:last-child).progressbar__list--complete::after {
  @apply border-t-primary;
} */
</style>
