<template>
  <div class="data-list-container">
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">新增数据</el-button>
      <div class="search-group">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入名称"
          style="width: 200px"
          clearable
          @clear="handleSearch"
        />
        <el-select
          v-model="searchForm.category"
          placeholder="请选择分类"
          style="width: 150px"
          clearable
          @clear="handleSearch"
        >
          <el-option
            v-for="category in categories"
            :key="category"
            :label="category"
            :value="category"
          />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="value" label="数值" width="120" />
      <el-table-column prop="category" label="分类" width="120" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="updateTime" label="更新时间" width="180" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="数值" prop="value">
          <el-input-number
            v-model="formData.value"
            :min="0"
            :precision="2"
            style="width: 100%"
            placeholder="请输入数值"
          />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select
            v-model="formData.category"
            placeholder="请选择分类"
            style="width: 100%"
          >
            <el-option
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
  getDataList,
  createData,
  updateData,
  deleteData
} from '@/api/modules/data'
import type { DataItem, DataListParams, CreateDataParams, UpdateDataParams } from '@/types'

const loading = ref(false)
const tableData = ref<DataItem[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增数据')
const formRef = ref<FormInstance>()
const isEdit = ref(false)
const currentId = ref<string>('')

const categories = ['财务', '用户', '订单', '流量', '转化', '库存']

const searchForm = reactive({
  name: '',
  category: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive<CreateDataParams>({
  name: '',
  value: 0,
  category: ''
})

const formRules: FormRules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ],
  value: [
    { required: true, message: '请输入数值', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ]
}

const loadData = async () => {
  loading.value = true
  try {
    const params: DataListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      name: searchForm.name || undefined,
      category: searchForm.category || undefined
    }
    const response = await getDataList(params)
    if (response.code === 200 && response.data) {
      tableData.value = response.data.list
      pagination.total = response.data.total
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增数据'
  dialogVisible.value = true
  Object.assign(formData, {
    name: '',
    value: 0,
    category: ''
  })
}

const handleEdit = (row: DataItem) => {
  isEdit.value = true
  dialogTitle.value = '编辑数据'
  currentId.value = row.id
  dialogVisible.value = true
  Object.assign(formData, {
    name: row.name,
    value: row.value,
    category: row.category
  })
}

const handleDelete = async (row: DataItem) => {
  try {
    await ElMessageBox.confirm('确定要删除这条数据吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const response = await deleteData(row.id)
    if (response.code === 200) {
      ElMessage.success('删除成功')
      loadData()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          const params: UpdateDataParams = {
            name: formData.name,
            value: formData.value,
            category: formData.category
          }
          const response = await updateData(currentId.value, params)
          if (response.code === 200) {
            ElMessage.success('更新成功')
            dialogVisible.value = false
            loadData()
          }
        } else {
          const params: CreateDataParams = {
            name: formData.name,
            value: formData.value,
            category: formData.category
          }
          const response = await createData(params)
          if (response.code === 200) {
            ElMessage.success('创建成功')
            dialogVisible.value = false
            loadData()
          }
        }
      } catch (error) {
        console.error('提交失败:', error)
      }
    }
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

const handleSizeChange = () => {
  loadData()
}

const handlePageChange = () => {
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.data-list-container {
  width: 100%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-group {
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
