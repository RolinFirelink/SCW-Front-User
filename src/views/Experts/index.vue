<script setup>
import { onMounted, ref } from 'vue'
import { reqExpertPage, reqExpertSave } from '@/api/experts/index'
import { ElMessage,ElMessageBox } from 'element-plus'
import { downloadFileById, uploadFile, reqGetFileInfo } from '@/api/file/index'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router';
// const currentPage = ref(1)
// const pageSize = ref(10)
// const total = ref(2)
const user = (() => {
  const cookieUser = Cookies.get('user')
  if (cookieUser) {
    try {
      return JSON.parse(decodeURIComponent(cookieUser))
    } catch (error) {
      console.error('解析用户信息失败:', error)
      return null
    }
  }
  return null
})()
//著作上传文件
const productsUploadRef = ref()
const router = useRouter()
const expertList = ref([])
const currentPage = ref(1)
const pageSize = ref(3)
const total = ref(0)
const getExpertPage = async () => {
  const res = await reqExpertPage({
    pageNum: currentPage.value,
    pageSize: pageSize.value
  })
  if (res.code === '200') {
    // 使用 Promise.all 确保所有异步操作完成
    expertList.value = await Promise.all(
      res.data.list.map(async (expert) => {
        return {
          ...expert,
          avatarUrl: expert.avatar ? await getAvatarUrl(expert.avatar) : null
        }
      })
    )
    total.value = res.data.total
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  getExpertPage()
}

const defaultAvatar =
  'https://ts2.tc.mm.bing.net/th?id=OIP-C.4uvuajAOVfVs7fzbr_agNQAAAA&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=2.5&pid=3.1&rm=2'
const dialogVisible = ref(false) // 控制弹窗显示
const detailDialogVisible = ref(false) // 控制详情弹窗显示
const selectedExpert = ref(null) // 当前选中的专家

const recommendForm = ref({
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
})

const viewDetails = async (expert) => {
  selectedExpert.value = expert

  //进行格式化
  // 获取相关文件信息
  try {
    // 获取 products 文件信息
    const productsWithFileInfo = await Promise.all(
      expert.products.map(async (productId) => {
        if (productId && productId !== 'null') {
          const fileInfo = await getFileInfo(productId);
          if (fileInfo) {
            return {
              id: fileInfo.id,
              name: fileInfo.fileName,
              status: fileInfo.status
            };
          } else {
            return null;
          }
        } else {
          return null;
        }
      })
    );

    // 获取 certification 文件信息
    const certificationWithFileInfo = await Promise.all(
      expert.certification.map(async (certificationId) => {
        if (certificationId && certificationId !== 'null') {
          const fileInfo = await getFileInfo(certificationId);
          if (fileInfo) {
            return {
              id: fileInfo.id,
              name: fileInfo.fileName,
              status: fileInfo.status
            };
          } else {
            return null;
          }
        } else {
          return null;
        }
      })
    );

    // 过滤掉无效的 certification 文件信息
    const validCertificationFiles = certificationWithFileInfo.filter(file => file !== null);

    // 过滤掉无效的 products 文件信息
    const validProductsFiles = productsWithFileInfo.filter(file => file !== null);

    // 更新 
    selectedExpert.value.certification = validCertificationFiles;
    selectedExpert.value.products = validProductsFiles;


  } catch (error) {
    ElMessage.error('获取文件信息失败: ' + error.message);
  }
  detailDialogVisible.value = true
}
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


// 获取文件信息
const getFileInfo = async (id) => {
  try {
    const response = await reqGetFileInfo(id);

    if (response.code === '200') {
      return response.data;
    } else {
      ElMessage.error('获取文件信息失败: ' + response.message);
      return null;
    }
  } catch (error) {
    ElMessage.error('获取文件信息失败: ' + error.message);
    return null;
  }
};

const handleApplyExpert = () => {
  const userInfo = Cookies.get('user');
  if (userInfo) {
    dialogVisible.value = true;
  } else {
    ElMessageBox.confirm(
      '您尚未登录，是否跳转到登录页面？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      ElMessage.success('即将跳转到登录页面');
      router.push('/login'); // 先显示提示，再跳转
    }).catch(() => {
      ElMessage.info('已取消操作');
    });
  }
};
const submitRecommendForm = async () => {
  const productsIds = recommendForm.value.products.map(item => item.id);
  const certificationIds = recommendForm.value.certification.map(item => item.id);
  let reqForm = {
    ...recommendForm.value,
    products: productsIds,
    certification: certificationIds,
  }
  const res = await reqExpertSave(reqForm)
  if (res.code === '200') {
    ElMessage({
      type: 'success',
      message: '成功提交专家信息'
    })
  } else {
    ElMessage({
      type: 'error',
      message: res.message
    })
  }
  dialogVisible.value = false
  recommendForm.value = {
    name: '',
    products: [],
    profile: '',
    phone: '',
    email: '',
    qq: '',
    weChat: '',
    certification: []
  }
  getExpertPage()
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
      status: 'success'
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
      status: 'success'
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
    console.error('下载头像失败:', error)
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
    const blob = await downloadFileById(file.id);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name ; // 设置下载的文件名
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // 释放对象URL
  } catch (error) {
    ElMessage.error('下载文件失败');
  }
}
onMounted(() => {
  getExpertPage()
})
</script>

