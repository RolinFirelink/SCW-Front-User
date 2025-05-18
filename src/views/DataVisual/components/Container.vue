<template>
  <div class="box-container">
    <Angel>
      <div class="title-wrapper">
        <div class="boxTitle">
          {{ props.title }}
          <div class="image">
            <img src="@/assets/gif/wave.gif" alt="wave" />
          </div>
        </div>
      </div>
      <div class="content-wrapper" :style="contentWrapperStyle">
        <div class="main-content">
          <slot></slot>
        </div>
      </div>
    </Angel>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import Angel from './Angel.vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  isHidden: {
    type: Boolean,
    default: false
  }
})

const overflowVisible = ref(props.isHidden)

const contentWrapperStyle = `height: calc(100% - 28px); overflow: ${overflowVisible.value ? 'hidden' : 'visible'};`
</script>
<style lang="scss" scoped>
.box-container {
  width: 100%;
  height: 100%;
  position: relative;
  margin: 50px;
  .title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;
    .boxTitle {
      height: 28px;
      line-height: 40px;
      width: 100%;
      font-size: 1.5rem;
      color: #fff;
      font-weight: bold;
      font-family: '黑体';
      position: absolute;
      top: -40px;
      left: 0;
      display: flex;
      .image {
        display: flex;
        align-items: flex-start;
        img {
          position: absolute;
          right: 0;
          max-width: 100%;
          max-height: 100%;
          margin-top: 15px;
        }
      }
    }
  }
  .content-wrapper {
    padding: 10px;
    .main-content {
      height: calc(100% - 28px);
      width: 100%;
    }
  }
}
</style>
