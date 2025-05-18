<template>
  <div style="width: 100%; display: flex; margin-top: 25px">
    <div class="priceChart" style="width: 67%; height: 400px">
      <div ref="lineChart" style="width: 100%; height: 80%"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const unit = ref('元/斤')
const price = ref(0) // 需设置的初始价格

const exampleData = [
  { date: '2023-01-01', value: 3.5 },
  { date: '2023-01-02', value: 3.8 },
  { date: '2023-01-03', value: 3.6 },
  { date: '2023-01-04', value: 3.7 }
]

onMounted(() => {
  // 价格示例，取最后一个数据点
  price.value = exampleData[exampleData.length - 1].value

  const chartDom = ref.$refs.lineChart
  const chart = echarts.init(chartDom)

  const option = {
    xAxis: {
      type: 'category',
      data: exampleData.map((item) => item.date),
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      name: unit.value,
      axisLine: { show: true },
      axisLabel: { formatter: '{value} 元/斤' }
    },
    series: [
      {
        name: '柑橘价格',
        type: 'line',
        data: exampleData.map((item) => item.value),
        smooth: true,
        areaStyle: {
          color: 'rgba(0, 128, 0, 0.3)'
        },
        lineStyle: { color: '#00a651' }
      }
    ]
  }

  chart.setOption(option)
})
</script>

<style lang="scss" scoped>
.report {
  display: flex;
  margin: 5% 0.8% 1.5% 3.5%;

  .reportLabel {
    color: #00a651;
    margin-right: 20px;
    font-size: 1.3em;
    font-weight: bold;
  }

  .reportContent {
    text-align: start;
  }
}

.greenbar {
  width: 96%;
  height: 5px;
  margin: 0 auto;
  background:
    linear-gradient(135deg, transparent 5px, #e0f4ea 0) left/50% 100% no-repeat,
    linear-gradient(-135deg, transparent 5px, #e0f4ea 0) right/50% 100% no-repeat;
}

.left {
  background: #f5fff7;
  box-shadow: 0px 0px 27px 0px rgba(110, 109, 109, 0.2);
  border-radius: 8px;
}

.priceChart {
  margin-left: 1.1%;
  box-shadow: 0px 0px 27px 0px rgba(110, 109, 109, 0.2);
}
</style>
