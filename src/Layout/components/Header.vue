<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import HeaderLink from './HeaderLink.vue'
const isSticky = ref(false)

const handleScroll = () => {
  isSticky.value = window.scrollY > 100 // 滚动超过100px时触发吸顶
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="app-header" :class="{ sticky: isSticky }">
    <div class="container">
      <h1 class="logo">
        <RouterLink to="/" class="logo-link">
          <img src="@/assets/images/logo.png" alt="智慧柑橘" class="logo-image" />
          <span class="logo-text">智慧柑橘</span>
        </RouterLink>
      </h1>
      <HeaderLink />
      <!-- <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜一搜" />
      </div> -->
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  background: #fff;
  user-select: none;
  box-shadow: 0 3px 12px rgba(98, 107, 181, 0.25);
  &.sticky {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    animation: slideDown 0.3s ease;
  }

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }
  .container {
    display: flex;
    align-items: center;
    padding: 20px 0;
  }

  .logo {
    &-link {
      display: inline-flex;
      align-items: center;
      padding: 8px;
      transition: all 0.3s;

      &:hover {
        text-decoration: none;
        .logo-container {
          transform: scale(1.1);
        }
      }
    }

    &-image {
      width: 32px;
      height: 32px;
      object-fit: contain;
      filter: none;
    }

    &-text {
      font-size: 20px;
      font-weight: 700;
      background: linear-gradient(to right, #ff9966, #ff5e62);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: 'Source Han Sans SC', sans-serif;
      letter-spacing: 0.5px;
    }
  }

  .search {
    width: 170px;
    height: 32px;
    position: relative;
    border-bottom: 1px solid #e7e7e7;
    line-height: 32px;

    .icon-search {
      font-size: 18px;
      margin-left: 5px;
    }

    input {
      width: 140px;
      padding-left: 5px;
      color: #666;
    }
  }

  .cart {
    width: 50px;

    .curr {
      height: 32px;
      line-height: 32px;
      text-align: center;
      position: relative;
      display: block;

      .icon-cart {
        font-size: 22px;
      }

      em {
        font-style: normal;
        position: absolute;
        right: 0;
        top: 0;
        padding: 1px 6px;
        line-height: 1;
        background: $helpColor;
        color: #fff;
        font-size: 12px;
        border-radius: 10px;
        font-family: Arial;
      }
    }
  }
}
</style>
