"use client";

import { LoadingSpinner } from "./ui/loading-spinner";

export default function PageLoading() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" color="#FC8D68" className="mb-4" />
        <p className="text-gray-600 font-medium">Loading amazing things...</p>
      </div>
    </div>
  );
}