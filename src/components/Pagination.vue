<template>
  <div class="pagination-bar">
    <el-pagination
      :current-page="props.curPage"
      :page-size="props.pageSize"
      :background="true"
      layout="prev, pager, next,total, jumper"
      :total="props.total"
      @current-change="change"
      class="mt-4"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  curPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    default: 0
  }
})
const emits = defineEmits(['pageChange'])
const change = (cur) => {
  emits('pageChange', cur)
}
</script>

<style lang="scss" scoped>
.pagination-bar {
  display: flex;
  justify-content: center;
  margin: 40px 0px;
  color: #666666;
  font-size: 14px;
  line-height: 32px;

  .goButton {
    background: $mainColor;
    width: 30px;
    height: 30px;
    padding: 6px 3px;
    color: white;
    border-radius: 2px;
    border: $mainColor solid 1px;
    margin-left: 20px;
    cursor: pointer;
  }
}
</style>
