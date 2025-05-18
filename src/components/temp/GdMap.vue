<template>
  <div class="content">
    <div
      ref="charts"
      :style="{
        width: config.containerWidth,
        height: config.containerHeight,
        marginLeft: config.containerMarginleft,
        marginbottom: config.bot
      }"
    ></div>
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref, defineProps, watch } from 'vue'
import * as echarts from 'echarts'
import guangdong from '@/assets/mapJson/guangdong.json'
import guangzhou from '@/assets/mapJson/guangzhou.json'
import shenzhen from '@/assets/mapJson/shenzhen.json'
import chaozhou from '@/assets/mapJson/chaozhou.json'
import huizhou from '@/assets/mapJson/huizhou.json'
import zhuhai from '@/assets/mapJson/zhuhai.json'
import shantou from '@/assets/mapJson/shantou.json'
import dongguan from '@/assets/mapJson/dongguan.json'
import foshan from '@/assets/mapJson/foshan.json'
import heyuan from '@/assets/mapJson/heyuan.json'
import jiangmen from '@/assets/mapJson/jiangmen.json'
import jieyang from '@/assets/mapJson/jieyang.json'
import maoming from '@/assets/mapJson/maoming.json'
import meizhou from '@/assets/mapJson/meizhou.json'
import qingyuan from '@/assets/mapJson/qingyuan.json'
import shanwei from '@/assets/mapJson/shanwei.json'
import shaoguan from '@/assets/mapJson/shaoguan.json'
import yunfu from '@/assets/mapJson/yunfu.json'
import zhaoqing from '@/assets/mapJson/zhaoqing.json'
import zhanjiang from '@/assets/mapJson/zhanjiang.json'
import zhongshan from '@/assets/mapJson/zhongshan.json'
import yangjiang from '@/assets/mapJson/yangjiang.json'
// import { red } from '@material-ui/core/colors'
// import { getProduceMapData } from '@/api/produce'
const { proxy } = getCurrentInstance()
const props = defineProps(['config', 'flag'])
let maxSupply = 0
let geoCoordMap = {
  广州市: [113.507649675, 23.3200491021],
  东莞市: [113.863433991, 22.9430238154],
  中山市: [113.422060021, 22.5451775145],
  云浮市: [111.750945959, 22.9379756855],
  佛山市: [113.034025635, 23.0350948405],
  惠州市: [114.41065808, 23.1135398524],
  揭阳市: [116.079500855, 23.3479994669],
  梅州市: [116.126403098, 24.304570606],
  汕头市: [116.588650288, 23.2839084533],
  汕尾市: [115.572924289, 22.9787305002],
  江门市: [112.678125341, 22.2751167835],
  河源市: [114.913721476, 23.9572508505],
  深圳市: [114.025973657, 22.5960535462],
  清远市: [113.040773349, 23.9984685504],
  湛江市: [110.165067263, 21.2574631038],
  潮州市: [116.830075991, 23.7618116765],
  珠海市: [113.262447026, 22.1369146461],
  肇庆市: [112.37965337, 23.5786632829],
  茂名市: [110.931245331, 21.9682257188],
  阳江市: [111.777009756, 21.9715173045],
  韶关市: [113.594461107, 24.8029603119]
}

let customerBatteryCityData = [{ name: '广州市', value: 600 }]

const cityNumber = {
  广州市: guangzhou,
  深圳市: shenzhen,
  潮州市: chaozhou,
  惠州市: huizhou,
  珠海市: zhuhai,
  汕头市: shantou,
  中山市: zhongshan,
  东莞市: dongguan,
  佛山市: foshan,
  河源市: heyuan,
  江门市: jiangmen,
  茂名市: maoming,
  梅州市: meizhou,
  清远市: qingyuan,
  汕尾市: shanwei,
  韶关市: shaoguan,
  揭阳市: jieyang,
  云浮市: yunfu,
  肇庆市: zhaoqing,
  湛江市: zhanjiang,
  阳江市: yangjiang
}

