<template>
  <div class="bar-echart">
    <div class="echart" ref="echartRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, computed, defineProps } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  labels: Array,
  values: Array
})

const echartRef = ref()

const option = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        const data = params[0]
        return `
      <div style="font-weight: bold">${data.name}</div>
      <div>数量：${data.value}</div>
      <div style="font-size: 12px; color: #999">支持鼠标滚动缩放</div>
    `
      }
    },
    grid: {
      bottom: '5%'
    },
    xAxis: {
      data: props.labels,
      axisLabel: {
        inside: true,
        color: '#fff'
      },
      z: 10
    },
    yAxis: {
      axisLabel: {
        color: '#999'
      }
    },
    dataZoom: [
      {
        type: 'inside'
      }
    ],
    series: [
      {
        type: 'bar',
        showBackground: true,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' }
            ])
          }
        },
        data: props.values
      }
    ]
  }
})

onMounted(() => {
  // 初始化echarts实例
  const echartInstance = echarts.init(echartRef.value, 'light', {
    renderer: 'canvas'
  })

  // watchEffect监听option变化, 重新执行
  watchEffect(() => echartInstance.setOption(option.value))

  // 监听window缩放
  window.addEventListener('resize', () => {
    echartInstance.resize()
  })
})
</script>

<style lang="less" scoped>
.echart {
  height: 450px;
}
</style>
