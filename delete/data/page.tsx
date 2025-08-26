'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

type TableInfo = {
  name: string
  columns: string[]
}

type TimeInterval = {
  label: string
  value: string
}

const TIME_INTERVALS: TimeInterval[] = [
  { label: '30 minutes ago', value: '30 minutes' },
  { label: '1 hour ago', value: '1 hour' },
  { label: '3 hours ago', value: '3 hours' },
  { label: '6 hours ago', value: '6 hours' },
  { label: '24 hours ago', value: '24 hours' },
  { label: '2 days ago', value: '2 days' },
  { label: '7 days ago', value: '7 days' },
  { label: '30 days ago', value: '30 days' }
]

export default function DataPage() {
  const [tables, setTables] = useState<TableInfo[]>([])
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [selectedInterval, setSelectedInterval] = useState<string>('24 hours')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    setTables([
      { name: 'sensordata', columns: ['DO', 'PH', 'ORP', 'TDS', 'Temperature', 'time'] },
      { name: 'sensordata1', columns: ['DO', 'PH', 'ORP', 'TDS', 'Temperature', 'time'] },
      { name: 'sensordata2', columns: ['DO', 'PH', 'ORP', 'TDS', 'Temperature', 'time'] },
      { name: 'sensordata3', columns: ['DO', 'PH', 'ORP', 'TDS', 'Temperature', 'time'] }
    ])
    setSelectedTable('sensordata')
    setSelectedColumns(['DO', 'PH', 'ORP'])
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
    try {
      const response = await fetch('/api/data/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: selectedTable,
          columns: selectedColumns,
          timeInterval: selectedInterval
        })
      })

      if (!response.ok) throw new Error('Export failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedTable}_${selectedInterval.replace(' ', '_')}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setDownloading(false)
    }
  }

  const currentTable = tables.find(t => t.name === selectedTable)

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">InfluxDB Data Export</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Table Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="table-select">Select Table</Label>
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger id="table-select">
                <SelectValue placeholder="Choose a table" />
              </SelectTrigger>
              <SelectContent>
                {tables.map(table => (
                  <SelectItem key={table.name} value={table.name}>
                    {table.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {currentTable && (
          <Card>
            <CardHeader>
              <CardTitle>Column Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {currentTable.columns.map(column => (
                  <label key={column} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column)}
                      onChange={() => handleColumnToggle(column)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm font-medium">{column}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Time Interval</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="interval-select">Select Time Range</Label>
            <Select value={selectedInterval} onValueChange={setSelectedInterval}>
              <SelectTrigger id="interval-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_INTERVALS.map(interval => (
                  <SelectItem key={interval.value} value={interval.value}>
                    {interval.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={downloadCSV}
              disabled={!selectedTable || selectedColumns.length === 0 || downloading}
              className="w-full"
            >
              {downloading ? 'Downloading...' : 'Download CSV'}
            </Button>
            {selectedColumns.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Selected columns: {selectedColumns.join(', ')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}