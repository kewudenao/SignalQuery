import type {
  DataItem,
  DataListParams,
  DataListResponse,
  CreateDataParams,
  UpdateDataParams,
  ChartData,
  ApiResponse
} from '@/types'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 日期格式化
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// Mock 数据存储（模拟数据库）
let mockData: DataItem[] = [
  {
    id: '1',
    name: '销售额',
    value: 125000,
    category: '财务',
    createTime: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    updateTime: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  },
  {
    id: '2',
    name: '用户数',
    value: 8500,
    category: '用户',
    createTime: formatDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)),
    updateTime: formatDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000))
  },
  {
    id: '3',
    name: '订单量',
    value: 3200,
    category: '订单',
    createTime: formatDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
    updateTime: formatDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000))
  },
  {
    id: '4',
    name: '访问量',
    value: 156000,
    category: '流量',
    createTime: formatDate(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)),
    updateTime: formatDate(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000))
  },
  {
    id: '5',
    name: '转化率',
    value: 3.5,
    category: '转化',
    createTime: formatDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    updateTime: formatDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
  },
  {
    id: '6',
    name: '库存量',
    value: 850,
    category: '库存',
    createTime: formatDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
    updateTime: formatDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
  },
  {
    id: '7',
    name: '退款金额',
    value: 8500,
    category: '财务',
    createTime: formatDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    updateTime: formatDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
  },
  {
    id: '8',
    name: '活跃用户',
    value: 5200,
    category: '用户',
    createTime: formatDate(new Date()),
    updateTime: formatDate(new Date())
  }
]

// Mock API 服务
export const mockApi = {
  // 获取数据列表
  async getDataList(params: DataListParams): Promise<ApiResponse<DataListResponse>> {
    await delay(300 + Math.random() * 200)
    
    let filteredData = [...mockData]
    
    // 按名称过滤
    if (params.name) {
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(params.name!.toLowerCase())
      )
    }
    
    // 按分类过滤
    if (params.category) {
      filteredData = filteredData.filter(item => item.category === params.category)
    }
    
    // 分页
    const total = filteredData.length
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    const list = filteredData.slice(start, end)
    
    return {
      code: 200,
      message: 'success',
      data: {
        list,
        total,
        page: params.page,
        pageSize: params.pageSize
      }
    }
  },
  
  // 获取数据详情
  async getDataDetail(id: string): Promise<ApiResponse<DataItem>> {
    await delay(300 + Math.random() * 200)
    
    const item = mockData.find(d => d.id === id)
    if (!item) {
      return {
        code: 404,
        message: '数据不存在',
        data: null as any
      }
    }
    
    return {
      code: 200,
      message: 'success',
      data: item
    }
  },
  
  // 创建数据
  async createData(params: CreateDataParams): Promise<ApiResponse<DataItem>> {
    await delay(300 + Math.random() * 200)
    
    const newItem: DataItem = {
      id: String(Date.now()),
      name: params.name,
      value: params.value,
      category: params.category,
      createTime: formatDate(new Date()),
      updateTime: formatDate(new Date())
    }
    
    mockData.push(newItem)
    
    return {
      code: 200,
      message: 'success',
      data: newItem
    }
  },
  
  // 更新数据
  async updateData(id: string, params: UpdateDataParams): Promise<ApiResponse<DataItem>> {
    await delay(300 + Math.random() * 200)
    
    const index = mockData.findIndex(d => d.id === id)
    if (index === -1) {
      return {
        code: 404,
        message: '数据不存在',
        data: null as any
      }
    }
    
    const updatedItem: DataItem = {
      ...mockData[index],
      ...params,
      updateTime: formatDate(new Date())
    }
    
    mockData[index] = updatedItem
    
    return {
      code: 200,
      message: 'success',
      data: updatedItem
    }
  },
  
  // 删除数据
  async deleteData(id: string): Promise<ApiResponse<null>> {
    await delay(300 + Math.random() * 200)
    
    const index = mockData.findIndex(d => d.id === id)
    if (index === -1) {
      return {
        code: 404,
        message: '数据不存在',
        data: null
      }
    }
    
    mockData.splice(index, 1)
    
    return {
      code: 200,
      message: 'success',
      data: null
    }
  },
  
  // 获取图表数据
  async getChartData(): Promise<ApiResponse<ChartData>> {
    await delay(300 + Math.random() * 200)
    
    // 按分类统计
    const categoryMap = new Map<string, number>()
    mockData.forEach(item => {
      const current = categoryMap.get(item.category) || 0
      categoryMap.set(item.category, current + item.value)
    })
    
    const categories = Array.from(categoryMap.keys())
    const values = Array.from(categoryMap.values())
    
    // 生成趋势数据（模拟最近7天的数据）
    const trend = Array.from({ length: 7 }, (_, i) => {
      return Math.floor(Math.random() * 50000 + 50000)
    })
    
    return {
      code: 200,
      message: 'success',
      data: {
        categories,
        values,
        trend
      }
    }
  }
}
