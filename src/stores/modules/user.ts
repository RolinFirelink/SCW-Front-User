// 用户相关信息的仓库
import { defineStore } from 'pinia'
// import { reqLogin, reqUserInfo, reqLogout } from '@/api/user/index'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { constantRoute } from '@/router/router'
import type {
  loginFormData,
} from '@/api/user/type'
// 创建用户仓库
const useUserStore = defineStore('User', {
  // 存储数据
  state: () => {
    return {
      token: GET_TOKEN(), //保存请求发送后获取到的token
      menuRoutes: constantRoute, //菜单数组
      username: '', //用户名
      avatar: '', //用户头像
      buttons: [],
    }
  },
  //逻辑
  actions: {
    //用户登录的方法逻辑
    async userLogin(data: loginFormData) {
      //调用接口
      const res: loginResponseData = await reqLogin(data)
      // console.log(res)
      if (res.code === '200') {
        // console.log('登录成功')
        this.token = res.data as string
        // localStorage.setItem('TOKEN', res.data.token as string) //将token存储在本地中
        SET_TOKEN(res.data as string)
        return 'ok'
      } else if (res.code === 201) {
        // console.log('登录失败')
        return Promise.reject(new Error(res.data))
      }
    },
    //获取用户信息
    async userInfo() {
      const res: userInfoReponseData = await reqUserInfo()
      // console.log('用户信息', res)
      if (res.code === 200) {
        this.username = res.data.name
        this.avatar = res.data.avatar
        // this.buttons = res.data.buttons
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
    //退出登录时调用的方法
    async userLogout() {
      const res = await reqLogout()
      if (res.code === '200') {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
    // 计算
    getters: {},
  },
})

export default useUserStore
