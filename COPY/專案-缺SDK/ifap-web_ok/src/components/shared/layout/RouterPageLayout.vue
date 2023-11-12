<template>
  <div class="main-container">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component({})
export default class RouterPageLayout extends Vue {
}
</script>

<style lang="scss" scoped>
</style>
