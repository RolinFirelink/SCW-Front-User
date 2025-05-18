import axios from 'axios'

/**
 * 发送 AI 请求的函数
 * @param {Object} params - 请求的负载数据
 * @returns {string} - 返回 AI 接口的响应数据
 */
async function reqAIChat(params) {
  try {
    const response = await axios({
      method: 'post',
      url: 'http://localhost:5000/kimichat',
      data: params,
      timeout: 60000
    })
    return response.data
  } catch (error) {
    if (error.response) {
      // 服务器返回了响应，但状态码不是2xx
      console.error('服务器响应错误:', error.response.data)
      throw new Error(`服务器返回错误状态码 ${error.response.status}: ${error.response.statusText}`)
    } else if (error.request) {
      // 请求已发出，但未收到响应
      console.error('未收到服务器响应:', error.request)
      throw new Error('未收到服务器响应。请检查服务器是否正常运行。')
    } else {
      // 在设置请求时发生错误
      console.error('请求过程中发生错误:', error.message)
      throw new Error('请求过程中发生错误。请检查网络连接或请求参数是否正确。')
    }
  }
}

export default reqAIChat
