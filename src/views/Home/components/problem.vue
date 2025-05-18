<template>
    <div class="knowledge-container">
      <!-- 柑橘相关问题部分 -->
      <div class="section orange-questions">
        <h2 class="section-title">柑橘相关问题</h2>
        <div class="questions-list">
          <div v-for="item in problemList" :key="item.id" class="question-item">
            <div class="question-header">
              <h3 class="question-title">{{ item.question }}</h3>
            </div>
            <div class="question-content">
              <p v-html="renderedAnswers[item.id]"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { reqProblemList } from '@/api/problem/index';
  import { marked } from 'marked';
  
  const problemList = ref([]);
  const answers = ref({});
  
  const getProblemList = async () => {
    try {
      const result = await reqProblemList();
      if (result.code === '200') {
        problemList.value = result.data;
        answers.value = result.data.reduce((acc, curr) => {
          acc[curr.id] = curr.answer;
          return acc;
        }, {});
      }
    } catch (error) {
      console.error('获取问题列表失败:', error);
    }
  };
  
  onMounted(() => {
    getProblemList();
  });
  
  const renderedAnswers = computed(() => {
    return Object.keys(answers.value).reduce((acc, key) => {
      acc[key] = marked(answers.value[key]);
      return acc;
    }, {});
  });
  </script>
  
  <style lang="scss">
  .knowledge-container {
    padding: 40px;
    background-color: #f8f5f2;
  
    .section {
      background: linear-gradient(135deg, #fff6ed, #fff9f5);
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(180, 100, 20, 0.08);
      margin-bottom: 25px;
      padding: 25px;
      border: 1px solid rgba(180, 100, 20, 0.1);
      transition: transform 0.3s ease;
  
      &:hover {
        transform: translateY(-3px);
      }
  
      .section-title {
        font-size: 1.4rem;
        font-weight: 600;
        margin-bottom: 15px;
        color: #d86c1f;
        border-bottom: 2px solid rgba(216, 108, 31, 0.2);
        padding-bottom: 8px;
        position: relative;
  
        &:after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 50px;
          height: 2px;
          background-color: #d86c1f;
        }
      }
  
      &.orange-questions {
        background: linear-gradient(135deg, #fff6ed, #f9f2ea);
        
        .question-item {
          margin-bottom: 20px;
          padding: 15px;
          background: rgba(216, 108, 31, 0.04);
          border-radius: 8px;
          border-left: 3px solid #d86c1f;
          transition: all 0.3s ease;
  
          &:hover {
            background: rgba(216, 108, 31, 0.08);
            transform: translateX(5px);
          }
  
          .question-title {
            font-size: 1.1rem;
            color: #5c4032;
            margin: 0 0 10px 0;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(216, 108, 31, 0.2);
          }
  
          .question-content {
            p {
              color: #5c4032;
              line-height: 1.6;
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }
  </style>