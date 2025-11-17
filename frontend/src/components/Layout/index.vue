<template>
  <div class="layout">
    <Header />
    <Breadcrumb />
    <div class="main-content">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '../Header/index.vue'
import Breadcrumb from '../Breadcrumb/index.vue'
import Footer from '../Footer/index.vue'
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  background-color: white;
  padding: 20px;
  overflow: auto;
}
</style>

