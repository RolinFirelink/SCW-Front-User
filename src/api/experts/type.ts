import type { ResponseData } from '../type'
export interface ExpertSaveRequest {
  id?: number
  products?: string
  userId: number
  name?: string
  profile?: string
  phone?: string
  email?: string
  qq?: string
  weChat?: string
  other?: string
  applyStatus?: number
  certification?: string
  reason?: string
  remark?: string
}

export interface ExpertSaveResponse extends ResponseData {
  data: string
}
