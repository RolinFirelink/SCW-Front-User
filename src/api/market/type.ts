import type { ResponseData } from '../type'

interface CnhnbProcurementItem {
  id: number
  name: string
  amount: string
  address: string
  purchaser: string
  updateTime: string
  level: string
  detailUrl: string
}
export interface ProcurementParams {
  pageNum: number
  pageSize: number
  keyword: string
}
export interface GanjuwPageResponse extends ResponseData {
  data: CnhnbProcurementItem[]
}

interface CnhnbPriceItem {
  total: number
  list: CnhnbPriceItem[]
  pageNum: number
  pageSize: number
  size: number
  startRow: number
  endRow: number
  pages: number
  prePage: number
  nextPage: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  navigatePages: number
  navigatepageNums: number[]
  navigateFirstPage: number
  navigateLastPage: number
  lastPage: boolean
  firstPage: boolean
}
export interface PriceParams {
  pageNum: number
  pageSize: number
  keyword: string
}

export interface GanjuwPriceResponse extends ResponseData {
  data: CnhnbPriceItem[]
}
