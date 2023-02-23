<template>
  <div>
    <a-input
      v-model="data.money"
      :prefix="data.dollarSign"
      allow-clear
      @focus="numberOnly()"
      @blur="transfer()"
    />
  </div>
</template>

<script src="./Money.ts" lang="ts">
</script>

<style>

</style>
