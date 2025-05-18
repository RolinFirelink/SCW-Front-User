// 用户登录
import request from '@/utils/request'
import type { loginFormData, registerFormData, logoutResponse } from './type'

enum API {
  LOGIN_URL = '/login',
  REGISTER_URL = '/user/register',
  LOGOUT_URL = '/user/logout',
  UPDATE_URL = '/user/update',
  GET_USER_INFO = '/user'
}

/**
 * 用户登录
 * @param data
 * @returns
 */
export function reqLogin(data: loginFormData) {
  return request({
    url: `${API.LOGIN_URL}?username=${data.username}&password=${data.password}`,
    method: 'post',
    data: data,
    headers: {
      userType: 1
    }
  })
}

/**
 * 用户注册
 * @param data
 * @returns
 */
export function registerUser(data: registerFormData) {
  return request({
    url: API.REGISTER_URL,
    method: 'post',
    data: data
  })
}
/**
 * 注销
 * @param token
 * @returns
 */
export function reqLogout(): Promise<logoutResponse> {
  return request({
    url: API.LOGOUT_URL,
    method: 'get'
  })
}

/**
 * 更新用户信息
 * @param data
 * @returns
 */
export function reqUpdateUser(data: unknown) {
  return request({
    url: API.UPDATE_URL,
    method: 'put',
    data: data
  })
}

/**
 * 根据id获取用户信息
 * @param id 用户ID
 * @returns
 */
export function reqGetUserInfo(id: number) {
  return request({
    url: `${API.GET_USER_INFO}/${id}`,
    method: 'get'
  })
}
