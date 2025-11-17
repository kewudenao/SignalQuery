import { DataItem, DataListParams, DataListResponse, DataForm, ChartData } from '@/types'

// 格式化日期
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 模拟延迟
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Mock 数据存储
let mockDataList: DataItem[] = [
  { id: 1, name: '数据项1', value: 120, category: '类型A', createTime: formatDate(new Date()), updateTime: formatDate(new Date()) },
  { id: 2, name: '数据项2', value: 85, category: '类型B', createTime: formatDate(new Date()), updateTime: formatDate(new Date()) },
  { id: 3, name: '数据项3', value: 200, category: '类型A', createTime: formatDate(new Date()), updateTime: formatDate(new Date()) },
  { id: 4, name: '数据项4', value: 150, category: '类型C', createTime: formatDate(new Date()), updateTime: formatDate(new Date()) },
  { id: 5, name: '数据项5', value: 90, category: '类型B', createTime: formatDate(new Date()), updateTime: formatDate(new Date()) },
  { id: 6, name: '数据项6', value: 180, category: '类型A', createTime: formatDate(new Date()), updateTime: formatDate(new Date()) },
  { id: 7, name: '数据项7', value: 110, category: '类型C', createTime: formatDate(new Date()), updateTime: formatDate(new Date()) },
  { id: 8, name: '数据项8', value: 95, category: '类型B', createTime: formatDate(new Date()), updateTime: formatDate(new Date()) },
]

let nextId = 9

// Mock API 服务
export const mockApi = {
  // 获取数据列表
  async getDataList(params: DataListParams): Promise<{ code: number; message: string; data: DataListResponse }> {
    await delay(300 + Math.random() * 200)
    
    let filteredList = [...mockDataList]
    
    // 按名称过滤
    if (params.name) {
      filteredList = filteredList.filter(item => 
        item.name.toLowerCase().includes(params.name!.toLowerCase())
      )
    }
    
    // 按分类过滤
    if (params.category) {
      filteredList = filteredList.filter(item => item.category === params.category)
    }
    
    // 分页
    const total = filteredList.length
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    const list = filteredList.slice(start, end)
    
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
  async getDataDetail(id: number): Promise<{ code: number; message: string; data: DataItem | null }> {
    await delay(300 + Math.random() * 200)
    
    const item = mockDataList.find(item => item.id === id)
    
    return {
      code: 200,
      message: 'success',
      data: item || null
    }
  },

  // 创建数据
  async createData(form: DataForm): Promise<{ code: number; message: string; data: DataItem }> {
    await delay(300 + Math.random() * 200)
    
    const now = formatDate(new Date())
    const newItem: DataItem = {
      id: nextId++,
      ...form,
      createTime: now,
      updateTime: now
    }
    
    mockDataList.push(newItem)
    
    return {
      code: 200,
      message: 'success',
      data: newItem
    }
  },

  // 更新数据
  async updateData(id: number, form: Partial<DataForm>): Promise<{ code: number; message: string; data: DataItem | null }> {
    await delay(300 + Math.random() * 200)
    
    const index = mockDataList.findIndex(item => item.id === id)
    if (index === -1) {
      return {
        code: 404,
        message: '数据不存在',
        data: null
      }
    }
    
    mockDataList[index] = {
      ...mockDataList[index],
      ...form,
      updateTime: formatDate(new Date())
    }
    
    return {
      code: 200,
      message: 'success',
      data: mockDataList[index]
    }
  },

  // 删除数据
  async deleteData(id: number): Promise<{ code: number; message: string; data: null }> {
    await delay(300 + Math.random() * 200)
    
    const index = mockDataList.findIndex(item => item.id === id)
    if (index === -1) {
      return {
        code: 404,
        message: '数据不存在',
        data: null
      }
    }
    
    mockDataList.splice(index, 1)
    
    return {
      code: 200,
      message: 'success',
      data: null
    }
  },

  // 获取图表数据
  async getChartData(): Promise<{ code: number; message: string; data: ChartData }> {
    await delay(300 + Math.random() * 200)
    
    // 按分类统计
    const categoryMap = new Map<string, number>()
    mockDataList.forEach(item => {
      const current = categoryMap.get(item.category) || 0
      categoryMap.set(item.category, current + item.value)
    })
    
    const categories = Array.from(categoryMap.keys())
    const values = Array.from(categoryMap.values())
    
    // 生成趋势数据（最近7天）
    const trend = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = formatDate(date).split(' ')[0]
      trend.push({
        date: dateStr,
        value: Math.floor(Math.random() * 200) + 50
      })
    }
    
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

