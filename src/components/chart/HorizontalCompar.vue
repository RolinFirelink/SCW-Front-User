<!--
  @description 横向对比图组件
  @features
    - 支持自定义数据展示
    - 带有彩色条形图效果
    - 支持自定义颜色配置
    - 响应式图表大小调整
  @props
    - config: 图表配置项
      - width: 图表宽度
      - height: 图表高度
    - data: 图表数据
      - names: 名称数组
      - values: 数值数组
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
      width: '430px',
      height: '400px'
    })
  },
  data: {
    type: Object,
    default: () => ({
      names: [
        '南昌转运中心',
        '广州转运中心',
        '杭州转运中心',
        '宁夏转运中心',
        '兰州转运中心',
        '南宁转运中心',
        '长沙转运中心',
        '武汉转运中心',
        '合肥转运中心',
        '贵州转运中心'
      ],
      values: [4, 13, 25, 29, 38, 44, 50, 52, 60, 72]
    })
  }
})

const chartRef = ref(null)
let chart = null

const myColor = [
  '#eb2100',
  '#eb3600',
  '#d0570e',
  '#d0a00e',
  '#34da62',
  '#00e9db',
  '#00c0e9',
  '#0096f3',
  '#33CCFF',
  '#33FFCC'
]

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  const option = {
    backgroundColor: '#0e2147',
    grid: {
      left: '11%',
      top: '12%',
      right: '0%',
      bottom: '8%',
      containLabel: true
    },
    xAxis: [
      {
        show: false
      }
    ],
    yAxis: [
      {
        axisTick: 'none',
        axisLine: 'none',
        offset: '27',
        axisLabel: {
          textStyle: {
            color: '#ffffff',
            fontSize: '16'
          }
        },
        data: props.data.names
      },
      {
        axisTick: 'none',
        axisLine: 'none',
        axisLabel: {
          textStyle: {
            color: '#ffffff',
            fontSize: '16'
          }
        },
        data: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']
      },
      {
        name: '分拨延误TOP 10',
        nameGap: '50',
        nameTextStyle: {
          color: '#ffffff',
          fontSize: '16'
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0)'
          }
        },
        data: []
      }
    ],
    series: [
      {
        name: '条',
        type: 'bar',
        yAxisIndex: 0,
        data: props.data.values,
        label: {
          normal: {
            show: true,
            position: 'right',
            textStyle: {
              color: '#ffffff',
              fontSize: '16'
            }
          }
        },
        barWidth: 12,
        itemStyle: {
          normal: {
            color: function (params) {
              let num = myColor.length
              return myColor[params.dataIndex % num]
            }
          }
        },
        z: 2
      },
      {
        name: '白框',
        type: 'bar',
        yAxisIndex: 1,
        barGap: '-100%',
        data: [99, 99.5, 99.5, 99.5, 99.5, 99.5, 99.5, 99.5, 99.5, 99.5],
        barWidth: 20,
        itemStyle: {
          normal: {
            color: '#0e2147',
            barBorderRadius: 5
          }
        },
        z: 1
      },
      {
        name: '外框',
        type: 'bar',
        yAxisIndex: 2,
        barGap: '-100%',
        data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        barWidth: 24,
        itemStyle: {
          normal: {
            color: function (params) {
              let num = myColor.length
              return myColor[params.dataIndex % num]
            },
            barBorderRadius: 5
          }
        },
        z: 0
      },
      {
        name: '外圆',
        type: 'scatter',
        hoverAnimation: false,
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        yAxisIndex: 2,
        symbolSize: 35,
        itemStyle: {
          normal: {
            color: function (params) {
              let num = myColor.length
              return myColor[params.dataIndex % num]
            },
            opacity: 1
          }
        },
        z: 2
      }
    ]
  }

  chart.setOption(option)
}

onMounted(() => {
  initChart()
})

onUnmounted(() => {
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
