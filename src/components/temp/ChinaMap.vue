<template>
  <div class="content">
    <div
      ref="charts"
      :style="{
        width: config.containerWidth,
        height: config.containerHeight,
        marginTop: config.containerMargintop
      }"
    ></div>
  </div>
  <!-- 使用示例 -->
  <!-- <ChinaMap :config="echartsMapConfig" /> -->
  <!-- const echartsMapConfig = reactive({
    containerWidth: '420px',
    containerHeight: '300px',
    containerMargintop: '-5px',
    clo: '#FF3B8B',
    containerTitleText: '采购图',
    borderColor: '#FFC6E6',
    areaColor2: 'rgba(255,150,218,0.7)',
    flag: 3
  }) -->
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, defineProps, watch } from 'vue'
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
import shanxi2 from '@/assets/mapJson/shanxi.json'
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
import shanxi1 from '@/assets/mapJson/3C.json'
import xizang from '@/assets/mapJson/xizang.json'
import jilin from '@/assets/mapJson/jilin.json'
import beijing from '@/assets/mapJson/beijing.json'
import yunnan from '@/assets/mapJson/yunnan.json'

const { proxy } = getCurrentInstance()

const props = defineProps(['config', 'flag'])
//当前地图
let currentMap = ref('china')
//点数据
const points = ref([
  // 散点图数据
  // { name: "新疆", value: [87.628579, 43.793301], itemStyle: { color: "#00EEFF" } }, // 新疆
])
// 线数据
const linesData = ref([])
watch(
  () => props.flag || props.config.flag
  //   (flag) => {
  //     load()
  //   }
)
//发请求获取数据
// const load = async () => {
//   const data = await getSaleLocation({ flag: props.flag || props.config.flag })
//   if (data) {
//     linesData.value = data.map((item) => {
//       return {
//         coords: [
//           [item.startLng, item.startLat],
//           [item.endLng, item.endLat]
//         ]
//       }
//     })
//     initCharts()
//   }
// }

onMounted(() => {
  initCharts()
})
//省份的Json文件信息
const provinceNumber = {
  广东: guangdong,
  河南: henan,
  内蒙古: neimenggu,
  黑龙江: heilongjiang,
  新疆: xinjiang,
  湖北: hubei,
  辽宁: liaoning,
  山东: shandong,
  陕西: shanxi2,
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
  山西: shanxi1,
  西藏: xizang,
  吉林: jilin,
  北京: beijing,
  云南: yunnan
}
//初始化图表
function initCharts() {
  // 地图的option配置
  const option = {
    title: {
      // text: props.config.titleName,
      text: props.config.containerTitleText || '销售流向图',
      x: 'center',
      y: 'top',
      textStyle: {
        color: '#FFFFFF'
      }
    },
    tooltip: {
      trigger: 'item',
      show: true,
      enterable: true,
      formatter: '{b}'
    },
    geo: {
      map: 'china',
      layoutSize: '125%',
      layoutCenter: ['50%', '50%'],
      label: {
        // 图形上的文本标签
        show: false,
        textStyle: {
          color: '#FFB80055'
        },
        emphasis: {
          // 鼠标放上去高亮的样式
          textStyle: {
            color: '#fff'
          }
        }
      },
      itemStyle: {
        // 地图区域的样式设置
        borderColor: props.config.borderColor,
        borderWidth: 1,
        areaColor: {
          //地图区域的颜色
          type: 'radial', // 径向渐变
          x: 0.5, // 圆心
          y: 0.5, // 圆心
          r: 0.8, // 半径
          colorStops: [
            {
              // 0% 处的颜色
              offset: 0,
              color: 'rgba(0, 102, 154, 0)'
            },
            {
              // 100% 处的颜色
              offset: 1,
              color: 'rgba(0, 102, 154, .4)'
            }
          ]
        },
        // 鼠标放上去高亮的样式
        emphasis: {
          areaColor: props.config.areaColor2,
          borderWidth: 0
        }
      }
    },
    series: [
      // 散点系列数据
      {
        type: 'effectScatter', // 带有涟漪特效动画的散点（气泡）图
        coordinateSystem: 'geo', //该系列使用的坐标系:地理坐标系
        // 特效类型,目前只支持涟漪特效'ripple'，意为“涟漪”
        effectType: 'ripple',
        // 配置何时显示特效。可选'render'和'emphasis' 。
        showEffectOn: 'render',
        rippleEffect: {
          // 涟漪特效相关配置。
          period: 10, // 动画的周期，秒数。
          scale: 4, // 动画中波纹的最大缩放比例。
          // 波纹的绘制方式，可选 'stroke' 和 'fill'。
          brushType: 'fill'
        },
        zlevel: 1, // 所有图形的 zlevel 值。
        data: points.value
      },
      // 线条系列数据
      {
        type: 'lines',
        zlevel: 2,
        symbol: ['none', 'arrow'], // 标记的图形: 箭头
        symbolSize: 10, // 标记的大小
        effect: {
          // 线条特效的配置
          show: true,
          period: 6, // 特效动画的时间，单位s
          trailLength: 0, // 特效尾迹的长度。取值[0,1]值越大，尾迹越重
          symbol: props.config.trans, // 特效图形的标记 可选'circle'等
          symbolSize: 15 // 特效标记的大小
        },
        lineStyle: {
          // 线条样式
          normal: {
            color: props.config.clo,
            width: 2.5, // 线条宽度
            opacity: 0.6, // 尾迹线条透明度
            curveness: 0.2 // 尾迹线条曲直度
          }
        },
        data: linesData.value
      }
    ]
  }
  const charts = echarts.init(proxy.$refs.charts)

  //注册地图
  echarts.registerMap('china', china)
  charts.setOption(option)
  //更新下级地图
  function switchMap(params) {
    const name = params.name //拿到点击的省份
    if (provinceNumber[name]) {
      echarts.registerMap(name, provinceNumber[name])
      currentMap.value = name
      option.geo.map = currentMap.value //更新地图
      // option.series[1].data = nextLineData.value; //下级地图的航线不要
      // 根据当前的省市的值筛选散点信息
      // const filteredPoints = nextPoints.value.filter((point) => {
      //   return point.name === currentMap.value;
      // });
      // 根据当前的省市的值筛选散点信息
      // const filteredPoints = nextPoints.value.filter((point) => {
      //   return point.name.includes(currentMap.value) && point.name.includes(params.name);
      // }).map((point) => {
      //   return point.name;
      // });
      // option.series[0].data = filteredPoints.value
      // option.series[0].data = nextPoints.value; //下级地图的散点信息
      charts.setOption(option)
    }
  }
  // 单击进入下一个地图
  // charts.on("click", (params) => {
  //   switchMap(params);
  // });
  // // 双击回到原来的中国地图
  // charts.on("dblclick", () => {
  //   if (currentMap.value !== "china") {
  //     // 回到中国地图
  //     echarts.registerMap("china", china);
  //     //更新变量名
  //     currentMap.value = "china";
  //     option.geo.map = currentMap.value;
  //     option.series[1].data = linesData.value;
  //     charts.setOption(option);
  //   }
  // });
}
</script>
<style scoped>
.content {
  margin-top: 10px;
  height: 80%;
}
</style>
