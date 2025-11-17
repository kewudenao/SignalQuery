import { request } from '../request'
import { mockApi } from '../mock'
import { DataItem, DataListParams, DataListResponse, DataForm, ChartData, ApiResponse } from '@/types'

/**
 * 获取数据列表
 * @param params 查询参数
 * @returns 数据列表响应
 */
export const getDataList = async (params: DataListParams): Promise<ApiResponse<DataListResponse>> => {
  try {
    return await request<DataListResponse>('/data/list', {
      method: 'GET',
      params
    })
  } catch (error) {
    console.warn('接口请求失败，使用 Mock 数据:', error)
    return mockApi.getDataList(params)
  }
}

/**
 * 获取数据详情
 * @param id 数据ID
 * @returns 数据详情
 */
export const getDataDetail = async (id: number): Promise<ApiResponse<DataItem | null>> => {
  try {
    return await request<DataItem | null>(`/data/${id}`, {
      method: 'GET'
    })
  } catch (error) {
    console.warn('接口请求失败，使用 Mock 数据:', error)
    return mockApi.getDataDetail(id)
  }
}

/**
 * 创建数据
 * @param form 数据表单
 * @returns 创建的数据
 */
export const createData = async (form: DataForm): Promise<ApiResponse<DataItem>> => {
  try {
    return await request<DataItem>('/data', {
      method: 'POST',
      data: form
    })
  } catch (error) {
    console.warn('接口请求失败，使用 Mock 数据:', error)
    return mockApi.createData(form)
  }
}

/**
 * 更新数据
 * @param id 数据ID
 * @param form 数据表单（部分字段）
 * @returns 更新的数据
 */
export const updateData = async (id: number, form: Partial<DataForm>): Promise<ApiResponse<DataItem | null>> => {
  try {
    return await request<DataItem | null>(`/data/${id}`, {
      method: 'PUT',
      data: form
    })
  } catch (error) {
    console.warn('接口请求失败，使用 Mock 数据:', error)
    return mockApi.updateData(id, form)
  }
}

/**
 * 删除数据
 * @param id 数据ID
 * @returns 删除结果
 */
export const deleteData = async (id: number): Promise<ApiResponse<null>> => {
  try {
    return await request<null>(`/data/${id}`, {
      method: 'DELETE'
    })
  } catch (error) {
    console.warn('接口请求失败，使用 Mock 数据:', error)
    return mockApi.deleteData(id)
  }
}

/**
 * 获取图表数据
 * @returns 图表数据
 */
export const getChartData = async (): Promise<ApiResponse<ChartData>> => {
  try {
    return await request<ChartData>('/data/chart', {
      method: 'GET'
    })
  } catch (error) {
    console.warn('接口请求失败，使用 Mock 数据:', error)
    return mockApi.getChartData()
  }
}

