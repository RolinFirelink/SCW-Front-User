<template>
  <div class="z-row" style="display: flex">
    <div class="echartList z-col" style="width: 25%">
      <div class="chart-item" style="height: 43%">
        <BoxContainer :title="'历年评价量'">
          <BarChart2/>
        </BoxContainer>
      </div>
      <div class="chart-item" style="height: 28%">
        <BoxContainer :title="'柑橘流程统计'">
          <BasicInfo />
        </BoxContainer>
      </div>
    </div>
    <div class="echartList z-col" style="width: 45.83%">
      <div class="chart-item" style="height: 32.5%; margin-left: 140px">
        <WaterChart2 />
      </div>
      <div class="chart-item" style="height: 60.8%">
        <BoxContainer :title="'当年不同性别用户使用功能倾向'">
          <PieChart3 />
        </BoxContainer>
      </div>
    </div>
    <div class="echartList z-col" style="width: 25%">
      <div class="chart-item" style="height: 43%">
        <BoxContainer :title="'历年用户喜好偏向'">
          <RadarChart />
        </BoxContainer>
      </div>
      <div class="chart-item" style="height: 43%">
        <BoxContainer :title="'本月用户增长量'">
          <LineChart2 :config="barchartConfig" />
        </BoxContainer>
      </div>
    </div>
  </div>
</template>

<script setup>
import BoxContainer from '../components/Container.vue'
import BasicInfo from '@/components/chart/BasicInfo.vue'
import BarChart2 from '@/views/DataVisual/chart/BarChart2.vue'
import RadarChart from '@/views/DataVisual/chart/RadarChart.vue'
import PieChart3 from '@/views/DataVisual/chart/PieChart3.vue'
import LineChart2 from '@/views/DataVisual/chart/LineChart2.vue'
import WaterChart2 from '@/views/DataVisual/chart/WaterChart2.vue'
const barchartConfig = {
  width: '430px',
  height: '250px'
}
</script>

<style scoped>
@import './layout.scss';
</style>