let cityScatterData = {}
let pointData = []
onMounted(() => {
  initCharts()
  //   load()
})
watch(
  () => props.flag || props.config.flag
  //   (flag) => {
  //     load()
  //   }
)
// const load = async () => {
//   pointData = []
//   const data = await getProduceMapData({
//     flag: props.flag || props.config.flag
//   })

//   if (data) {
//     const cityMap = new Map()
//     data.forEach((item) => {
//       let baseTotalScale = 0
//       let cityData = cityMap.get(item.city)
//       if (!cityData) {
//         cityData = { name: item.city, value: 0 }
//       }
//       item.productProductionScale.forEach((product) => {
//         cityData.value = parseFloat((cityData.value + product.productionScale).toFixed(2))
//       })
//       cityMap.set(item.city, cityData)
//       //散点
//       const { city, baseName, lat, lng, productProductionScale, region } = item
//       productProductionScale.forEach((item) => {
//         baseTotalScale += Number(item.productionScale)
//       })
//       pointData.push({
//         name: baseName,
//         value: [lng, lat, baseTotalScale],
//         city,
//         region,
//         productProductionScale
//       })
//       maxSupply = Math.max(baseTotalScale, maxSupply)
//     })
//     customerBatteryCityData = Array.from(cityMap.values())
//     if (props.config.flag === 1 || props.flag === '1') {
//       customerBatteryCityData = [
//         { name: '云浮市', value: 12899.4 },
//         { name: '清远市', value: 13600 },
//         { name: '韶关市', value: 3924.2 },
//         { name: '茂名市', value: 8506.4 },
//         { name: '湛江市', value: 8263.35 },
//         { name: '肇庆市', value: 11630.5 },
//         { name: '江门市', value: 5534.31 },
//         { name: '广州市', value: 1344 },
//         { name: '东莞市', value: 83.7 },
//         { name: '梅州市', value: 2666 },
//         { name: '潮州市', value: 1090.8 },
//         { name: '汕头市', value: 659.28 },
//         { name: '揭阳市', value: 2013.07 },
//         { name: '汕尾市', value: 1277.4 },
//         { name: '惠州市', value: 4117.6 },
//         { name: '深圳市', value: 134.7 },
//         { name: '中山市', value: 706.42 },
//         { name: '广州市', value: 1344 },
//         { name: '珠海市', value: 98.1 },
//         { name: '江门市', value: 5534.31 },
//         { name: '佛山市', value: 3712.3 },
//         { name: '河源市', value: 5314.62 }
//       ]
//     }
//     if (props.config.flag === 6 || props.flag === '6') {
//       customerBatteryCityData = [
//         {
//           name: '韶关市',
//           companyList: [
//             {
//               name: '韶关市曲江区预制菜产业园',
//               city: '广东韶关'
//             }
//           ]
//         },
//         {
//           name: '云浮市',
//           companyList: [
//             {
//               name: '温氏',
//               file: '即配',
//               industry: '农林牧渔',
//               city: '广东云浮'
//             }
//           ]
//         },
//         {
//           name: '湛江市',
//           value: 3,
//           companyList: [
//             { name: '国联水产', file: '即配', industry: '农林牧渔', city: '广东湛江' },
//             { name: '广东恒兴', file: '即配', industry: '农林牧渔', city: '广东湛江' },
//             { name: '壹号土猪', file: '即配', industry: '农林牧渔', city: '广东湛江' },
//             { name: '湛江市吴川烤鱼预制菜产业园', city: '广东湛江' }
//           ]
//         },
//         {
//           name: '江门市',
//           value: 2,
//           companyList: [
//             {
//               name: '得宝食品',
//               file: '即配',
//               industry: '农林牧渔',
//               city: '广东台山'
//             },
//             {
//               name: '远宏水产',
//               file: '即配',
//               industry: '农林牧渔',
//               city: '广东台山'
//             },
//             {
//               name: '江门市蓬江区预制菜产业园',
//               city: '广东江门'
//             }
//           ]
//         },
//         {
//           name: '广州市',
//           value: 6,
//           companyList: [
//             {
//               name: '广州酒家',
//               file: '即烹',
//               industry: '餐饮',
//               city: '广东广州'
//             },
//             {
//               name: '广弘控股',
//               file: '即烹',
//               industry: '其他',
//               city: '广东广州'
//             },
//             {
//               name: '江丰实业',
//               file: '即热',
//               industry: '农林牧渔',
//               city: '广东广州'
//             },
//             {
//               name: '九毛九',
//               file: '即烹',
//               industry: '餐饮',
//               city: '广东广州'
//             },
//             {
//               name: '岭南控股',
//               file: '即京',
//               industry: '其他',
//               city: '广东广州'
//             },
//             {
//               name: '尚好菜',
//               file: '即烹',
//               industry: '食品加工',
//               city: '广东广州'
//             },
//             {
//               name: '广州市南沙区预制菜产业园',
//               city: '广东广州'
//             }
//           ]
//         },
//         {
//           name: '珠海市',
//           value: 1,
//           companyList: [
//             {
//               name: '珠海市斗门区预制菜产业园',
//               city: '广东珠海'
//             }
//           ]
//         },
//         {
//           name: '潮州市',
//           vlaue: 1,
//           companyList: [
//             {
//               name: '无穷',
//               file: '即食',
//               industry: '食品加工',
//               city: '广东潮州'
//             },
//             {
//               name: '潮州市饶平县预制菜产业圆',
//               city: '广东潮州'
//             }
//           ]
//         },
//         {
//           name: '茂名市',
//           value: 2,
//           companyList: [
//             {
//               name: '茂名市化州市预制菜产业园',
//               city: '广东茂名'
//             }
//           ]
//         },
//         {
//           name: '惠州市',
//           value: 2,
//           companyList: [
//             {
//               name: '唐顺兴',
//               file: '即配',
//               industry: '农林牧渔',
//               city: '广东惠州'
//             },
//             {
//               name: '惠州市博罗县预制菜产业园',
//               city: '广东惠州'
//             }
//           ]
//         },
//         {
//           name: '佛山市',
//           value: 6,
//           companyList: [
//             {
//               name: '东龙烤鳗',
//               file: '即烹',
//               industry: '农林牧渔',
//               city: '广东佛山'
//             },
//             {
//               name: '甘竹罐头',
//               file: '即食',
//               industry: '食品加工',
//               city: '广东佛山'
//             },
//             {
//               name: '何氏水产',
//               file: '即配',
//               industry: '农林牧渔',
//               city: '广东佛山'
//             },
//             {
//               name: '品珍科技',
//               file: '即烹',
//               industry: '食品加工',
//               city: '广东佛山'
//             },
//             {
//               name: '新雨润',
//               file: '即烹',
//               industry: '食品加工',
//               city: '广东佛山'
//             },
//             {
//               name: '鱼兴港',
//               file: '即配',
//               industry: '农林牧渔',
//               city: '广东佛山'
//             },
//             {
//               name: '佛山市南海区预制菜产业园',
//               city: '广东佛山'
//             },
//             {
//               name: '佛山市顺德区预制菜产业园',
//               city: '广东佛山'
//             }
//           ]
//         }
//       ]
//       customerBatteryCityData.forEach((item) => {
//         item.value = item.companyList.length
//         let sum = 1
//         for (let i = 0; i < item.value; i++) {
//           sum *= 1.2
//         }
//         item.count = item.value
//         item.value = sum
//       })
//     }
//     const rawData = [
//       { name: '国联水产', file: '即配', industry: '农林牧渔', city: '广东湛江' },
//       { name: '广州酒家', file: '即烹', industry: '餐饮', city: '广东广州' },
//       { name: '温氏', file: '即配', industry: '农林牧渔', city: '广东云浮' },
//       { name: '得宝食品', file: '即配', industry: '农林牧渔', city: '广东台山' },
//       { name: '东龙烤鳗', file: '即烹', industry: '农林牧渔', city: '广东佛山' },
//       { name: '甘竹罐头', file: '即食', industry: '食品加工', city: '广东佛山' },
//       { name: '广东恒兴', file: '即配', industry: '农林牧渔', city: '广东湛江' },
//       { name: '广弘控股', file: '即烹', industry: '其他', city: '广东广州' },
//       { name: '何氏水产', file: '即配', industry: '农林牧渔', city: '广东佛山' },
//       { name: '江丰实业', file: '即热', industry: '农林牧渔', city: '广东广州' },
//       { name: '九毛九', file: '即烹', industry: '餐饮', city: '广东广州' },
//       { name: '岭南控股', file: '即京', industry: '其他', city: '广东广州' },
//       { name: '品珍科技', file: '即烹', industry: '食品加工', city: '广东佛山' },
//       { name: '尚好菜', file: '即烹', industry: '食品加工', city: '广东广州' },
//       { name: '唐顺兴', file: '即配', industry: '农林牧渔', city: '广东惠州' },
//       { name: '无穷', file: '即食', industry: '食品加工', city: '广东潮州' },
//       { name: '新雨润', file: '即烹', industry: '食品加工', city: '广东佛山' },
//       { name: '壹号土猪', file: '即配', industry: '农林牧渔', city: '广东湛江' },
//       { name: '鱼兴港', file: '即配', industry: '农林牧渔', city: '广东佛山' },
//       { name: '远宏水产', file: '即配', industry: '农林牧渔', city: '广东台山' }
//     ]