<template>
  <div class="expert-info-container">
    <!-- 新增头部区域 -->
    <div class="expert-header">
      <div class="expert-header__title">柑橘专家库</div>
      <el-button class="expert-header__button" @click="handleApplyExpert">
        申请成为专家
      </el-button>
    </div>
    <!-- <el-button type="primary" @click="dialogVisible = true">专家入驻</el-button>
    <br />
    <br /> -->
    <el-row :gutter="20">
      <el-col v-for="expert in expertList" :key="expert.id" :span="8" class="expert-card">
        <el-card class="expert-card__content">
          <template #header>
            <div class="expert-card__header">
              <img :src="expert.avatarUrl || defaultAvatar" alt="专家头像" class="expert-card__avatar" />
              <div class="expert-card__name">{{ expert.name }}</div>
            </div>
          </template>
          <div class="expert-card__body">
            <p>
              <strong>简介：</strong>
              {{ expert.profile || '暂无简介信息' }}
            </p>
            <p>
              <strong>职位：</strong>
              {{ expert.positions || '暂无职位信息' }}
            </p>
            <p>
              <strong>擅长领域：</strong>
              {{ expert.field || '暂无领域信息' }}
            </p>
          </div>
          <div class="expert-card__footer">
            <el-button type="primary" link @click="viewDetails(expert)">查看详情</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="pagination-container">
      <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
        :current-page="currentPage" @current-change="handlePageChange" />
    </div>
  </div>
  <el-dialog v-model="detailDialogVisible" width="50%" custom-class="expert-detail-dialog">
    <div v-if="selectedExpert" class="expert-detail-container">
      <el-row :gutter="20">
        <el-col :span="8" class="expert-detail-avatar-col">
          <div class="expert-detail__avatar">
            <img :src="selectedExpert.avatarUrl || defaultAvatar" alt="专家头像" class="expert-detail__avatar-img" />
            <div class="expert-detail__name">{{ selectedExpert.name }}</div>
          </div>
        </el-col>
        <el-col :span="16" class="expert-detail-info-col">
          <el-descriptions title="专家信息" :column="1" border class="expert-detail-descriptions">
            <el-descriptions-item label="简介" class="description-item">
              {{ selectedExpert.profile || '暂无简介信息' }}
            </el-descriptions-item>

            <el-descriptions-item label="著作" class="description-item">
              <div v-if="selectedExpert.products && selectedExpert.products.length > 0">
                <div v-for="(product, index) in selectedExpert.products" :key="index" class="product-item">
                  <span class="product-name">{{ product.name }}</span>
                  <el-button size="small" type="text" @click="downloadFile(product)">下载</el-button>
                </div>
              </div>
              <div v-else>
                暂无著作信息
              </div>
            </el-descriptions-item>


            <el-descriptions-item label="职位" class="description-item">
              {{ selectedExpert.positions || '暂无职位信息' }}
            </el-descriptions-item>
            <el-descriptions-item label="擅长领域" class="description-item">
              {{ selectedExpert.field || '暂无领域信息' }}
            </el-descriptions-item>
            <el-descriptions-item label="电话" class="description-item">
              {{ selectedExpert.phone || '暂无电话信息' }}
            </el-descriptions-item>
            <el-descriptions-item label="邮箱" class="description-item">
              {{ selectedExpert.email || '暂无邮箱信息' }}
            </el-descriptions-item>
            <el-descriptions-item label="QQ" class="description-item">
              {{ selectedExpert.qq || '暂无QQ信息' }}
            </el-descriptions-item>
            <el-descriptions-item label="微信" class="description-item">
              {{ selectedExpert.weChat || '暂无微信信息' }}
            </el-descriptions-item>
            <el-descriptions-item label="认证信息" class="description-item">
              <div v-if="selectedExpert.certification && selectedExpert.certification.length > 0">
                <div v-for="(certification, index) in selectedExpert.certification" :key="index"
                  class="certification-item">
                  <span class="certification-name">{{ certification.name }}</span>
                  <el-button size="small" type="text" @click="downloadFile(certification)">下载</el-button>
                </div>
              </div>
              <div v-else>
                暂无认证信息
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="detailDialogVisible = false" class="detail-close-button">关闭</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="dialogVisible" title="专家入驻" width="50%" :before-close="() => (dialogVisible = false)">
    <el-form :model="recommendForm" :rules="rules" ref="recommendFormRef" label-width="100px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="recommendForm.name" placeholder="请输入专家姓名"></el-input>
      </el-form-item>
      <el-form-item label="著作" prop="products">
        <el-upload ref="productsUploadRef" multiple :limit="5" show-file-list :on-exceed="handleExceed"
          :on-remove="handleProRemove" :http-request="getProUploadFile" list-type="text" :file-list="recommendForm.products.map((file) => ({
            uid: file.id,
            name: file.name,
            status: 'success'
          }))
            " accept=".pdf,.doc,.docx">
          <el-button size="small" type="primary">点击上传</el-button>
          <template #tip>
            <div class="el-upload__tip">支持上传 PDF、Word 文件，最多 5 个文件</div>
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
        </el-upload>
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
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitRecommendForm">提交</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.expert-info-container {
  padding: 30px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 添加头部区域样式 */
