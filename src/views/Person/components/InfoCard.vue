<template>
  <el-card class="info-card">
    <el-button type="primary" @click="openEditDialog">修改信息</el-button>
    <div class="profile-section">
      <div
        class="profile-img"
        @mouseenter="showUploadTip = true"
        @mouseleave="showUploadTip = false"
      >
        <div class="avatar-uploader">
          <div class="avatar-mask">
            <el-upload
              ref="imgUpload"
              :show-file-list="false"
              :http-request="uploadImg"
              :limit="1"
              accept="image/*"
            >
              <template #trigger>
                <div v-if="showUploadTip" class="click-cover">
                  <el-icon class="add-icon"><Plus /></el-icon>
                  <div class="click-text">点击修改头像</div>
                </div>
              </template>
            </el-upload>
          </div>

          <div class="avatar-container">
            <img v-if="avatarUrl" :src="avatarUrl" alt="用户头像" />
            <el-icon class="el-icon-user" v-else><User /></el-icon>
          </div>
        </div>
      </div>
      <h2 class="text-primary">
        个人信息展示
        <el-tag :type="userTypeInfo.type" class="badge-custom">{{ userTypeInfo.text }}</el-tag>
      </h2>
    </div>
    <el-row>
      <el-col :span="12">
        <div class="info-section">
          <h3>
            <i class="el-icon-info"></i>
            基本信息
          </h3>
          <div class="info-item">
            <p>
              <i class="el-icon-user"></i>
              用户名：{{ userInfo.userName }}
            </p>
          </div>
          <div class="info-item">
            <p>
              <i class="el-icon-s-custom"></i>
              账号：{{ userInfo.account }}
            </p>
          </div>
          <div class="info-item">
            <p>
              <i class="el-icon-s-custom"></i>
              姓名：{{ userInfo.name }}
            </p>
          </div>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="info-section">
          <h3>
            <i class="el-icon-graduation-cap"></i>
            联系方式
          </h3>
          <div class="info-item">
            <p>
              <i class="el-icon-office-building"></i>
              手机号：{{ userInfo.mobile }}
            </p>
          </div>
          <div class="info-item">
            <p>
              <i class="el-icon-date"></i>
              邮箱：{{ userInfo.email }}
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
  <!-- 修改信息对话框 -->
  <el-dialog
    title="修改个人信息"
    :modal-append-to-body="false"
    :append-to-body="true"
    :lock-scroll="true"
    :close-on-click-modal="false"
    v-model="editDialogVisible"
    width="50%"
  >
    <el-form ref="editFormRef" :model="editForm" label-width="100px" :rules="rules">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="editForm.userName" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="editForm.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="editForm.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitEdit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
//TODO: 抽成组件，只传参数
//TODO: 修改后要更新cookie信息
import { reqUpdateUser, reqGetUserInfo } from '@/api/user/index'
import { downloadFileById, uploadFile } from '@/api/file/index'
import { ElMessage } from 'element-plus'
import { computed, ref, onMounted } from 'vue'
import Cookies from 'js-cookie'
let userInfo = ref({})
const showUploadTip = ref(false)
const editDialogVisible = ref(false)
const editForm = ref({
  id: '',
  userName: '',
  name: '',
  mobile: '',
  email: ''
})
const imgUpload = ref(null)
const editFormRef = ref(null)
const avatarUrl = ref('')

