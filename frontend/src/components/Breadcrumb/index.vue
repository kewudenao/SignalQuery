<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbList"
        :key="index"
      >
        {{ item }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbList = computed(() => {
  return (route.meta.breadcrumb as string[]) || []
})
</script>

<style scoped>
.breadcrumb {
  height: 36px;
  background-color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #e4e7ed;
}

.breadcrumb :deep(.el-breadcrumb__inner) {
  color: #888888;
  font-size: 14px;
}

.breadcrumb :deep(.el-breadcrumb__separator) {
  color: #888888;
}
</style>

