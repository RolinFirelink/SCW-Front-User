<template>
  <div ref="chart" style="width: 100%; height: 600px"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const chart = ref(null)

const categories = ['附件', '轮播图', '爬虫', '下载', '专家', '智能', '上传', '用户', '问答']
const timelineData = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const databeast = {
  1: [389, 259, 262, 324, 232, 176, 196, 214, 133],
  2: [111, 315, 139, 375, 204, 352, 163, 258, 385],
  3: [227, 210, 328, 292, 241, 110, 130, 185, 392],
  4: [100, 350, 300, 250, 200, 150, 100, 150, 200],
  5: [280, 128, 255, 254, 313, 143, 360, 343, 338],
  6: [121, 388, 233, 309, 133, 308, 297, 283, 349],
  7: [200, 350, 300, 250, 200, 150, 100, 150, 200],
  8: [380, 129, 173, 101, 310, 393, 386, 296, 366],
  9: [363, 396, 388, 108, 325, 120, 180, 292, 200]
}

const databeauty = {
  1: [121, 388, 233, 309, 133, 308, 297, 283, 349],
  2: [200, 350, 300, 250, 200, 150, 100, 150, 200],
  3: [380, 129, 173, 101, 310, 393, 386, 296, 366],
  4: [363, 396, 388, 108, 325, 120, 180, 292, 200],
  5: [300, 350, 300, 250, 200, 150, 100, 150, 200],
  6: [100, 350, 300, 250, 200, 150, 100, 150, 200],
  7: [280, 128, 255, 254, 313, 143, 360, 343, 338],
  8: [389, 259, 262, 324, 232, 176, 196, 214, 133],
  9: [111, 315, 139, 375, 204, 352, 163, 258, 385]
}

const baseOption = {
  baseOption: {
    // backgroundColor: '#000',
    timeline: {
      axisType: 'category',
      autoPlay: true,
      playInterval: 1000,
      data: timelineData.map((month) => `${month}月`),
      label: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['男性', '女性'],
      textStyle: {
        color: '#fff'
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: 60,
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: {
        color: '#B2B2B2'
      },
      splitLine: {
        lineStyle: {
          color: '#1F2022'
        }
      }
    },
    yAxis: {
      type: 'category',
      inverse: true,
      data: categories,
      axisLabel: {
        color: '#9D9EA0'
      },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: []
  },
  options: timelineData.map((month) => ({
    series: [
      {
        name: '男性',
        type: 'bar',
        data: databeast[month],
        label: { show: true, position: 'right', color: '#fff' }
      },
      {
        name: '女性',
        type: 'bar',
        data: databeauty[month],
        label: { show: true, position: 'right', color: '#fff' }
      }
    ]
  }))
}

onMounted(() => {
  const myChart = echarts.init(chart.value)
  myChart.setOption(baseOption)
  window.addEventListener('resize', () => {
    myChart.resize()
  })
})
</script>
