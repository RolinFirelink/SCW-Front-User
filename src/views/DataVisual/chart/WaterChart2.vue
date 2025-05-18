<template>
  <div ref="chartRef" style="width: 600px; height: 420px"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import 'echarts-liquidfill'

const chartRef = ref(null)
let myChart = null

let angle = 0
const scale = 0.83
const color = '#008CFF'
const value = 0.8935
const values = 0.8935
const data = [values, values]

function getCirlPoint(x0, y0, r, angle) {
  let x1 = x0 + r * Math.cos((angle * Math.PI) / 180)
  let y1 = y0 + r * Math.sin((angle * Math.PI) / 180)
  return {
    x: x1,
    y: y1
  }
}

function getOption() {
  return {
    // backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [
    //   { offset: 0, color: '#282c51' },
    //   { offset: 1, color: '#050a2a' }
    // ]),
    legend: {
      type: 'plain',
      orient: 'vertical',
      right: 0,
      top: '10%',
      align: 'auto',
      data: [],
      textStyle: {
        color: 'white',
        fontSize: 16,
        padding: [10, 1, 10, 0]
      },
      selectedMode: false
    },
    title: {
      text: (value * 100).toFixed(2) + '{a|%}',
      textStyle: {
        fontSize: 40,
        fontFamily: 'Microsoft Yahei',
        fontWeight: 'normal',
        color: '#fff',
        rich: {
          a: {
            fontSize: 60
          }
        }
      },
      x: 'center',
      y: '45%'
    },
    graphic: [
      {
        type: 'group',
        left: 'center',
        top: '60%',
        children: [
          {
            type: 'text',
            z: 100,
            left: '10',
            // top: 'middle',
            style: {
              fill: '#fff',
              text: '项目整体负载率',
              font: '20px Microsoft YaHei'
            }
          }
        ]
      }
    ],
    series: [
      {
        name: 'ring5',
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: (params, api) => ({
          type: 'arc',
          shape: {
            cx: api.getWidth() / 2,
            cy: api.getHeight() / 2,
            r: (Math.min(api.getWidth(), api.getHeight()) / 2) * scale,
            startAngle: ((270 + -angle) * Math.PI) / 180,
            endAngle: ((90 + -angle) * Math.PI) / 180
          },
          style: {
            stroke: color,
            fill: 'transparent',
            lineWidth: 1.5
          },
          silent: true
        }),
        data: [0]
      },
      {
        name: 'ring5',
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: (params, api) => ({
          type: 'arc',
          shape: {
            cx: api.getWidth() / 2,
            cy: api.getHeight() / 2,
            r: (Math.min(api.getWidth(), api.getHeight()) / 2) * scale,
            startAngle: ((90 + -angle) * Math.PI) / 180,
            endAngle: ((270 + -angle) * Math.PI) / 180
          },
          style: {
            stroke: color,
            fill: 'transparent',
            lineWidth: 1.5
          },
          silent: true
        }),
        data: [0]
      },
      {
        name: 'ring5',
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: (params, api) => {
          let x0 = api.getWidth() / 2
          let y0 = api.getHeight() / 2
          let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * scale
          let point = getCirlPoint(x0, y0, r, 90 + -angle)
          return {
            type: 'circle',
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4
            },
            style: {
              stroke: color,
              fill: color
            },
            silent: true
          }
        },
        data: [0]
      },
      {
        name: 'ring5',
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: (params, api) => {
          let x0 = api.getWidth() / 2
          let y0 = api.getHeight() / 2
          let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * scale
          let point = getCirlPoint(x0, y0, r, 270 + -angle)
          return {
            type: 'circle',
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4
            },
            style: {
              stroke: color,
              fill: color
            },
            silent: true
          }
        },
        data: [0]
      },
      {
        type: 'liquidFill',
        radius: '80%',
        center: ['50%', '50%'],
        data: data,
        backgroundStyle: {
          color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.7, [
            { offset: 0, color: '#0a225e' },
            { offset: 0.5, color: '#0b215d' },
            { offset: 1, color: '#207cdb' }
          ])
        },
        outline: {
          borderDistance: 10,
          itemStyle: {
            borderWidth: 0,
            shadowBlur: 0
          }
        },
        itemStyle: {
          color: {
            type: 'linear',
            x: 0.6,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(212, 252, 125, 1)' },
              { offset: 0.5, color: 'rgba(2, 193, 131, 1)' },
              { offset: 1, color: 'rgba(2, 193, 131, 1)' }
            ],
            globalCoord: false
          },
          shadowBlur: 10,
          shadowColor: 'rgba(13, 13, 46, 0)'
        },
        label: {
          normal: {
            formatter: ''
          }
        }
      }
    ]
  }
}

let interval = null

function draw() {
  angle += 3
  myChart.setOption(getOption(), true)
}

onMounted(() => {
  myChart = echarts.init(chartRef.value)
  draw()
  interval = setInterval(draw, 100)
})

onBeforeUnmount(() => {
  clearInterval(interval)
  myChart?.dispose()
})
</script>
