// API 响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 数据项类型
export interface DataItem {
  id: string
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

// 创建数据参数
export interface CreateDataParams {
  name: string
  value: number
  category: string
}

// 更新数据参数
export interface UpdateDataParams {
  name?: string
  value?: number
  category?: string
}

// 图表数据
export interface ChartData {
  categories: string[]
  values: number[]
  trend: number[]
}

// 用户信息
export interface UserInfo {
  avatar: string
  name: string
}
