<template>
  <div class="container" ref="chart" style="width: 420px; height: 300px"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const chart = ref(null)

onMounted(() => {
  const myChart = echarts.init(chart.value)

  const option = {
    backgroundColor: '#062a44',
    series: [
      {
        name: '刻度',
        type: 'gauge',
        radius: '90%',
        min: 0,
        max: 1000,
        splitNumber: 10,
        startAngle: 220,
        endAngle: -40,
        axisLine: {
          show: true,
          lineStyle: {
            width: 1,
            color: [[1, 'rgba(0,0,0,0)']]
          }
        },
        axisLabel: {
          show: true,
          color: '#fff',
          distance: 60,
          fontSize: 12 // 可选，字体大小
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: '#fff',
            width: 1
          },
          length: -8
        },
        splitLine: {
          show: true,
          length: -20,
          lineStyle: {
            color: '#fff'
          }
        },
        detail: {
          show: false
        },
        pointer: {
          show: false
        }
      },
      {
        type: 'gauge',
        radius: '80%',
        center: ['50%', '50%'],
        splitNumber: 0,
        startAngle: 220,
        endAngle: -40,
        axisLine: {
          show: true,
          lineStyle: {
            width: 20,
            color: [
              [
                0.98,
                new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: '#ae3df6' },
                  { offset: 1, color: '#53bef9' }
                ])
              ],
              [1, '#222e7d']
            ]
          }
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        pointer: {
          show: false
        },
        title: {
          show: true,
          offsetCenter: [0, '-20%'],
          textStyle: {
            color: '#ddd',
            fontSize: 15
          }
        },
        detail: {
          show: true,
          offsetCenter: [0, 0],
          color: '#ddd',
          formatter: (params) => `${params}`,
          textStyle: {
            fontSize: 25
          }
        },
        data: [
          {
            name: '预期用户总数',
            value: 800
          }
        ]
      }
    ]
  }

  myChart.setOption(option)

  // 监听窗口大小变化自动缩放图表
  window.addEventListener('resize', () => {
    myChart.resize()
  })
})
</script>

<style scoped>
.container {
  margin-left: 250px;
  margin-top: 80px;
}
</style>
