<template>
  <div class="chart-container">
    <v-chart :option="option" autoresize />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { use } from 'echarts/core'
import VChart from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

// 初始化变量
const bgColor = '#062a44'
const title = '总量'
const color = ['#0E7CE2', '#FF8352', '#E271DE', '#F8456B', '#00FFFF', '#4AEAB0']
const echartData = [
  { name: '好评', value: 3720 },
  { name: '中评', value: 2920 },
  { name: '未评价', value: 2200 },
  { name: '差评', value: 1420 }
]

const formatNumber = (num) => {
  const reg = /(?=(\B)(\d{3})+$)/g
  return num.toString().replace(reg, ',')
}

const total = echartData.reduce((a, b) => a + b.value * 1, 0)

const option = ref({
  backgroundColor: bgColor,
  color: color,
  title: [
    {
      text: `{name|${title}}\n{val|${formatNumber(total)}}`,
      top: 'center',
      left: 'center',
      textStyle: {
        rich: {
          name: {
            fontSize: 12, // ✅ 更小一点
            fontWeight: 'normal',
            color: '#ffffff',
            padding: [6, 0]
          },
          val: {
            fontSize: 24, // ✅ 缩小字体
            fontWeight: 'bold',
            color: '#ffffff'
          }
        }
      }
    }
  ],
  series: [
    {
      type: 'pie',
      radius: ['40%', '55%'], // ✅ 半径更小一点，避免 label 被挤
      center: ['50%', '50%'],
      data: echartData,
      hoverAnimation: false,
      itemStyle: {
        normal: {
          borderColor: bgColor,
          borderWidth: 2
        }
      },
      labelLine: {
        normal: {
          length: 12, // ✅ 缩短线条
          length2: 40, // ✅ 缩短外层线条
          lineStyle: {
            color: '#ffffff'
          }
        }
      },
      label: {
        normal: {
          formatter: (params) => {
            return `{icon|●}{name|${params.name}} {value|${formatNumber(params.value)}}`
          },
          padding: [0, -40, 20, -40], // ✅ 让文字距离中间更近一点
          rich: {
            icon: {
              fontSize: 12
            },
            name: {
              fontSize: 12, // ✅ 缩小字体
              padding: [0, 6, 0, 2],
              color: '#ffffff'
            },
            value: {
              fontSize: 14, // ✅ 缩小数字字体
              fontWeight: 'bold',
              color: '#ffffff'
            }
          }
        }
      }
    }
  ]
})
</script>

<style scoped>
.chart-container {
  width: 440px;
  height: 400px;
}
</style>
