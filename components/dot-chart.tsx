// // // // 'use client'

// // // // interface DotChartProps {
// // // //   title: string
// // // //   data: Array<{ x: string; y: number }>
// // // //   color?: string
// // // //   yLabel?: string
// // // // }

// // // // export const DotChart = ({ title, data, color = 'hsl(var(--primary))', yLabel }: DotChartProps) => {
// // // //   if (!data || data.length === 0) {
// // // //     return (
// // // //       <div className="p-4 bg-card rounded-lg border">
// // // //         <h3 className="font-semibold mb-4">{title}</h3>
// // // //         <div className="w-full h-48 bg-muted rounded flex items-center justify-center">
// // // //           <p className="text-muted-foreground">No data available</p>
// // // //         </div>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   const maxY = Math.max(...data.map(d => d.y))
// // // //   const minY = Math.min(...data.map(d => d.y))
// // // //   const range = maxY - minY || 1

// // // //   return (
// // // //     <div className="p-4 bg-card rounded-lg border">
// // // //       <h3 className="font-semibold mb-4">{title}</h3>
// // // //       <div className="w-full h-48 relative">
// // // //         <svg className="w-full h-full">
// // // //           {data.map((point, index) => {
// // // //             const x = (index / Math.max(data.length - 1, 1)) * 90 + 5
// // // //             const y = 90 - ((point.y - minY) / range) * 80
// // // //             return (
// // // //               <g key={index}>
// // // //                 <circle
// // // //                   cx={`${x}%`}
// // // //                   cy={`${y}%`}
// // // //                   r="4"
// // // //                   fill={color}
// // // //                   className="hover:r-6 transition-all"
// // // //                 />
// // // //                 <text
// // // //                   x={`${x}%`}
// // // //                   y="95%"
// // // //                   textAnchor="middle"
// // // //                   className="text-xs fill-muted-foreground"
// // // //                 >
// // // //                   {new Date(point.x).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // // //                 </text>
// // // //               </g>
// // // //             )
// // // //           })}
// // // //         </svg>
// // // //         <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
// // // //           <span>{maxY.toFixed(1)}</span>
// // // //           <span>{minY.toFixed(1)}</span>
// // // //         </div>
// // // //         {yLabel && (
// // // //           <div className="absolute left-2 top-1/2 -rotate-90 text-xs text-muted-foreground">
// // // //             {yLabel}
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //       <div className="mt-2 text-xs text-muted-foreground">
// // // //         {data.length} points • Range: {minY.toFixed(1)} - {maxY.toFixed(1)}
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }


// // // 'use client'

// // // interface DotChartProps {
// // //   title: string
// // //   data: Array<{ x: string; y: number }>
// // //   color?: string
// // //   yLabel?: string
// // // }

// // // export const DotChart = ({ title, data, color = 'hsl(var(--primary))', yLabel }: DotChartProps) => {
// // //   if (!data || data.length === 0) {
// // //     return (
// // //       <div className="p-4 bg-card rounded-lg border">
// // //         <h3 className="font-semibold mb-4">{title}</h3>
// // //         <div className="w-full h-48 bg-muted rounded flex items-center justify-center">
// // //           <p className="text-muted-foreground">No data available</p>
// // //         </div>
// // //       </div>
// // //     )
// // //   }

// // //   const maxY = Math.max(...data.map(d => d.y))
// // //   const minY = Math.min(...data.map(d => d.y))
// // //   const range = maxY - minY || 1

