<!--
  @description 可下钻的中国地图组件
  @features
    - 支持省份下钻查看
    - 支持鼠标缩放和平移
    - 支持双击返回全国地图
    - 支持自定义配置（颜色、大小等）
    - 展示各地区数据分布
  @props
    - config: 地图配置项
      - containerWidth: 容器宽度
      - containerHeight: 容器高度
      - containerMargin: 容器边距
      - textColor: 地图文字颜色
      - backgroundColors: 地图渐变色起始色
      - backgroundColore: 地图渐变色结束色
-->
<template>
  <div class="content">
    <div
      ref="charts"
      :style="{
        width: config.containerWidth,
        height: config.containerHeight,
        margin: config.containerMargin
      }"
    ></div>
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref, defineProps, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import china from '@/assets/china.json'
import guangdong from '@/assets/mapJson/guangdong.json'
import henan from '@/assets/mapJson/henan.json'
import neimenggu from '@/assets/mapJson/neimenggu.json'
import heilongjiang from '@/assets/mapJson/heilongjiang.json'
import xinjiang from '@/assets/mapJson/xinjiang.json'
import hubei from '@/assets/mapJson/hubei.json'
import liaoning from '@/assets/mapJson/liaoning.json'
import shandong from '@/assets/mapJson/shandong.json'
import shanxi from '@/assets/mapJson/shanxi.json'
import shanghai from '@/assets/mapJson/shanghai.json'
import guizhou from '@/assets/mapJson/guizhou.json'
import chongqing from '@/assets/mapJson/chongqing.json'
import anhui from '@/assets/mapJson/anhui.json'
import fujian from '@/assets/mapJson/fujian.json'
import hunan from '@/assets/mapJson/hunan.json'
import hainan from '@/assets/mapJson/hainan.json'
import jiangsu from '@/assets/mapJson/jiangsu.json'
import qinghai from '@/assets/mapJson/qinghai.json'
import guangxi from '@/assets/mapJson/guangxi.json'
import ningxia from '@/assets/mapJson/ningxia.json'
import zhejiang from '@/assets/mapJson/zhejiang.json'
import hebei from '@/assets/mapJson/hebei.json'
import xianggang from '@/assets/mapJson/xianggang.json'
import taiwan from '@/assets/mapJson/taiwan.json'
import aomen from '@/assets/mapJson/aomen.json'
import gansu from '@/assets/mapJson/gansu.json'
import sichuan from '@/assets/mapJson/sichuan.json'
import tianjin from '@/assets/mapJson/tianjin.json'
import jiangxi from '@/assets/mapJson/jiangxi.json'
import sxtaiyuan from '@/assets/mapJson/sxtaiyuan.json'
import xizang from '@/assets/mapJson/xizang.json'
import jilin from '@/assets/mapJson/jilin.json'
import beijing from '@/assets/mapJson/beijing.json'
import yunnan from '@/assets/mapJson/yunnan.json'
// import img1 from '@/assets/icon/chandi2.png'
// import { getPositionDistribution } from '@/api/sale'
import { reqGetProcurementMap, reqGetPriceMap } from '@/api/market/index'
const { proxy } = getCurrentInstance()
const props = defineProps({
  config: {
    type: Object,
    required: true,
    default: () => ({
      containerWidth: '100%',
      containerHeight: '600px',
      containerMargin: '0',
      textColor: '#8B4513',
      backgroundColors: '#fff',
      backgroundColore: '#eee'
    })
  },
  data: {
    type: Array,
    required: true
  }
})
const mapCount = ref({})
onMounted(() => {
  // initCharts()
  getProcurement()
  // getPrice()
})

const geoCoordMap = {
  中国: china,
  广东: guangdong,
  河南: henan,
  内蒙古: neimenggu,
  黑龙江: heilongjiang,
  新疆: xinjiang,
  湖北: hubei,
  辽宁: liaoning,
  山东: shandong,
  陕西: shanxi,
  上海: shanghai,
  贵州: guizhou,
  重庆: chongqing,
  安徽: anhui,
  福建: fujian,
  湖南: hunan,
  海南: hainan,
  江苏: jiangsu,
  青海: qinghai,
  广西: guangxi,
  宁夏: ningxia,
  浙江: zhejiang,
  河北: hebei,
  香港: xianggang,
  台湾: taiwan,
  澳门: aomen,
  甘肃: gansu,
  四川: sichuan,
  天津: tianjin,
  江西: jiangxi,
  山西: sxtaiyuan,
  西藏: xizang,
  吉林: jilin,
  北京: beijing,
  云南: yunnan
}
//TODO: 动态注册地图
//TODO：频繁调用charts.setOption()刷新echats图，性能问题，使用防抖/节流优化
//TODO：数据要作为参数传入！
//TODO: 动态极值

