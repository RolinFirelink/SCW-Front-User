<script setup>
import { reqGetPriceMap, reqGetCnhnbPricePage } from '@/api/market/index'
import TableData from './TableData.vue'
import { ElMessage } from 'element-plus'
import { ref, onMounted, computed } from 'vue'
import TypeBar from '@/components/chart/TypeBar.vue'
const isShowTable = ref(true)
const priceMapData = ref([])
const loading = ref(true)
const chartData = computed(() => {
  const labels = Object.keys(priceMapData.value)
  const values = Object.values(priceMapData.value)
  return { labels, values }
})

const getMapData = async () => {
  const res = await reqGetPriceMap()
  if (res.code !== '200') {
    return ElMessage.error('获取数据失败')
  } else {
    priceMapData.value = res.data
    loading.value = false
  }
}
const toggleView = () => {
  isShowTable.value = !isShowTable.value
}
onMounted(() => {
  getMapData()
})
</script>

<template>
  <div class="content-wrapper">
    <div class="header">
      <h1 style="text-align: center; margin: 0 auto">全国柑橘价格信息</h1>
      <el-button 
        type="warning" 
        size="defalut" 
        @click="toggleView" 
        class="toggle-btn"
      >
        {{ isShowTable ? '查看数据' : '返回图表' }}
      </el-button>
    </div>
    <el-skeleton :loading="loading" :rows="10" animated>
      <template #default>
        <!-- <Transition name="fade" mode="out-in"> -->
        <!-- <div> -->
        <TableData v-show="!isShowTable" key="table" />
        <TypeBar
          v-show="isShowTable"
          :labels="chartData.labels"
          :values="chartData.values"
          key="table"
        />
        <!-- </div> -->
        <!-- </Transition> -->
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped lang="scss">
.content-wrapper {
  font-size: 16px;
  padding-top: 5px;
  padding-bottom: 20px;
  margin-bottom: 70px;
  margin-top: 20px;
  box-shadow: 0px 0px 27px 0px rgba(255, 165, 0, 0.1);
  background: linear-gradient(to bottom, #fff9f2, #ffffff);
  border-radius: 8px;
  border: 1px solid #ffe4ca;
  width: calc(100% + 50px); // 增加宽度
  margin-right: -30px; // 补偿右侧间距
  
  .tableDate {
    padding-bottom: 20px;
  }
}
.header {
  position: relative;
  text-align: center;
  margin: 0 auto;
  padding: 20px; // 增加内边距
  background-color: #fff5e6; // 添加淡橙色背景
  border-bottom: 2px solid #ffd591; // 添加橙色分隔线
  border-radius: 8px 8px 0 0; // 上方圆角

  h1 {
    margin: 0 auto;
    color: #f77f00; // 标题使用深橙色
    font-weight: bold;
  }

  .toggle-btn {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #ff9f1c; // 自定义按钮颜色
    border-color: #ff9f1c;
    
    &:hover {
      background-color: #f77f00; // 悬停时的颜色
      border-color: #f77f00;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
