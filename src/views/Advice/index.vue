<template>
  <div class="advice-container">
    <el-form :model="formData" label-width="120px" label-position="top">
      <!-- 交互按钮 -->
      <el-form-item>
        <div class="button-group">
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="submitForm" :loading="loading">提交</el-button>
        </div>
      </el-form-item>
      <div class="select-group">
        <el-form-item label="柑橘品种选择">
          <el-select v-model="formData.citrusType" placeholder="请选择柑橘品种">
            <el-option
              v-for="item in citrusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生长时期选择">
          <el-select v-model="formData.growthStage" placeholder="请选择生长时期">
            <el-option
              v-for="item in growthStageOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </div>
      <!-- 文件上传 -->
      <el-upload
        class="upload-demo"
        action="#"
        list-type="picture-card"
        :auto-upload="true"
        :file-list="formData.fileList"
        :accept="'image/*'"
        :on-change="handleFileChange"
        :http-request="uploadImgFile"
        :on-remove="handleRemove"
        :before-upload="beforeImageUpload"
        :on-preview="handlePictureCardPreview"
      >
        <el-icon><Plus /></el-icon>
        <template #file="{ file }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <el-icon><ZoomIn /></el-icon>
              </span>
              <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                <el-icon><Delete /></el-icon>
              </span>
            </span>
          </div>
        </template>
      </el-upload>
      <!-- 文字描述输入 -->
      <el-form-item label="文字描述">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          placeholder="请输入详细描述..."
        />
      </el-form-item>
    </el-form>

    <!-- 结果展示框 -->
    <div v-if="showResult" class="result-container">
      <el-divider>建议结果</el-divider>
      <el-result
        v-if="submitSuccess"
        icon="success"
        title="提交成功"
        sub-title="您的请求已成功提交，以下是智能建议结果"
      >
        <template #extra>
          <div class="result-content">
            <div class="markdown-content" v-html="renderedMarkdown"></div>
            <!-- <pre>{{ JSON.stringify(resultData, null, 2) }}</pre> -->
          </div>
        </template>
      </el-result>
      <el-result v-else icon="error" title="提交失败" sub-title="请检查您的输入并重试" />
    </div>
    <!-- 图片预览 -->
    <el-dialog v-model="imgDialog" append-to-body>
      <div class="preview-container">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { reqGetAIAdvice } from '@/api/advice'
import { uploadFile, downloadFileById } from '@/api/file/index'
import { marked } from 'marked'
const formData = reactive({
  citrusType: '',
  growthStage: '',
  fileList: [],
  description: '',
  hasVideo: false,
  hasImage: false
})
// const fileList = ref([])
const dialogImageUrl = ref('')
const imgDialog = ref(false)
// 提交状态
const loading = ref(false)
const showResult = ref(false)
const submitSuccess = ref(false)
const resultData = ref(null)

const renderedMarkdown = computed(() => {
  return marked(resultData.value || '')
})

// 柑橘品种选项
const citrusOptions = [
  { value: 'orange', label: '橙子' },
  { value: 'grapefruit', label: '柚子' },
  { value: 'lemon', label: '柠檬' },
  { value: 'tangerine', label: '橘子' },
  { value: 'lime', label: '青柠' },
  { value: 'pomelo', label: '柚子' }
]

// 生长时期选项
const growthStageOptions = [
  { value: 'seedling', label: '幼苗期' },
  { value: 'flowering', label: '开花期' },
  { value: 'fruiting', label: '结果期' },
  { value: 'mature', label: '成熟期' },
  { value: 'dormant', label: '休眠期' }
]

// 重置表单
const resetForm = () => {
  formData.fileList = [...[]] // 或者直接 formData.fileList = []
  formData.citrusType = ''
  formData.growthStage = ''
  formData.description = ''
  formData.hasVideo = false
  formData.hasImage = false
  showResult.value = false
  // 重置预览状态
  // previewVisible.value = false
  // previewFile.value = null
}
// 提交表单
const submitForm = async () => {
  if (!formData.citrusType) {
    ElMessage.warning('请选择柑橘品种')
    return
  }

  if (!formData.growthStage) {
    ElMessage.warning('请选择生长时期')
    return
  }

  loading.value = true

  try {
    const params = {
      variety: formData.citrusType,
      growth: formData.growthStage,
      video: formData.hasVideo,
      image: formData.hasImage,
      text: formData.description
    }
    const res = await reqGetAIAdvice(params)
    resultData.value = res.data
    // 模拟返回数据
    // resultData.value = {
    //   recommendation: '根据您提供的信息，建议采取以下措施：',
    //   details: [
    //     '增加灌溉频率，保持土壤湿润',
    //     '适当增加氮肥，促进叶片生长',
    //     '注意防治柑橘黄龙病，定期检查叶片'
    //   ],
    //   nextSteps: '建议两周后复查植株状态，并根据生长情况调整肥料配比。'
    // }

    submitSuccess.value = true
    showResult.value = true
    ElMessage.success('提交成功')
  } catch (error) {
    console.error('提交失败:', error)
    submitSuccess.value = false
    showResult.value = true
    ElMessage.error('提交失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 文件操作
const beforeImageUpload = (file) => {
  //只允许上传图片/视频文件
  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')
  if (!isImage && !isVideo) {
    ElMessage.error('只允许上传图片/视频文件')
    return false
  }
}
const handleFileChange = (uploadFile) => {
  // fileList.value = [
  //   {
  //     url: uploadFile.url,
  //     name: uploadFile.name,
  //     raw: uploadFile.raw,
  //   },
  // ];
}
const uploadImgFile = async (file) => {
  // console.log("上传文件到服务器", file);
  try {
    const res = await uploadFile(file.file)
    if (res.code === '200') {
      ElMessage.success('文件上传成功')
      return
    } else {
      ElMessage.error('文件上传失败')
      return
    }
  } catch (error) {
    ElMessage.error('文件上传失败')
    return
  }
}
const handleRemove = (uploadFile) => {
  formData.fileList = formData.fileList.filter((file) => file.id !== uploadFile.id)
}
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  imgDialog.value = true
  console.log('预览图数据', uploadFile)
  // dialogImageUrl.value = uploadFile.images
}
</script>

<style scoped>
.advice-container {
  padding: 32px;
  min-height: 100vh;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
  background: none;
  padding: 0;
  box-shadow: none;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  padding-bottom: 8px;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  padding: 12px 16px !important;
  border-radius: 8px !important;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:focus-within),
:deep(.el-textarea__inner:focus) {
  outline: none;
}

:deep(.el-select .el-input__wrapper) {
  padding: 8px 16px !important;
}

:deep(.el-upload--picture-card) {
  border: 2px dashed;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.button-group {
  margin-top: 32px;
}

:deep(.el-button) {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.el-button--primary) {
  border: none;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px;
}

.result-container {
  margin-top: 24px;
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.result-content {
  margin-top: 16px;
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
}

.select-group {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.select-group :deep(.el-form-item) {
  flex: 1;
  margin-bottom: 0;
}
</style>
