<template>
  <el-table
    ref="scrollableTable"
    :data="tableData"
    :height="height"
    :size="size"
    :stripe="stripe"
    :header-cell-style="headerCellStyle"
    :row-style="rowStyle"
    :row-class-name="tableRowClassName"
    class="custom-scrollable"
  >
    <slot></slot>
  </el-table>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  tableData: {
    type: Array,
    default: () => []
  },
  height: {
    type: [String, Number],
    default: '150'
  },
  size: {
    type: String,
    default: 'small'
  },
  stripe: {
    type: Boolean,
    default: true
  },
  headerCellStyle: {
    type: Object,
    default: () => ({})
  },
  rowStyle: {
    type: Object,
    default: () => ({})
  },
  tableRowClassName: {
    type: Function,
    default: () => ''
  }
})

const scrollableTable = ref(null)
const tableScroll = ref(true)
let scrollInterval = null

const scrollUp = () => {
  nextTick(() => {
    if (!scrollableTable.value) {
      console.error('Table ref 未找到！')
      return
    }

    // el-table 的滚动容器是 .el-scrollbar__wrap
    const scrollContainer = scrollableTable.value.$el.querySelector('.el-scrollbar__wrap')

    if (!scrollContainer) {
      console.error('未找到表格滚动容器 .el-scrollbar__wrap')
      return
    }

    // 监听鼠标悬浮，暂停滚动
    scrollContainer.addEventListener('mouseover', () => {
      tableScroll.value = false
    })
    scrollContainer.addEventListener('mouseout', () => {
      tableScroll.value = true
    })

    // 开启滚动
    scrollInterval = setInterval(() => {
      if (tableScroll.value) {
        scrollContainer.scrollTop += 1
        if (
          scrollContainer.scrollTop + scrollContainer.clientHeight >=
          scrollContainer.scrollHeight
        ) {
          scrollContainer.scrollTop = 0 // 回到顶部，形成无限滚动
        }
      }
    }, 50) // 调整滚动速度
  })
}

onMounted(() => {
  scrollUp() // 组件加载后启动滚动
})

onUnmounted(() => {
  if (scrollInterval) {
    clearInterval(scrollInterval)
  }
})
</script>

<style scoped>
.custom-scrollable {
  overflow-y: auto;
}
</style>
