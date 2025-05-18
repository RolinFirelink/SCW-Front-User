<template>
  <div class="weather-container">
    <!-- 建议 -->
    <div class="section weather-advice" v-if="suggestion">
      <h2 class="section-title">今日种植建议</h2>
      <div v-html="renderedMarkdown"></div>
    </div>
    <!-- 天气概览部分 -->
    <div class="section weather-overview" v-if="data.shortReport">
      <h2 class="section-title">天气概览</h2>
      <div class="weather-summary">
        <div class="title-icon">
          <!-- <el-icon><weather-icon /></el-icon> -->
          <h3 class="summary-title">{{ data.shortReport }}</h3>
        </div>
      </div>
    </div>

    <!-- 空气质量部分 -->
    <div class="section air-quality">
      <h2 class="section-title">空气质量</h2>
      <div class="weather-details">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <!-- <el-icon><air-quality-icon /></el-icon> -->
              <label>空气质量指数 (AQI):</label>
              <span>{{ data.aqi }}</span>
            </div>
            <div class="detail-item">
              <!-- <el-icon><air-quality-level-icon /></el-icon> -->
              <label>空气质量等级:</label>
              <span>{{ data.level }}</span>
            </div>
            <div class="detail-item">
              <!-- <el-icon><pollutant-icon /></el-icon> -->
              <label>主要污染物:</label>
              <span>{{ data.pollutants }}</span>
            </div>
            <div class="detail-item">
              <!-- <el-icon><pm25-icon /></el-icon> -->
              <label>PM2.5 浓度:</label>
              <span>{{ data.pm }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 其他天气数据部分 -->
    <div class="section other-weather-data">
      <h2 class="section-title">其他天气数据</h2>
      <div class="weather-details">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <!-- <el-icon><temperature-icon /></el-icon> -->
              <label>最高气温:</label>
              <span>{{ data.maxTemperature }}</span>
            </div>
            <div class="detail-item">
              <!-- <el-icon><temperature-icon /></el-icon> -->
              <label>最低气温:</label>
              <span>{{ data.minTemperature }}</span>
            </div>
            <div class="detail-item">
              <!-- <el-icon><rainfall-icon /></el-icon> -->
              <label>最大雨量:</label>
              <span>{{ data.maxRainfall }}</span>
            </div>
            <div class="detail-item">
              <!-- <el-icon><rainfall-icon /></el-icon> -->
              <label>最小雨量:</label>
              <span>{{ data.minRainfall }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <!-- <el-icon><wind-speed-icon /></el-icon> -->
              <label>最大风速:</label>
              <span>{{ data.maxSpeed }}</span>
            </div>
            <div class="detail-item">
              <!-- <el-icon><wind-speed-icon /></el-icon> -->
              <label>最小风速:</label>
              <span>{{ data.minSpeed }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reqGetWeather } from '@/api/home/index'
import { onMounted, ref, computed } from 'vue'
import { marked } from 'marked'
const suggestion = ref('')
const data = ref({})

const getData = async () => {
  const res = await reqGetWeather()
  suggestion.value = res.data.advice
  data.value = res.data
}
onMounted(() => {
  getData()
})
const renderedMarkdown = computed(() => {
  return marked(suggestion.value)
})
</script>

<style lang="scss">

.weather-container {
  padding: 40px;
  background-color: #f8f5f2; // 添加一个柔和的背景色

  .section {
    background: linear-gradient(135deg, #fff6ed, #fff9f5);
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(180, 100, 20, 0.08);
    margin-bottom: 25px;
    padding: 25px;
    border: 1px solid rgba(180, 100, 20, 0.1);
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-3px);
    }

    .section-title {
      font-size: 1.4rem;
      font-weight: 600;
      margin-bottom: 15px;
      color: #d86c1f; // 更深的橙色，减少视觉刺激
      border-bottom: 2px solid rgba(216, 108, 31, 0.2);
      padding-bottom: 8px;
      position: relative;

      &:after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 50px;
        height: 2px;
        background-color: #d86c1f;
      }
    }

    .weather-summary {
      width: 100%;
      max-width: 500px;

      .title-icon {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        padding: 12px;
        background: rgba(216, 108, 31, 0.08);
        border-radius: 10px;
        border-left: 4px solid #d86c1f;

        .summary-title {
          font-size: 1.1rem;
          color: #5c4032; // 更深的褐色
          margin: 0;
          padding: 5px 0;
        }
      }
    }

    .weather-details {
      .detail-item {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        padding: 12px;
        border-radius: 8px;
        background: rgba(216, 108, 31, 0.04);
        transition: all 0.3s ease;
        border-left: 3px solid transparent;

        &:hover {
          background: rgba(216, 108, 31, 0.08);
          border-left-color: #d86c1f;
        }

        label {
          font-size: 1rem;
          font-weight: 500;
          color: #6b4423; // 深褐色
          width: 130px;
          text-align: right;
          margin-right: 15px;
        }

        span {
          font-size: 1rem;
          color: #5c4032;
          font-weight: 500;
        }
      }
    }

    &.weather-advice {
      background: linear-gradient(135deg, #fff6ed, #f9f2ea);
      
      p {
        color: #5c4032;
        line-height: 1.6;
        margin-bottom: 10px;
      }
    }

    &.air-quality {
      .detail-item span {
        padding: 4px 8px;
        border-radius: 4px;
        background: rgba(216, 108, 31, 0.08);
      }
    }
  }
}
</style>
