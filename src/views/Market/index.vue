<script setup>
import { ref, onMounted, reactive } from 'vue'
import Pagination from '@/components/Pagination.vue'
import ScrollableTable from '@/components/ScrollableTable.vue'
import DrillingMap from '@/components/chart/DrillingMap.vue'
import { reqGetProcurementPage } from '@/api/market/index'
import Price from './component/Price.vue'

const tableData = ref([])
const pageNum = ref(1)
const pageSize = ref(100)
const showAddProcureDialog = ref(false)

const getData = async (page = 1) => {
  pageNum.value = page
  const res = await reqGetProcurementPage({
    pageNum: pageNum.value,
    pageSize: pageSize.value
  })
  tableData.value = res.data.list
}

const drillingConfig = ref({
  containerWidth: '100%', // 改为响应式宽度
  containerHeight: '500px',
  backgroundColors: '#FFF3E0', // 更柔和的橘色背景
  backgroundColore: '#FFE0B2',
  legendColor: '#FB8C00' // 更现代的橘色
})

onMounted(() => {
  getData()
})
</script>

<template>
  <div class="content-wrapper">
    <div class="page-header">
      <h1>全国柑橘采购信息</h1>
      <div class="orange-divider"></div>
    </div>

    <el-row :gutter="30">
      <el-col :span="12">
        <div class="chart-container">
          <h3>采购分布地图</h3>
          <div class="chart">
            <DrillingMap :config="drillingConfig" />
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="table-container">
          <h3>采购详细信息</h3>
          <div class="tableDate">
            <ScrollableTable :tableData="tableData" height="450" size="small">
              <el-table-column prop="name" label="名称" />
              <el-table-column prop="amount" label="数量" sortable />
              <el-table-column prop="address" label="地址" />
              <el-table-column prop="purchaser" label="采购者" />
              <el-table-column prop="updateTime" label="更新时间" />
            </ScrollableTable>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
  <Price />
</template>

<style scoped lang="scss">
.content-wrapper {
  font-size: 16px;
  padding: 30px;
  margin: 30px auto;
  box-shadow: 0 4px 20px rgba(255, 140, 0, 0.1);
  background-color: #fff;
  border-radius: 16px;
  max-width: 1400px;

  .page-header {
    text-align: center;
    margin-bottom: 40px;

    h1 {
      color: #f57c00;
      font-size: 32px;
      font-weight: 600;
      margin: 0;
    }

    .orange-divider {
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, #ffb74d, #ff9800);
      margin: 15px auto;
      border-radius: 2px;
    }
  }

  .chart-container,
  .table-container {
    background-color: #fff8e1;
    border-radius: 12px;
    padding: 20px;
    height: 100%;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }

    h3 {
      color: #f57c00;
      font-size: 20px;
      margin-bottom: 20px;
      padding-left: 15px;
      border-left: 4px solid #ffb74d;
    }
  }

  .chart {
    background-color: rgba(255, 255, 255, 0.7);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(255, 140, 0, 0.08);
  }

  .tableDate {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(255, 140, 0, 0.08);

    :deep(.el-table) {
      border-radius: 8px;
      overflow: hidden;

      th {
        background-color: #fff3e0;
        color: #f57c00;
        font-weight: 600;
      }

      td {
        color: #5d4037;
      }

      tr:hover > td {
        background-color: #fff8e1;
      }
    }
  }
}
</style>
