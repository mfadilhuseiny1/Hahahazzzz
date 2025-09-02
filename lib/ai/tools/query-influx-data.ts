// // import { tool } from 'ai';
// // import { z } from 'zod';
// // import { InfluxDB } from '@influxdata/influxdb-client';

// // // Simple cache to prevent duplicate calls
// // const cache = new Map<string, any>();
// // const CACHE_TTL = 60000; // 1 minute

// // export const queryInfluxData = tool({
// //   description: 'Query sensor data from InfluxDB based on user questions about water quality parameters like DO, PH, ORP, TDS, Temperature',
// //   parameters: z.object({
// //     query: z.string().describe('Natural language query about the sensor data'),
// //     timeRange: z.string().optional().describe('Time range for the query (e.g., 1h, 24h, 7d)').default('24h'),
// //     parameters: z.array(z.enum(['DO', 'PH', 'ORP', 'TDS', 'Temperature'])).optional(),
// //   }),
// //   execute: async ({ query, timeRange, parameters }) => {
// //     // Fix: Include query in cache key to prevent wrong cached results
// //     const cacheKey = `${query}-${timeRange}-${parameters?.join(',')}`;
// //     const cached = cache.get(cacheKey);
    
// //     if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
// //       return cached.data;
// //     }

// //     // Validate timeRange format
// //     if (!/^\d+[hdwmy]$/.test(timeRange)) {
// //       return { error: 'Invalid time range format. Use format like: 1h, 24h, 7d' };
// //     }

// //     // Validate environment variables
// //     if (!process.env.INFLUXDB_URL || !process.env.INFLUXDB_TOKEN || !process.env.INFLUXDB_ORG || !process.env.INFLUXDB_BUCKET) {
// //       return { error: 'Missing required InfluxDB environment variables' };
// //     }

// //     try {
// //       const client = new InfluxDB({
// //         url: process.env.INFLUXDB_URL,
// //         token: process.env.INFLUXDB_TOKEN
// //       });
      
// //       const queryApi = client.getQueryApi(process.env.INFLUXDB_ORG);
            
// //       const fluxQuery = `
// //         import "date"

// //         from(bucket: "${process.env.INFLUXDB_BUCKET}")
// //           |> range(start: -${timeRange})
// //           |> filter(fn: (r) => r._measurement == "S01A")
// //           |> filter(fn: (r) => r._field == "DO" or r._field == "PH" or r._field == "ORP" or r._field == "TDS" or r._field == "Water_Temp")
// //           |> filter(fn: (r) => date.minute(t: r._time) % 5 == 0)
// //           |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
// //       `;
// //       const results: any[] = [];
      
// //       return new Promise((resolve, reject) => {
// //         queryApi.queryRows(fluxQuery, {
// //           next(row, tableMeta) {
// //             const o = tableMeta.toObject(row);
// //             results.push({
// //               DO: o.DO ?? null,
// //               PH: o.PH ?? null,
// //               ORP: o.ORP ?? null,
// //               TDS: o.TDS ?? null,
// //               Temperature: o.Water_Temp ?? null,
// //               time: o._time
// //             });
// //           },
// //           error(error) {
// //             reject({
// //               error: 'Failed to retrieve sensor data',
// //               message: error.message
// //             });
// //           },
// //           complete() {
// //             const result = {
// //               data: results,
// //               summary: `Retrieved ${results.length} sensor readings from the last ${timeRange}`,
// //               query: query
// //             };
            
// //             cache.set(cacheKey, { data: result, timestamp: Date.now() });
// //             resolve(result);
// //           }
// //         });
// //       });
// //     } catch (error) {
// //       return {
// //         error: 'Failed to retrieve sensor data',
// //         message: error instanceof Error ? error.message : 'Unknown error'
// //       };
// //     }
// //   },
// // });


// import { tool } from 'ai';
// import { z } from 'zod';
// import { InfluxDB } from '@influxdata/influxdb-client';

// // Simple cache to prevent duplicate calls
// const cache = new Map<string, any>();
// const CACHE_TTL = 60000; // 1 minute

// export const queryInfluxData = tool({
//   description: 'Query sensor data from InfluxDB based on user questions about water quality parameters like DO, PH, ORP, TDS, Temperature',
//   parameters: z.object({
//     query: z.string().describe('Natural language query about the sensor data'),
//     timeRange: z.string().optional().describe('Time range for the query (e.g., 1h, 24h, 7d)').default('24h'),
//     parameters: z.array(z.enum(['DO', 'PH', 'ORP', 'TDS', 'Temperature'])).optional(),
//   }),
//   execute: async ({ query, timeRange, parameters }) => {
//     // Fix: Include query in cache key to prevent wrong cached results
//     const cacheKey = `${query}-${timeRange}-${parameters?.join(',')}`;
//     const cached = cache.get(cacheKey);
    
//     if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
//       return cached.data;
//     }

//     // Validate timeRange format
//     if (!/^\d+[hdwmy]$/.test(timeRange)) {
//       return { error: 'Invalid time range format. Use format like: 1h, 24h, 7d' };
//     }

