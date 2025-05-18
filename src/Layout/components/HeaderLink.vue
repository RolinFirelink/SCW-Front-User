<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import dropDownIcon from '@/assets/svg/drop-down.svg'
const route = useRoute()
const categoryList = ref([
  { path: 'info', name: '柑橘资讯', showDropdown: false },
  {
    path: 'market',
    name: '柑橘行情',
    showDropdown: false
  },
  {
    // path: 'ai-chat',
    name: '智能AI',
    showDropdown: false,
    subItems: [
      { path: 'ai-chat', name: '智能问答' },
      { path: 'intelligence-recognition', name: '智能识别' },
      { path: 'intelligence-advice', name: '智能建议' }
    ]
  },
  { path: 'experts-profile', name: '专家管理', showDropdown: false },
  { path: 'data-visual', name: '数据大屏', showDropdown: false }
])
const isActive = (item) => {
  // 如果当前路由路径以一级菜单的路径开头，则认为该一级菜单被激活
  return route.path.startsWith(`/${item.path}`)
}
</script>

<template>
  <ul class="app-header-nav">
    <li class="home nav-item">
      <RouterLink to="/">首页</RouterLink>
    </li>
    <li v-for="item in categoryList" :key="item.path" class="nav-item">
      <div
        v-if="item.subItems"
        class="dropdown-container"
        @mouseenter="item.showDropdown = true"
        @mouseleave="item.showDropdown = false"
      >
        <a href="javascript:;" :class="{ active: isActive(item) }">
          {{ item.name }}
          <!-- <img :src="dropDownIcon" class="dropdown-icon" alt="drop-down" /> -->
        </a>
        <!-- 下拉框 -->
        <ul class="dropdown-menu" v-show="item.showDropdown">
          <li v-for="subItem in item.subItems" :key="subItem.path">
            <RouterLink active-class="active" :to="`/${subItem.path}`">
              {{ subItem.name }}
            </RouterLink>
          </li>
        </ul>
      </div>
      <RouterLink active-class="active" v-else :to="`/${item.path}`">
        {{ item.name }}
      </RouterLink>
    </li>
  </ul>
</template>

<style lang="scss">
.app-header-nav {
  display: flex;
  padding-left: 40px;
  position: relative;
  z-index: 998;

  .nav-item {
    position: relative;
    margin-right: 20px;
    width: 120px;
    text-align: center;
    display: flex;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.3s;
    .active {
      color: $mainColor;
      border-bottom: 1px solid $mainColor;
    }

    a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;

      &:hover {
        color: $mainColor;
        border-bottom: 1px solid $mainColor;
        background-color: rgba($mainColor, 0.1);
        .dropdown-icon {
          display: inline-block;
          width: 20px;
          height: 20px;
          transform: rotate(180deg);
        }
      }
    }
  }
}

.dropdown-container {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  min-width: 120px;

  li {
    padding: 8px 16px;
    cursor: pointer;
    .active {
      color: $mainColor;
      border-bottom: 1px solid $mainColor;
    }
    a {
      display: block;
      font-size: 14px;
      color: #333;
      text-decoration: none;
    }
  }
}
</style>
