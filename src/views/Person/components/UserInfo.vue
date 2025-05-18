<script setup>
// import avatarImg from '@/assets/images/user/avatar.jpg'
import Cookies from 'js-cookie'
import { reqUpdateUser } from '@/api/user/index'
import { uploadFile, downloadFileById } from '@/api/file/index'

import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
const uploadRef = ref()
let userInfo = ref({})

const userTypeLabel = computed(() => {
  const typeMap = {
    1: '普通用户',
    2: '专家',
    3: '管理员',
    4: '超级管理员'
  }
  return typeMap[userInfo.value.userType] || '未知类型'
})
const saveUserInfo = async () => {
  console.log(userInfo.value)
  const res = await reqUpdateUser(userInfo.value)
  if (res.code === '200') {
    ElMessage.success('保存成功')
    // 更新cookie
    Cookies.set('user', encodeURIComponent(JSON.stringify(userInfo.value)), { expires: 7 })
  } else {
    ElMessage.error('更新失败')
  }
}
//头像上传
const avatarUrl = ref(null)
const avatarUpload = ref(null)
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

const removeAvatar = () => {
  userInfo.value.avatar = null
  avatarUrl.value = null // 重置头像 URL
  // 清除上传组件的文件列表
  avatarUpload.value.clearFiles()
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
    removeAvatar()
    avatarUrl.value = await getAvatarUrl(res.data.id)

    userInfo.value.avatar = res.data.id

    ElMessage.success('头像修改成功')
  } else {
    ElMessage.error('头像上传失败')
  }
}

const loadUserInfo = async () => {
  const userCookie = Cookies.get('user')
  if (userCookie) {
    userInfo.value = JSON.parse(decodeURIComponent(userCookie))
    avatarUrl.value = await getAvatarUrl(userInfo.value.avatar)
  } else {
    console.warn('未找到用户信息的cookie')
  }
}
onMounted(() => {
  loadUserInfo()
})
// TODO:用来显示个人信息组件的文件
</script>

<template>
  <div class="user-setting-wrap">
    <el-row>
      <el-col :span="6" class="avatar-col">
        <div class="avatar-wrap">
          <img
            :src="avatarUrl"
            style="width: 180px; height: 180px; border-radius: 40px; overflow: hidden"
            class="avatar"
          />

          <el-upload
            ref="avatarUpload"
            class="avatar-uploader"
            :show-file-list="false"
            :http-request="uploadAvatar"
            :before-upload="beforeAvatarUpload"
            :limit="1"
            accept="image/*"
          >
            <template #trigger>
              <el-button type="primary">修改头像</el-button>
            </template>
          </el-upload>
        </div>
      </el-col>
      <el-col :span="18">
        <el-form label-width="120px" class="user-form">
          <el-form-item label="账户">
            <el-input v-model="userInfo.account" placeholder="请输入账户" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="userInfo.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="userInfo.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfo.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="用户类型">
            <el-tag :closable="false">{{ userTypeLabel }}</el-tag>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveUserInfo">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss"></style>
