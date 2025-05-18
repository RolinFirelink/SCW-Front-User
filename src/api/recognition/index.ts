import request from '@/utils/request'
// import type { AIResponse } from './type'

enum API {
  SMART_IMAGES = '/smart/images',
  SMART_VEDIO = '/smart/video/process',
  GET_TASK_RESULT = '/smart/api/tasks'
}

/**
 * 图片识别接口，用于分析柑橘图像
 * @param files - 文件数组
 * @returns Promise<SmartImagesResponse> - The analysis result
 */
export function reqSmartImages(files: File[]) {
  const formData = new FormData()

  // 将每个文件添加到 FormData 的 "files" 字段中
  files.forEach((file) => {
    formData.append('files', file) // 字段名必须与后端要求的 'files' 完全一致
  })

  return request({
    url: API.SMART_IMAGES,
    method: 'post',
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // },
    data: formData
  })
}

/**
 * 视频识别接口
 * @param files- An array of files to upload (multipart/form-data)
 * @returns Promise<SmartImagesResponse> - The analysis result
 */
export function reqSmartVedio(file: File) {
  const formData = new FormData()

  formData.append('file', file)

  return request({
    url: API.SMART_VEDIO,
    method: 'post',
    data: formData
  })
}