// // //   return (
// // //     <div className="p-4 bg-card rounded-lg border">
// // //       <h3 className="font-semibold mb-4">{title}</h3>
// // //       <div className="w-full h-60 relative">
// // //         <svg className="w-full h-48">
// // //           {data.map((point, index) => {
// // //             const x = (index / Math.max(data.length - 1, 1)) * 90 + 5
// // //             const y = 85 - ((point.y - minY) / range) * 75
// // //             return (
// // //               <g key={index}>
// // //                 <circle
// // //                   cx={`${x}%`}
// // //                   cy={`${y}%`}
// // //                   r="4"
// // //                   fill={color}
// // //                   className="hover:r-6 transition-all"
// // //                 />
// // //               </g>
// // //             )
// // //           })}
// // //         </svg>
// // //         <div className="flex justify-between text-xs text-muted-foreground mt-1">
// // //           {data.map((point, index) => (
// // //             <span key={index} className="text-center">
// // //               {new Date(point.x).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // //             </span>
// // //           ))}
// // //         </div>
// // //         <div className="absolute left-0 top-0 h-48 flex flex-col justify-between text-xs text-muted-foreground">
// // //           <span>{maxY.toFixed(1)}</span>
// // //           <span>{minY.toFixed(1)}</span>
// // //         </div>
// // //         {yLabel && (
// // //           <div className="absolute left-2 top-24 -rotate-90 text-xs text-muted-foreground">
// // //             {yLabel}
// // //           </div>
// // //         )}
// // //       </div>
// // //       <div className="mt-2 text-xs text-muted-foreground">
// // //         {data.length} points • Range: {minY.toFixed(1)} - {maxY.toFixed(1)}
// // //       </div>
// // //     </div>
// // //   )
// // // }


// // 'use client'

// // interface DotChartProps {
// //   title: string
// //   data: Array<{ x: string; y: number }>
// //   color?: string
// //   yLabel?: string
// // }

// // export const DotChart = ({ title, data, color = 'hsl(var(--primary))', yLabel }: DotChartProps) => {
// //   if (!data || data.length === 0) {
// //     return (
// //       <div className="p-4 bg-card rounded-lg border">
// //         <h3 className="font-semibold mb-4">{title}</h3>
// //         <div className="w-full h-48 bg-muted rounded flex items-center justify-center">
// //           <p className="text-muted-foreground">No data available</p>
// //         </div>
// //       </div>
// //     )
// //   }

// //   const maxY = Math.max(...data.map(d => d.y))
// //   const minY = Math.min(...data.map(d => d.y))
// //   const range = maxY - minY || 1

// //   return (
// //     <div className="p-4 bg-card rounded-lg border">
// //       <h3 className="font-semibold mb-4">{title}</h3>
// //       <div className="w-full h-60 relative">
// //         <svg className="w-full h-48">
// //           {data.map((point, index) => {
// //             const x = (index / Math.max(data.length - 1, 1)) * 90 + 5
// //             const y = 85 - ((point.y - minY) / range) * 75
// //             return (
// //               <g key={index}>
// //                 <circle
// //                   cx={`${x}%`}
// //                   cy={`${y}%`}
// //                   r="4"
// //                   fill={color}
// //                   className="hover:r-6 transition-all"
// //                 />
// //                 {/* Put time labels directly under each dot */}
// //                 <text
// //                   x={`${x}%`}
// //                   y="98%"
// //                   textAnchor="middle"
// //                   className="text-[10px] fill-muted-foreground"
// //                 >
// //                   {new Date(point.x).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// //                 </text>
// //               </g>
// //             )
// //           })}
// //         </svg>
// //         <div className="absolute left-0 top-0 h-48 flex flex-col justify-between text-xs text-muted-foreground">
// //           <span>{maxY.toFixed(1)}</span>
// //           <span>{minY.toFixed(1)}</span>
// //         </div>
// //         {yLabel && (
// //           <div className="absolute left-2 top-24 -rotate-90 text-xs text-muted-foreground">
// //             {yLabel}
// //           </div>
// //         )}
// //       </div>
// //       <div className="mt-2 text-xs text-muted-foreground">
// //         {data.length} points • Range: {minY.toFixed(1)} - {maxY.toFixed(1)}
// //       </div>
// //     </div>
// //   )
// // }

// 'use client'

// interface DotChartProps {
//   title: string
//   data: Array<{ x: string; y: number }>
//   color?: string
//   yLabel?: string
// }

