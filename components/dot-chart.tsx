'use client'

interface DotChartProps {
  title: string
  data: Array<{ x: string; y: number }>
  color?: string
  yLabel?: string
}

export const DotChart = ({ title, data, color = 'hsl(var(--primary))', yLabel }: DotChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 bg-card rounded-lg border">
        <h3 className="font-semibold mb-4">{title}</h3>
        <div className="w-full h-48 bg-muted rounded flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    )
  }

  const maxY = Math.max(...data.map(d => d.y))
  const minY = Math.min(...data.map(d => d.y))
  const range = maxY - minY || 1

  return (
    <div className="p-4 bg-card rounded-lg border">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="w-full h-48 relative">
        <svg className="w-full h-full">
          {data.map((point, index) => {
            const x = (index / Math.max(data.length - 1, 1)) * 90 + 5
            const y = 90 - ((point.y - minY) / range) * 80
            return (
              <g key={index}>
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill={color}
                  className="hover:r-6 transition-all"
                />
                <text
                  x={`${x}%`}
                  y="95%"
                  textAnchor="middle"
                  className="text-xs fill-muted-foreground"
                >
                  {new Date(point.x).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </text>
              </g>
            )
          })}
        </svg>
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
          <span>{maxY.toFixed(1)}</span>
          <span>{minY.toFixed(1)}</span>
        </div>
        {yLabel && (
          <div className="absolute left-2 top-1/2 -rotate-90 text-xs text-muted-foreground">
            {yLabel}
          </div>
        )}
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {data.length} points • Range: {minY.toFixed(1)} - {maxY.toFixed(1)}
      </div>
    </div>
  )
}
