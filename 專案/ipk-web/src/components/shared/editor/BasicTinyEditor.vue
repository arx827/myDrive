<template>
  <div>
    <editor
      ref="editor"
      v-model="editValue"
      :init="init"
      model-events="input change paste"
      @input="handleInput"
      @onfocus="handleFocus"
    />
  </div>
</template>
<script src="./BasicTinyEditor.ts" />