// const values = dataList.map((item) => item.value)
// 向上取整，确保为整数
// const dynamicMax = Math.ceil(Math.max(...values))
// 向下取整，确保为整数
// const dynamicMin = Math.floor(Math.min(...values))
// console.log('最大/最小值', dynamicMax, dynamicMin)
// const step = Math.ceil((dynamicMax - dynamicMin) / 4)
// const pieces = [
//   { lt: dynamicMin + step, label: '无', color: '#d9d9d9' },
//   { gte: dynamicMin + step, lt: dynamicMin + step * 2, label: '少', color: '#ffdfa6' },
//   { gte: dynamicMin + step * 2, lt: dynamicMin + step * 3, label: '中等', color: '#ffa940' },
//   { gte: dynamicMin + step * 3, label: '多', color: '#ff4d4f' }
// ]
function loadMap(name) {
  if (geoCoordMap[name]) {
    echarts.registerMap(name, geoCoordMap[name])
    return true
  }
  return false
}

const getProcurement = async () => {
  const res = await reqGetProcurementMap()
  if (res.code == '200') {
    mapCount.value = res.data
    initCharts()
  }
}

const processData = (province = null) => {
  const result = {}

  // 添加空值检查
  if (!mapCount.value || !Array.isArray(mapCount.value)) {
    return result
  }

  if (!province) {
    // 处理全国视图，显示省级数据
    mapCount.value.forEach((item) => {
      result[item.province] = item.value
    })
  } else {
    // 处理省份下钻视图，显示城市数据
    const provinceData = mapCount.value.find((item) => item.province === province)
    if (provinceData) {
      provinceData.citys.forEach((city) => {
        result[city.city] = city.value
      })
    }
  }

  return result
}

function initCharts() {
  const charts = echarts.init(proxy.$refs.charts)
  let currentMap = ref('china')
  const processedData = processData()
  // const dataList = Object.entries(processedData).map(([name, value]) => ({
  //   name,
  //   value
  // }))
  // console.log('echarts里的data数据', dataList)
  function updateMapData(mapName) {
    const processedData = processData(mapName === 'china' ? null : mapName)

    return Object.entries(processedData).map(([name, value]) => ({
      name,
      value
    }))
  }

  const dataList = updateMapData('china')
  // console.log('echarts里的data数据', dataList)
  function handleMapClick(params) {
    const name = params.name
    if (loadMap(name)) {
      option.geo.map = params.name
      option.geo.center = null
      option.geo.zoom = 1
      //更新数据
      option.series[0].data = updateMapData(name)
      console.log('当前option的数据', option.series[0].data)

      charts.setOption(option, false)
      currentMap.value = name
    }
  }
  function handleDbClick() {
    if (currentMap.value !== 'china') {
      echarts.registerMap('china', china)
      option.geo.map = 'china'
      option.geo.center = null
      option.geo.zoom = 1
      option.series[0].data = updateMapData('china')
      charts.setOption(option, false)
      currentMap.value = 'china'
    }
  }
  function refreshMap(params) {
    let option = charts.getOption()
    if (params.zoom !== null && params.zoom !== undefined) {
      option.geo.zoom = params.zoom
      option.geo.center = params.center
    }
    charts.setOption(option)
  }
  // 监听单击
  charts.on('click', (params) => {
    handleMapClick(params)
  })
  // 监听双击
  charts.on('dblclick', handleDbClick)
  // 监听地图平移pan缩放zoom事件
  charts.on('geoRoam', (params) => {
    refreshMap(params)
  })

  //echats配置项
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        // 获取当前地图级别的数据
        const data = processData(currentMap.value === 'china' ? null : currentMap.value)
        const value = data[params.name] || 0
        return `${params.name} 总数: ${value}`
      }
    },
    goDown: true,
    geo: {
      map: 'china',
      zoom: 1,
      layoutSize: '100%',
      layoutCenter: ['50%', '50%'],
      roam: true,
      label: {
        normal: {
          show: true,
          //默认字体颜色
          textStyle: {
            color: props.config.textColor || '#8B4513'
          }
        },
        emphasis: {
          textStyle: {
            color: 'rgb(183,185,14)',
            fontWeight: 'bold',
            fontSize: 14
          }
        }
      },
      itemStyle: {
        normal: {
          borderColor: 'rgb(147, 235, 248)',
          borderWidth: 1,
          areaColor: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [
              {
                offset: 0,
                color: props.config.backgroundColors
              },
              {
                offset: 1,
                color: props.config.backgroundColore
              }
            ],
            globalCoord: true
          }
        },
        //地图hover颜色
        emphasis: {
          areaColor: '#ff870f',
          borderWidth: 0.1
        }
      }
    },
    //图例
    visualMap: {
      min: 0,
      max: 100,
      left: 26,
      bottom: 40,
      showLabel: true,
      text: ['多', '少'],
      //分段
      pieces: [
        {
          gt: 100,
          label: '> 100 ',
          color: '#7f1100'
        },
        {
          gte: 10,
          lte: 100,
          label: '10 - 100',
          color: '#ff5428'
        },
        {
          gte: 1,
          lt: 10,
          label: '1 - 9',
          color: '#ff8c71'
        },
        {
          gt: 0,
          lt: 1,
          label: '无',
          color: '#ffd768'
        }
      ],
      show: true
    },
    series: [
      {
        name: '数据',
        type: 'map',
        mapType: 'china',
        geoIndex: 0,
        data: dataList
      }
    ]
  }
  echarts.registerMap('china', china)
  charts.setOption(option)
}
// 组件卸载时清理
onUnmounted(() => {})
</script>
