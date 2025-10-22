"use client"

import { QuotesTable } from "@/components/quotes-table"

export default function QuotesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quote Requests</h1>
          <p className="text-gray-600 mt-2">Manage quote requests</p>
        </div>
      </div>

      <QuotesTable />
    </div>
  )
}
