import request from '@/utils/request'
import {  ExpertSaveRequest, ExpertSaveResponse } from './type'
import Cookies from 'js-cookie';
enum API {
    EXPERT_PAGE = '/expert/page',
    ADD_EXPERTE = '/expert/save',
    EXPERT_SELF = '/expert/selfPage',
    EXPERT_UPDATE = '/expert/update',
    EXPERT_DETELE = '/expert'
  }
  /**
 * 获取专家分页数据
 * @param params - The query parameters
 * @returns Promise<ExpertPageResponse>
 */
export function reqExpertPage(params) {
    const queryParams = Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')
  
    return request({
      url: `${API.EXPERT_PAGE}?${queryParams}&status=1`,
      method: 'get',
    });
  }
  
/**
 * 新增专家信息
 * @param data - The expert data to save
 * @returns Promise<ExpertSaveResponse>
 */
export function reqExpertSave(data: ExpertSaveRequest): Promise<ExpertSaveResponse> {
   // 设置请求头
   const headers = {
    'Content-Type': 'application/json',
  };

  // 获取认证令牌并添加到请求头
  const token = Cookies.get('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return request({
    url: API.ADD_EXPERTE,
    method: 'post',
    data: data, 
  });
}
/**
 * 获取用户自身专家
 */

export function reqExpertSelf(params = {}) {
  // 设置默认分页参数
  const { pageNum = 1, pageSize = 10, ...otherParams } = params;

  // 构建查询参数字符串
  const queryParams = Object.keys({ pageNum, pageSize, ...otherParams })
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  // 设置请求头
  const headers = {
    'Content-Type': 'application/json',
  };

  // 获取认证令牌并添加到请求头
  const token = Cookies.get('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 构建完整请求URL
  const url = `${API.EXPERT_SELF}?${queryParams}`;

  // 发起请求
  return request({
    url,
    method: 'get',
    headers,
  });
}

export function reqExpertUpdate(expertBO) {
  
  // 设置请求头
  const headers = {
    'Content-Type': 'application/json',
  };

  // 获取认证令牌并添加到请求头
  const token = Cookies.get('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  
  return request({
    url: `${API.EXPERT_UPDATE}`,
    method: 'put',
    headers,
    data: expertBO,
  });
}

export function reqExpertDelete(id: number) {
  return request({
    url: `${API.EXPERT_DETELE}/${id}`,
    method: 'delete',
  });
}