// export const DotChart = ({ title, data, color = 'hsl(var(--primary))', yLabel }: DotChartProps) => {
//   if (!data || data.length === 0) {
//     return (
//       <div className="p-4 bg-card rounded-lg border">
//         <h3 className="font-semibold mb-4">{title}</h3>
//         <div className="w-full h-48 bg-muted rounded flex items-center justify-center">
//           <p className="text-muted-foreground">No data available</p>
//         </div>
//       </div>
//     )
//   }

//   const maxY = Math.max(...data.map(d => d.y))
//   const minY = Math.min(...data.map(d => d.y))
//   const range = maxY - minY || 1

//   // Decide how many ticks (max 6)
//   const tickCount = Math.min(6, data.length)
//   const tickIndexes = Array.from({ length: tickCount }, (_, i) =>
//     Math.floor((i * (data.length - 1)) / (tickCount - 1))
//   )

//   return (
//     <div className="p-4 bg-card rounded-lg border">
//       <h3 className="font-semibold mb-4">{title}</h3>
//       <div className="w-full h-60 relative">
//         <svg className="w-full h-48">
//           {data.map((point, index) => {
//             const x = (index / Math.max(data.length - 1, 1)) * 90 + 5
//             const y = 85 - ((point.y - minY) / range) * 75
//             return (
//               <circle
//                 key={index}
//                 cx={`${x}%`}
//                 cy={`${y}%`}
//                 r="4"
//                 fill={color}
//                 className="hover:r-6 transition-all"
//               />
//             )
//           })}

//           {/* Render only selected tick labels */}
//           {tickIndexes.map((i) => {
//             const point = data[i]
//             const x = (i / Math.max(data.length - 1, 1)) * 90 + 5
//             return (
//               <text
//                 key={i}
//                 x={`${x}%`}
//                 y="98%"
//                 textAnchor="middle"
//                 className="text-[10px] fill-muted-foreground"
//               >
//                 {new Date(point.x).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </text>
//             )
//           })}
//         </svg>

//         <div className="absolute left-0 top-0 h-48 flex flex-col justify-between text-xs text-muted-foreground">
//           <span>{maxY.toFixed(1)}</span>
//           <span>{minY.toFixed(1)}</span>
//         </div>

//         {yLabel && (
//           <div className="absolute left-2 top-24 -rotate-90 text-xs text-muted-foreground">
//             {yLabel}
//           </div>
//         )}
//       </div>
//       <div className="mt-2 text-xs text-muted-foreground">
//         {data.length} points • Range: {minY.toFixed(1)} - {maxY.toFixed(1)}
//       </div>
//     </div>
//   )
// }

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

  // Limit ticks on x-axis
  const tickCount = Math.min(6, data.length)
  const tickIndexes = Array.from({ length: tickCount }, (_, i) =>
    Math.floor((i * (data.length - 1)) / (tickCount - 1))
  )

  return (
    <div className="p-4 bg-card rounded-lg border">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="w-full h-60 relative">
        {/* increase height for labels */}
        <svg className="w-full h-56">
          {data.map((point, index) => {
            const x = (index / Math.max(data.length - 1, 1)) * 90 + 5
            const y = 80 - ((point.y - minY) / range) * 70
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                fill={color}
                className="hover:r-6 transition-all"
              />
            )
          })}

          {/* X-axis line */}
          <line
            x1="5%"
            x2="95%"
            y1="85%"
            y2="85%"
            stroke="gray"
            strokeWidth="1"
          />

          {/* Only render tick labels */}
          {tickIndexes.map((i) => {
            const point = data[i]
            const x = (i / Math.max(data.length - 1, 1)) * 90 + 5
            return (
              <text
                key={i}
                x={`${x}%`}
                y="95%"   // now inside SVG space
                textAnchor="middle"
                className="text-[10px] fill-muted-foreground"
              >
                {new Date(point.x).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </text>
            )
          })}
        </svg>

        {/* Y-axis values */}
        <div className="absolute left-0 top-0 h-48 flex flex-col justify-between text-xs text-muted-foreground">
          <span>{maxY.toFixed(1)}</span>
          <span>{minY.toFixed(1)}</span>
        </div>

        {yLabel && (
          <div className="absolute left-2 top-24 -rotate-90 text-xs text-muted-foreground">
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