const userTypeInfo = computed(() => {
  const typeMap = {
    1: { text: '普通用户', type: 'info' },
    2: { text: '专家', type: 'success' },
    3: { text: '管理员', type: 'warning' },
    4: { text: '超级管理员', type: 'danger' }
  }
  return typeMap[userInfo.value.userType] || { text: '未知类型', type: 'info' }
})
const rules = {
  userName: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    {
      min: 2,
      max: 20,
      message: '用户名长度在2到20个字符之间',
      trigger: 'blur'
    }
  ],
  name: [
    { required: true, message: '姓名不能为空', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在2到20个字符之间', trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}
//根据id生成图片url
const getAvatarUrl = async (fileId) => {
  if (!fileId) return null
  try {
    const blob = await downloadFileById(fileId)

    return URL.createObjectURL(blob)
  } catch (error) {
    return null
  }
}
const loadUserInfo = async () => {
  const userCookie = Cookies.get('user')
  if (userCookie) {
    const cookieUser = JSON.parse(decodeURIComponent(userCookie))
    const res = await reqGetUserInfo(cookieUser.id)
    if (res.code === '200') {
      userInfo.value = res.data
      avatarUrl.value = await getAvatarUrl(res.data.avatar)
    } else {
      ElMessage.error('获取用户信息失败')
    }
  } else {
    ElMessage.error('请登录获取用户信息')
  }
}
const openEditDialog = () => {
  if (editFormRef.value) {
    editFormRef.value.resetFields()
  }
  //只传需要的字段
  editForm.value = {
    id: userInfo.value.id,
    userName: userInfo.value.userName,
    name: userInfo.value.name,
    mobile: userInfo.value.mobile,
    email: userInfo.value.email
  }
  // editForm.value = { ...userInfo.value }
  // console.log('编辑表单', editForm.value)
  // console.log('表单', userInfo.value)

  editDialogVisible.value = true
}
// 上传头像
const uploadImg = async (param) => {
  const file = param.file
  const res = await uploadFile(file)
  if (res.code === '200') {
    avatarUrl.value = await getAvatarUrl(res.data.id)
    const updateRes = await reqUpdateUser({
      id: userInfo.value.id,
      avatar: res.data.id
    })
    if (updateRes.code === '200') {
      ElMessage.success('头像修改成功')
      userInfo.value.avatar = res.data.id
    } else {
      ElMessage.error('头像信息更新失败')
    }
  } else {
    ElMessage.error('头像上传失败')
  }
}
const submitEdit = async () => {
  editFormRef.value.validate(async (valid) => {
    if (valid) {
      const res = await reqUpdateUser(editForm.value)
      if (res.code === '200') {
        ElMessage.success('修改成功')
        // 更新用户信息
        userInfo.value = {
          userName: editForm.value.userName,
          name: editForm.value.name,
          mobile: editForm.value.mobile,
          email: editForm.value.email
        }
        editDialogVisible.value = false
      }
    } else {
      ElMessage.error('表单验证失败')
    }
  })
}
onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped lang="scss">
.info-card {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  padding: 30px;
  margin: 20px auto;
  max-width: 800px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .profile-section {
    text-align: center;
    padding: 20px 0;
    border-bottom: 2px solid #eee;
    margin-bottom: 30px;

    .profile-img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin: 0 auto 20px;
      border: 5px solid #fff;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      background-color: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      overflow: hidden;
      .avatar-uploader {
        width: 100%;
        height: 100%;
        position: relative;
        .avatar-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover; // 保持图片比例并填充容器
          }

          .el-icon-user {
            font-size: 80px;
            color: $mainColor;
          }
        }

        .click-cover {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1;

          .add-icon {
            font-size: 32px;
            color: white;
            margin-bottom: 8px;
          }

          .click-text {
            color: white;
            font-size: 14px;
          }
        }

        .avatar {
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 50%;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
    i {
      font-size: 80px;
      color: $mainColor;
    }
    h2 {
      color: $mainColor;
    }

    .badge-custom {
      background-color: $mainColor;
      color: white;
      padding: 5px 10px;
      border-radius: 15px;
      margin-left: 10px;
    }
  }

  .info-section {
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
    margin-bottom: 20px;

    h3 {
      display: flex;
      align-items: center;

      i {
        margin-right: 10px;
        color: $mainColor;
      }
    }

    .info-item {
      margin: 15px 0;
      padding-left: 20px;
      border-left: 4px solid $mainColor;

      p {
        margin: 0;
      }

      i {
        margin-right: 10px;
        color: $mainColor;
      }
    }
  }

  .description {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    h3 {
      display: flex;
      align-items: center;

      i {
        margin-right: 10px;
        color: $mainColor;
      }
    }

    .lead {
      font-size: 1.1em;
      margin-bottom: 10px;
    }

    .list-group-item {
      display: block;
      margin: 5px 0;
      padding: 5px 10px;
      border-radius: 5px;

      i {
        margin-right: 10px;
      }
    }
  }
}
</style>
