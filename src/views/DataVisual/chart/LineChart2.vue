<template>
  <div ref="chartRef" style="width: 100%; height: 400px"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)

onMounted(() => {
  const chart = echarts.init(chartRef.value)

  const option = {
    backgroundColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: '#c86589' },
      { offset: 1, color: '#06a7ff' }
    ]),
    grid: {
      top: '20%',
      left: '10%',
      right: '10%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
      axisLabel: {
        margin: 30,
        color: '#ffffff63'
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: true,
        length: 25,
        lineStyle: {
          color: '#ffffff1f'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#ffffff1f'
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        position: 'right',
        axisLabel: {
          margin: 20,
          color: '#ffffff63'
        },
        axisTick: {
          show: true,
          length: 15,
          lineStyle: {
            color: '#ffffff1f'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#ffffff1f'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#fff',
            width: 2
          }
        }
      }
    ],
    series: [
      {
        name: '注册总量',
        type: 'line',
        smooth: true,
        showAllSymbol: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#fff'
        },
        label: {
          show: true,
          position: 'top',
          textStyle: {
            color: '#fff'
          }
        },
        itemStyle: {
          color: 'red',
          borderColor: '#fff',
          borderWidth: 3
        },
        tooltip: {
          show: false
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#eb64fb' },
            { offset: 1, color: '#3fbbff0d' }
          ])
        },
        data: [393, 438, 485, 631, 689, 824, 987, 1000, 1100, 1200]
      }
    ]
  }

  chart.setOption(option)
  window.addEventListener('resize', () => {
    chart.resize()
  })
})
</script>
