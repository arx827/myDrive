<template>
  <span>
    <button
      class="btn__main mx-1"
      :class="buttonClass()"
      :disabled="buttonDisabled"
      @click="handleValidateButtonAuth"
    >
      <a-icon v-if="!isEmpty(iconType)" :type="iconType" class="icon_margin" />
      {{ buttonText }}
    </button>
  </span>
</template>

<script src="./IpkButton.ts" lang="ts" />
