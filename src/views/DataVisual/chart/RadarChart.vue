<template>
  <div style="width: 100%; height: 400px">
    <v-chart :option="chartOption" autoresize />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { use } from 'echarts/core'
import VChart from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'

// 注册组件
use([CanvasRenderer, RadarChart, TitleComponent, TooltipComponent, LegendComponent])

const chartOption = ref({
  backgroundColor: '#101736',
  color: ['#00c2ff', '#f9cf67', '#e92b77'],
  legend: {
    show: true,
    bottom: 45,
    center: 0,
    itemWidth: 14,
    itemHeight: 14,
    itemGap: 21,
    textStyle: {
      fontSize: 14,
      color: '#ade3ff'
    },
    data: ['2022', '2023', '2024']
  },
  radar: [
    {
      indicator: [
        { text: '新闻资讯', max: 100 },
        { text: '智能识别', max: 100 },
        { text: '智能问答', max: 100 },
        { text: '专家管理', max: 100 },
        { text: '用户注册', max: 100 }
      ],
      center: ['50%', '50%'],
      radius: 142,
      startAngle: 90,
      splitNumber: 3,
      name: {
        formatter: '{value}',
        textStyle: {
          fontSize: 14,
          color: '#5b81cb'
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['#141c42', '#141c42']
        }
      },
      axisLine: {
        lineStyle: {
          color: '#153269'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#113865',
          width: 1
        }
      }
    }
  ],
  series: [
    {
      name: '雷达图',
      type: 'radar',
      itemStyle: {
        emphasis: {
          lineStyle: {
            width: 4
          }
        }
      },
      data: [
        {
          name: '2016',
          value: [85, 65, 55, 90, 82],
          areaStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#00c2ff' },
                  { offset: 0.5, color: 'rgba(0,0,0,0)' },
                  { offset: 1, color: '#00c2ff' }
                ],
                globalCoord: false
              },
              opacity: 1
            }
          },
          symbolSize: 2.5,
          label: {
            normal: {
              show: true,
              position: 'top',
              distance: 2,
              color: '#6692e2',
              fontSize: 14,
              formatter: (params) => params.value
            }
          },
          itemStyle: {
            normal: {
              borderColor: '#00c2ff',
              borderWidth: 2.5
            }
          }
        },
        {
          name: '2017',
          value: [50, 20, 45, 30, 75],
          symbolSize: 2.5,
          itemStyle: {
            normal: {
              borderColor: '#f9cf67',
              borderWidth: 2.5
            }
          },
          areaStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#f9cf67' },
                  { offset: 0.5, color: 'rgba(0,0,0,0)' },
                  { offset: 1, color: '#f9cf67' }
                ],
                globalCoord: false
              },
              opacity: 1
            }
          }
        },
        {
          name: '2018',
          value: [37, 80, 12, 50, 25],
          symbolSize: 2.5,
          itemStyle: {
            normal: {
              borderColor: '#e92b77',
              borderWidth: 2.5
            }
          },
          areaStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#e92b77' },
                  { offset: 0.5, color: 'rgba(0,0,0,0)' },
                  { offset: 1, color: '#e92b77' }
                ],
                globalCoord: false
              },
              opacity: 1
            }
          }
        }
      ]
    }
  ]
})
</script>
