<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import logoSvg from '@/assets/img/image_logo.svg?component'

const router = useRouter()

const isLogin = ref(true)

const {
  proxy: { $user },
} = getCurrentInstance()

/**
 * Event
 */
// 登出
function logout() {
  console.log('logout')
  $user.signOut()
  router.replace({ path: '/login' })
}

// 回首頁
function routerToHome() {
  router.push({
    path: '/',
  })
}
</script>

<template>
  <header class="main__header d-flex justify-content-between align-items-center">
    <logoSvg class="header__logo header__icon cursor-pointer svg__currentColor" @click="routerToHome" />
    <div class="header__control d-flex align-items-center" v-if="isLogin">
      <HomeOutlined class="d-flex align-items-center control__icon" @click="routerToHome" />
      <UserOutlined class="control__icon" />
      <a-dropdown overlayClassName="userDropdown">
        <span class="cursor-pointer">B0123 李X文</span>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="logout">登出</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </header>
</template>

<style scoped lang="scss">
.main__header {
  height: #{$MAIN-HEADER-H}px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: $COLOR-WHITE;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.12);
  padding: 0 18px;
  z-index: 30;
  border-bottom: 1px solid $COLOR-GRAY5;
}
.header__logo {
  min-width: 126px;
  height: 27px;
  margin-left: 0;
  color: #333;
}
.header__control {
  .control__icon {
    margin-left: 5px;
    margin-right: 5px;
    font-size: 25px;
    color: $COLOR-MAIN2;
  }
}
</style>
