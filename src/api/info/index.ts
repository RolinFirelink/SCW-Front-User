import request from '@/utils/request'
import type { GanjuwPageResponse, GanjuInfoParams } from './type'
enum API {
  GET_GANJUW_PAGE = '/crawler/ganjuwPage',
  GET_GANJUW_BY_ID = '/crawler/ganjuw'
}

/**
 * 分页获取柑橘网的柑橘新闻内容
 * @param params - 参数
 * @returns Promise<GanjuwPageResponse> - 分页的新闻内容
 */
export function reqGetGanjuwPage(params: GanjuInfoParams): Promise<GanjuwPageResponse> {
  const queryParams = Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')
  return request({
    url: `${API.GET_GANJUW_PAGE}?${queryParams}`,
    method: 'get'
  })
}

/**
 * 根据 ID 获取柑橘网的柑橘新闻内容
 * @param id - 文章 ID
 * @returns Promise<GanjuwNewsDetailResponse> - 新闻详情内容
 */
export function reqGetGanjuwArticleById(id: number) {
  return request({
    url: `${API.GET_GANJUW_BY_ID}/${id}`,
    method: 'get'
  })
}
