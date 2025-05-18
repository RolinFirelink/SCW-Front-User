<template>
  <div ref="chartRef" style="width: 100%; height: 400px"></div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
//水图拓展
import 'echarts-liquidfill'
const chartRef = ref(null)

// 更新数据结构
const val1data2 = [
  { value: 0.5, name: '智能识别' },
  { value: 0.3, name: '智能对话' },
  { value: 0.2, name: '智能生长' },
]

const arr = ['middleLost', 0.8, val1data2, '调用成功率']

onMounted(() => {
  const myChart = echarts.init(chartRef.value)

  const option = {
    title: {
      top: '45%',
      left: 'center',
      text: arr[3],
      textStyle: {
        color: '#fff',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 14
      },
      subtext: '(占所有次数的' + ((arr[1] * 10000) / 100).toFixed(2) + '%)',
      subtextStyle: {
        color: '#000000',
        fontSize: 12
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function (res) {
        if (res.componentSubType == 'liquidFill') {
          return res.seriesName + ': ' + ((res.value * 10000) / 100).toFixed(2) + '%'
        } else {
          return (
            '<span class="ii" style="background:' +
            res.color +
            ' "></span>' +
            res.name +
            ':<br/> ' +
            res.data.value
          )
        }
      }
    },
    series: [
      //水图
      {
        type: 'liquidFill',
        itemStyle: {
          normal: {
            opacity: 0.4,
            shadowBlur: 0,
            shadowColor: 'blue'
          }
        },
        name: arr[3],
        data: [
          {
            value: 0.8,
            itemStyle: {
              normal: {
                color: '#53d5ff',
                opacity: 0.8
              }
            }
          }
        ],
        color: ['#53d5ff'],
        center: ['50%', '50%'],
        label: {
          normal: {
            formatter: '',
            textStyle: {
              fontSize: 12
            }
          }
        },
        outline: {
          itemStyle: {
            borderColor: '#86c5ff',
            borderWidth: 0
          },
          borderDistance: 0
        }
      },
      {
        type: 'pie',
        radius: ['42%', '50%'],
        color: ['#c487ee', '#deb140', '#49dff0', '#034079', '#6f81da', '#00ffb4'],
        hoverAnimation: false,
        label: {
          show: true,
          normal: {
            formatter: '{b}\n{d}%',
            show: true,
            position: ''
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        itemStyle: {
          normal: {
            borderWidth: 2,
            borderColor: '#fff'
          },
          emphasis: {
            borderWidth: 0,
            shadowBlur: 2,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: arr[2]
      }
    ]
  }

  myChart.setOption(option)

  window.addEventListener('resize', () => {
    myChart.resize()
  })
})
</script>
