<template>
  <div ref="chartRef" style="width: 440px; height: 400px"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)

onMounted(() => {
  const chart = echarts.init(chartRef.value)

  const data = [220, 182, 191, 234, 290, 330, 310]
  const sideData = data.map((item) => item + 4.5)

  const option = {
    backgroundColor: '#041730',
    tooltip: {
      trigger: 'axis',
      formatter: '{b} : {c}',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      data: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
      axisLine: {
        lineStyle: {
          color: '#3eb2e8'
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff'
        }
      }
    },
    yAxis: {
      axisLine: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#4784e8'
        }
      }
    },
    series: [
      {
        name: 'a',
        tooltip: { show: false },
        type: 'bar',
        barWidth: 24.5,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              { offset: 0, color: '#0B4EC3' },
              { offset: 0.6, color: '#138CEB' },
              { offset: 1, color: '#17AAFE' }
            ])
          }
        },
        data: data,
        barGap: 0
      },
      {
        type: 'bar',
        barWidth: 8,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              { offset: 0, color: '#09337C' },
              { offset: 0.6, color: '#0761C0' },
              { offset: 1, color: '#0575DE' }
            ])
          }
        },
        barGap: 0,
        data: sideData
      },
      {
        name: 'b',
        tooltip: { show: false },
        type: 'pictorialBar',
        itemStyle: {
          borderWidth: 1,
          borderColor: '#0571D5',
          color: '#1779E0'
        },
        symbol: 'path://M 0,0 l 120,0 l -30,60 l -120,0 z',
        symbolSize: ['30', '12'],
        symbolOffset: ['0', '-11'],
        symbolPosition: 'end',
        data: data,
        z: 3
      }
    ]
  }

  chart.setOption(option)

  // 响应式重绘
  window.addEventListener('resize', () => {
    chart.resize()
  })
})
</script>

<style scoped></style>
