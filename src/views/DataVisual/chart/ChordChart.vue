<template>
  <div ref="chartRef" style="width: 600px; height: 400px;"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)

onMounted(() => {
  const myChart = echarts.init(chartRef.value)

  const option = {
    title: {
      text: '今日国内各品种像销售量',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        fontFamily: 'Microsoft YaHei',
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 5,
        shadowOffsetX: 2,
        shadowOffsetY: 2
      }
    },
    tooltip: {
      trigger: 'item',
      textStyle: {
        color: '#ffffff', // ✅ 更显眼的文字颜色
        fontSize: 14,
        fontWeight: 'bold'
      },
      backgroundColor: 'rgba(50,50,50,0.9)' // ✅ 提高对比度
    },
    legend: {
      orient: 'vertical',
      left: 10,
      top: 20,
      textStyle: {
        color: '#ffffff', // ✅ 白色字体
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    series: [
      {
        name: '货物金额',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 600, name: '橘子' },    // 20%
          { value: 50, name: '丑橘' },   // 7.5%
          { value: 715, name: '蜜糖橘' }, // 2.5%
          { value: 155, name: '柠檬' },    // 15%
          { value: 204, name: '柑' },      // 20%
          { value: 180, name: '沃柑' },    // 10%
          { value: 135, name: '橙子' },    // 10%
          { value: 285, name: '甜柑' },   // 2.5%
          { value: 253, name: '苦橘' }    // 2.5%
        ]
      }
    ]
  }

  myChart.setOption(option)
})
</script>
