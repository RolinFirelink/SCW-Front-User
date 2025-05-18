<template>
  <div class="content">
    <div
      ref="charts"
      :style="{
        width: config.containerWidth,
        height: config.containerHeight,
        marginLeft: config.marginLeft,
        marginTop: config.marginTop
      }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, getCurrentInstance } from 'vue'
import * as echarts from 'echarts'
import { reqGetCnhnbPricePage } from '@/api/market/index'

//TODO组件里的数据都要转化为参数传递进来，不能直接在组件调用API接口
const pageNum = ref(1)
const pageSize = ref(70)

const { proxy } = getCurrentInstance()
const props = defineProps(['config'])
const priceData = ref([])
const getData = async (page = 1) => {
  pageNum.value = page
  const res = await reqGetCnhnbPricePage({
    pageNum: pageNum.value,
    pageSize: pageSize.value
  })

  priceData.value = res.data.list
  initCharts()
}
onMounted(() => {
  getData()
  initCharts()
})

function initCharts() {
  const charts = echarts.init(proxy.$refs.charts)
  const xData = []
  const priceValues = []
  priceData.value.forEach((item) => {
    const time = new Date(item.time).toISOString().split('T')[0]
    xData.push(time)
    console.log('提取的时间', time)

    const price = parseFloat(item.price.replace('元/斤', ''))
    console.log('提取的价格', price)

    priceValues.push(price)
  })
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        let tooltip =
          '<div style=" font-weight: bold; display: inline-block;">' +
          params[0].name +
          '</div><br/>'
        params.forEach((param) => {
          tooltip +=
            '<div style="display:flex;align-items:center; margin-top: 5px;">' +
            '<span style="background-color:' +
            param.color +
            ';width:8px;height:8px;border-radius:50%;margin-right:5px;"></span>' +
            '<span>' +
            param.seriesName +
            '：' +
            '</span>' +
            '<span style="font-weight: bold;">' +
            param.value +
            '</span>' +
            props.config.unit +
            '</div>'
        })
        return tooltip
      }
    },
    grid: {
      borderWidth: 0,
      bottom: 20,
      left: 40,
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      textStyle: {
        color: '#ffffff',
        fontSize: 16
      },
      data: ['平均价格']
    },
    xAxis: [
      {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: 'rgba(204,187,225,0.5)'
          }
        },
        axisLabel: {
          color: '#ffffff',
          fontSize: 16
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        data: xData
      }
    ],
    yAxis: [
      {
        name: props.config.unit,
        type: 'value',
        nameTextStyle: {
          color: '#FFFFFF',
          fontSize: 18
        },
        splitLine: {
          show: true
        },
        axisLabel: {
          interval: 0,
          color: '#ffffff',
          fontSize: 16
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#FFFFFF',
            width: 1
          }
        }
      }
    ],
    series: [
      {
        name: '平均价格',
        type: 'line',
        symbolSize: 10,
        symbol: 'circle',
        itemStyle: {
          color: props.config.avgPriceColor || '#FF0000'
        },
        data: priceValues
      }
    ]
  }

  charts.setOption(option)
}
</script>

<style scoped></style>
