<template>
  <el-container class="layout-container">
    <Header />
    <el-container>
      <el-main class="main-content">
        <Breadcrumb />
        <div class="content-wrapper">
          <router-view />
        </div>
      </el-main>
    </el-container>
    <Footer />
  </el-container>
</template>

<script setup lang="ts">
import Header from '../Header/index.vue'
import Breadcrumb from '../Breadcrumb/index.vue'
import Footer from '../Footer/index.vue'
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.main-content {
  padding: 0;
  background-color: white;
}

.content-wrapper {
  padding: 20px;
  background-color: white;
}
</style>
