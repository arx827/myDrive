<script setup lang="ts">
import { computed } from 'vue'
import { useLoadingStore } from '@/stores/index'

const store = useLoadingStore()
const loading = computed(() => store.getLoading)
</script>

<template>
  <div v-if="loading" class="custom__spinWrap">
    <div class="custom__position">
      <div id="circularG">
        <div id="circularG_1" class="circularG" />
        <div id="circularG_2" class="circularG" />
        <div id="circularG_3" class="circularG" />
        <div id="circularG_4" class="circularG" />
        <div id="circularG_5" class="circularG" />
        <div id="circularG_6" class="circularG" />
        <div id="circularG_7" class="circularG" />
        <div id="circularG_8" class="circularG" />
      </div>
      <p class="loading__text">資料載入中</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// loading
.custom__spinWrap {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}
.custom__position {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 50% 50%;
}
#circularG {
  position: relative;
  width: 68px;
  height: 68px;
  margin: auto;
}

.circularG {
  position: absolute;
  background-color: $COLOR-MAIN1;
  width: 16px;
  height: 16px;
  border-radius: 10px;
  animation-name: bounce_circularG;
  animation-duration: 0.718s;
  animation-iteration-count: infinite;
  animation-direction: normal;
}

#circularG_1 {
  left: 0;
  top: 27px;
  animation-delay: 0.268s;
}

#circularG_2 {
  left: 7px;
  top: 7px;
  animation-delay: 0.364s;
}

#circularG_3 {
  top: 0;
  left: 27px;
  animation-delay: 0.45s;
}

#circularG_4 {
  right: 7px;
  top: 7px;
  animation-delay: 0.536s;
}

#circularG_5 {
  right: 0;
  top: 27px;
  animation-delay: 0.632s;
}

#circularG_6 {
  right: 7px;
  bottom: 7px;
  animation-delay: 0.718s;
}

#circularG_7 {
  left: 27px;
  bottom: 0;
  animation-delay: 0.814s;
}

#circularG_8 {
  left: 7px;
  bottom: 7px;
  animation-delay: 0.9s;
}

@keyframes bounce_circularG {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.3);
  }
}

.loading__text {
  color: $COLOR-WHITE;
  margin-top: 10px;
  margin-bottom: 0;
  font-size: 10px;
  text-align: center;
  font-weight: 600;
}
</style>
