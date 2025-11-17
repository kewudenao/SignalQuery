<template>
  <div class="home">
    <div class="chart-container">
      <div class="chart-item">
        <div class="chart-title">数据统计</div>
        <v-chart
          v-if="barOption"
          :option="barOption"
          class="chart"
          autoresize
        />
      </div>
      <div class="chart-item">
        <div class="chart-title">趋势分析</div>
        <v-chart
          v-if="lineOption"
          :option="lineOption"
          class="chart"
          autoresize
        />
      </div>
      <div class="chart-item">
        <div class="chart-title">分类占比</div>
        <v-chart
          v-if="pieOption"
          :option="pieOption"
          class="chart"
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
import { ChartData } from '@/types'
import { ElMessage } from 'element-plus'

// 注册 ECharts 组件
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

const barOption = ref<any>(null)
const lineOption = ref<any>(null)
const pieOption = ref<any>(null)

// 统一更新图表配置
const updateChartOptions = (chartData: ChartData) => {
  // 柱状图配置
  barOption.value = {
    title: {
      show: false
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
        data: chartData.values,
        itemStyle: {
          color: '#409EFF'
        }
      }
    ]
  }

  // 折线图配置（带面积填充）
  lineOption.value = {
    title: {
      show: false
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
      data: chartData.trend.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '趋势',
        type: 'line',
        data: chartData.trend.map(item => item.value),
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
            ]
          }
        },
        itemStyle: {
          color: '#409EFF'
        },
        smooth: true
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
      show: false
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
        name: '分类',
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

// 加载图表数据
const loadChartData = async () => {
  try {
    const response = await getChartData()
    if (response.code === 200 && response.data) {
      updateChartOptions(response.data)
    }
  } catch (error) {
    console.error('加载图表数据失败:', error)
    ElMessage.error('加载图表数据失败')
  }
}

onMounted(() => {
  loadChartData()
})
</script>

<style scoped>
.home {
  width: 100%;
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.chart-item {
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.chart {
  height: 300px;
  width: 100%;
}

@media (max-width: 1200px) {
  .chart-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .chart-container {
    grid-template-columns: 1fr;
  }
}
</style>

