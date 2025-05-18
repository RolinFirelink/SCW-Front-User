import request from '@/utils/request'
import type { ProcurementParams, PriceParams } from './type'
enum API {
  GET_CNHNB_PROCUREMENT_PAGE = '/crawler/cnhnbProcurementPage',
  GET_CNHNB_PRICE_PAGE = '/crawler/cnhnbPricePage',
  ADD_CNHNB_PRICE = '/crawler/price/save',
  GET_PROCUREMENT_MAP = '/crawler/getProcurementMap',
  GET_PRICE_MAP = '/crawler/getPriceMap'
}
/**
 * 分页获取惠农网的采购信息
 * @param params - 分页参数
 * @returns Promise<CnhnbProcurementPageResponse> - 采购信息分页数据
 */
export function reqGetProcurementPage(params: ProcurementParams) {
  return request({
    url: API.GET_CNHNB_PROCUREMENT_PAGE,
    method: 'get',
    params: params
  })
}

/**
 * 分页获取惠农网的价格信息
 * @param params - 参数信息
 * @returns Promise<CnhnbPricePageResponse> - 价格信息分页数据
 */
export function reqGetCnhnbPricePage(params: PriceParams) {
  return request({
    url: API.GET_CNHNB_PRICE_PAGE,
    method: 'get',
    params: params
  })
}

/**
 * 新增惠农网的柑橘价格新闻内容
 * @param param
 * @returns Promise<SaveCnhnbPriceResponse> - API response
 */
export function reqAddCnhnbPrice(param) {
  return request({
    url: API.ADD_CNHNB_PRICE,
    method: 'post',
    data: param
  })
}
/**
 * 获取惠农网的采购统计信息
 * @returns Promise<ProcurementMapResponse>
 */
export function reqGetProcurementMap() {
  return request({
    url: API.GET_PROCUREMENT_MAP,
    method: 'get'
  })
}

/**
 * 获取惠农网的价格统计信息
 * @returns Promise<PriceMapResponse>
 */
export function reqGetPriceMap() {
  return request({
    url: API.GET_PRICE_MAP,
    method: 'get'
  })
}
