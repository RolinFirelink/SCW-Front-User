<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Nav from './components/Nav.vue'
import ReturnTop from '@/components/ReturnTop.vue'
</script>

<template>
  <div class="global">
    <Nav />
    <Header />
    <main class="container main">
      <RouterView />
    </main>
    <Footer />
    <ReturnTop />
  </div>
</template>

<style scoped>
.global {
  background-color: #fff;
}
</style>