.expert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 20px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

/* 专家入驻按钮样式 */
.expert-header__button {
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, #ff8c00, #ffa500);
  border: none;
  padding: 12px 30px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 140, 0, 0.2);
}

.expert-header__button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 140, 0, 0.3);
  background: linear-gradient(45deg, #ffa500, #ff8c00);
}

.expert-header__button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent);
  transition: 0.5s;
}

.expert-header__button:hover::before {
  left: 100%;
}

.expert-header__title {
  font-size: 24px;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.expert-header__title::before {
  content: '🍊';
  margin-right: 10px;
  font-size: 28px;
}

.expert-card {
  margin-bottom: 25px;
}

.expert-card__content {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  background: #ffffff;
  /* 修改为纯白色背景 */
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.expert-card__content:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(255, 140, 0, 0.2);
}

.expert-card__header {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to bottom, rgba(255, 165, 0, 0.1), transparent);
}

.expert-card__avatar {
  width: 140px;
  height: 170px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(255, 140, 0, 0.15);
  border: 3px solid #fff;
  transition: transform 0.3s ease;
}

.expert-card__avatar:hover {
  transform: scale(1.05);
}

.expert-card__name {
  font-size: 20px;
  font-weight: 600;
  color: #ff8c00;
  margin-top: 12px;
  position: relative;
  padding-bottom: 10px;
}

.expert-card__name::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: linear-gradient(to right, #ffa500, #ff8c00);
  border-radius: 2px;
}

.expert-card__body {
  padding: 20px;
  line-height: 1.8;
}

.expert-card__body p {
  margin-bottom: 12px;
  font-size: 15px;
  color: #666;
  position: relative;
  padding-left: 20px;
}

.expert-card__body p::before {
  content: '🍊';
  position: absolute;
  left: 0;
  font-size: 14px;
}

.expert-card__body strong {
  color: #ff8c00;
  font-weight: 600;
  margin-right: 8px;
}

.expert-card__footer {
  padding: 15px;
  text-align: center;
  border-top: 1px solid rgba(255, 140, 0, 0.1);
  background-color: #fff;
}

.expert-card__footer .el-button {
  background-color: #fff;
  color: #ff8c00;
  font-weight: 500;
  padding: 8px 20px;
  border: 2px solid #ff8c00;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.expert-card__footer .el-button:hover {
  color: #fff;
  background-color: #ff8c00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 140, 0, 0.2);
}

/* 分页样式 */
.pagination-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.pagination-container :deep(.el-pagination.is-background) .el-pager li:not(.is-disabled).is-active {
  background-color: #ff8c00;
}

.pagination-container :deep(.el-pagination.is-background) .el-pager li:not(.is-disabled):hover {
  color: #ff8c00;
}

/* 详情弹窗样式 */
.expert-detail-container {
  padding: 25px;
  background-color: #f5f5f5;
  /* 修改为灰色背景 */
}

.expert-detail__avatar-img {
  width: 180px;
  height: 220px;
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 6px 16px rgba(255, 140, 0, 0.15);
  border: 4px solid #fff;
  transition: all 0.3s ease;
}

.expert-detail__name {
  font-size: 24px;
  font-weight: 600;
  color: #ff8c00;
  margin-top: 15px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.expert-detail-descriptions {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 140, 0, 0.2);
  box-shadow: 0 4px 12px rgba(255, 140, 0, 0.08);
}

.description-item {
  padding: 15px;
  border-bottom: 1px solid rgba(255, 140, 0, 0.1);
}

/* 入驻按钮样式 */
.expert-info-container>.el-button {
  background-color: #ff8c00;
  border-color: #ff8c00;
  padding: 12px 25px;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.expert-info-container>.el-button:hover {
  background-color: #ffa500;
  border-color: #ffa500;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 140, 0, 0.2);
}
</style>