'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

import { 
  Droplets, 
  Thermometer, 
  Zap, 
  Gauge, 
  Clock, 
  Download, 
  Database, 
  Waves,
  Fish,
  Beaker,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Settings
} from 'lucide-react'

type TableInfo = {
  name: string
  displayName: string
  columns: string[]
  icon: any
  description: string
  lastUpdate: string
  category: 'environmental' | 'system'
}

type TableCategory = {
  id: 'environmental' | 'system'
  name: string
  icon: any
  description: string
  tables: TableInfo[]
}

type TimeInterval = {
  label: string
  value: string
  description: string
}

type SensorMetric = {
  name: string
  value: number
  unit: string
  status: 'optimal' | 'warning' | 'critical'
  icon: any
  change: number
}

const TIME_INTERVALS: TimeInterval[] = [
  { label: '30 minutes ago', value: '30 minutes', description: 'Recent activity' },
  { label: '1 hour ago', value: '1 hour', description: 'Short-term trends' },
  { label: '3 hours ago', value: '3 hours', description: 'Extended monitoring' },
  { label: '6 hours ago', value: '6 hours', description: 'Half-day analysis' },
  { label: '24 hours ago', value: '24 hours', description: 'Daily patterns' },
  { label: '2 days ago', value: '2 days', description: 'Weekly trends' },
  { label: '7 days ago', value: '7 days', description: 'Weekly analysis' },
  { label: '30 days ago', value: '30 days', description: 'Monthly overview' }
]

const SENSOR_COLUMNS = {
  'DO': { 
    name: 'Dissolved Oxygen', 
    icon: Droplets, 
    unit: 'mg/L', 
    color: 'from-blue-500 to-cyan-500',
    description: 'Critical for fish respiration and water quality'
  },
  'PH': { 
    name: 'pH Level', 
    icon: Beaker, 
    unit: 'pH', 
    color: 'from-green-500 to-emerald-500',
    description: 'Acidity/alkalinity balance for optimal fish health'
  },
  'ORP': { 
    name: 'Oxidation Potential', 
    icon: Zap, 
    unit: 'mV', 
    color: 'from-yellow-500 to-orange-500',
    description: 'Water oxidation state and disinfection effectiveness'
  },
  'TDS': { 
    name: 'Total Dissolved Solids', 
    icon: Gauge, 
    unit: 'ppm', 
    color: 'from-purple-500 to-violet-500',
    description: 'Mineral content and water purity indicator'
  },
  'Temperature': { 
    name: 'Water Temperature', 
    icon: Thermometer, 
    unit: '°C', 
    color: 'from-red-500 to-pink-500',
    description: 'Thermal regulation for species-specific requirements'
  },
  'A_Temp': { 
    name: 'Air Temperature', 
    icon: Thermometer, 
    unit: '°C', 
    color: 'from-orange-500 to-red-500',
    description: 'Ambient air temperature monitoring'
  },
  'Humidity': { 
    name: 'Humidity', 
    icon: Droplets, 
    unit: '%', 
    color: 'from-blue-400 to-teal-500',
    description: 'Relative humidity levels in facility'
  },
  'CPU_Temp': { 
    name: 'CPU Temperature', 
    icon: Thermometer, 
    unit: '°C', 
    color: 'from-red-600 to-pink-600',
    description: 'System processor temperature monitoring'
  },
  'V_Input': { 
    name: 'Input Voltage', 
    icon: Zap, 
    unit: 'V', 
    color: 'from-yellow-600 to-orange-600',
    description: 'System power input voltage levels'
  },
  'Wifi_S': { 
    name: 'WiFi Signal Strength', 
    icon: Waves, 
    unit: 'dBm', 
    color: 'from-green-600 to-blue-600',
    description: 'Wireless network connectivity strength'
  },
  'freeHeap': { 
    name: 'Free Memory', 
    icon: Database, 
    unit: 'KB', 
    color: 'from-purple-600 to-indigo-600',
    description: 'Available system memory heap space'
  },
  'time': { 
    name: 'Timestamp', 
    icon: Clock, 
    unit: '', 
    color: 'from-gray-500 to-slate-500',
    description: 'Temporal data for trend analysis'
  }
}

