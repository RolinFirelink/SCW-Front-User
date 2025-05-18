<template>
  <div class="layout">
    <div class="menu">
      <RouterLink to="/" class="re-home">返回首页</RouterLink>
      <!-- Logo -->
      <div class="logo">
        <img :src="logo" draggable="false" alt="logo" class="logo-img" />
        <span class="logo-span">柑橘智能问答</span>
      </div>
    </div>
    <div class="chat">
      <!-- 消息列表 -->
      <div class="messages">
        <div
          v-for="message in messages"
          :key="message.key"
          :class="['message', message.role === 'ai' ? 'message-ai' : 'message-user']"
        >
          <img v-if="message.role === 'ai'" :src="logo" class="avatar" alt="AI" />
          <div
            class="message-content"
            v-if="message.isMarkdown"
            v-html="marked.parse(message.content)"
          ></div>
          <div class="message-content" v-else>{{ message.content }}</div>
          <img v-if="message.role === 'local'" :src="img" class="avatar" alt="User" />
        </div>
      </div>

      <!-- 输入框 -->
      <Sender
        :value="content"
        class="sender"
        @submit="onSubmit"
        @update:value="(val) => (content = val)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Sender } from 'ant-design-x-vue'
import reqAIChat from '@/api/chat/index'
import { ElMessage } from 'element-plus'
import logo from '@/assets/images/customer_service.jpg'
import img from '@/assets/images/user/img.jpg'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

marked.setOptions({
  highlight: (code) => hljs.highlightAuto(code).value,
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false
})

marked.use({
  renderer: {
    link(href, title, text) {
      return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`
    }
  }
})

const content = ref('')

const messages = ref([
  {
    key: '1',
    content: `你好,我是柑橘AI智能助手。有任何柑橘问题,请随时向我提问!`,
    role: 'ai',
    variant: 'primary',
    isMarkdown: true
  }
])

const onSubmit = async (nextContent) => {
  if (!nextContent) return
  messages.value.push({
    key: `${messages.value.length + 1}`,
    content: nextContent,
    role: 'local',
    variant: 'shadow'
  })
  content.value = ''
  try {
    const res = await reqAIChat({ message: nextContent })
    if (!res) {
      ElMessage({
        message: '请求失败',
        type: 'error'
      })
      return
    }

    messages.value.push({
      key: `${messages.value.length + 1}`,
      content: res,
      role: 'ai',
      variant: 'primary',
      isMarkdown: true
    })
  } catch (error) {
    ElMessage({
      message: '请求出错',
      type: 'error'
    })
  }
}
</script>

<style>
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 100px; /* 减小底部padding，为发送框留出合适空间 */
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.message {
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;        /* 让消息容器占满宽度 */
  max-width: unset;   /* 移除之前的最大宽度限制 */
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}


.message-ai {
  padding-right: 15%;
  justify-content: flex-start;
}

.message-user {
  padding-right: 15%;
  justify-content: flex-end;  /* 整体靠右对齐 */
}


.message-content {
  max-width: 60%;  /* 限制消息内容最大宽度 */
  padding: 12px 16px;
  border-radius: 12px;
  background-color: transparent;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-ai .message-content {
  background-color: #f0f2f5;
  border-radius: 12px;
  border-top-left-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}


.message-user .message-content {
  background: linear-gradient(120deg, #E3F2FD, #BBDEFB);  /* 更柔和的蓝色渐变 */
  color: #1a237e;  /* 深蓝色文字 */
  border-radius: 12px;
  border-top-right-radius: 2px;
  box-shadow: 0 2px 6px rgba(33, 150, 243, 0.1);
  margin-right: 12px;  /* 给头像留出间距 */
}


.markdown-body {
  padding: 0;
  line-height: 1.6;
  color: #333;
}

.re-home {
  display: inline-block;
  padding: 10px 20px;
  margin: 12px;
  background: linear-gradient(135deg, #FF6B00, #FFA500);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 165, 0, 0.3);
}

.re-home:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 165, 0, 0.4);
}

.layout {
  width: 100%;
  min-width: 1000px;
  height: 100vh;
  display: flex;
  background: #FFFAF0;
  font-family: AlibabaPuHuiTi, sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.menu {
  padding: 24px 0;
  width: 280px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #FFF3E0, #FFE0B2);
  border-right: 1px solid rgba(255, 165, 0, 0.1);
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 120px;
  background: url('data:image/svg+xml,...') repeat; /* 可以添加淡淡的柑橘图案背景 */
}

.message {
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0; /* 防止头像被压缩 */
}

.message-content {
  max-width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: transparent;
  word-wrap: break-word;  /* 确保长文本会自动换行 */
  white-space: pre-wrap;  /* 保留换行和空格 */
}

.message-ai .message-content {
  background-color: #f0f2f5;
  border-radius: 12px;
  border-top-left-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.message-user .message-content {
  background: linear-gradient(135deg, #FFB74D, #FFA726);
  color: white;
  border-top-right-radius: 4px;
  box-shadow: 0 2px 6px rgba(255, 165, 0, 0.2);
}

.sender {
  position: fixed;
  bottom: 20px;      /* 距离底部距离减小 */
  left: 50%;
  transform: translateX(-50%);
  width: 750px;
  max-width: 90%;
  background-color: rgba(255, 255, 255, 0.95);
  z-index: 10;
  padding: 12px 16px;  /* 减小内边距 */
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(255, 165, 0, 0.1);
  border: 1px solid rgba(255, 165, 0, 0.1);
  backdrop-filter: blur(10px);
}

/* 可以添加一个渐变遮罩，让底部消息过渡得更自然 */
.chat::after {
  content: '';
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  max-width: 100%;
  height: 100px;
  background: linear-gradient(to bottom, transparent, #FFFAF0);
  pointer-events: none; /* 确保不会影响滚动和点击 */
  z-index: 5;
}

.logo {
  display: flex;
  height: 72px;
  align-items: center;
  justify-content: start;
  padding: 0 24px;
  margin-bottom: 20px;
}

.logo-img {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(255, 165, 0, 0.2);
}

.logo-span {
  margin: 0 12px;
  font-weight: bold;
  color: #FF6B00;
  font-size: 18px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 添加滚动条样式 */
.messages::-webkit-scrollbar {
  width: 8px;
}

.messages::-webkit-scrollbar-track {
  background: rgba(255, 165, 0, 0.1);
  border-radius: 4px;
}

.messages::-webkit-scrollbar-thumb {
  background: rgba(255, 165, 0, 0.3);
  border-radius: 4px;
}

.chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 800px;  /* 限制聊天区域最大宽度 */
  margin: 0 auto;    /* 使聊天区域居中 */
  position: relative;
  height: 100%;
}

.messages::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 165, 0, 0.5);
}
</style>
