// // import { InfluxDB } from '@influxdata/influxdb-client'
// // import { NextResponse } from 'next/server'

// // export async function GET() {
// //   try {
// //     const client = new InfluxDB({
// //       url: process.env.INFLUXDB_URL!,
// //       token: process.env.INFLUXDB_TOKEN!
// //     })
    
// //     const queryApi = client.getQueryApi(process.env.INFLUXDB_ORG!)
    
// //     const fluxQuery = `
// //       from(bucket: "${process.env.INFLUXDB_BUCKET}")
// //         |> range(start: -24h)
// //         |> filter(fn: (r) => r._measurement == "S01A")
// //         |> filter(fn: (r) => r._field == "DO" or r._field == "PH" or r._field == "ORP" or r._field == "TDS" or r._field == "Water_Temp")
// //         |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
// //     `

// //     const results: any[] = []
    
// //     return new Promise((resolve, reject) => {
// //       queryApi.queryRows(fluxQuery, {
// //         next(row, tableMeta) {
// //           const o = tableMeta.toObject(row)
// //           results.push({
// //             DO: o.DO || '',
// //             PH: o.PH || '',
// //             ORP: o.ORP || '',
// //             TDS: o.TDS || '',
// //             Temperature: o.Water_Temp || '',
// //             time: new Date(o._time).toString()
// //           })
// //         },
// //         error(error) {
// //           reject(NextResponse.json({ error: 'Query failed', details: error }, { status: 500 }))
// //         },
// //         complete() {
// //           resolve(NextResponse.json(results))
// //         }
// //       })
// //     })
// //   } catch (error) {
// //     return NextResponse.json({ error: 'Failed to fetch data', details: error }, { status: 500 })
// //   }
// // }


// import { InfluxDB } from '@influxdata/influxdb-client'
// import { NextResponse } from 'next/server'

// export async function GET(): Promise<Response> {
//   try {
//     const client = new InfluxDB({
//       url: process.env.INFLUXDB_URL!,
//       token: process.env.INFLUXDB_TOKEN!
//     })
    
//     const queryApi = client.getQueryApi(process.env.INFLUXDB_ORG!)
    
//     const fluxQuery = `
//       from(bucket: "${process.env.INFLUXDB_BUCKET}")
//         |> range(start: -24h)
//         |> filter(fn: (r) => r._measurement == "S01A")
//         |> filter(fn: (r) => r._field == "DO" or r._field == "PH" or r._field == "ORP" or r._field == "TDS" or r._field == "Water_Temp")
//         |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
//     `

//     const results: any[] = []
    
//     return new Promise<Response>((resolve, reject) => {
//       queryApi.queryRows(fluxQuery, {
//         next(row, tableMeta) {
//           const o = tableMeta.toObject(row)
//           results.push({
//             DO: o.DO || '',
//             PH: o.PH || '',
//             ORP: o.ORP || '',
//             TDS: o.TDS || '',
//             Temperature: o.Water_Temp || '',
//             time: new Date(o._time).toString()
//           })
//         },
//         error(error) {
//           reject(NextResponse.json({ error: 'Query failed', details: error }, { status: 500 }))
//         },
//         complete() {
//           resolve(NextResponse.json(results))
//         }
//       })
//     })
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to fetch data', details: error }, { status: 500 })
//   }
// }



import { InfluxDB } from '@influxdata/influxdb-client'
import { NextResponse } from 'next/server'

async function queryWithRetry(queryApi: any, fluxQuery: string, maxRetries = 3): Promise<any[]> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const results: any[] = []
      
      return new Promise<any[]>((resolve, reject) => {
        queryApi.queryRows(fluxQuery, {
          next(row: any, tableMeta: any) {
            const o = tableMeta.toObject(row)
            results.push({
              DO: o.DO || '',
              PH: o.PH || '',
              ORP: o.ORP || '',
              TDS: o.TDS || '',
              Temperature: o.Water_Temp || '',
              time: new Date(o._time).toString()
            })
          },
          error(error: any) {
            reject(error)
          },
          complete() {
            resolve(results)
          }
        })
      })
    } catch (error) {
      if (attempt === maxRetries) throw error
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }
  throw new Error('Max retries exceeded')
}

export async function GET(): Promise<Response> {
  try {
    const client = new InfluxDB({
      url: process.env.INFLUXDB_URL!,
      token: process.env.INFLUXDB_TOKEN!
    })
    
    const queryApi = client.getQueryApi(process.env.INFLUXDB_ORG!)
    
    const fluxQuery = `
      from(bucket: "${process.env.INFLUXDB_BUCKET}")
        |> range(start: -24h)
        |> filter(fn: (r) => r._measurement == "S01A")
        |> filter(fn: (r) => r._field == "DO" or r._field == "PH" or r._field == "ORP" or r._field == "TDS" or r._field == "Water_Temp")
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    `

    const results = await queryWithRetry(queryApi, fluxQuery)
    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data', details: error }, { status: 500 })
  }
}
