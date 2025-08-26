// // // import {InfluxDBClient, Point} from '@influxdata/influxdb3-client'

// // // const token = process.env.INFLUXDB_TOKEN

// // // async function main() {
// // //     const client = new InfluxDBClient({host: 'https://us-east-1-1.aws.cloud2.influxdata.com', token: token})

// // //     // following code goes here
// // //     const query = `SELECT * FROM 'sensordata' 
// // //     WHERE time >= now() - interval '24 hours' AND 
// // //     ('DO' IS NOT NULL OR 'PH' IS NOT NULL) order by time asc`

// // //     const rows = await client.query(query, 'Data1')

// // //     console.log(`${"ants".padEnd(5)}${"bees".padEnd(5)}${"location".padEnd(10)}${"time".padEnd(15)}`);
// // //     for await (const row of rows) {
// // //         let DO = row.DO || '';
// // //         let PH = row.PH || '';
// // //         let time = new Date(row.time);
// // //         console.log(`${DO.toString().padEnd(5)}${PH.toString().padEnd(5)}${row.location.padEnd(10)}${time.toString().padEnd(15)}`);
// // //     }
// // //     client.close()
// // // }

// // // main()

'use client'
import { useState, useEffect } from 'react'

type SensorData = {
    DO: number | string
    PH: number | string
    ORP: number | string
    time: string
}

export default function InfluxPage() {
    const [data, setData] = useState<SensorData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                setError(null)
                
                const response = await fetch('/api/influx')
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                
                const results = await response.json()
                setData(results)
            } catch (err) {
                console.error('Fetch error:', err)
                setError(err instanceof Error ? err.message : 'Failed to fetch data')
            } finally {
                setLoading(false)
            }
        }
        
        fetchData()
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div>
            <h1>Influx Data</h1>
            <pre>
                {`${"DO".padEnd(5)}${"PH".padEnd(5)}${"ORP".padEnd(10)}${"time".padEnd(15)}`}
                {data.map((row, i) => (
                    `\n${row.DO.toString().padEnd(5)}${row.PH.toString().padEnd(5)}${row.ORP.toString().padEnd(10)}${row.time.padEnd(15)}`
                )).join('')}
            </pre>
        </div>
    )
}