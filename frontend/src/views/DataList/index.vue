<template>
  <div class="data-list">
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">新增数据</el-button>
      <div class="search-bar">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入名称"
          clearable
          style="width: 200px; margin-right: 10px;"
          @clear="handleSearch"
        />
        <el-select
          v-model="searchForm.category"
          placeholder="请选择分类"
          clearable
          style="width: 150px; margin-right: 10px;"
          @clear="handleSearch"
        >
          <el-option label="类型A" value="类型A" />
          <el-option label="类型B" value="类型B" />
          <el-option label="类型C" value="类型C" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="value" label="数值" />
      <el-table-column prop="category" label="分类" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="updateTime" label="更新时间" width="180" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
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
            placeholder="请输入数值"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="formData.category" placeholder="请选择分类" style="width: 100%;">
            <el-option label="类型A" value="类型A" />
            <el-option label="类型B" value="类型B" />
            <el-option label="类型C" value="类型C" />
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
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { getDataList, createData, updateData, deleteData } from '@/api/modules/data'
import { DataItem, DataListParams, DataForm } from '@/types'

const loading = ref(false)
const tableData = ref<DataItem[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增数据')
const formRef = ref<FormInstance>()
const editId = ref<number | null>(null)

const searchForm = reactive({
  name: '',
  category: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive<DataForm>({
  name: '',
  value: 0,
  category: ''
})

const formRules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ],
  value: [
    { required: true, message: '请输入数值', trigger: 'blur' },
    { type: 'number', min: 0, message: '数值必须大于等于0', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ]
}

// 加载数据列表
const loadDataList = async () => {
  loading.value = true
  try {
    const params: DataListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...(searchForm.name && { name: searchForm.name }),
      ...(searchForm.category && { category: searchForm.category })
    }
    
    const response = await getDataList(params)
    if (response.code === 200 && response.data) {
      tableData.value = response.data.list
      pagination.total = response.data.total
    }
  } catch (error) {
    console.error('加载数据列表失败:', error)
    ElMessage.error('加载数据列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadDataList()
}

// 分页大小改变
const handleSizeChange = () => {
  loadDataList()
}

// 页码改变
const handlePageChange = () => {
  loadDataList()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增数据'
  editId.value = null
  formData.name = ''
  formData.value = 0
  formData.category = ''
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: DataItem) => {
  dialogTitle.value = '编辑数据'
  editId.value = row.id
  formData.name = row.name
  formData.value = row.value
  formData.category = row.category
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: DataItem) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除数据"${row.name}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await deleteData(row.id)
    if (response.code === 200) {
      ElMessage.success('删除成功')
      loadDataList()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (editId.value === null) {
          // 新增
          const response = await createData(formData)
          if (response.code === 200) {
            ElMessage.success('新增成功')
            dialogVisible.value = false
            loadDataList()
          } else {
            ElMessage.error(response.message || '新增失败')
          }
        } else {
          // 编辑
          const response = await updateData(editId.value, formData)
          if (response.code === 200) {
            ElMessage.success('更新成功')
            dialogVisible.value = false
            loadDataList()
          } else {
            ElMessage.error(response.message || '更新失败')
          }
        }
      } catch (error) {
        console.error('操作失败:', error)
        ElMessage.error('操作失败')
      }
    }
  })
}

// 对话框关闭
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  loadDataList()
})
</script>

<style scoped>
.data-list {
  width: 100%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

