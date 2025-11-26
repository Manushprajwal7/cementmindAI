"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Database, Table, AlertCircle, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function BigQueryAnalytics() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<boolean>(false);

  const runQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setPermissionError(false);

    try {
      const response = await fetch("/api/bigquery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sql: query.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === "PERMISSION_DENIED") {
          setPermissionError(true);
          setError(
            "BigQuery permission denied. Please contact your administrator to grant the required permissions."
          );
        } else {
          throw new Error(data.error || `API error: ${response.status}`);
        }
        return;
      }

      setResults(data);
    } catch (err: any) {
      console.error("Error executing BigQuery:", err);
      setError(err.message || "Failed to execute query");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          BigQuery Data Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="Enter your SQL query here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[120px] font-mono"
          />

          <div className="flex justify-between items-center">
            <Button
              onClick={runQuery}
              disabled={!query.trim() || loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running Query...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  Run Query
                </>
              )}
            </Button>

            {results?.metadata && (
              <div className="text-sm text-muted-foreground">
                {results.metadata.rowCount} rows •{" "}
                {results.metadata.executionTimeMs}ms
              </div>
            )}
          </div>

          {permissionError && (
            <Alert variant="destructive" className="flex items-start gap-2">
              <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <AlertDescription>
                  <strong>Permission Required</strong>
                  <p className="mt-1">
                    Your account does not have permission to run BigQuery jobs.
                    Please contact your system administrator to grant the
                    "BigQuery Job User" role (roles/bigquery.jobUser) to your
                    service account.
                  </p>
                </AlertDescription>
              </div>
            </Alert>
          )}

          {error && !permissionError && (
            <Alert variant="destructive" className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {results?.rows && results.rows.length > 0 && (
            <div className="mt-4 border rounded-md overflow-auto">
              <div className="flex items-center gap-2 p-2 bg-muted">
                <Table className="h-4 w-4" />
                <span className="font-medium">Query Results</span>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {Object.keys(results.rows[0]).map((key) => (
                      <th
                        key={key}
                        className="px-4 py-2 text-left text-sm font-medium"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.rows.map((row: any, i: number) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}
                    >
                      {Object.values(row).map((value: any, j: number) => (
                        <td key={j} className="px-4 py-2 text-sm">
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {results?.rows && results.rows.length === 0 && (
            <div className="mt-4 p-4 border rounded-md text-center text-muted-foreground">
              Query executed successfully, but returned no results.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
