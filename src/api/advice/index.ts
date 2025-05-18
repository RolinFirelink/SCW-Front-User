import request from '@/utils/request'

// 接口枚举
enum API {
  GET_AI_ADVICE = '/smart/ai'
}

// 请求参数类型定义
export interface AIAdviceParams {
  variety: string // 品种
  growth: string // 生长阶段
  video: boolean // 是否包含视频
  image: boolean // 是否包含图片
  text: string // 文本描述
}

/**
 * 获取智能建议
 * @param data 请求参数
 * @returns Promise<AIAdviceResponse> - 智能建议响应
 */
export function reqGetAIAdvice(data: AIAdviceParams) {
  return request({
    url: API.GET_AI_ADVICE,
    method: 'post',
    data
  })
}
