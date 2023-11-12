<script setup lang="ts">
import { computed } from 'vue'
import { useLoadingStore } from '@/stores/index'

const loadingStore = useLoadingStore()
const loading = computed(() => loadingStore.getLoading)
</script>

<template>
  <div v-if="loading" class="fixed bottom-0 left-0 right-0 top-0 z-[9999] bg-[#FFFFFF98]">
    <div class="absolute left-[calc((100%-35px)/2)] top-[calc((100%-36px)/2)]">
      <div class="cssload-box-loading"></div>
    </div>
  </div>
</template>

<style scoped>
/* 動畫CSS截自 : https://cssload.net/en/3d-loaders by Dicson */
.cssload-box-loading {
  width: 35px;
  height: 36px;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.cssload-box-loading:before {
  content: '';
  width: 35px;
  height: 5px;
  background: rgb(0, 0, 0);
  opacity: 0.1;
  position: absolute;
  top: 44px;
  left: 0;
  border-radius: 50%;
  animation: shadow 0.58s linear infinite;
  -o-animation: shadow 0.58s linear infinite;
  -ms-animation: shadow 0.58s linear infinite;
  -webkit-animation: shadow 0.58s linear infinite;
  -moz-animation: shadow 0.58s linear infinite;
}
.cssload-box-loading:after {
  content: '';
  width: 35px;
  height: 36px;
  background: #68a8ef;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 3px;
  animation: cssload-animate 0.58s linear infinite;
  -o-animation: cssload-animate 0.58s linear infinite;
  -ms-animation: cssload-animate 0.58s linear infinite;
  -webkit-animation: cssload-animate 0.58s linear infinite;
  -moz-animation: cssload-animate 0.58s linear infinite;
}

@keyframes cssload-animate {
  17% {
    border-bottom-right-radius: 3px;
  }
  25% {
    transform: translateY(9px) rotate(22.5deg);
  }
  50% {
    transform: translateY(18px) scale(1, 0.9) rotate(45deg);
    border-bottom-right-radius: 39px;
  }
  75% {
    transform: translateY(9px) rotate(67.5deg);
  }
  100% {
    transform: translateY(0) rotate(90deg);
  }
}

@-o-keyframes cssload-animate {
  17% {
    border-bottom-right-radius: 3px;
  }
  25% {
    -o-transform: translateY(9px) rotate(22.5deg);
  }
  50% {
    -o-transform: translateY(18px) scale(1, 0.9) rotate(45deg);
    border-bottom-right-radius: 39px;
  }
  75% {
    -o-transform: translateY(9px) rotate(67.5deg);
  }
  100% {
    -o-transform: translateY(0) rotate(90deg);
  }
}

@-ms-keyframes cssload-animate {
  17% {
    border-bottom-right-radius: 3px;
  }
  25% {
    -ms-transform: translateY(9px) rotate(22.5deg);
  }
  50% {
    -ms-transform: translateY(18px) scale(1, 0.9) rotate(45deg);
    border-bottom-right-radius: 39px;
  }
  75% {
    -ms-transform: translateY(9px) rotate(67.5deg);
  }
  100% {
    -ms-transform: translateY(0) rotate(90deg);
  }
}

@-webkit-keyframes cssload-animate {
  17% {
    border-bottom-right-radius: 3px;
  }
  25% {
    -webkit-transform: translateY(9px) rotate(22.5deg);
  }
  50% {
    -webkit-transform: translateY(18px) scale(1, 0.9) rotate(45deg);
    border-bottom-right-radius: 39px;
  }
  75% {
    -webkit-transform: translateY(9px) rotate(67.5deg);
  }
  100% {
    -webkit-transform: translateY(0) rotate(90deg);
  }
}

@-moz-keyframes cssload-animate {
  17% {
    border-bottom-right-radius: 3px;
  }
  25% {
    -moz-transform: translateY(9px) rotate(22.5deg);
  }
  50% {
    -moz-transform: translateY(18px) scale(1, 0.9) rotate(45deg);
    border-bottom-right-radius: 39px;
  }
  75% {
    -moz-transform: translateY(9px) rotate(67.5deg);
  }
  100% {
    -moz-transform: translateY(0) rotate(90deg);
  }
}

@keyframes shadow {
  0%,
  100% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.2, 1);
  }
}

@-o-keyframes shadow {
  0%,
  100% {
    -o-transform: scale(1, 1);
  }
  50% {
    -o-transform: scale(1.2, 1);
  }
}

@-ms-keyframes shadow {
  0%,
  100% {
    -ms-transform: scale(1, 1);
  }
  50% {
    -ms-transform: scale(1.2, 1);
  }
}

@-webkit-keyframes shadow {
  0%,
  100% {
    -webkit-transform: scale(1, 1);
  }
  50% {
    -webkit-transform: scale(1.2, 1);
  }
}

@-moz-keyframes shadow {
  0%,
  100% {
    -moz-transform: scale(1, 1);
  }
  50% {
    -moz-transform: scale(1.2, 1);
  }
}
</style>
