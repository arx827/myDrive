<script setup lang="ts"></script>

<template>
  <button
    class="h-[165px] w-[165px] max-w-full rounded bg-white text-lg font-semibold leading-[0px] text-primary shadow-[0px_0px_12px_#00000015] duration-300 ease-in-out hover:bg-[#FAFAFA] disabled:cursor-not-allowed lg:h-[182px] lg:w-[182px]"
  >
    <div class="mx-auto mb-[24px] h-[65px] w-[65px] text-[65px] lg:mb-[32px]">
      <slot name="icon"></slot>
    </div>
    <div class="block h-auto text-xl">
      <slot name="text"></slot>
    </div>
  </button>
</template>

<style scoped></style>
