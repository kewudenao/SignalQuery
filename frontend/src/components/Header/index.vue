<template>
  <div class="header">
    <div class="header-left">
      <div class="logo">数据可视化</div>
    </div>
    <div class="header-center">
      <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        class="header-menu"
        @select="handleMenuSelect"
      >
        <el-menu-item index="/home">首页</el-menu-item>
        <el-menu-item index="/data-list">数据管理</el-menu-item>
      </el-menu>
    </div>
    <div class="header-right">
      <el-avatar :src="userStore.userInfo.avatar" :size="32" />
      <span class="username">{{ userStore.userInfo.name }}</span>
      <el-button type="text" class="contact-btn" @click="handleContact">联系我们</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const handleMenuSelect = (index: string) => {
  router.push(index)
}

const handleContact = () => {
  ElMessage.info('请联系管理员')
}
</script>

<style scoped>
.header {
  height: 64px;
  background-color: #263346;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: white;
}

.header-left {
  flex-shrink: 0;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: white;
}

.header-center {
  flex: 1;
  margin-left: 40px;
}

.header-menu {
  background-color: #263346;
  border-bottom: none;
}

.header-menu :deep(.el-menu-item) {
  color: white;
  font-size: 16px;
  border-bottom: none;
}

.header-menu :deep(.el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.1);
}

.header-menu :deep(.el-menu-item.is-active) {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-bottom: none;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.username {
  color: white;
  font-size: 14px;
}

.contact-btn {
  color: white;
  font-size: 14px;
  padding: 0;
}

.contact-btn:hover {
  color: rgba(255, 255, 255, 0.8);
}
</style>

