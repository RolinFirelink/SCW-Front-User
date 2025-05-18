<template>
  <div class="container">
    <table>
      <thead>
        <tr>
          <th>最新时间</th>
          <th>地区</th>
          <th>产品</th>
          <th>价格</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in tableData"
          :key="item.id"
          :class="index % 2 === 0 ? 'evenBackground' : 'oddBackground'"
        >
          <td>{{ formatDate(item.time) }}</td>
          <td>{{ item.address }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.price }}</td>
        </tr>
      </tbody>
    </table>
    <Pagination :curPage="pageNum" :pageSize="pageSize" :total="total" @pageChange="getData" />
  </div>
</template>

<script setup>
//TODO: 切换页面闪烁黑屏，滚动条状态重刷问题
import { ref, onMounted } from 'vue'
import { reqGetCnhnbPricePage } from '@/api/market/index'
import Pagination from '@/components/Pagination.vue'
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])
const loading = ref(true)

const getData = async (page = 1) => {
  loading.value = true
  try {
    pageNum.value = page
    const res = await reqGetCnhnbPricePage({
      pageNum: pageNum.value,
      pageSize: pageSize.value
    })
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 添加日期格式化函数
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

onMounted(() => {
  getData()
})
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-x: auto;
  min-height: 500px;
  padding: 20px;
  background-color: #fff9f2;  /* 添加柔和的橙色背景 */
}

table {
  width: 100%;
  border-collapse: separate;  /* 改为separate以支持圆角 */
  border-spacing: 0;
  table-layout: fixed;
  box-shadow: 0 4px 6px rgba(255, 140, 0, 0.1);  /* 添加柔和的阴影 */
  border-radius: 12px;  /* 表格整体圆角 */
  overflow: hidden;  /* 确保圆角效果可见 */
}

th,
td {
  padding: 16px;
  text-align: center;
  white-space: nowrap;
}

th {
  background-color: #ff8c00;  /* 更改为明亮的橙色 */
  color: white;
  font-weight: 600;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 3px solid #ff6b00;  /* 添加底部边框 */
}

tr {
  vertical-align: middle;
  transition: all 0.3s ease;  /* 添加过渡效果 */
}

.evenBackground {
  background-color: #ffffff;
}

.oddBackground {
  background-color: #fff3e0;  /* 更柔和的橙色背景 */
}

.evenBackground:hover,
.oddBackground:hover {
  background-color: #ffe0b2;
  transform: scale(1.01);  /* 添加微小的放大效果 */
  box-shadow: 0 2px 4px rgba(255, 140, 0, 0.15);
}

td {
  color: #424242;  /* 更改文字颜色 */
  font-size: 14px;
  border-bottom: 1px solid #ffe0b2;  /* 添加柔和的分隔线 */
}

/* 添加响应式设计 */
@media screen and (max-width: 768px) {
  .container {
    padding: 10px;
  }
  
  th,
  td {
    padding: 12px 8px;
    font-size: 13px;
  }
}

/* 优化分页组件样式 */
:deep(.pagination) {
  margin-top: 20px;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(255, 140, 0, 0.1);
}
</style>
