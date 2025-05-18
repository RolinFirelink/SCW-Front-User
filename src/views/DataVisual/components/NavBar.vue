<template>
  <div class="header">
    <div class="title">柑橘数据大屏</div>
    <div class="navList">
      <button
        class="button type1"
        v-for="(navItem, index) in navList"
        :key="index"
        @click="nav(navItem.path)"
      >
        {{ navItem.title }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()
const curPath = ref('')
const navList = ref([
  {
    title: '返回首页',
    path: '/'
  },
  {
    title: '数据全景',
    path: '/data-visual'
  },
  {
    title: '洞察之眼',
    path: '/data-visual2'
  },
  {
    title: '趋势风云',
    path: '/data-visual3'
  }
])
const nav = (path) => {
  if (path === 'back') {
    router.back()
  } else {
    curPath.value = path
    router.replace(path)
  }
}
</script>

<style lang="scss" scoped>
.header {
  margin: 0 auto;
  height: 80px;
  box-sizing: border-box;
  position: relative;
  padding-top: 13px;
  font-size: 36px;
  font-weight: bold;
  color: #00ffff;
  text-align: center;
  letter-spacing: 3px;
  margin-bottom: -60px;
  background: url('@/assets/images/chart/nav.png') no-repeat center top;
}
.return {
  position: absolute;
  top: 0%;
  left: 5%;
}
.navList {
  position: absolute;
  top: -8%;
  right: 1%;
}
.button {
  position: relative;
  padding: 0.2em 1.3em;
  border: none;
  background-color: transparent;
  cursor: pointer;
  outline: none;
  font-size: 18px;
  margin: 0em 0.8em;
}

.button.type1 {
  font-weight: bold;
  color: #00ffff;

  &::after,
  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 20%;
    height: 20%;
    border: 2px solid;
    transition: all 0.3s ease;
    border-radius: 2px;
  }

  &::after {
    bottom: 0;
    right: 0;
    border-top-color: transparent;
    border-left-color: transparent;
    border-bottom-color: #00ffff;
    border-right-color: #00ffff;
  }

  &::before {
    top: 0;
    left: 0;
    border-bottom-color: transparent;
    border-right-color: transparent;
    border-top-color: #00ffff;
    border-left-color: #00ffff;
  }

  &:hover {
    &::after,
    &::before {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
