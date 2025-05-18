<!--
  @description 多系列柱状图组件
  @features
    - 支持三个系列的数据展示
    - 带有数据缩放功能
    - 柱状图带渐变色效果
    - 自动轮播高亮效果
    - 响应式图表大小调整
  @props
    - config: 图表配置项
      - width: 图表宽度
      - height: 图表高度
    - data: 图表数据
      - xAxisData: x轴数据
      - seriesData: 三个系列的数据数组
-->
<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({
      width: '300px',
      height: '400px'
    })
  },
  data: {
    type: Object,
    default: () => ({
      xAxisData: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
      seriesData: [
        [500, 550, 600, 650, 700, 750, 800, 850],
        [450, 500, 550, 600, 650, 700, 750, 800],
        [400, 450, 500, 550, 600, 650, 700, 750]
      ]
    })
  }
})

const chartRef = ref(null)
let chart = null
let timer = null

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  const option = {
    backgroundColor: '#323a5e',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '2%',
      right: '4%',
      bottom: '14%',
      top: '16%',
      containLabel: true
    },
    legend: {
      data: ['沃柑', '蜜糖橘', '橘子'],
      right: 10,
      top: 12,
      textStyle: {
        color: '#fff'
      },
      itemWidth: 12,
      itemHeight: 10
    },
    xAxis: {
      type: 'category',
      data: props.data.xAxisData,
      axisLine: {
        lineStyle: {
          color: 'white'
        }
      },
      axisLabel: {
        textStyle: {
          fontFamily: 'Microsoft YaHei'
        }
      }
    },
    yAxis: {
      type: 'value',
      max: '1200',
      axisLine: {
        show: false,
        lineStyle: {
          color: 'white'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.3)'
        }
      }
    },
    dataZoom: [
      {
        show: true,
        height: 12,
        xAxisIndex: [0],
        bottom: '8%',
        start: 10,
        end: 90,
        handleSize: '110%',
        handleStyle: {
          color: '#d3dee5'
        },
        textStyle: {
          color: '#fff'
        },
        borderColor: '#90979c'
      },
      {
        type: 'inside',
        show: true,
        height: 15,
        start: 1,
        end: 35
      }
    ],
    series: [
      {
        name: '沃柑',
        type: 'bar',
        barWidth: '15%',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#fccb05'
              },
              {
                offset: 1,
                color: '#f5804d'
              }
            ]),
            barBorderRadius: 12
          }
        },
        data: props.data.seriesData[0]
      },
      {
        name: '蜜糖橘',
        type: 'bar',
        barWidth: '15%',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#8bd46e'
              },
              {
                offset: 1,
                color: '#09bcb7'
              }
            ]),
            barBorderRadius: 11
          }
        },
        data: props.data.seriesData[1]
      },
      {
        name: '橘子',
        type: 'bar',
        barWidth: '15%',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#248ff7'
              },
              {
                offset: 1,
                color: '#6851f1'
              }
            ]),
            barBorderRadius: 11
          }
        },
        data: props.data.seriesData[2]
      }
    ]
  }

  chart.setOption(option)

  // 自动轮播效果
  let currentIndex = -1
  timer = setInterval(() => {
    const dataLen = option.series[0].data.length

    chart.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: currentIndex
    })

    currentIndex = (currentIndex + 1) % dataLen

    chart.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: currentIndex
    })

    chart.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: currentIndex
    })
  }, 1000)
}

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  if (chart) {
    chart.dispose()
    chart = null
  }
})
</script>

<style scoped>
.chart-container {
  width: v-bind('config.width');
  height: v-bind('config.height');
}
</style>
