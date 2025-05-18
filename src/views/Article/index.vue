<template>
  <div class="article_contain">
    <div v-html="htmlStr" class="article"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { reqGetGanjuwArticleById } from '@/api/info/index'
const route = useRoute()

const htmlStr = ref('')

onMounted(() => {
  getData()
})

const getData = async () => {
  const id = route.params.id
  const res = await reqGetGanjuwArticleById(id)
  if (res.code === '200') {
    htmlStr.value = res.data.detail
  }
}
</script>

<style scoped lang="less">
.article_contain {
  min-height: 800px;
  margin: 30px auto;
}

.article {
  text-align: start;
  // line-height:200%;
}

@media only screen and (max-width: 767px) {
  .curMenu {
    height: 20vw;
    margin: 0 auto;
    margin-bottom: 40px;
  }

  .article_contain {
    width: 95%;
    margin: 10px auto;
  }
}
</style>