export default function BRINAquacultureDashboard() {
  const [tableCategories, setTableCategories] = useState<TableCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<'environmental' | 'system' | null>(null)
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [selectedInterval, setSelectedInterval] = useState<string>('24 hours')
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [liveMetrics, setLiveMetrics] = useState<SensorMetric[]>([])

  useEffect(() => {
    // Initialize with BRIN aquaculture laboratory data
    const environmentalTables = [
      {
        name: 'sensordata',
        displayName: 'Pond 1 Sensors',
        columns: ['DO', 'PH', 'ORP', 'TDS', 'Temperature', 'time'],
        icon: Waves,
        description: 'Real-time water quality monitoring from Pond 1',
        lastUpdate: '2 minutes ago',
        category: 'environmental' as const
      },
      {
        name: 'sensordata1',
        displayName: 'Pond 2 Sensors',
        columns: ['DO', 'PH', 'ORP', 'TDS', 'Temperature', 'time'],
        icon: Waves,
        description: 'Real-time water quality monitoring from Pond 2',
        lastUpdate: '3 minutes ago',
        category: 'environmental' as const
      },
      {
        name: 'sensordata2',
        displayName: 'Pond 3 Sensors',
        columns: ['DO', 'PH', 'ORP', 'TDS', 'Temperature', 'time'],
        icon: Waves,
        description: 'Real-time water quality monitoring from Pond 3',
        lastUpdate: '1 minute ago',
        category: 'environmental' as const
      },
      {
        name: 'sensordata3',
        displayName: 'Pond 4 Sensors',
        columns: ['DO', 'PH', 'ORP', 'TDS', 'Temperature', 'time'],
        icon: Waves,
        description: 'Real-time water quality monitoring from Pond 4',
        lastUpdate: '4 minutes ago',
        category: 'environmental' as const
      }
    ]

    const systemTables = [
      {
        name: 'system_logs',
        displayName: 'Pond 1 System Diagnostics',
        columns: ['A_Temp', 'Humidity', 'CPU_Temp', 'V_Input', 'Wifi_S', 'freeHeap', 'time'],
        icon: Settings,
        description: 'Infrastructure monitoring and system health for Pond 1',
        lastUpdate: '1 minute ago',
        category: 'system' as const
      },
      {
        name: 'system_logs1',
        displayName: 'Pond 2 System Diagnostics',
        columns: ['A_Temp', 'Humidity', 'CPU_Temp', 'V_Input', 'Wifi_S', 'freeHeap', 'time'],
        icon: Settings,
        description: 'Infrastructure monitoring and system health for Pond 2',
        lastUpdate: '2 minutes ago',
        category: 'system' as const
      },
      {
        name: 'system_logs2',
        displayName: 'Pond 3 System Diagnostics',
        columns: ['A_Temp', 'Humidity', 'CPU_Temp', 'V_Input', 'Wifi_S', 'freeHeap', 'time'],
        icon: Settings,
        description: 'Infrastructure monitoring and system health for Pond 3',
        lastUpdate: '3 minutes ago',
        category: 'system' as const
      },
      {
        name: 'system_logs3',
        displayName: 'Pond 4 System Diagnostics',
        columns: ['A_Temp', 'Humidity', 'CPU_Temp', 'V_Input', 'Wifi_S', 'freeHeap', 'time'],
        icon: Settings,
        description: 'Infrastructure monitoring and system health for Pond 4',
        lastUpdate: '1 minute ago',
        category: 'system' as const
      }
    ]

    setTableCategories([
      {
        id: 'environmental',
        name: 'Environmental Sensors',
        icon: Waves,
        description: 'Water quality monitoring across all ponds',
        tables: environmentalTables
      },
      {
        id: 'system',
        name: 'System Diagnostics',
        icon: Settings,
        description: 'Hardware and infrastructure monitoring for all ponds',
        tables: systemTables
      }
    ])

    setSelectedCategory('environmental')
    setSelectedTable('sensordata')
    setSelectedColumns(['DO', 'PH', 'ORP'])

    // Mock live metrics
    setLiveMetrics([
      { name: 'DO', value: 7.2, unit: 'mg/L', status: 'optimal', icon: Droplets, change: 2.1 },
      { name: 'PH', value: 7.8, unit: 'pH', status: 'optimal', icon: Beaker, change: -0.3 },
      { name: 'Temperature', value: 24.5, unit: '°C', status: 'warning', icon: Thermometer, change: 1.2 },
      { name: 'A_Temp', value: 28.2, unit: '°C', status: 'optimal', icon: Thermometer, change: 0.5 },
      { name: 'CPU_Temp', value: 42.1, unit: '°C', status: 'optimal', icon: Thermometer, change: -1.2 },
      { name: 'Wifi_S', value: -45, unit: 'dBm', status: 'optimal', icon: Waves, change: 3.2 }
    ])
  }, [])

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setLiveMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * 0.5,
        change: (Math.random() - 0.5) * 5
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column)
        : [...prev, column]
    )
  }

  const downloadCSV = async () => {
    if (!selectedTable || selectedColumns.length === 0) return

    setDownloading(true)
    setDownloadProgress(0)
    
    // Simulate download progress
    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      
      // Mock CSV generation
      const csvContent = `data:text/csv;charset=utf-8,timestamp,${selectedColumns.join(',')}\n` +
        Array.from({ length: 100 }, (_, i) => 
          `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')},${selectedColumns.map(() => (Math.random() * 100).toFixed(2)).join(',')}`
        ).join('\n')

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `BRIN_${selectedTable}_${selectedInterval.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setTimeout(() => {
        setDownloading(false)
        setDownloadProgress(0)
      }, 500)
    }
  }

  const currentCategory = tableCategories.find(cat => cat.id === selectedCategory)
  const currentTable = currentCategory?.tables.find(t => t.name === selectedTable)
  const selectedInterval_obj = TIME_INTERVALS.find(t => t.value === selectedInterval)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-600 bg-green-50 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Aquaculture Laboratory
              </h1>
              <p className="text-slate-600 text-lg">Advanced Data Export & Analysis System</p>
            </div>
          </div>
          
          {/* Live Metrics Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {liveMetrics.map((metric) => {
              const IconComponent = metric.icon
              return (
                <Card key={metric.name} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${SENSOR_COLUMNS[metric.name as keyof typeof SENSOR_COLUMNS]?.color} flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(metric.status)}`}>
                        {metric.status}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-slate-800">
                        {metric.value.toFixed(1)}
                        <span className="text-sm font-normal text-slate-500 ml-1">{metric.unit}</span>
                      </p>
                      <p className="text-xs text-slate-600 font-medium">{SENSOR_COLUMNS[metric.name as keyof typeof SENSOR_COLUMNS]?.name}</p>
                      <div className={`flex items-center text-xs ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendingUp className={`w-3 h-3 mr-1 ${metric.change < 0 ? 'rotate-180' : ''}`} />
                        {Math.abs(metric.change).toFixed(1)}% vs last hour
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Table Selection */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Database className="w-4 h-4 text-white" />
                  </div>
                  Data Source Selection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Category Selection */}
                  <div className="grid gap-3">
                    {tableCategories.map(category => {
                      const IconComponent = category.icon
                      const isSelected = selectedCategory === category.id
                      return (
                        <div
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id)
                            if (category.tables.length > 0) {
                              setSelectedTable(category.tables[0].name)
                            }
                          }}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50 shadow-md' 
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-blue-500' : 'bg-gray-100'
                            }`}>
                              <IconComponent className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-lg text-slate-800">{category.name}</h3>
                                {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                              </div>
                              <p className="text-sm text-slate-600 mb-2">{category.description}</p>
                              <p className="text-xs text-slate-500">{category.tables.length} data source{category.tables.length !== 1 ? 's' : ''} available</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Table Selection Panel */}
                  {selectedCategory && currentCategory && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-sm text-slate-800 mb-3">
                        Select {currentCategory.name} Source:
                      </h4>
                      <div className="grid gap-2">
                        {currentCategory.tables.map(table => {
                          const TableIcon = table.icon
                          const isTableSelected = selectedTable === table.name
                          return (
                            <div
                              key={table.name}
                              onClick={() => setSelectedTable(table.name)}
                              className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                isTableSelected 
                                  ? 'border-green-500 bg-green-50' 
                                  : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                                  isTableSelected ? 'bg-green-500' : 'bg-gray-100'
                                }`}>
                                  <TableIcon className={`w-4 h-4 ${isTableSelected ? 'text-white' : 'text-gray-600'}`} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h5 className="font-medium text-sm text-slate-800">{table.displayName}</h5>
                                    {isTableSelected && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                  </div>
                                  <p className="text-xs text-slate-600">{table.description}</p>
                                  <p className="text-xs text-slate-500 mt-1">
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    Updated {table.lastUpdate}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Column Selection */}
            {currentTable && (
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                    Parameter Selection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {currentTable.columns.map(column => {
                      const columnInfo = SENSOR_COLUMNS[column as keyof typeof SENSOR_COLUMNS]
                      const IconComponent = columnInfo?.icon || Database
                      const isSelected = selectedColumns.includes(column)
                      
                      return (
                        <label 
                          key={column} 
                          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            isSelected 
                              ? 'border-green-500 bg-green-50 shadow-md' 
                              : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleColumnToggle(column)}
                            className="sr-only"
                          />
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 bg-gradient-to-br ${columnInfo?.color || 'from-gray-400 to-gray-500'}`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-slate-800">{columnInfo?.name || column}</h4>
                              {isSelected && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                            </div>
                            {columnInfo?.unit && (
                              <p className="text-xs text-blue-600 font-medium mb-1">Unit: {columnInfo.unit}</p>
                            )}
                            <p className="text-xs text-slate-600">{columnInfo?.description || 'Data parameter'}</p>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Export */}
          <div className="space-y-6">
            {/* Time Interval */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  Time Range
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedInterval} onValueChange={setSelectedInterval}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-orange-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_INTERVALS.map(interval => (
                      <SelectItem key={interval.value} value={interval.value} className="py-3">
                        <div>
                          <div className="font-medium">{interval.label}</div>
                          <div className="text-xs text-slate-500">{interval.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedInterval_obj && (
                  <p className="text-sm text-slate-600 mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <AlertCircle className="w-4 h-4 inline mr-2 text-orange-600" />
                    {selectedInterval_obj.description}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Export Configuration */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Download className="w-4 h-4 text-white" />
                  </div>
                  Export Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedColumns.length > 0 && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-sm text-slate-800 mb-2">Export Summary</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Table:</span>
                        <span className="font-medium">{currentCategory?.name} - {currentTable?.displayName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Parameters:</span>
                        <span className="font-medium">{selectedColumns.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Time range:</span>
                        <span className="font-medium">{selectedInterval}</span>
                      </div>

                    </div>
                  </div>
                )}

                {downloading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Preparing export...</span>
                      <span>{Math.round(downloadProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${downloadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={downloadCSV}
                  disabled={!selectedTable || selectedColumns.length === 0 || downloading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {downloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Export to CSV
                    </>
                  )}
                </Button>

                {selectedColumns.length > 0 && !downloading && (
                  <div className="text-xs text-slate-500 text-center">
                    Selected: {selectedColumns.map(col => SENSOR_COLUMNS[col as keyof typeof SENSOR_COLUMNS]?.name || col).join(', ')}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-md flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Database Connection</span>
                    <div className="text-xs bg-green-100 text-green-800 border border-green-200 px-2 py-1 rounded-full">Online</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Sensor Network</span>
                    <div className="text-xs bg-green-100 text-green-800 border border-green-200 px-2 py-1 rounded-full">Active</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Data Integrity</span>
                    <div className="text-xs bg-green-100 text-green-800 border border-green-200 px-2 py-1 rounded-full">Verified</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Last Backup</span>
                    <span className="text-slate-500">2 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}