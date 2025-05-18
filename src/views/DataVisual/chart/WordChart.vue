<template>
  <v-chart :option="option" autoresize style="width: 100%; height: 500px;" />
</template>

<script setup>
import { ref } from 'vue';
import { use } from 'echarts/core';
import VChart from 'vue-echarts';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent } from 'echarts/components';
import 'echarts-wordcloud'; // 直接引入 echarts-wordcloud 插件

// 注册核心组件
use([
  CanvasRenderer,
  TooltipComponent
]);

const list = [
  {
    value: 50,
    name: '柑橘',
    textStyle: {
      shadowBlur: 4,
      shadowColor: '#ECEFFF',
      shadowOffsetY: 14,
      color: '#73DDFF',
    },
  },
  { value: 30, name: '蜜橘' },
  { value: 29, name: '丑橘' },
  { value: 28, name: '蜜糖橘' },
  { value: 27, name: '柠檬' },
  { value: 26, name: '柑' },
  { value: 25, name: '沃柑' },
  { value: 24, name: '橙子' },
  { value: 23, name: '甜柑' },
  { value: 22, name: '苦橘' },
  { value: 21, name: '金橘' },
  { value: 20, name: '砂糖橘' },
  { value: 16, name: '血橙' },
  { value: 15, name: '柚子' },
  { value: 14, name: '青柠' },
  { value: 13, name: '黄皮橘' },
  { value: 12, name: '红橘' },
  { value: 11, name: '蜜柚' },
  { value: 10, name: '柑橘' },
  { value: 9, name: '蜜柑' },
];

const option = ref({
  tooltip: {
    show: true,
    borderColor: '#fe9a8bb3',
    borderWidth: 1,
    padding: [10, 15, 10, 15],
    confine: true,
    backgroundColor: 'rgba(255, 255, 255, .9)',
    textStyle: {
      color: 'hotpink',
      lineHeight: 22
    },
    extraCssText: 'box-shadow: 0 4px 20px -4px rgba(199, 206, 215, .7);border-radius: 4px;'
  },
  series: [
    {
      type: 'wordCloud',
      shape: 'pentagon',
      left: 'center',
      top: 'center',
      width: '100%',
      height: '100%',
      sizeRange: [14, 50],
      rotationRange: [0, 0],
      rotationStep: 0,
      gridSize: 25,
      drawOutOfBound: false,
      layoutAnimation: true,
      textStyle: {
        fontFamily: 'PingFangSC-Semibold',
        fontWeight: 600,
        color: function () {
          const colors = ['#fe9a8bb3', '#fe9a8bb3', '#fe9a8b03', '#9E87FFb3', '#9E87FFb3', '#9E87FFb3', '#fe9a8bb3', '#fe9a8bb3', '#fe9a8bb3', '#73DDFF', '#58D5FF']
          return colors[Math.floor(Math.random() * colors.length)]
        }
      },
      emphasis: {
        focus: 'none'
      },
      data: list
    }
  ]
});
</script>
