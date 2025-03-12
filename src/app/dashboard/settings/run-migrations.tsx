"use client";

import { useState } from "react";
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
  Play,
} from "lucide-react";

export default function RunMigrations() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runMigration = async (migrationFile: string) => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await fetch("/api/run-migration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ migrationFile }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Successfully ran migration: ${migrationFile}`);
      } else {
        setError(`Failed to run migration: ${data.error || "Unknown error"}`);
      }
    } catch (error: any) {
      setError(`Error running migration: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Migrations</CardTitle>
        <CardDescription>
          Run database migrations to set up your Supabase database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-2">Available Migrations</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-100">
                <div className="flex items-center">
                  <Database className="h-4 w-4 text-gray-500 mr-2" />
                  <span>initial-setup.sql</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    runMigration("supabase/migrations/initial-setup.sql")
                  }
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span className="ml-2">Run</span>
                </Button>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-100">
                <div className="flex items-center">
                  <Database className="h-4 w-4 text-gray-500 mr-2" />
                  <span>20240701000001_payments_invoices_setup.sql</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    runMigration(
                      "supabase/migrations/20240701000001_payments_invoices_setup.sql",
                    )
                  }
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span className="ml-2">Run</span>
                </Button>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-100">
                <div className="flex items-center">
                  <Database className="h-4 w-4 text-gray-500 mr-2" />
                  <span>20240702000001_fix_auth_references.sql</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    runMigration(
                      "supabase/migrations/20240702000001_fix_auth_references.sql",
                    )
                  }
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span className="ml-2">Run</span>
                </Button>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-100 bg-blue-50 border-blue-200">
                <div className="flex items-center">
                  <Database className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="font-medium">
                    20240705000001_clients_pets_rewards.sql
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    runMigration(
                      "supabase/migrations/20240705000001_clients_pets_rewards.sql",
                    )
                  }
                  disabled={loading}
                  className="border-blue-300 text-blue-600 hover:bg-blue-100"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span className="ml-2">Run</span>
                </Button>
              </div>
            </div>
          </div>

          {success && (
            <div className="p-4 border border-green-200 rounded-md bg-green-50 text-sm text-green-700 flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-600" />
              {success}
            </div>
          )}

          {error && (
            <div className="p-4 border border-red-200 rounded-md bg-red-50 text-sm text-red-700 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
              {error}
            </div>
          )}

          <div className="p-4 border border-yellow-200 rounded-md bg-yellow-50 text-sm text-yellow-700">
            <p className="font-medium mb-2 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Important Notes:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Make sure your Supabase environment variables are correctly set
                in .env.local
              </li>
              <li>
                Migrations should be run in order (initial-setup first, then
                others)
              </li>
              <li>Running migrations will modify your database schema</li>
              <li>
                Always back up your database before running migrations in
                production
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleString()}
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
