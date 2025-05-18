import type { ResponseData } from '../type'
//用户登录接口携带参数的ts类型
export interface loginFormData {
  username: string
  password: string
}

export interface registerFormData {
  id: number
  account: string
  password: string
  userName?: string // 可选
  userType?: number // 可选
  avatar?: string // 可选
  name?: string // 可选
  mobile?: string // 可选
  email?: string // 可选
  activeFlag?: boolean // 可选
}

export interface UpdateFormData {
  account: 'string'
  password: 'string'
  userName: 'string'
  userType: number
  avatar?: 'string'
  name?: 'string'
  mobile?: 'string'
  email?: 'string'
  activeFlag?: true
}

export interface logoutResponse extends ResponseData {
  data: boolean
}