//     // Validate environment variables
//     if (!process.env.INFLUXDB_URL || !process.env.INFLUXDB_TOKEN || !process.env.INFLUXDB_ORG || !process.env.INFLUXDB_BUCKET) {
//       return { error: 'Missing required InfluxDB environment variables' };
//     }

//     try {
//       const client = new InfluxDB({
//         url: process.env.INFLUXDB_URL,
//         token: process.env.INFLUXDB_TOKEN
//       });
      
//       const queryApi = client.getQueryApi(process.env.INFLUXDB_ORG);
            
//       const fluxQuery = `
//         import "date"

//         from(bucket: "${process.env.INFLUXDB_BUCKET}")
//           |> range(start: -${timeRange})
//           |> filter(fn: (r) => r._measurement == "S01A")
//           |> filter(fn: (r) => r._field == "DO" or r._field == "PH" or r._field == "ORP" or r._field == "TDS" or r._field == "Water_Temp")
//           |> filter(fn: (r) => date.minute(t: r._time) % 5 == 0)
//           |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
//       `;
//       const results: any[] = [];
      
//       return new Promise((resolve, reject) => {
//         queryApi.queryRows(fluxQuery, {
//           next(row, tableMeta) {
//             const o = tableMeta.toObject(row);
//             results.push({
//               DO: o.DO ?? null,
//               PH: o.PH ?? null,
//               ORP: o.ORP ?? null,
//               TDS: o.TDS ?? null,
//               Temperature: o.Water_Temp ?? null,
//               time: o._time
//             });
//           },
//           error(error) {
//             reject({
//               error: 'Failed to retrieve sensor data',
//               message: error.message
//             });
//           },
//           complete() {
//             const result = {
//               data: results,
//               summary: `Retrieved ${results.length} sensor readings from the last ${timeRange}`,
//               query: query,
//               tableName: 'S01A'
//             };
            
//             cache.set(cacheKey, { data: result, timestamp: Date.now() });
//             resolve(result);
//           }
//         });
//       });
//     } catch (error) {
//       return {
//         error: 'Failed to retrieve sensor data',
//         message: error instanceof Error ? error.message : 'Unknown error'
//       };
//     }
//   },
// });


import { tool } from 'ai';
import { z } from 'zod';
import { InfluxDB } from '@influxdata/influxdb-client';

// Simple cache to prevent duplicate calls
const cache = new Map<string, any>();
const CACHE_TTL = 60000; // 1 minute

export const queryInfluxData = tool({
  description: 'Query sensor data from InfluxDB based on user questions about water quality parameters like DO, PH, ORP, TDS, Temperature',
  parameters: z.object({
    query: z.string().describe('Natural language query about the sensor data'),
    timeRange: z.string().optional().describe('Time range for the query (e.g., 1h, 24h, 7d)').default('24h'),
    parameters: z.array(z.enum(['DO', 'PH', 'ORP', 'TDS', 'Temperature'])).optional(),
  }),
  execute: async ({ query, timeRange, parameters }) => {
    // Fix: Include query in cache key to prevent wrong cached results
    const cacheKey = `${query}-${timeRange}-${parameters?.join(',')}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    // Validate timeRange format
    if (!/^\d+[hdwmy]$/.test(timeRange)) {
      return { error: 'Invalid time range format. Use format like: 1h, 24h, 7d' };
    }

    // Validate environment variables
    if (!process.env.INFLUXDB_URL || !process.env.INFLUXDB_TOKEN || !process.env.INFLUXDB_ORG || !process.env.INFLUXDB_BUCKET) {
      return { error: 'Missing required InfluxDB environment variables' };
    }

    try {
      const client = new InfluxDB({
        url: process.env.INFLUXDB_URL,
        token: process.env.INFLUXDB_TOKEN
      });
      
      const queryApi = client.getQueryApi(process.env.INFLUXDB_ORG);
            
      const fluxQuery = `
        import "date"

        from(bucket: "${process.env.INFLUXDB_BUCKET}")
          |> range(start: -${timeRange})
          |> filter(fn: (r) => r._measurement == "S01A")
          |> filter(fn: (r) => r._field == "DO" or r._field == "PH" or r._field == "ORP" or r._field == "TDS" or r._field == "Water_Temp")
          |> filter(fn: (r) => date.minute(t: r._time) % 5 == 0)
          |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      `;
      const results: any[] = [];
      
      return new Promise((resolve, reject) => {
        queryApi.queryRows(fluxQuery, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            results.push({
              DO: o.DO ?? null,
              PH: o.PH ?? null,
              ORP: o.ORP ?? null,
              TDS: o.TDS ?? null,
              Temperature: o.Water_Temp ?? null,
              time: o._time
            });
          },
          error(error) {
            reject({
              error: 'Failed to retrieve sensor data',
              message: error.message
            });
          },
          complete() {
            const result = {
              data: results,
              summary: `Retrieved ${results.length} sensor readings from the last ${timeRange}`,
              query: query,
              tableName: 'S01A',
              displayInstruction: 'DO NOT display or recreate the table data. The table component will handle the visualization. Only provide analysis and insights about the data.'
            };
            
            cache.set(cacheKey, { data: result, timestamp: Date.now() });
            resolve(result);
          }
        });
      });
    } catch (error) {
      return {
        error: 'Failed to retrieve sensor data',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },
});
