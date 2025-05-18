<template>
  <div class="chart-container">
    <v-chart :option="chartOption" autoresize />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { use } from 'echarts/core'
import VChart from 'vue-echarts'
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  LineChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
  DataZoomComponent
} from 'echarts/components'

// 注册组件
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
  DataZoomComponent
])

const chartOption = ref({
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: [
      "广东",
      "湖南",
      "北京",
      "杭州",
      "上海",
    ],
    textStyle: {
      color: "#ffffff", // 图例字体颜色
      fontSize: 14,
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: 60, // 增加底部空间，避免dataZoom挡住x轴
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: [
      "2016",
      "2017",
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
    ],
    axisLine: {
      lineStyle: {
        color: '#ffffff'
      }
    },
    axisLabel: {
      color: '#ffffff',
      fontSize: 12
    }
  },
  yAxis: {
    type: "value",
    axisLine: {
      lineStyle: {
        color: '#ffffff'
      }
    },
    axisLabel: {
      color: '#ffffff',
      fontSize: 12
    },
    splitLine: {
      lineStyle: {
        color: '#ffffff'
      }
    }
  },
  dataZoom: [
    {
      type: 'slider',
      xAxisIndex: 0,
      start: 0,
      end: 100,
      height: 20,
      bottom: 20 // 让滚动条在 X 轴下面
    },
    {
      type: 'inside',
      xAxisIndex: 0,
      zoomOnMouseWheel: true,
      moveOnMouseWheel: true,
      moveOnMouseMove: true
    }
  ],
  series: [
    {
      name: "广东",
      type: "line",
      data: [130, 105, 135, 120, 175, 205, 185, 195, 208],
      smooth: true,
    },
    {
      name: "湖南",
      type: "line",
      data: [225, 222, 180, 234, 205, 180, 170, 220, 231],
      smooth: true,
    },
    {
      name: "北京",
      type: "line",
      data: [180, 230, 201, 150, 230, 230, 240, 210, 240],
      smooth: true,
    },
    {
      name: "杭州",
      type: "line",
      data: [180, 175, 201, 210, 200, 142, 205, 235, 248],
      smooth: true,
    },
    {
      name: "上海",
      type: "line",
      data: [235, 250, 238, 252, 260, 245, 235, 235, 230],
      smooth: true,
    },
  ],
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 600px;
}
</style>
