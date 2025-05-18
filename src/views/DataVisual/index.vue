<template>
  <div class="app-container">
    <div ref="drawDom">
      <NavBar />
      <div class="main-container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import NavBar from './components/NavBar.vue'
import { useDrawToVue3 } from '@yangtaowei/b-s-adaption'
const drawDom = ref(null)
//移动端标识
const isMobile = window.innerWidth <= 768
const baseWidth = isMobile ? 3800 : 1920
const baseHeight = Math.round((baseWidth * 9) / 16)
const { calcRate, resize } = useDrawToVue3(drawDom, {
  baseWidth: baseWidth,
  baseHeight: baseHeight
})

onMounted(() => {
  calcRate()
  window.addEventListener('resize', resize, false)
  const container = drawDom.value
  if (container) {
    container.style.overflow = 'hidden'
  }
})
onBeforeUnmount(() => window.removeEventListener('resize', resize, false))
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: url('@/assets/images/chart/bg.png') no-repeat center center;
  background-blend-mode: lighten;
  background-size: cover;
  background-position: center;
  user-select: none;
  .main-container {
    height: calc(100% - 70px);
    position: relative;
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