//     // 从原始数据中提取所有不同的城市名称
//     const uniqueCities = [...new Set(rawData.map((item) => item.city))]

//     // 生成结果对象数组
//     const result = uniqueCities.map((city) => ({
//       city,
//       companyList: rawData.filter((item) => item.city === city)
//     }))
//     initCharts()
//   }
// }

function initCharts() {
  const charts = echarts.init(proxy.$refs.charts)
  let currentMap = ref('guangdong') // 在图表初始化之后添加这一行
  const options = {
    goDown: true, // 是否下钻
    backgroundColor: 'rgba(0,0,0,0)',
    tooltip: {
      show: true
    },
    title: {
      text: props.config.containerTitleText,
      x: 'left',
      y: 'top',
      textStyle: {
        color: '#FFFFFF'
      }
    },

    geo: [
      {
        map: 'guangdong',
        aspectScale: 1, //地图的长宽比
        layoutSize: '100%', //地图的大小
        layoutCenter: ['50%', '40%'], //图表中心在容器的位置
        itemStyle: {
          areaColor: {
            //区域颜色
            type: 'linear-gradient',
            x: 0,
            y: 0,
            x2: 0,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(37,128,190,0.3)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(15,128,195,0.3)' // 50% 处的颜色
              }
            ],
            global: true // 缺省为 false
          },
          borderColor: props.config.borderColor,
          borderWidth: 1,
          label: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          },
          emphasis: {
            areaColor: {
              type: 'linear-gradient',
              x: 0,
              y: 0,
              x2: 0,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(37,128,190,1)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(15,128,195,1)' // 50% 处的颜色
                }
              ],
              global: true // 缺省为 false
            }
          }
        },
        emphasis: {
          itemStyle: {
            areaColor: '#0160AD'
          },
          label: {
            show: false,
            textStyle: {
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold' // 添加这行来设置字体为粗体
            }
          }
        },
        zlevel: 3
      }
    ],

    series: [
      {
        geoIndex: 0,
        coordinateSystem: 'geo',
        showLegendSymbol: true,
        type: 'map',
        tooltip: {
          trigger: 'item',
          show: true,
          enterable: true,

          formatter: function (params) {
            if (params.data) {
              const data = params.data
              const name = params.name
              const total =
                '<span style="font-size: 16px; font-weight: bold;color:black ">' +
                '总生产规模： ' +
                (data.value || 0) +
                (props.config.unit || '万吨') +
                '</span>'
              let tooltipString =
                '<div style="text-align: left;">' +
                '<span style="font-size: 16px; font-weight: bold;">' +
                name +
                '</span><br><br>'
              if (params.value && props.config.flag !== 6 && props.flag !== '6') {
                tooltipString += total
              }
              if (params.data.count) {
                tooltipString +=
                  '<span style="font-size: 16px; font-weight: bold;color:black ">' +
                  '企业数量： ' +
                  data.count +
                  '</span>'
              }
              if (params.data.companyList) {
                params.data.companyList.forEach((item) => {
                  if (item.file && item.industry) {
                    tooltipString += `<div style='color:black;'>${item.name}（${item.file}）${item.industry}</div>`
                  } else {
                    tooltipString += `<div style='color:black;'>${item.name}</div>`
                  }
                })
              }
              return tooltipString
            } else {
              return '' // 如果没有数据，返回空字符串
            }
          }
        },
        label: {
          show: true,
          textStyle: {
            color: '#fff'
          },
          emphasis: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          }
        },
        itemStyle: {
          borderColor: '#2ab8ff',
          borderWidth: 1.1,
          areaColor: '#12235c',
          emphasis: {
            areaColor: '#2AB8FF',
            borderWidth: 0,
            color: 'red'
          }
        },
        map: name, // 使用
        data: customerBatteryCityData
      },

      {
        //2
        type: 'lines',
        zlevel: 5,
        effect: {
          show: false,
          // period: 4, //箭头指向速度，值越小速度越快
          // trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
          // symbol: 'arrow', //箭头图标
          // symbol: imgDatUrl,
          symbolSize: 5 // 图标大小
        },
        lineStyle: {
          width: 17, // 尾迹线条宽度
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: 'rgb(199,145,41)' // 0% 处的颜色
              },
              {
                offset: 0.5,
                color: 'rgb(199,145,41)' // 0% 处的颜色
              },
              {
                offset: 0.5,
                color: 'rgb(223,176,32)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgb(223,176,32)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgb(199,145,41)' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          },
          opacity: 1, // 尾迹线条透明度
          curveness: 0 // 尾迹线条曲直度
        },
        label: {
          show: 0,
          position: 'end',
          formatter: '245'
        },
        silent: true,
        data: lineData()
      },
      {
        //3
        type: 'scatter',
        coordinateSystem: 'geo',
        geoIndex: 0,
        zlevel: 7,
        label: {
          show: false,
          position: 'bottom',
          formatter: (params) => this.data[params.dataIndex].value,
          padding: [4, 8],
          backgroundColor: '#003F5E',
          borderRadius: 5,
          borderColor: '#67F0EF',
          borderWidth: 1,
          color: '#67F0EF'
        },
        symbol: 'diamond',
        symbolSize: [17, 8],
        itemStyle: {
          //柱子顶
          color: '#ffd133',
          opacity: 1
        },
        silent: true,
        data: scatterData()
      },
      {
        //4
        type: 'scatter',
        coordinateSystem: 'geo',
        geoIndex: 0,
        zlevel: 7,
        label: {
          formatter: '{b}',
          position: 'bottom',
          color: '#fff',
          fontSize: 12,
          distance: 10,
          show: true
        },
        symbol: 'diamond',
        symbolSize: [17, 8],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: 'rgb(199,145,41)' // 0% 处的颜色
              },
              {
                offset: 0.5,
                color: 'rgb(199,145,41)' // 0% 处的颜色
              },
              {
                offset: 0.5,
                color: 'rgb(223,176,32)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgb(223,176,32)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgb(199,145,41)' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          },
          opacity: 1
        },
        silent: true,
        data: scatterData2()
      },
      {
        zlevel: 10,
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: function (val) {
          //用来设置每个省份圆圈的大小
          return Math.max(8, (val[2] / maxSupply) * 15)
        }, // 根据需要调整符号大小
        data: pointData,
        tooltip: {
          trigger: 'item',
          show: true,
          coordinateSystem: 'geo',
          formatter: function (params) {
            let text = "<div style='text-align:left;'>"
            const { data } = params
            if (data) {
              text += params.name + '<br>'
              data.productProductionScale.forEach((item) => {
                text +=
                  '<strong>' +
                  item.product +
                  '</strong><br>' +
                  item.productionScale +
                  (props.config.unit || '万吨') +
                  '<br>'
              })
            }
            text += '</div>'
            return text
          }
        },
        itemStyle: {
          color: 'green'
        }
      }
    ]
  }
  // 动态计算柱形图的高度（定一个max）
  function lineMaxHeight(cityName) {
    const cityData = cityName ? cityScatterData[cityName] : customerBatteryCityData
    const maxValue = Math.max(...cityData.map((item) => item.value))
    const heightMultiplier = cityName ? 0.3 : 0.9 // 您可以根据需要调整这些值
    return heightMultiplier / maxValue
  }

  // 柱状体的主干
  function lineData(cityName) {
    const cityData = cityName ? cityScatterData[cityName] : customerBatteryCityData
    return cityData
      .filter((item) => geoCoordMap[item.name]) // 新增过滤条件
      .map((item) => {
        const coords = geoCoordMap[item.name]
        return {
          coords: [
            coords,
            [coords[0], coords[1] + item.value * lineMaxHeight(cityName)] // 修改此处为 cityName
          ]
        }
      })
  }

  function scatterData(cityName) {
    const cityData = cityName ? cityScatterData[cityName] : customerBatteryCityData
    return cityData
      .filter((item) => geoCoordMap[item.name]) // 新增过滤条件
      .map((item) => {
        const coords = geoCoordMap[item.name]
        return [coords[0], coords[1] + item.value * lineMaxHeight(cityName)]
      })
  }

  // 柱状体的底部
  function scatterData2(cityName) {
    const cityData = cityName ? cityScatterData[cityName] : customerBatteryCityData
    return cityData.map((item) => {
      return {
        name: item.name,
        value: geoCoordMap[item.name]
      }
    })
  }
  // 注册地图，key为option中设置的，value为地图数据
  echarts.registerMap('guangdong', guangdong)
  charts.setOption(options)

  const save = customerBatteryCityData
  const save2 = geoCoordMap
  //下级地图函数
  function switchMap(params) {
    const name = params.name
    if (cityNumber[name]) {
      echarts.registerMap(name, cityNumber[name])
      options.geo[0].map = params.name
      options.series[4].tooltip.show = true
      options.geo[0].emphasis.label.show = true
      options.series[0].map = name
      options.series[0].tooltip.show = false
      options.series[0].data = customerBatteryCityData
      options.series[0].label.show = true
      options.series[1].data = lineData(name)
      options.series[2].data = scatterData(name)
      options.series[3].data = scatterData2(name)
      // options.series[4].data = cityScatterData[name].map((item) => {
      //   return {
      //     value: item.coordinate, //对应坐标
      //     realvalue: item.value,
      //     name: item.name,
      //     domicile: item.domicile, // 添加此行
      //     contact: item.contact, // 添加此行
      //     mainProduct: item.mainProduct, // 添加此行
      //   };
      // });

      charts.setOption(options, false)

      currentMap.value = name
    }
  }

  // charts.on("click", (params) => {
  //   switchMap(params);
  // });

  // charts.on("dblclick", () => {
  //   // 首先，将isDoubleClick设置为true
  //   if (currentMap.value !== "guangdong") {
  //     // 注册广东省地图并将地图设置回广东省
  //     customerBatteryCityData = save;
  //     geoCoordMap = save2;
  //     echarts.registerMap("guangdong", guangdong);
  //     options.geo[0].map = "guangdong";
  //     options.series[0].map = "guangdong";
  //     options.geo[0].emphasis.label.show = false;
  //     options.series[0].label.show = true; // 设置名称标签显示
  //     options.series[0].data = customerBatteryCityData;
  //     options.series[1].data = lineData();
  //     options.series[2].data = scatterData();
  //     options.series[3].data = scatterData2();
  //     options.series[0].tooltip.show = true;

  //     charts.setOption(options, false);
  //     // 将当前地图设置回广东省
  //     currentMap.value = guangdong;
  //   }
  // });
}
</script>
<style scoped></style>
