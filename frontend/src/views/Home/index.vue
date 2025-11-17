<template>
  <div class="home-container">
    <div class="chart-row">
      <div class="chart-item">
        <div class="chart-title">数据统计</div>
        <v-chart
          v-if="barOption"
          class="chart"
          :option="barOption"
          autoresize
        />
      </div>
    </div>
    <div class="chart-row">
      <div class="chart-item">
        <div class="chart-title">趋势分析</div>
        <v-chart
          v-if="lineOption"
          class="chart"
          :option="lineOption"
          autoresize
        />
      </div>
      <div class="chart-item">
        <div class="chart-title">分类占比</div>
        <v-chart
          v-if="pieOption"
          class="chart"
          :option="pieOption"
          autoresize
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { getChartData } from '@/api/modules/data'
import type { ChartData } from '@/types'
import type { EChartsOption } from 'echarts'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const barOption = ref<EChartsOption | null>(null)
const lineOption = ref<EChartsOption | null>(null)
const pieOption = ref<EChartsOption | null>(null)

// 统一更新图表配置
const updateChartOptions = (chartData: ChartData) => {
  // 柱状图配置
  barOption.value = {
    title: {
      text: '',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.categories,
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '数值',
        type: 'bar',
        barWidth: '60%',
        data: chartData.values,
        itemStyle: {
          color: '#409EFF'
        }
      }
    ]
  }

  // 折线图配置（带面积填充）
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return `${date.getMonth() + 1}/${date.getDate()}`
  })

  lineOption.value = {
    title: {
      text: '',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '趋势',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        data: chartData.trend,
        itemStyle: {
          color: '#67C23A'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
              { offset: 1, color: 'rgba(103, 194, 58, 0.1)' }
            ]
          }
        }
      }
    ]
  }

  // 饼图配置
  const pieData = chartData.categories.map((category, index) => ({
    value: chartData.values[index],
    name: category
  }))

  pieOption.value = {
    title: {
      text: '',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '分类占比',
        type: 'pie',
        radius: '50%',
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
}

const loadChartData = async () => {
  try {
    const response = await getChartData()
    if (response.code === 200 && response.data) {
      updateChartOptions(response.data)
    }
  } catch (error) {
    console.error('加载图表数据失败:', error)
  }
}

onMounted(() => {
  loadChartData()
})
</script>

<style scoped>
.home-container {
  width: 100%;
}

.chart-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-row:last-child {
  margin-bottom: 0;
}

.chart-item {
  flex: 1;
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}

.chart {
  height: 400px;
  width: 100%;
}

@media (max-width: 768px) {
  .chart-row {
    flex-direction: column;
  }
}
</style>
