<template>
  <div class="citrus-container">
    <div class="recognition-header">
      <h2 class="title">
        <el-icon class="citrus-icon"><OrangeIcon /></el-icon>
        柑橘智能识别
      </h2>
      <p class="subtitle">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上传柑橘图片或视频，获取专业分析建议
      </p>
    </div>

    <div class="content-wrapper">
      <el-card class="upload-card" :body-style="{ padding: '30px' }">
        <!-- 文件类型选择 -->
        <el-form label-width="100px">
          <el-form-item label="文件类型">
            <el-radio-group v-model="fileType" @change="handleFileTypeChange">
              <el-radio-button label="image">
                <el-icon><Picture /></el-icon>
                图片
              </el-radio-button>
              <el-radio-button label="video">
                <el-icon><VideoCamera /></el-icon>
                视频
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <!-- 文件上传区域 -->
        <div class="upload-area">
          <el-upload
            class="citrus-upload"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :file-list="fileList"
            :accept="acceptTypes"
            :on-exceed="handleExceed"
            :on-change="handleFileChange"
            :limit="10"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
          >
            <template #default>
              <div class="upload-content">
                <el-icon class="upload-icon"><Plus /></el-icon>
                <div class="upload-text">
                  <span>点击或拖拽文件上传</span>
                  <p class="upload-hint">
                    支持 {{ fileType === 'image' ? 'JPG/PNG' : 'MP4' }} 格式
                  </p>
                </div>
              </div>
            </template>

            <template #file="{ file }">
              <div class="preview-item">
                <img v-if="fileType === 'image'" class="preview-thumbnail" :src="file.url" alt="" />
                <video v-else class="preview-thumbnail" :src="file.url" controls></video>
                <div class="preview-actions">
                  <el-button type="primary" circle @click.stop="handlePictureCardPreview(file)">
                    <el-icon><ZoomIn /></el-icon>
                  </el-button>
                  <el-button type="danger" circle @click.stop="handleRemove(file)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </template>
          </el-upload>
        </div>

        <!-- 识别按钮 -->
        <div class="action-area">
          <el-button
            type="primary"
            size="large"
            :icon="Search"
            @click="recognize"
            :disabled="!fileList.length"
          >
            开始识别
          </el-button>
        </div>
      </el-card>

      <!-- 结果展示卡片 -->
      <el-card class="result-card" :body-style="{ padding: '30px' }">
        <template #header>
          <div class="result-header">
            <el-icon><DataAnalysis /></el-icon>
            <span>识别结果</span>
          </div>
        </template>
        <div class="result-content" v-if="suggestion">
          <div class="markdown-content" v-html="renderedMarkdown"></div>
        </div>
        <div class="empty-result" v-else>
          <el-empty description="暂无识别结果，请上传文件并点击识别"></el-empty>
        </div>
      </el-card>
    </div>

    <!-- 预览弹窗 -->
    <el-dialog v-model="dialogVisible" width="80%" :destroy-on-close="true" align-center>
      <div class="preview-dialog">
        <img
          v-if="fileType === 'image'"
          :src="dialogImageUrl"
          alt="Preview Image"
          class="preview-media"
        />
        <video
          v-else
          :src="dialogImageUrl"
          controls
          preload="auto"
          class="preview-media"
          ref="previewVideo"
        ></video>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Delete,
  ZoomIn,
  Plus,
  Picture,
  VideoCamera,
  Search,
  DataAnalysis
} from '@element-plus/icons-vue'
import { reqSmartVedio, reqSmartImages } from '@/api/recognition/index'
import { marked } from 'marked'

// 自定义柑橘图标组件
const OrangeIcon = {
  template: `
    <svg viewBox="0 0 1024 1024" width="1em" height="1em">
      <path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#FF9800"/>
      <path d="M512 192c-176.73 0-320 143.27-320 320s143.27 320 320 320 320-143.27 320-320-143.27-320-320-320z m0 576c-141.38 0-256-114.62-256-256s114.62-256 256-256 256 114.62 256 256-114.62 256-256 256z" fill="#FFF3E0"/>
    </svg>
  `
}

const handleVideoLoad = () => {
  if (previewVideo.value) {
    previewVideo.value.play()
  }
}

// 原有的响应式数据和方法保持不变
const fileType = ref('image')
const acceptTypes = ref('image/*')
const fileList = ref([])
const suggestion = ref('')
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

// 文件移除时的回调
const handleRemove = (file) => {
  fileList.value = fileList.value.filter((item) => item.uid !== file.uid)
}

const previewVideo = ref(null)

