<script setup>
import { onMounted, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '400px'
  }
})

let map = null
let marker = null
onMounted(() => {
  AMapLoader.load({
    key: '0293cb0364d619dc864bcc2624495c50',
    version: '2.0',
    plugins: []
  })
    .then((AMap) => {
      const center = [113.282112, 23.105955]
      map = new AMap.Map('container', {
        viewMode: '3D', // 是否为3D地图模式
        zoom: 15, //缩放属性
        center: center
      })
      //自定义mark标记图标
      const customIcon = new AMap.Icon({
        size: new AMap.Size(40, 40),
        image: '/src/assets/icon/mark-red.png',
        // 图标所用图片大小
        imageSize: new AMap.Size(40, 40)
      })
      // 创建点标记，并使用自定义图标
      marker = new AMap.Marker({
        position: center,
        icon: customIcon,
        offset: new AMap.Pixel(-20, -40) // 偏移量要根据图标大小调整
      })

      // 将点标记添加到地图
      marker.setMap(map)
    })
    .catch((e) => {
      console.log(e)
    })
})

onUnmounted(() => {
  if (marker) {
    marker.setMap(null)
    marker = null
  }
  map?.destroy()
})
</script>

<template>
  <div id="container" :style="{ width: props.width, height: props.height }"></div>
</template>
