import request from '@/utils/request'
import type { WeatherResponse } from './type'
enum API {
  GET_WEATHER = '/crawler/getWeather',
  //分页获取轮播图
  CAROUSEL_PAGE = '/carousel/page'
}
/**
 * 获取最新的天气信息
 * @param token
 * @returns Promise<WeatherResponse> - 天气信息
 */
export function reqGetWeather(): Promise<WeatherResponse> {
  return request({
    url: API.GET_WEATHER,
    method: 'get'
  })
}

/**
 * 分页获取轮播图列表
 * @param params 分页参数
 * @returns Promise
 */
export function reqGetCarouselPage(params: unknown) {
  return request({
    url: API.CAROUSEL_PAGE,
    method: 'get',
    params
  })
}
