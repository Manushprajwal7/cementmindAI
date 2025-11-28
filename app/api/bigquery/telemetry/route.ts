import { NextRequest } from "next/server";
import { BigQuery } from "@google-cloud/bigquery";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { operation } = body || {};

    // Get project ID from environment variables
    const projectId =
      process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID;

    // Initialize BigQuery with credentials from environment variables
    let bqOptions: any = {
      projectId,
    };

    // Use service account credentials from environment variables
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (clientEmail && privateKey && projectId) {
      bqOptions.credentials = {
        client_email: clientEmail,
        private_key: privateKey,
      };
    }

    const bq = new BigQuery(bqOptions);

    let sql = "";
    let params: any = {};

    // Define different operations
    switch (operation) {
      case "analyze_telemetry":
        sql = `
          WITH recent_data AS (
            SELECT 
              timestamp,
              temperature,
              pressure,
              vibration,
              humidity,
              particle_count as particleCount,
              flow_rate as flowRate,
              energy_consumption as energyConsumption
            FROM \`${projectId}.cement_data.telemetry\`
            WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR)
          ),
          summary_stats AS (
            SELECT
              AVG(temperature) as avgTemperature,
              MAX(pressure) as maxPressure,
              MIN(humidity) as minHumidity,
              SUM(energyConsumption) as totalEnergyConsumption,
              COUNT(*) as totalRecords
            FROM recent_data
          ),
          anomalies AS (
            SELECT 
              timestamp,
              'temperature' as metric,
              temperature as value,
              95.0 as threshold
            FROM recent_data 
            WHERE temperature > 95.0
            UNION ALL
            SELECT 
              timestamp,
              'pressure' as metric,
              pressure as value,
              7.0 as threshold
            FROM recent_data 
            WHERE pressure > 7.0
            UNION ALL
            SELECT 
              timestamp,
              'vibration' as metric,
              vibration as value,
              4.5 as threshold
            FROM recent_data 
            WHERE vibration > 4.5
          ),
          hourly_avg AS (
            SELECT
              TIMESTAMP_TRUNC(timestamp, HOUR) as hour,
              AVG(temperature) as avg_temp,
              AVG(pressure) as avg_pressure,
              AVG(humidity) as avg_humidity
            FROM recent_data
            GROUP BY TIMESTAMP_TRUNC(timestamp, HOUR)
            ORDER BY hour
          ),
          trends AS (
            SELECT
              'temperature' as metric,
              CASE 
                WHEN COUNT(*) > 1 AND AVG(avg_temp) > LAG(AVG(avg_temp), 1) OVER (ORDER BY MAX(hour)) THEN 'increasing'
                WHEN COUNT(*) > 1 AND AVG(avg_temp) < LAG(AVG(avg_temp), 1) OVER (ORDER BY MAX(hour)) THEN 'decreasing'
                ELSE 'stable'
              END as trend,
              ROUND(
                IF(
                  COUNT(*) > 1 AND LAG(AVG(avg_temp), 1) OVER (ORDER BY MAX(hour)) IS NOT NULL AND LAG(AVG(avg_temp), 1) OVER (ORDER BY MAX(hour)) != 0,
                  (AVG(avg_temp) - LAG(AVG(avg_temp), 1) OVER (ORDER BY MAX(hour))) / LAG(AVG(avg_temp), 1) OVER (ORDER BY MAX(hour)) * 100,
                  0
                ), 
                2
              ) as change_percent
            FROM hourly_avg
            WHERE avg_temp IS NOT NULL
            GROUP BY 1
            HAVING COUNT(*) > 0
            ORDER BY MAX(hour) DESC
            LIMIT 1
            
            UNION ALL
            
            SELECT
              'pressure' as metric,
              CASE 
                WHEN COUNT(*) > 1 AND AVG(avg_pressure) > LAG(AVG(avg_pressure), 1) OVER (ORDER BY MAX(hour)) THEN 'increasing'
                WHEN COUNT(*) > 1 AND AVG(avg_pressure) < LAG(AVG(avg_pressure), 1) OVER (ORDER BY MAX(hour)) THEN 'decreasing'
                ELSE 'stable'
              END as trend,
              ROUND(
                IF(
                  COUNT(*) > 1 AND LAG(AVG(avg_pressure), 1) OVER (ORDER BY MAX(hour)) IS NOT NULL AND LAG(AVG(avg_pressure), 1) OVER (ORDER BY MAX(hour)) != 0,
                  (AVG(avg_pressure) - LAG(AVG(avg_pressure), 1) OVER (ORDER BY MAX(hour))) / LAG(AVG(avg_pressure), 1) OVER (ORDER BY MAX(hour)) * 100,
                  0
                ), 
                2
              ) as change_percent
            FROM hourly_avg
            WHERE avg_pressure IS NOT NULL
            GROUP BY 1
            HAVING COUNT(*) > 0
            ORDER BY MAX(hour) DESC
            LIMIT 1
            
            UNION ALL
            
            SELECT
              'humidity' as metric,
              CASE 
                WHEN COUNT(*) > 1 AND AVG(avg_humidity) > LAG(AVG(avg_humidity), 1) OVER (ORDER BY MAX(hour)) THEN 'increasing'
                WHEN COUNT(*) > 1 AND AVG(avg_humidity) < LAG(AVG(avg_humidity), 1) OVER (ORDER BY MAX(hour)) THEN 'decreasing'
                ELSE 'stable'
              END as trend,
              ROUND(
                IF(
                  COUNT(*) > 1 AND LAG(AVG(avg_humidity), 1) OVER (ORDER BY MAX(hour)) IS NOT NULL AND LAG(AVG(avg_humidity), 1) OVER (ORDER BY MAX(hour)) != 0,
                  (AVG(avg_humidity) - LAG(AVG(avg_humidity), 1) OVER (ORDER BY MAX(hour))) / LAG(AVG(avg_humidity), 1) OVER (ORDER BY MAX(hour)) * 100,
                  0
                ), 
                2
              ) as change_percent
            FROM hourly_avg
            WHERE avg_humidity IS NOT NULL
            GROUP BY 1
            HAVING COUNT(*) > 0
            ORDER BY MAX(hour) DESC
            LIMIT 1
          )
          SELECT 
            (SELECT avgTemperature FROM summary_stats) as avgTemperature,
            (SELECT maxPressure FROM summary_stats) as maxPressure,
            (SELECT minHumidity FROM summary_stats) as minHumidity,
            (SELECT totalEnergyConsumption FROM summary_stats) as totalEnergyConsumption,
            (SELECT COUNT(*) FROM anomalies) as anomalyCount,
            ARRAY_AGG(DISTINCT anomalies) as anomalies,
            ARRAY_AGG(DISTINCT trends) as trends
          FROM anomalies, trends
          WHERE anomalies.timestamp IS NOT NULL 
          LIMIT 10
        `;
        break;

      default:
        return new Response(JSON.stringify({ error: "Invalid operation" }), {
          status: 400,
        });
    }

    const options: any = {
      query: sql,
      location: process.env.GOOGLE_CLOUD_REGION || "US",
    };
    if (params) options.params = params;

    // Track query execution time
    const startTime = Date.now();
    const [job] = await bq.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    const executionTime = Date.now() - startTime;

    // Return enhanced response with metadata
    return new Response(
      JSON.stringify({
        rows,
        metadata: {
          timestamp: new Date().toISOString(),
          rowCount: rows.length,
          executionTimeMs: executionTime,
          jobId: job.id,
          projectId,
        },
      }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("BigQuery API error:", err);

    // Handle permission errors specifically
    if (err?.message?.includes("bigquery.jobs.create permission")) {
      return new Response(
        JSON.stringify({
          error:
            "BigQuery permission denied. Please check service account permissions.",
          code: "PERMISSION_DENIED",
          timestamp: new Date().toISOString(),
        }),
        { status: 403 }
      );
    }

    return new Response(
      JSON.stringify({
        error: err?.message || "Unknown error",
        timestamp: new Date().toISOString(),
      }),
      { status: 500 }
    );
  }
}
