<template>
  <v-chart :option="chartOption" autoresize style="width: 100%; height: 400px; margin-top: -60px" />
</template>

<script setup>
import { ref } from 'vue'
import { use } from 'echarts/core'
import VChart from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { FunnelChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  LegendComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  FunnelChart,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  LegendComponent
])

const chartOption = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {c}'
  },
  series: [
    {
      name: '用户',
      type: 'funnel',
      left: '10%',
      top: 60,
      bottom: 60,
      width: '80%',
      sort: 'ascending', // 实现金字塔效果
      label: {
        show: true,
        position: 'inside',
        formatter: '{b} ({c})'
      },
      labelLine: {
        length: 10,
        lineStyle: {
          width: 1,
          type: 'solid'
        }
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1
      },
      data: [
        { value: 50, name: '附件' }, // 顶部，数值最小
        { value: 80, name: '轮播图' }, // 第二层
        { value: 120, name: '爬虫' }, // 第三层
        { value: 180, name: '下载' }, // 第四层
        { value: 250, name: '专家' }, // 第五层
        { value: 350, name: '智能' }, // 第六层
        { value: 450, name: '上传' }, // 第七层
        { value: 600, name: '用户' }, // 第八层
        { value: 800, name: '问答' } // 底部，数值最大
      ]
    }
  ]
})
</script>
