// 数据项类型
export interface DataItem {
  id: number
  name: string
  value: number
  category: string
  createTime: string
  updateTime: string
}

// 数据列表查询参数
export interface DataListParams {
  page: number
  pageSize: number
  name?: string
  category?: string
}

// 数据列表响应
export interface DataListResponse {
  list: DataItem[]
  total: number
  page: number
  pageSize: number
}

// 创建/更新数据请求
export interface DataForm {
  name: string
  value: number
  category: string
}

// API 统一响应格式
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 图表数据
export interface ChartData {
  categories: string[]
  values: number[]
  trend: Array<{ date: string; value: number }>
}

// 用户信息
export interface UserInfo {
  avatar: string
  name: string
}

