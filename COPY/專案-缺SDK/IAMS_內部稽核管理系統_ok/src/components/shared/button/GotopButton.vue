<template>
  <div
    class="btn--gotop btn__icon--gotop--circle"
    @click="scrollToTop"
  />
</template>

<script lang="ts">
import {
	Vue, Component, Prop,
} from 'vue-property-decorator';

@Component({})
export default class GotopButton extends Vue {
	scrollToTop() {
		this.$emit('scrollToTop');
	}
}
</script>

<style lang="scss" scoped>
.btn--gotop{
  position: fixed;
  bottom: 60px;
  right: 46px;
  z-index: 99;
}
</style>
