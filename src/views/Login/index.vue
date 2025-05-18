<template>
  <div class="login-container">
    <div class="login-card" shadow="always">
      <div class="login-title">欢迎登录柑橘智慧种植管理</div>
      <el-form ref="loginFormRef" :rules="rules" :model="loginForm" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            show-password
            placeholder="请输入密码"
            :prefix-icon="Lock"
          ></el-input>
        </el-form-item>
        <el-form-item class="login-links">
<!--          <el-link href="/forgot" class="forgot-link">忘记密码</el-link>-->
          <!-- <el-link class="sms-login">短信登录</el-link> -->
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            @click="handleLogin"
            :disabled="!loginForm.username || !loginForm.password"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <!-- <el-divider content-position="center">或</el-divider>
      <el-row class="third-party-login">
        <el-col :span="24">
          <el-button type="text" class="third-party-btn">
            <img alt="企业微信" class="third-party-icon" />
            通过企业微信继续操作
          </el-button>
        </el-col>
      </el-row> -->

      <el-row class="register-link">
        <el-col :span="24">
          <span>还没有账号?</span>
          <el-link>
            <router-link to="/register" class="register-link-text">前往注册试用</router-link>
          </el-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import { reqLogin } from '@/api/user/index'
import { ElMessage } from 'element-plus'
const loginForm = ref({
  username: 'test',
  password: '123456'
})
const router = useRouter()

// 表单引用
const loginFormRef = ref(null)

// 表单验证规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    {
      pattern: /^[a-zA-z0-9_-]{6,16}$/,
      message: '密码格式不正确，请输入 6 - 16 位字母、数字、下划线或减号',
      trigger: 'blur'
    },
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 登录处理函数
const handleLogin = async () => {
  try {
    const res = await reqLogin(loginForm.value)
    if (res.code === "200") {
      router.push({
        path: '/'
      })

      const token = res.data.extendAttribute.split(' ')[1];
      console.log(token)
      Cookies.set('auth_token', token)
      Cookies.set('user', JSON.stringify(res.data))
    } else {
      // 使用 ElMessage 显示错误信息
      ElMessage.error(res.message || '登录失败，请检查用户名和密码')
    }
  } catch (error) {
    console.error('登录请求出错:', error)
    // 捕获异常时也显示错误信息
    ElMessage.error('登录请求出错，请稍后重试')
  }
}

</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #fff8f0 0%, #fff 100%);
  position: relative;
  overflow: hidden;
}

/* 装饰性柑橘图案 */
.orange-decoration {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  opacity: 0.1;
  background: radial-gradient(circle, #ff9f43 0%, #ff7e1d 100%);
}

.top-left {
  top: -100px;
  left: -100px;
}

.bottom-right {
  bottom: -100px;
  right: -100px;
}

.login-card {
  width: 400px;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(255, 126, 29, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
}

/* Logo样式 */
.logo-container {
  text-align: center;
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 10px;
  color: #ff7e1d;
}

.login-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 14px;
}

/* 表单样式优化 */
.login-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  padding: 12px;
  background: #fff;
  border: 1px solid #ffd5b4;
}

.login-form :deep(.el-input__wrapper:hover) {
  border-color: #ff9f43;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  border-color: #ff7e1d;
  box-shadow: 0 0 0 1px rgba(255, 126, 29, 0.2);
}

/* 登录按钮样式 */
.login-btn {
  width: 100%;
  height: 45px;
  font-size: 16px;
  border-radius: 8px;
  background: linear-gradient(45deg, #ff7e1d, #ff9f43);
  border: none;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(45deg, #ff9f43, #ff7e1d);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 126, 29, 0.2);
}

.login-btn:disabled {
  background: #ffd5b4;
  cursor: not-allowed;
}

/* 链接样式 */
.login-links {
  margin: -10px 0 20px;
}

.login-links :deep(.el-link) {
  color: #ff7e1d;
  font-size: 14px;
}

.login-links :deep(.el-link:hover) {
  color: #ff9f43;
}

/* 注册链接样式 */
.register-link {
  margin-top: 25px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.register-link-text {
  color: #ff7e1d;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
}

.register-link-text:hover {
  color: #ff9f43;
}

@media (max-width: 480px) {
  .login-card {
    width: 90%;
    padding: 30px 20px;
  }
}
</style>
