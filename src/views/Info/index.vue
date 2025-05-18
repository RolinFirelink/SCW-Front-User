<template>
  <el-tabs class="custom-tabs" type="card" v-model="activeTab">
    <el-tab-pane
      v-for="tab in tabs"
      :key="tab.type"
      :label="tab.label"
      :name="tab.type"
    >
      <div class="presentaionList" ref="presentationList">
        <div v-for="item in pageList" :key="item.id" class="presentation">
          <img class="headImg" :src="item.headImg" />
          <div class="content">
            <div class="name">
              <RouterLink active-class="active" :to="{ path: `article/${item.id}` }">
                {{ item.title }}
              </RouterLink>
            </div>
            <div class="meta">
              <span class="author">{{ item.author }}</span>
              <span class="time">{{ item.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>

  <!-- 加载更多按钮 -->
  <el-button v-if="hasMore" @click="loadMore" class="load-more-btn" link type="primary">
    加载更多
  </el-button>
  <div v-if="loadingMore" class="loading-more">加载中...</div>
  <div v-if="!hasMore" class="no-more">没有更多了</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { reqGetGanjuwPage } from '@/api/info/index'

const tabs = [
  { label: '行业资讯', type: 'NEWS' },
  { label: '政策法规', type: 'LAWS' },
  { label: '行情资讯', type: 'MARKET' },
  { label: '种植技术', type: 'TECH' },
  { label: '橘页头条', type: 'HEAD' }
]

const activeTab = ref(tabs[0].type)
const pageList = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loadingMore = ref(false)
const hasMore = ref(true)

// 监听 Tab 切换，重置数据并加载第一页
watch(activeTab, async (newType) => {
  pageNum.value = 1
  pageList.value = []
  hasMore.value = true
  await getDatas(newType)
})

// 获取数据（可加载更多）
const getDatas = async (type, append = false) => {
  if (loadingMore.value) return
  loadingMore.value = true

  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    type: type || activeTab.value
  }

  try {
    const res = await reqGetGanjuwPage(params)
    const { list, total: totalCount } = res.data

    if (append) {
      pageList.value = [...pageList.value, ...list]
    } else {
      pageList.value = list
    }

    total.value = totalCount
    hasMore.value = pageNum.value * pageSize.value < total.value
    pageNum.value += 1
  } catch (error) {
    console.error('加载数据失败:', error)
  }

  loadingMore.value = false
}

// 加载更多数据
const loadMore = () => {
  getDatas(activeTab.value, true)
}

// 页面初始化
onMounted(() => {
  getDatas()
})
</script>

<style lang="less" scoped>
.headImg {
  width: 180px;  // 稍微加大图片尺寸
  height: 120px;
  object-fit: cover;
  border-radius: 12px;  // 添加圆角
  box-shadow: 0 4px 12px rgba(255, 140, 0, 0.1);  // 添加橘色阴影
  transition: transform 0.3s ease;  // 添加过渡效果
}

.custom-tabs {
  margin-top: 30px;
  background: linear-gradient(to bottom, rgba(255, 245, 235, 0.5), transparent);  // 添加渐变背景
  padding: 20px;
  border-radius: 16px;
}

.presentaionList {
  min-height: 800px;
  margin: 20px auto;
  max-width: 1200px;  // 限制最大宽度
}

.presentation {
  display: flex;
  cursor: pointer;
  margin-top: 20px;
  padding: 20px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 2px 15px rgba(255, 140, 0, 0.08);
  transition: all 0.3s ease;
  border: none;  // 移除原有边框

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 20px rgba(255, 140, 0, 0.15);
    
    .headImg {
      transform: scale(1.03);
    }
    
    .content .name a {
      color: #ff6b00;
    }
  }

  .content {
    margin-left: 25px;
    flex: 1;

    .name {
      font-weight: 600;
      font-size: 20px;
      margin-bottom: 15px;
      line-height: 1.4;
      
      a {
        color: #333;
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
          color: #ff6b00;
        }
      }
    }

    .meta {
      font-size: 14px;
      color: #666;
      margin-bottom: 12px;
      display: flex;
      align-items: center;

      .author {
        margin-right: 15px;
        color: #ff8c00;
        font-weight: 500;
        
        &::before {
          content: '作者：';
          color: #999;
          font-weight: normal;
        }
      }

      .time {
        color: #999;
        &::before {
          content: '发布于 ';
        }
      }
    }
  }
}

:deep(.el-tabs__item) {
  font: 16px/1.5 'Microsoft YaHei', sans-serif;
  color: #666;
  padding: 12px 30px;
  margin: 0 8px;
  background: white;
  border: none;
  position: relative;
  transition: all 0.3s ease;
  border-radius: 8px;
  
  &.is-active {
    color: #ff6b00 !important;
    background-color: #fff5eb;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 3px;
      background: linear-gradient(to right, #ff8c00, #ff6b00);
      border-radius: 3px;
    }
  }

  &:hover {
    color: #ff6b00;
    background-color: #fff5eb;
  }
}

:deep(.el-tabs__nav) {
  border: none;
  padding: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.loading-more,
.no-more {
  text-align: center;
  padding: 15px;
  font-size: 15px;
  color: #999;
  font-weight: 500;
}

.load-more-btn {
  display: block;
  margin: 20px auto;
  padding: 12px 30px;
  font-size: 16px;
  background: linear-gradient(to right, #ff8c00, #ff6b00);
  color: white;
  border-radius: 25px;
  transition: all 0.3s ease;
  border: none;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 140, 0, 0.3);
  }
}
</style>
