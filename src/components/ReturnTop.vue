<template>
  <div class="backtop-container">
    <button class="back-to-top" @click="scrollToTop" v-if="showButton">
      <img src="@/assets/svg/top.svg" alt="" />
      <!-- <span class="btn-text" style="font-size: 12px">返回顶部</span> -->
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const showButton = ref(false)
//获取下滑的值
const handleScroll = () => {
  showButton.value = window.scrollY > 200
}
//返回0顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

//销毁时移除这个监听事件
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="less" scoped>
.backtop-container {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 999;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  .back-to-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 16px;
    cursor: pointer;
    border: none;
    border-radius: 12px;
    background: linear-gradient(145deg, #fff3e0 0%, #ffffff 100%);
    transition: all 0.2s ease;

    svg {
      width: 28px;
      height: 28px;
      transition: transform 0.3s ease;
    }

    .btn-text {
      font-size: 13px;
      font-weight: 500;
      color: #ffa500;
      letter-spacing: 0.5px;
      // text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
    }

    &:hover {
      transform: translateY(-2px);
      // box-shadow: 0 6px 24px rgba(228, 225, 27, 0.25);
      background: linear-gradient(145deg, #ffe0b2 0%, #f5fff5 100%);

      svg {
        transform: scale(1.1) translateY(-2px);
        // filter: drop-shadow(0 3px 6px rgba(0, 128, 0, 0.3));
      }
    }

    &:active {
      transform: scale(0.95);
      // box-shadow: 0 2px 8px rgba(0, 128, 0, 0.2);
    }
  }

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;

    .back-to-top {
      padding: 10px 14px;
      border-radius: 10px;

      svg {
        width: 24px;
        height: 24px;
      }

      .btn-text {
        font-size: 12px;
      }
    }
  }
}
</style>