// 识别功能（示例）
const recognize = async () => {
  // console.log('识别文件', fileList.value)

  if (fileList.value.length === 0) {
    ElMessage.error('请先上传文件')
    return
  }
  try {
    let response
    const files = fileList.value.map((file) => file.raw)
    if (fileType.value === 'image') {
      response = await reqSmartImages(files)
    } else if (fileType.value === 'video') {
      response = await reqSmartVedio(files[0])
      if (response.code === '200') {
        ElMessage.success('视频上传成功')
        // const taskId = response.data
        // try {
        //   const res = await reqGetTaskResult(taskId)
        //   if (res.code === '200') {
        //     response = res
        //   }
        // } catch (error) {
        //   console.error('视频建议请求失败:', error)
        //   ElMessage.error('识别失败，请检查网络或稍后重试')
        //   suggestion.value = ''
        // }
      }
    } else {
      ElMessage.error('未知文件类型')
      return
    }

    // console.log('API 响应:', response)

    if (response.code === '200') {
      ElMessage.success('文件识别成功')
      suggestion.value = response.data
    } else {
      ElMessage.error('识别失败: ' + (response.message || ''))
      suggestion.value = ''
    }
  } catch (error) {
    console.error('API 请求失败:', error)
    ElMessage.error('识别失败，请检查网络或稍后重试')
    suggestion.value = ''
  }
}

// 文件上传前的校验
const beforeUpload = (uploadFile) => {
  const isCorrectType =
    fileType.value === 'image'
      ? uploadFile.type.startsWith('image/')
      : uploadFile.type.startsWith('video/')
  if (!isCorrectType) {
    ElMessage.error('请上传正确的文件类型')
    return false
  }
  return true
}

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true

  // 如果是视频，等待 DOM 更新后处理视频
  if (fileType.value === 'video') {
    nextTick(() => {
      const videoElement = previewVideo.value
      if (videoElement) {
        // 重置视频
        videoElement.currentTime = 0
        // 设置视频源
        videoElement.src = file.url
        // 加载视频
        videoElement.load()
      }
    })
  }
}

const handleFileChange = (uploadFile) => {
  //fileList.value = []
  // 过滤相同文件
  if (fileList.value.some((file) => file.uid === uploadFile.uid)) {
    return
  }
  // 添加新的文件到文件列表
  fileList.value.push(uploadFile)
  // console.log('上传后文件列表', fileList.value)
  // console.log('上传后文件', uploadFile)

  if (uploadFile.raw) {
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadFile.url = e.target.result
    }
    reader.readAsDataURL(uploadFile.raw)
  }
}

// 文件超出限制时的回调
const handleExceed = () => {
  ElMessage.warning('最多上传10个文件')
}

// 根据文件类型动态设置接受的文件类型
watch(fileType, (newVal) => {
  acceptTypes.value = newVal === 'image' ? 'image/*' : 'video/*'
})

// 监听对话框关闭事件
watch(dialogVisible, (newVal) => {
  if (!newVal && fileType.value === 'video' && previewVideo.value) {
    // 关闭对话框时暂停视频
    previewVideo.value.pause()
  }
})

const handleFileTypeChange = () => {
  // 清空文件列表
  fileList.value = []
  // 重置其他相关状态
  suggestion.value = ''
  dialogImageUrl.value = ''
  dialogVisible.value = false
  // 根据文件类型设置接受的文件类型
  acceptTypes.value = fileType.value === 'image' ? 'image/*' : 'video/*'
}

// 计算属性保持不变
const renderedMarkdown = computed(() => {
  return marked(suggestion.value || '')
})
</script>

<style scoped>
.citrus-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.recognition-header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  color: #ff9800;
  font-size: 32px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.citrus-icon {
  font-size: 36px;
}

.subtitle {
  color: #666;
  margin-top: 12px;
  font-size: 16px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.upload-card,
.result-card {
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.upload-area {
  margin: 20px 0;
  background-color: #fff8e1;
  border-radius: 8px;
  padding: 20px;
}

.citrus-upload {
  --el-upload-list-picture-card-size: 180px;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ff9800;
}

.upload-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.upload-text {
  text-align: center;
}

.upload-hint {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.preview-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.preview-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-actions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s;
}

.preview-item:hover .preview-actions {
  opacity: 1;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px;
  border-radius: 8px;
}

.action-area {
  text-align: center;
  margin-top: 30px;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  color: #ff9800;
}

.result-content {
  min-height: 300px;
  padding: 20px;
  background: #fff8e1;
  border-radius: 8px;
}

.markdown-content {
  line-height: 1.6;
}

.empty-result {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-media {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
}

/* Element Plus 组件样式覆盖 */
:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 180px;
  background-color: white;
  border: 2px dashed #ff9800;
}

:deep(.el-radio-button__inner) {
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.el-button--primary) {
  background-color: #ff9800;
  border-color: #ff9800;
}

:deep(.el-button--primary:hover) {
  background-color: #fb8c00;
  border-color: #fb8c00;
}
</style>
