<template>
  <button
    class="btn--store btn__icon--store--circle"
    @click="handleStore"
  />
</template>

<script lang="ts">
import {
	Vue, Component, Prop,
} from 'vue-property-decorator';

@Component({})
export default class TemporaryStoreButton extends Vue {
	handleStore() {
		this.$emit('click');
	}
}
</script>

<style lang="scss" scoped>
.btn--store{
  position: fixed;
  bottom: 124px;
  right: 46px;
}

</style>
