<script setup>
//import { QuestionMarkCircle } from '@element-plus/icons-vue'
</script>

<template>
  <div class="faq-container">
    <h2 class="faq-title">常见问题</h2>
    <div class="faq-grid">
      <div class="faq-item">
        <h3 class="faq-question">
          <el-icon class="question-icon"><QuestionMarkCircle /></el-icon>
          什么是Vue.js？
        </h3>
        <p class="faq-answer">
          Vue.js 是一个渐进式 JavaScript 框架，用于构建用户界面。 它被设计成可以自底向上增量采用的。
        </p>
      </div>
      <!-- ... 其他问题保持不变，添加相同的图标结构 ... -->
    </div>
  </div>
</template>

<style scoped>
.faq-container {
  margin: 0 auto;
  max-width: 75rem;
  padding-bottom: 1.25rem;
  background-color: var(--el-bg-color);
  border-radius: 8px;
  padding: 2rem;
}

.faq-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: var(--el-text-color-primary);
}

.faq-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  padding: 0 0.75rem;
}

.faq-item {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: var(--el-bg-color-overlay);
  transition: all 0.3s ease;
}

.faq-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.faq-question {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  color: var(--el-text-color-primary);
}

.question-icon {
  margin-right: 0.5rem;
  font-size: 1.25rem;
  color: var(--el-color-primary);
}

.faq-answer {
  color: var(--el-text-color-regular);
  margin-top: 0.75rem;
  line-height: 1.6;
  padding-left: 2.25rem;
}

@media (min-width: 1024px) {
  .faq-title {
    font-size: 1.875rem;
    padding-bottom: 0.75rem;
  }

  .faq-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 4rem;
    padding: 0;
  }
}
</style>
