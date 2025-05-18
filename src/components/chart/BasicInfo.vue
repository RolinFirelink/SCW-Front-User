<template>
  <div class="centerContent">
    <div class="cContent">
      <span class="c1">
        <div>{{ content.ruGe.title }}</div>
        <div class="t1">{{ content.ruGe.value }}</div>
      </span>
      <span class="c2">
        <div>{{ content.zhongGe.title }}</div>
        <div class="t2">{{ content.zhongGe.value }}</div>
      </span>
    </div>
    <div class="cContent">
      <span class="c3">
        <div>{{ content.huoGe.title }}</div>
        <div class="t3">{{ content.huoGe.value }}</div>
      </span>
      <span class="c4">
        <div>{{ content.bingGe.title }}</div>
        <div class="t4">{{ content.bingGe.value }}</div>
      </span>
    </div>
  </div>
</template>
<script setup>
defineProps({
  content: {
    type: Object,
    default: () => ({
      ruGe: {
        title: '柑橘日销数（千万）',
        value: 68420
      },
      zhongGe: {
        title: '柑橘采摘数（千万）',
        value: 4082
      },
      huoGe: {
        title: '柑橘出口数（吨）',
        value: 4082
      },
      bingGe: {
        title: '柑橘出口数（吨）',
        value: 4208
      }
    })
  }
})
</script>

<style lang="scss" scoped>
.centerContent {
  height: 100%;
  .cContent {
    height: 50%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-weight: 700;
    span > div:first-child {
      color: #fff;
      font-size: 17px;
    }
    .c1 {
      padding-left: 15%;
      background: url('../../assets/svg/orange1.svg') no-repeat;
      background-size: 25%;
    }
    .c2 {
      padding-left: 15%;
      background: url('../../assets/svg/orange2.svg') no-repeat;
      background-size: 20%;
      background-position: 10px 4px;
    }
    .c3 {
      padding-left: 15%;
      background: url('../../assets/svg/orange3.svg') no-repeat;
      background-size: 25%;
    }
    .c4 {
      padding-left: 15%;
      background: url('../../assets/svg/orange.svg') no-repeat;
      background-size: 25%;
      background-position: 5px -2px;
    }
    .t1 {
      color: #ee4000;
      font-size: 18px;
    }
    .t2 {
      color: #ee9a49;
      font-size: 18px;
    }
    .t3 {
      color: #eee685;
      font-size: 18px;
    }
    .t4 {
      color: #43cd80;
      font-size: 18px;
    }
  }
}
</style>
