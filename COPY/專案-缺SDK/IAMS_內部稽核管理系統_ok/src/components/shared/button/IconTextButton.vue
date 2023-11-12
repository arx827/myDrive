<template>
  <button
    class="btn__icon-text"
    :disabled="disabled"
    @click="clickHandler"
  >
    <div
      :class="'btn__icon-text__img btn__icon-text--'+type"
      alt=""
    />
    <!-- eslint-disable -->
    <div class="btn__icon-text__text">{{ text }}</div>
  </button>
</template>

<script lang="ts">
import {
	Vue, Component, Prop,
} from 'vue-property-decorator';

@Component({})
export default class IconTextButton extends Vue {
  @Prop()
  text: string

  @Prop()
  type: string

  @Prop()
  disabled: boolean

  clickHandler() {
  	this.$emit('click');
  }
}
</script>

<style lang="scss" scoped>

</style>
