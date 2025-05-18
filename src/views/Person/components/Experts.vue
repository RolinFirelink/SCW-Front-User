<script setup>
import { onMounted, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { reqExpertSelf, reqExpertUpdate, reqExpertDelete } from '@/api/experts/index'
import { downloadFileById, uploadFile, reqGetFileInfo } from '@/api/file/index'
import { Close } from '@element-plus/icons-vue';

// tab列表
const tabTypes = [
  { name: 'all', label: '全部用户' },
  { name: 'deliver', label: '待审核' },
  { name: 'complete', label: '审核成功' },
  { name: 'fail', label: '审核失败' },
  { name: 'cancel', label: '审核作废' }
]

// 用户列表
const expertList = ref([])
const total = ref(0)
const params = ref({
  pageNum: 1,
  pageSize: 7
})
const status = ref('all')

// 获取专家列表
const getExpertList = async () => {
  try {
    const { data } = await reqExpertSelf({
      pageNum: params.value.pageNum,
      pageSize: params.value.pageSize
    })

    // 状态映射表
    const statusMap = {
      deliver: 0,
      complete: 1,
      fail: 2,
      cancel: 3
    }

    if (status.value !== 'all') {
      if (statusMap.hasOwnProperty(status.value)) {
        expertList.value = data.list.filter((item) => {
          return item.applyStatus === statusMap[status.value]
        })
      } else {
        expertList.value = data.list
      }
    } else {
      // 如果是 'all'，则直接赋值
      expertList.value = data.list
    }

    total.value = data.total
  } catch (error) {
    ElMessage.error('获取专家列表失败')
  }
}
// tab切换
const tabChange = (type) => {
  if (type == 0) {
    status.value = 'all'
  }
  if (type == 1) {
    status.value = 'deliver'
  }
  if (type == 2) {
    status.value = 'complete'
  }
  if (type == 3) {
    status.value = 'fail'
  }
  if (type == 4) {
    status.value = 'cancel'
  }

  getExpertList()
}

// 页数切换
const pageChange = (page) => {
  params.value.page = page
  getExpertList()
}

// 格式化申请状态
const formatApplyStatus = (applyStatus) => {
  const statusMap = {
    0: '申请中',
    1: '申请成功',
    2: '申请失败',
    3: '申请作废'
  }
  return statusMap[Number(applyStatus)] || '未知状态'
}

// 删除专家
const deleteexpert = (expertId) => {
  ElMessageBox.confirm('确定要删除该专家吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        const response = await reqExpertDelete(expertId)

        if (response.code === '200') {
          // 更新专家列表，移除被删除的专家
          expertList.value = expertList.value.filter((expert) => expert.id !== expertId)
          ElMessage.success('删除成功')
        } else {
          ElMessage.error('删除失败: ' + response.message || '未知错误')
        }
      } catch (error) {
        ElMessage.error('删除失败: ' + error.message)
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

const editDialogVisible = ref(false)

// 获取文件信息
const getFileInfo = async (id) => {
  try {
    const response = await reqGetFileInfo(id)

    if (response.code === '200') {
      return response.data
    } else {
      ElMessage.error('获取文件信息失败: ' + response.message)
      return null
    }
  } catch (error) {
    ElMessage.error('获取文件信息失败: ' + error.message)
    return null
  }
}

// 编辑专家
const editEpertList = async (expert) => {
  if (expert) {
    // 将选中的专家信息赋值到 recommendForm
    recommendForm.value = {
      id: expert.id,
      name: expert.name,
      products: [],
      profile: expert.profile,
      phone: expert.phone,
      email: expert.email,
      qq: expert.qq || '',
      weChat: expert.weChat || '',
      avatar: expert.avatar || '',
      field: expert.field || '',
      positions: expert.positions || '',
      certification: expert.certification || [],
      reason: expert.reason || '',
      remark: expert.remark || ''
    }

    // 获取相关文件信息
    try {
      // 获取 products 文件信息
      const productsWithFileInfo = await Promise.all(
        expert.products.map(async (productId) => {
          if (productId && productId !== 'null') {
            const fileInfo = await getFileInfo(productId)
            if (fileInfo) {
              return {
                id: fileInfo.id,
                name: fileInfo.fileName,
                status: fileInfo.status
              }
            } else {
              return null
            }
          } else {
            return null
          }
        })
      )

      // 获取 certification 文件信息
      const certificationWithFileInfo = await Promise.all(
        expert.certification.map(async (certificationId) => {
          if (certificationId && certificationId !== 'null') {
            const fileInfo = await getFileInfo(certificationId)
            if (fileInfo) {
              return {
                id: fileInfo.id,
                name: fileInfo.fileName,
                status: fileInfo.status
              }
            } else {
              return null
            }
          } else {
            return null
          }
        })
      )

      // 过滤掉无效的 certification 文件信息
      const validCertificationFiles = certificationWithFileInfo.filter((file) => file !== null)

      // 过滤掉无效的 products 文件信息
      const validProductsFiles = productsWithFileInfo.filter((file) => file !== null)
      // 更新
      recommendForm.value.certification = validCertificationFiles
      recommendForm.value.products = validProductsFiles

      // 获取头像
      avatarUrl.value = await getAvatarUrl(expert.avatar)
    } catch (error) {
      ElMessage.error('获取文件信息失败: ' + error.message)
    }
  } else {
    // 如果没有传入专家信息，重置表单
    recommendForm.value = {
      id: '',
      name: '',
      products: [],
      profile: '',
      phone: '',
      email: '',
      qq: '',
      weChat: '',
      avatar: '',
      field: '',
      positions: '',
      certification: []
    }
  }
  editDialogVisible.value = true
}

const editEpert = async () => {
  try {
    // 提取 id 列表
    const productsIds = recommendForm.value.products.map((item) => item.id)
    const certificationIds = recommendForm.value.certification.map((item) => item.id)

    const payload = {
      ...recommendForm.value,
      products: productsIds,
      certification: certificationIds
    }
    const response = await reqExpertUpdate(payload)
    if (response.code === '200') {
      ElMessage.success('保存成功')
      editDialogVisible.value = false
      // 刷新专家列表
      getExpertList()
    } else {
      ElMessage.error('保存失败: ' + response.data.message)
    }
  } catch (error) {
    ElMessage.error('保存失败: ' + error.message)
  }
}

// 判断是否可以编辑
const isEditable = (applyStatus) => {
  //作废不可以申请
  return applyStatus === 3
}

//著作上传文件
const productsUploadRef = ref()

const recommendForm = ref({
  id: '',
  name: '',
  products: [],
  profile: '',
  phone: '',
  email: '',
  qq: '',
  weChat: '',
  avatar: '',
  field: '',
  positions: '',
  certification: [],
  remark: '',
  reason: ''
})

const rules = {
  name: [{ required: true, message: '请输入专家姓名', trigger: 'blur' }],
  products: [{ required: true, message: '请输入专家著作', trigger: 'blur' }],
  profile: [{ required: true, message: '请输入专家简介', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入专家电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入专家邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ]
}

const handleExceed = (files) => {
  ElMessage({
    type: 'error',
    message: '超出最大限制'
  })
}

//著作的文件上传
const getProUploadFile = async (param) => {
  const file = param.file

  const res = await uploadFile(file)
  if (res.code == '200') {
    recommendForm.value.products.push({
      id: res.data.id,
      name: file.name
    })
    param.onSuccess({
      uid: res.data.id,
      name: file.name,
      status: 1
    })
    ElMessage({
      type: 'success',
      message: '上传著作文件成功'
    })
  }
}
const handleProRemove = (file) => {

  const fileId = file.uid

  const index = recommendForm.value.products.findIndex((item) => item.id === fileId)

  if (index !== -1) {
    recommendForm.value.products.splice(index, 1)
    ElMessage.success('文件移除成功')
  }
}

//资质文件处理
const handleCerUploadSuccess = () => { }

const getCerUploadFile = async (param) => {
  const file = param.file
  const res = await uploadFile(file)
  if (res.code == '200') {
    recommendForm.value.certification.push({
      id: res.data.id,
      uid: file.uid,
      name: file.name
    })
    param.onSuccess({
      uid: file.uid,
      id: res.data.id,
      name: file.name,
      status: 1
    })
    ElMessage({
      type: 'success',
      message: '上传资质文件成功'
    })
  }
}
const handleCerRemove = (file) => {



  const fileId = file.id

  const index = recommendForm.value.certification.findIndex((item) => item.id === fileId)

  if (index !== -1) {
   
    recommendForm.value.certification.splice(index, 1)
    ElMessage.success('资质文件移除成功')
  }
 
}
//头像上传
const avatarUrl = ref(null)

// 获取头像 URL
const getAvatarUrl = async (fileId) => {
  if (!fileId) return null
  try {
    const blob = await downloadFileById(fileId)

    return URL.createObjectURL(blob)
  } catch (error) {
    return null
  }
}

const avatarUpload = ref(null)

const removeAvatar = () => {
  recommendForm.value.avatar = null
  avatarUrl.value = null // 重置头像 URL
  // 清除上传组件的文件列表
  avatarUpload.value.clearFiles()
  ElMessage.success('已移除头像')
}

// 上传前验证
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
    return false
  }
  return true
}

const uploadAvatar = async (param) => {
  const file = param.file
  const res = await uploadFile(file)
  if (res.code === '200') {
    recommendForm.value.avatar = res.data.id

    avatarUrl.value = await getAvatarUrl(res.data.id)

    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error('头像上传失败')
  }
}

const downloadFile = async (file) => {
  try {
    const blob = await downloadFileById(file.uid)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name // 设置下载的文件名
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url) // 释放对象URL
  } catch (error) {
    ElMessage.error('下载文件失败')
  }
}

//详细
const detailDialogVisible = ref(false);

const detailEpert = async (expert) => {
  if (expert) {
    // 将选中的专家信息赋值到 recommendForm
    recommendForm.value = {
      id: expert.id,
      name: expert.name,
      products: [],
      profile: expert.profile,
      phone: expert.phone,
      email: expert.email,
      qq: expert.qq || '',
      weChat: expert.weChat || '',
      avatar: expert.avatar || '',
      field: expert.field || '',
      positions: expert.positions || '',
      certification: expert.certification || [],
      reason: expert.reason || '',
      remark: expert.remark || ''
    }

    // 获取相关文件信息
    try {
      // 获取 products 文件信息
      const productsWithFileInfo = await Promise.all(
        expert.products.map(async (productId) => {
          if (productId && productId !== 'null') {
            const fileInfo = await getFileInfo(productId)
            if (fileInfo) {
              return {
                id: fileInfo.id,
                name: fileInfo.fileName,
                status: fileInfo.status
              }
            } else {
              return null
            }
          } else {
            return null
          }
        })
      )

      // 获取 certification 文件信息
      const certificationWithFileInfo = await Promise.all(
        expert.certification.map(async (certificationId) => {
          if (certificationId && certificationId !== 'null') {
            const fileInfo = await getFileInfo(certificationId)
            if (fileInfo) {
              return {
                id: fileInfo.id,
                name: fileInfo.fileName,
                status: fileInfo.status
              }
            } else {
              return null
            }
          } else {
            return null
          }
        })
      )

      // 过滤掉无效的 certification 文件信息
      const validCertificationFiles = certificationWithFileInfo.filter((file) => file !== null)

      // 过滤掉无效的 products 文件信息
      const validProductsFiles = productsWithFileInfo.filter((file) => file !== null)
      // 更新
      recommendForm.value.certification = validCertificationFiles
      recommendForm.value.products = validProductsFiles

      // 获取头像
      avatarUrl.value = await getAvatarUrl(expert.avatar)
    } catch (error) {
      ElMessage.error('获取文件信息失败: ' + error.message)
    }
  } else {
    // 如果没有传入专家信息，重置表单
    recommendForm.value = {
      id: '',
      name: '',
      products: [],
      profile: '',
      phone: '',
      email: '',
      qq: '',
      weChat: '',
      avatar: '',
      field: '',
      positions: '',
      certification: []
    }
  }
  detailDialogVisible.value = true
}
const isHovered = ref(false);

const handleHover = (state) => {
  isHovered.value = state;
};

onMounted(() => getExpertList())
</script>

<template>
  <div class="expert-container">
    <el-tabs @tab-change="tabChange" class="custom-tabs">
      <!-- tab切换 -->
      <el-tab-pane v-for="item in tabTypes" :key="item.name" :label="item.label" />

      <div class="main-container">
        <div class="holder-container" v-if="expertList.length === 0">
          <el-empty description="暂无专家信息" />
        </div>
        <div v-else>
          <!-- 用户表格 -->
          <el-table :data="expertList" style="width: 100%" class="custom-table">
            <el-table-column prop="name" label="真实姓名" />
            <el-table-column prop="profile" label="简介" show-overflow-tooltip />
            <el-table-column prop="phone" label="手机" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="weChat" label="微信号" />
            <el-table-column prop="apply_status" label="申请状态"
              :formatter="(row) => formatApplyStatus(row.applyStatus)" />
            <el-table-column label="操作" min-width="140%">
              <template #default="scope">
                <div class="button-group">
                  <el-button size="small" @click="detailEpert(scope.row)" class="custom-button">
                    详细
                  </el-button>
                  <el-button size="small" @click="editEpertList(scope.row)"
                    :disabled="isEditable(scope.row.applyStatus)" class="custom-button">
                    编辑
                  </el-button>
                  <el-button size="small" type="danger" @click="deleteexpert(scope.row.id)" class="custom-button">
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination :total="total" @current-change="pageChange" :page-size="params.pageSize" background
              layout="prev, pager, next" class="custom-pagination" />
          </div>
        </div>
      </div>
    </el-tabs>

    <el-dialog v-model="editDialogVisible" width="50%" :before-close="() => (editDialogVisible = false)"
      class="custom-dialog">
      <el-form :model="recommendForm" :rules="rules" ref="recommendFormRef" label-width="100px" class="custom-form">
        <el-form-item label="专家id" prop="id" v-if="false">
          <el-input v-model="recommendForm.id"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="recommendForm.name" placeholder="请输入专家姓名"></el-input>
        </el-form-item>
        <el-form-item label="著作" prop="products">
          <el-upload ref="productsUploadRef" multiple :limit="5" show-file-list :on-exceed="handleExceed"
            :on-remove="handleProRemove" :http-request="getProUploadFile" list-type="text" :file-list="recommendForm.products.map((file) => ({
              uid: file.id,
              name: file.name,
              status: file.status
            }))
              " accept=".pdf,.doc,.docx">
            <el-button size="small" type="primary" class="custom-button">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">支持上传 PDF、Word 文件，最多 5 个文件</div>
            </template>

            <template #file="{ file }">
              <div class="custom-file-item" @mouseenter="handleHover(true)" @mouseleave="handleHover(false)">
                <span class="file-name" @click="downloadFile(file)">{{ file.name }}</span>
                <span class="remove-button" @click.stop="handleProRemove(file)">
                  <el-icon v-if="isHovered">
                    <Close />
                  </el-icon>
                </span>
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="简介" prop="profile">
          <el-input v-model="recommendForm.profile" type="textarea" placeholder="请输入专家简介"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="recommendForm.phone" placeholder="请输入专家电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="recommendForm.email" placeholder="请输入专家邮箱"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="recommendForm.qq" placeholder="请输入专家QQ"></el-input>
        </el-form-item>
        <el-form-item label="微信" prop="weChat">
          <el-input v-model="recommendForm.weChat" placeholder="请输入专家微信"></el-input>
        </el-form-item>
        <el-form-item label="履历" prop="positions">
          <el-input v-model="recommendForm.positions" placeholder="请输入专家履历"></el-input>
        </el-form-item>
        <el-form-item label="擅长领域" prop="field">
          <el-input v-model="recommendForm.field" placeholder="请输入专家擅长领域"></el-input>
        </el-form-item>
        <el-form-item label="认证信息" prop="certification">
          <el-upload ref="cerUploadRef" multiple :limit="3" :file-list="recommendForm.certification.map((file) => ({
          uid: file.uid,
          id: file.id,
          name: file.name,
          status: 'success'
        }))
          " :on-exceed="handleExceed" :on-success="handleCerUploadSuccess" :on-remove="handleCerRemove"
          :http-request="getCerUploadFile" list-type="text" accept=".pdf,.jpg,.png">
          <el-button size="small" type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">支持上传 PDF、图片文件，最多 3 个文件</div>
            </template>

            <template #file="{ file }">
              <div class="custom-file-item" @mouseenter="handleHover(true)" @mouseleave="handleHover(false)">
                <span class="file-name" @click="downloadFile(file)">{{ file.name }}</span>
                <span class="remove-button" @click.stop="handleCerRemove(file)">
                  <el-icon v-if="isHovered">
                    <Close />
                  </el-icon>
                </span>
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="原因" prop="reason">
          <el-input v-model="recommendForm.reason" placeholder="请输入原因"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="recommendForm.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload ref="avatarUpload" class="avatar-uploader" :show-file-list="false" :http-request="uploadAvatar"
            :before-upload="beforeAvatarUpload" :limit="1" accept="image/*">
            <div v-if="recommendForm.avatar" class="avatar-container">
              <img :src="avatarUrl" class="avatar" />
              <el-button class="remove-avatar-button" @click.stop="removeAvatar" circle>
                <el-icon>
                  <Close />
                </el-icon>
              </el-button>
            </div>
            <div v-else class="avatar-placeholder">
              <el-icon class="avatar-uploader-icon">
                <Plus />
              </el-icon>
              <span class="avatar-uploader-text">点击上传</span>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false" class="custom-button">取消</el-button>
        <el-button type="primary" @click="editEpert" class="custom-button">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailDialogVisible" width="50%" :before-close="() => (detailDialogVisible = false)"
      class="custom-dialog">
      <el-form :model="recommendForm" :rules="rules" ref="recommendFormRef" label-width="100px" class="custom-form">
        <el-form-item label="专家id" prop="id" v-if="false">
          <el-input v-model="recommendForm.id"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="recommendForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="著作" prop="products">
          <div>
            <div v-for="(file, index) in recommendForm.products" :key="index">
              <el-link type="primary" @click="downloadFile(file)">
                {{ file.name }}
              </el-link>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="简介" prop="profile">
          <el-input v-model="recommendForm.profile" type="textarea" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="recommendForm.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="recommendForm.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="recommendForm.qq" disabled></el-input>
        </el-form-item>
        <el-form-item label="微信" prop="weChat">
          <el-input v-model="recommendForm.weChat" disabled></el-input>
        </el-form-item>
        <el-form-item label="履历" prop="positions">
          <el-input v-model="recommendForm.positions" disabled></el-input>
        </el-form-item>
        <el-form-item label="擅长领域" prop="field">
          <el-input v-model="recommendForm.field" disabled></el-input>
        </el-form-item>
        <el-form-item label="认证信息" prop="certification">
          <div>
            <div v-for="(file, index) in recommendForm.certification" :key="index">
              <el-link type="primary" @click="downloadFile(file)">
                {{ file.name }}
              </el-link>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="原因" prop="reason">
          <el-input v-model="recommendForm.reason" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="recommendForm.remark" disabled></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <div class="avatar-container">
            <img v-if="recommendForm.avatar" :src="avatarUrl" class="avatar" />

          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center;">
          <el-button @click="detailDialogVisible = false" class="custom-button">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.expert-container {
  padding: 20px 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .custom-tabs {
    .el-tabs__item {
      padding: 0 20px;
      font-size: 16px;
      transition: color 0.3s;

      &:hover {
        color: #409eff;
      }

      &.is-active {
        color: #409eff;
        font-weight: bold;
      }
    }
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }

  .main-container {
    min-height: 500px;
    margin-top: 20px;

    .holder-container {
      min-height: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .custom-table {
      .el-table__header th {
        background-color: #f0f0f0;
        font-weight: bold;
        color: #333;
      }

      .el-table__body tr:hover {
        background-color: #e9f5ff;
      }
    }
  }

  .custom-button {
    border-radius: 4px;
    transition:
      background-color 0.3s,
      color 0.3s;

    &:hover {
      filter: brightness(0.9);
    }
  }

  .custom-pagination {
    .el-pager li {
      margin: 0 5px;
      border-radius: 4px;
      transition:
        background-color 0.3s,
        color 0.3s;

      &:hover {
        background-color: #e9f5ff;
        color: #409eff;
      }

      &.active {
        background-color: #409eff;
        color: #fff;
      }
    }
  }

  .custom-dialog {
    .el-dialog__header {
      background-color: #f0f0f0;
      border-bottom: 1px solid #e0e0e0;
    }

    .el-dialog__title {
      font-size: 18px;
      font-weight: bold;
    }

    .el-dialog__body {
      padding: 20px;
    }

    .el-dialog__footer {
      border-top: 1px solid #e0e0e0;
      padding: 20px;
      text-align: right;
    }
  }

  .custom-form {
    .el-form-item {
      margin-bottom: 20px;
    }

    .el-input {
      border-radius: 4px;
    }

    .el-upload {
      .el-button {
        border-radius: 4px;
      }
    }
  }

  .avatar-container {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;

    .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-avatar-button {
      position: absolute;
      top: 5px;
      right: 5px;
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
    }
  }

  .avatar-placeholder {
    width: 100px;
    height: 100px;
    border: 1px dashed #ccc;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: border-color 0.3s;

    &:hover {
      border-color: #409eff;
    }

    .avatar-uploader-icon {
      font-size: 24px;
      color: #ccc;
    }

    .avatar-uploader-text {
      font-size: 12px;
      color: #999;
    }
  }
  .custom-file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #eee;
  width: 100%;
}

.file-name {
  cursor: pointer;
  color: #333;
}

.remove-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;
  opacity: 0;
  transition: opacity 0.2s;
}

.custom-file-item:hover .remove-button {
  opacity: 1;
}

.remove-button:hover {
  background-color: #e0e0e0;
}
}
</style>
