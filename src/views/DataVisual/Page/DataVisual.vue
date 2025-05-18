<template>
  <div class="z-row" style="display: flex">
    <div class="echartList z-col" style="width: 25%">
      <div class="chart-item" style="height: 43%">
        <BoxContainer :title="'历年沃柑、蜜糖橘、橘子产量'">
          <BarChart :config="barchartConfig" />
        </BoxContainer>
      </div>
      <div class="chart-item" style="height: 43%">
        <BoxContainer :title="'当前系统评价分布'">
          <PieChart2 :config="barchartConfig" />
        </BoxContainer>
      </div>
    </div>
    <div class="echartList z-col" style="width: 45.83%">
      <div class="chart-item" style="height: 32.5%">
        <PieChart :config="barchartConfig" />

        <!-- <div class="placeholder">图表加载中...</div> -->
      </div>
      <div class="chart-item" style="height: 60.8%">
        <BoxContainer :title="'历年各地区柑橘产量变化'">
          <PlaceLineChart :config="barchartConfig" />
        </BoxContainer>
      </div>
    </div>
    <div class="echartList z-col" style="width: 25%">
      <div class="chart-item" style="height: 43%; margin-top: 10px">
        <BoxContainer :title="'地理位置信息'">
          <AMapContainer />
        </BoxContainer>
      </div>
      <div class="chart-item" style="height: 43%">
        <BoxContainer :title="'实时监控'">
          <div class="video-container">
            <video :src="video" autoplay loop muted class="background-video"></video>
          </div>
        </BoxContainer>
      </div>
    </div>
  </div>
</template>

<script setup>
import BoxContainer from '../components/Container.vue'
import BarChart from '@/components/chart/BarChart.vue'
import PlaceLineChart from '@/components/chart/PlaceLineChart.vue'
import PieChart from '@/views/DataVisual/chart/PieChart.vue'
import PieChart2 from '@/views/DataVisual/chart/PieChart2.vue'
import AMapContainer from '@/components/AMapContainer.vue'
import video from '@/assets/video/chart.mp4'
// 图表配置
const barchartConfig = {
  width: '430px',
  height: '400px'
}
</script>

<style scoped>
@import './layout.scss';
.video-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.background-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
