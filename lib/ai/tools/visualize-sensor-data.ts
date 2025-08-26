// // lib/ai/tools/visualize-sensor-data.ts
// import { tool } from 'ai';
// import { z } from 'zod';
// import { InfluxDB } from '@influxdata/influxdb-client';

// export const visualizeSensorData = tool({
//   description: 'Create visualizations of sensor data from InfluxDB when user asks to visualize or show charts',
//   parameters: z.object({
//     parameters: z.array(z.enum(['DO', 'PH', 'ORP', 'TDS', 'Temperature'])).describe('Sensor parameters to visualize'),
//     timeRange: z.string().optional().describe('Time range (e.g., 1h, 6h, 24h)').default('6h'),
//     chartType: z.enum(['line', 'scatter']).optional().default('line')
//   }),
//   execute: async ({ parameters, timeRange, chartType }) => {
//     try {
//       const client = new InfluxDB({
//         url: process.env.INFLUXDB_URL!,
//         token: process.env.INFLUXDB_TOKEN!
//       });
      
//       const queryApi = client.getQueryApi(process.env.INFLUXDB_ORG!);
      
//       const fluxQuery = `
//         from(bucket: "${process.env.INFLUXDB_BUCKET}")
//           |> range(start: -${timeRange})
//           |> filter(fn: (r) => r._measurement == "S01A")
//           |> filter(fn: (r) => ${parameters.map(p => `r._field == "${p}"`).join(' or ')})
//           |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
//           |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
//       `;

//       const results: any[] = [];
      
//       return new Promise((resolve) => {
//         queryApi.queryRows(fluxQuery, {
//           next(row, tableMeta) {
//             const o = tableMeta.toObject(row);
//             results.push({
//               time: o._time,
//               ...parameters.reduce((acc, param) => ({
//                 ...acc,
//                 [param]: o[param] ?? null
//               }), {})
//             });
//           },
//           error(error) {
//             resolve({ error: 'Failed to fetch data', message: error.message });
//           },
//           complete() {
//             const charts = parameters.map(param => ({
//               type: 'chart',
//               title: `${param} Over Time`,
//               chartType,
//               data: results
//                 .filter(r => r[param] !== null)
//                 .map(r => ({
//                   x: new Date(r.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//                   y: Number(r[param])
//                 })),
//               xLabel: 'Time',
//               yLabel: getUnit(param),
//               id: `chart-${param}-${Date.now()}`
//             }));
            
//             resolve({ charts, summary: `Generated ${charts.length} charts for ${parameters.join(', ')}` });
//           }
//         });
//       });
//     } catch (error) {
//       return { error: 'Failed to create visualization', message: error instanceof Error ? error.message : 'Unknown error' };
//     }
//   },
// });

// function getUnit(param: string): string {
//   const units: Record<string, string> = {
//     'DO': 'mg/L',
//     'PH': 'pH',
//     'ORP': 'mV',
//     'TDS': 'ppm',
//     'Temperature': '°C'
//   };
//   return units[param] || '';
// }


// lib/ai/tools/visualize-sensor-data.ts
import { tool } from 'ai';
import { z } from 'zod';
import { InfluxDB } from '@influxdata/influxdb-client';

export const visualizeSensorData = tool({
  description: 'Create visualizations of sensor data from InfluxDB when user asks to visualize or show charts',
  parameters: z.object({
    parameters: z.array(z.enum(['DO', 'PH', 'ORP', 'TDS', 'Water_Temp'])).describe('Sensor parameters to visualize'),
    timeRange: z.string().optional().describe('Time range (e.g., 1h, 6h, 24h)').default('6h'),
    chartType: z.enum(['line', 'scatter']).optional().default('line')
  }),
  execute: async ({ parameters, timeRange, chartType }) => {
    try {
      const client = new InfluxDB({
        url: process.env.INFLUXDB_URL!,
        token: process.env.INFLUXDB_TOKEN!
      });
      
      const queryApi = client.getQueryApi(process.env.INFLUXDB_ORG!);
      
      const fluxQuery = `
        from(bucket: "${process.env.INFLUXDB_BUCKET}")
          |> range(start: -${timeRange})
          |> filter(fn: (r) => r._measurement == "S01A")
          |> filter(fn: (r) => ${parameters.map(p => `r._field == "${p}"`).join(' or ')})
          |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
          |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      `;

      const results: any[] = [];
      
      return new Promise((resolve) => {
        queryApi.queryRows(fluxQuery, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            results.push({
              time: o._time,
              ...parameters.reduce((acc, param) => ({
                ...acc,
                [param]: o[param] ?? null
              }), {})
            });
          },
          error(error) {
            resolve({ error: 'Failed to fetch data', message: error.message });
          },
          complete() {
            const charts = parameters.map((param, index) => ({
              type: 'chart',
              title: `${param} Over Time`,
              chartType,
              data: results
                .filter(r => r[param] !== null)
                .map(r => ({
                  x: new Date(r.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  y: Number(r[param])
                })),
              xLabel: 'Time',
              yLabel: getUnit(param),
              id: `sensor-chart-${index}`
            }));
            
            resolve({ charts, summary: `Generated ${charts.length} charts for ${parameters.join(', ')}` });
          }
        });
      });
    } catch (error) {
      return { error: 'Failed to create visualization', message: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
});

function getUnit(param: string): string {
  const units: Record<string, string> = {
    'DO': 'mg/L',
    'PH': 'pH',
    'ORP': 'mV',
    'TDS': 'ppm',
    'Temperature': '°C'
  };
  return units[param] || '';
}
