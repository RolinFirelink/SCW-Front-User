<template>
  <div class="login-container">
    <div class="login-card">
      <div class="register-title">欢迎注册柑橘智慧种植管理</div>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><UserFilled /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="account">
          <el-input v-model="ruleForm.account" placeholder="请输入账号">
            <template #prefix>
              <el-icon><UserFilled /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            :limit="1"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :http-request="getuploadFile"
          >
            <template #trigger>
              <el-button type="primary">上传头像</el-button>
            </template>
            <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon> -->
            <!-- <template #tip>
              <div class="el-upload__tip">项目文件不能超过MB</div>
            </template> -->
          </el-upload>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            show-password
            placeholder="请输入密码"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPassword">
          <el-input
            v-model="ruleForm.checkPassword"
            type="password"
            show-password
            placeholder="请再次输入密码"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="phoneNumber">
          <el-input v-model="ruleForm.phoneNumber" placeholder="请输入手机号">
            <template #prefix>
              <el-icon><PhoneFilled /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="ruleForm.email" placeholder="请输入邮箱">
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="submitForm(ruleFormRef)">
            注册
          </el-button>
        </el-form-item>
      </el-form>
      <el-row class="register-link">
        <el-col :span="24">
          <span>已有账号?</span>
          <el-link>
            <router-link to="/login" class="register-link-text">前往登录</router-link>
          </el-link>
        </el-col>
      </el-row>
    </div>
  </div>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { UserFilled, Lock, PhoneFilled, Message } from '@element-plus/icons-vue'
import { registerUser } from '@/api/user/index'
import { uploadFile } from '@/api/file/index'
const uploadRef = ref()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const ruleFormRef = ref()
const router = useRouter()
const ruleForm = reactive({
  username: '',
  account: '',
  password: '',
  avatar: '2',
  checkPassword: '',
  phoneNumber: '',
  email: '',
  role: '0'
})

const validatePass = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (ruleForm.checkPassword) {
    ruleFormRef.value.validateField('checkPassword', () => null)
    callback()
  }
}
const validatePass2 = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请再次输入密码'))
  } else if (value !== ruleForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}
const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, validator: validatePass, trigger: 'blur' }],
  checkPassword: [{ validator: validatePass2, trigger: 'blur' }]
})
const submitForm = async (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const res = await registerUser(ruleForm)
      // console.log(res)
      if (res.code === '200') {
        ElMessage.success('注册成功,请登录')
        router.push('/login')
      } else {
        ElMessage.error('请检查输入信息')
      }
    } else {
      ElMessage.error('请检查输入信息')
    }
  })
}
const getuploadFile = async (param) => {
  const file = param.file
  const res = await uploadFile(file)

  if (res.code == 200) {
    ruleForm.avatar = res.data.id
    ElMessage({
      type: 'success',
      message: '上传文件成功'
    })
  }
}
const beforeUpload = (file) => {
  // console.log('beforeUpload')
  // console.log(file)
}

const handleExceed = (files) => {
  uploadRef.value.clearFiles()
  const file = files[0]
  uploadRef.value.handleStart(file)
  ElMessage({
    type: 'error',
    message: '只能上传一个文件'
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding-top: clamp(2rem, 10vw, 5rem);
}

.login-card {
  max-width: 400px;
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.register-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.login-form {
  width: 100%;
}

.login-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.register-link {
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
}

.register-link-text {
  margin-left: 5px;
  text-decoration: none;
  color: #409eff;
}
</style>
