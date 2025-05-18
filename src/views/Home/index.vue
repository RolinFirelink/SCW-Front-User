<template>
  <div>
    <div class="carousel-container">
      <el-carousel :interval="3000">
        <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
          <img :src="item.img" alt="carousel image" style="width: 100%; height: auto" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <Weather />

    <problem />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import image1 from '@/assets/images/carousel/img1.jpg'
import image2 from '@/assets/images/carousel/img2.jpg'
import { uploadFile, downloadFileById } from '@/api/file/index'
import { reqGetCarouselPage } from '@/api/home/index'
import Weather from './components/Weather.vue'
import problem from './components/problem.vue'
import { ElMessage } from 'element-plus'
// import Fqa from './components/Fqa.vue'
// const uploadRef = ref()
const carouselItems = ref([{ img: image1 }, { img: image2 }])
const getImage = async (fileId) => {
  try {
    const response = await downloadFileById(fileId)
    return URL.createObjectURL(response)
  } catch (error) {
    console.error('获取图片文件失败:', error)
    return null
  }
}
const getCarouselList = async () => {
  try {
    const res = await reqGetCarouselPage({
      pageNum: 1,
      pageSize: 10
    })
    if (res.data && res.data.list && res.data.list.length > 0) {
      const promises = res.data.list.map(async (item) => {
        const url = await getImage(item.images)
        // console.log('获取到的url', url)
        return url ? { img: url } : null
      })

      const results = await Promise.all(promises)
      carouselItems.value = results.filter((item) => item !== null)
    }
  } catch (error) {
    console.error('获取轮播图失败:', error)
    ElMessage.error('获取轮播图失败')
  }
}
// const clearObjectUrls = () => {
//   carouselItems.value.forEach((item) => {
//     if (item.img.startsWith('blob:')) {
//       URL.revokeObjectURL(item.img)
//     }
//   })
// }
onMounted(() => {
  getCarouselList()
})

onUnmounted(() => {
  // clearObjectUrls()
})
</script>
<style lang="less" scoped>
.el-carousel {
  height: 100%;
}

.el-carousel-item img {
  width: 100%;
  height: auto;
}

.carousel-container {
  margin-bottom: 20px; // 添加20px的下边距
}

.el-carousel {
  height: 100%;
}
</style>
