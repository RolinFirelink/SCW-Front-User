<script setup lang="ts">
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import { reqLogout } from '@/api/user/index'
import { ElMessage } from 'element-plus'
const router = useRouter()
// const user = JSON.parse(decodeURIComponent(Cookies.get('user')))
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
const logout = async () => {
  const res = await reqLogout()
  if (res.code === '200') {
    ElMessage({
      type: 'success',
      message: '退出登录成功'
    })
    Cookies.remove('auth_token')
    Cookies.remove('user')
    router.push('/login')
  }
}
</script>

<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="user">
          <li>
            <a href="javascript:;">
              <i class="iconfont icon-user" />
              {{ user.account }}
            </a>
          </li>
          <li>
            <el-popconfirm
              title="确认退出吗?"
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm="logout"
            >
              <template #reference>
                <a href="javascript:;">退出登录</a>
              </template>
            </el-popconfirm>
          </li>
          <!-- <li><a href="javascript:;" @click="$router.push('/member/order')">我的订单</a></li> -->
          <li><a href="javascript:;" @click="$router.push('/personal')">个人中心</a></li>
        </template>
        <template v-else>
          <li><RouterLink to="/login">请先登录</RouterLink></li>
          <li><a href="javascript:;">帮助中心</a></li>
          <li><a href="javascript:;">关于我们</a></li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;

        i {
          font-size: 14px;
          margin-right: 2px;
        }

        &:hover {
          color: $mainColor;
        }
      }

      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
