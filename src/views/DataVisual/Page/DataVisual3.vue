<template>
  <div class="z-row" style="display: flex">
    <div class="echartList z-col" style="width: 25%">
      <div class="chart-item" style="height: 43%">
        <BoxContainer :title="'今日国内各品种销售量'">
          <ChordChart />
        </BoxContainer>
      </div>
      <div class="chart-item" style="height: 43%">
        <BoxContainer :title="'高频关键词'">
          <WordChart :config="barchartConfig" />
        </BoxContainer>
      </div>
    </div>
    <div class="echartList z-col" style="width: 45.83%">
      <div class="chart-item" style="height: 32.5%">
        <BoxContainer :title="'今日各功能使用数'">
          <PyramidChart />
        </BoxContainer>
      </div>
      <div class="chart-item" style="height: 60.8%">
        <BoxContainer :title="'历年各地区柑橘产量变化'">
          <DynamicMap />
        </BoxContainer>
      </div>
    </div>
    <div class="echartList z-col" style="width: 25%">
      <div class="chart-item" style="height: 43%">
        <BoxContainer :title="'智能模块使用分布'">
          <WaterChart />
        </BoxContainer>
      </div>
      <div class="chart-item" style="height: 43%">
        <BoxContainer :title="'本日各地区柑橘转运量(单位T)'">
          <HorizontalCompar />
        </BoxContainer>
      </div>
    </div>
  </div>
</template>

<script setup>
import BoxContainer from '../components/Container.vue'
import HorizontalCompar from '@/components/chart/HorizontalCompar.vue'
import WaterChart from '@/views/DataVisual/chart/WaterChart.vue'
import ChordChart from '@/views/DataVisual/chart/ChordChart.vue'
import PyramidChart from '@/views/DataVisual/chart/PyramidChart.vue'
import WordChart from '@/views/DataVisual/chart/WordChart.vue'
import DynamicMap from '@/views/DataVisual/chart/DynamicMap.vue'
const barchartConfig = {
  width: '430px',
  height: '250px'
}
</script>

<style scoped>
@import './layout.scss';
</style>
