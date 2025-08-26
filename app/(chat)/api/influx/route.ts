import { InfluxDB } from '@influxdata/influxdb-client'
import { NextResponse } from 'next/server'

export async function GET() {
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

    const results: any[] = []
    
    return new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
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
        error(error) {
          reject(NextResponse.json({ error: 'Query failed', details: error }, { status: 500 }))
        },
        complete() {
          resolve(NextResponse.json(results))
        }
      })
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data', details: error }, { status: 500 })
  }
}
