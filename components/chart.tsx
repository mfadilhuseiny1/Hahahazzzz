interface ChartProps {
  title: string;
  chartType: string;
  data: Array<{ x: string | number; y: number; label?: string }>;
  xLabel?: string;
  yLabel?: string;
}

export const Chart = ({ title, chartType, data, xLabel, yLabel }: ChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-4">{title}</h3>
        <div className="w-full h-64 bg-background rounded border flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  const validData = data.filter(d => typeof d.y === 'number' && !isNaN(d.y));
  
  if (validData.length === 0) {
    return (
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-4">{title}</h3>
        <div className="w-full h-64 bg-background rounded border flex items-center justify-center">
          <p className="text-muted-foreground">No valid data points</p>
        </div>
      </div>
    );
  }

  const maxY = Math.max(...validData.map(d => d.y));
  const minY = Math.min(...validData.map(d => d.y));
  const range = maxY - minY || 1; // Prevent division by zero

  const getCoordinates = (point: typeof validData[0], index: number) => {
    const x = validData.length === 1 ? 50 : (index / (validData.length - 1)) * 100;
    const y = range === 0 ? 50 : 100 - ((point.y - minY) / range) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  return (
    <div className="p-4 bg-muted rounded-lg">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="w-full h-64 bg-background rounded border p-4 relative">
        <div className="absolute left-2 top-1/2 -rotate-90 text-xs text-muted-foreground">
          {yLabel}
        </div>
        
        <div className="ml-8 mr-4 h-full relative">
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
            <span>{maxY.toFixed(1)}</span>
            <span>{((maxY + minY) / 2).toFixed(1)}</span>
            <span>{minY.toFixed(1)}</span>
          </div>
          
          <div className="ml-8 h-full relative">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {chartType === 'line' && validData.length > 1 && (
                <polyline
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="0.5"
                  vectorEffect="non-scaling-stroke"
                  points={validData.map((point, index) => {
                    const coords = getCoordinates(point, index);
                    return `${coords.x},${coords.y}`;
                  }).join(' ')}
                />
              )}
              
              {validData.map((point, index) => {
                const coords = getCoordinates(point, index);
                return (
                  <circle
                    key={index}
                    cx={coords.x}
                    cy={coords.y}
                    r="1"
                    fill="hsl(var(--primary))"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </svg>
          </div>
        </div>
        
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
          {xLabel}
        </div>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground">
        {validData.length} data points • Range: {minY.toFixed(1)} - {maxY.toFixed(1)}
      </div>
    </div>
  );
};
