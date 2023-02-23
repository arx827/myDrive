<template>
  <div class="container main-container">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component({})
export default class RouterPageLayout extends Vue {
  // @Watch('$route', { immediate: true, deep: true })
  // watchRouter(newVal) {
  //   console.log(newVal);
  // }
}
</script>

<style lang="scss" scoped>
</style>
