import { http } from '../request'
import { mockApi } from '../mock'
import type {
  DataItem,
  DataListParams,
  DataListResponse,
  CreateDataParams,
  UpdateDataParams,
  ChartData,
  ApiResponse
} from '@/types'

/**
 * 获取数据列表
 * GET /api/data/list
 * @param params 查询参数
 * @returns 数据列表响应
 */
export const getDataList = async (params: DataListParams): Promise<ApiResponse<DataListResponse>> => {
  try {
    return await http.get<DataListResponse>('/data/list', { params })
  } catch (error) {
    console.warn('接口请求失败，使用 Mock 数据:', error)
    return mockApi.getDataList(params)
  }
}

/**
 * 获取数据详情
 * GET /api/data/:id
 * @param id 数据ID
 * @returns 数据详情
 */
export const getDataDetail = async (id: string): Promise<ApiResponse<DataItem>> => {
  try {
    return await http.get<DataItem>(`/data/${id}`)
  } catch (error) {
    console.warn('接口请求失败，使用 Mock 数据:', error)
    return mockApi.getDataDetail(id)
  }
}

/**
 * 创建数据
 * POST /api/data
 * @param params 创建参数
 * @returns 创建的数据项
 */
export const createData = async (params: CreateDataParams): Promise<ApiResponse<DataItem>> => {
  try {
    return await http.post<DataItem>('/data', params)
  } catch (error) {
    console.warn('接口请求失败，使用 Mock 数据:', error)
    return mockApi.createData(params)
  }
}

/**
 * 更新数据
 * PUT /api/data/:id
 * @param id 数据ID
 * @param params 更新参数
 * @returns 更新后的数据项
 */
export const updateData = async (id: string, params: UpdateDataParams): Promise<ApiResponse<DataItem>> => {
  try {
    return await http.put<DataItem>(`/data/${id}`, params)
  } catch (error) {
    console.warn('接口请求失败，使用 Mock 数据:', error)
    return mockApi.updateData(id, params)
  }
}

/**
 * 删除数据
 * DELETE /api/data/:id
 * @param id 数据ID
 * @returns 删除结果
 */
export const deleteData = async (id: string): Promise<ApiResponse<null>> => {
  try {
    return await http.delete<null>(`/data/${id}`)
  } catch (error) {
    console.warn('接口请求失败，使用 Mock 数据:', error)
    return mockApi.deleteData(id)
  }
}

/**
 * 获取图表数据
 * GET /api/data/chart
 * @returns 图表数据
 */
export const getChartData = async (): Promise<ApiResponse<ChartData>> => {
  try {
    return await http.get<ChartData>('/data/chart')
  } catch (error) {
    console.warn('接口请求失败，使用 Mock 数据:', error)
    return mockApi.getChartData()
  }
}
