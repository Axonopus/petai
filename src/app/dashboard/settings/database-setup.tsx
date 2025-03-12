"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertCircle,
  Database,
  Check,
  RefreshCw,
  AlertTriangle,
  Terminal,
} from "lucide-react";
import { createClient } from "../../../../supabase/client";

export default function DatabaseSetup() {
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "warning"
  >("loading");
  const [message, setMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<
    "unknown" | "success" | "error"
  >("unknown");
  const [missingVars, setMissingVars] = useState<{
    url?: boolean;
    anonKey?: boolean;
    serviceKey?: boolean;
  }>({});

  const checkConnection = async () => {
    setIsChecking(true);
    setStatus("loading");
    setMigrationStatus("unknown");

    try {
      const response = await fetch("/api/supabase-setup");
      const data = await response.json();

      if (data.success) {
        if (data.migrations?.success) {
          setMigrationStatus("success");
        } else {
          setMigrationStatus("error");
        }

        setStatus("success");
        setMessage("Database connection successful!");
      } else {
        if (data.missingVars) {
          setMissingVars(data.missingVars);
          setStatus("warning");
          setMessage("Environment variables missing or misconfigured");
        } else {
          setStatus("error");
          setMessage(`Connection error: ${data.error || "Unknown error"}`);
        }
      }
    } catch (error: any) {
      setStatus("error");
      setMessage(`Connection error: ${error.message || "Unknown error"}`);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const runMigrations = async () => {
    // This would typically be handled by a server endpoint
    // For now, we'll just show a message
    alert(
      "Migration functionality would be triggered here. In a production environment, this would run the necessary SQL migrations.",
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Connection</CardTitle>
        <CardDescription>
          Verify your Supabase database connection status and run migrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div
              className={`p-2 rounded-full ${status === "success" ? "bg-green-100" : status === "error" ? "bg-red-100" : status === "warning" ? "bg-yellow-100" : "bg-blue-100"}`}
            >
              {status === "success" ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : status === "error" ? (
                <AlertCircle className="h-5 w-5 text-red-600" />
              ) : status === "warning" ? (
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              ) : (
                <Database className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="font-medium">
                {status === "success"
                  ? "Connected"
                  : status === "error"
                    ? "Connection Failed"
                    : status === "warning"
                      ? "Configuration Issues"
                      : "Checking Connection..."}
              </h3>
              <p className="text-sm text-gray-500">{message}</p>
            </div>
          </div>

          {/* Migration Status */}
          {status === "success" && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-1.5 rounded-full ${migrationStatus === "success" ? "bg-green-100" : migrationStatus === "error" ? "bg-red-100" : "bg-gray-200"}`}
                >
                  {migrationStatus === "success" ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : migrationStatus === "error" ? (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  ) : (
                    <Terminal className="h-4 w-4 text-gray-500" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium">Database Migrations</h4>
                  <p className="text-xs text-gray-500">
                    {migrationStatus === "success"
                      ? "All migrations have been applied successfully"
                      : migrationStatus === "error"
                        ? "Some migrations may be missing or failed"
                        : "Migration status unknown"}
                  </p>
                </div>
              </div>
              {migrationStatus === "error" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={runMigrations}
                >
                  <Terminal className="mr-2 h-3.5 w-3.5" />
                  Run Migrations
                </Button>
              )}
            </div>
          )}

          {/* Environment Variables Status */}
          {Object.keys(missingVars).length > 0 && (
            <div className="p-4 border border-yellow-200 rounded-md bg-yellow-50 text-sm text-yellow-700">
              <p className="font-medium mb-2">Missing Environment Variables:</p>
              <ul className="list-disc pl-5 space-y-1">
                {missingVars.url && <li>NEXT_PUBLIC_SUPABASE_URL</li>}
                {missingVars.anonKey && <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>}
                {missingVars.serviceKey && <li>SUPABASE_SERVICE_KEY</li>}
              </ul>
              <p className="mt-2 text-xs">
                Check your .env.local file and ensure all required variables are
                set.
              </p>
            </div>
          )}

          {/* Error Troubleshooting */}
          {status === "error" && (
            <div className="p-4 border border-red-200 rounded-md bg-red-50 text-sm text-red-700">
              <p className="font-medium mb-2">Troubleshooting Steps:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Verify your Supabase URL and API keys in .env.local</li>
                <li>Check if your Supabase project is active</li>
                <li>Ensure your IP is not blocked by Supabase</li>
                <li>Verify that the required tables exist in your database</li>
                <li>Check if migrations have been applied correctly</li>
              </ol>
            </div>
          )}

          <Button
            onClick={checkConnection}
            disabled={isChecking}
            variant="outline"
            className="mt-4"
          >
            {isChecking ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>Refresh Connection Status</>
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-gray-500">
          Last checked: {new Date().toLocaleTimeString()}
        </p>
        <Button
          variant="link"
          size="sm"
          className="text-xs"
          onClick={() => window.open(".env.local.example", "_blank")}
        >
          View Environment Variables Example
        </Button>
      </CardFooter>
    </Card>
  );
}
