"use client"

import { ConsultationsTable } from "@/components/consultations-table"

export default function ConsultationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Consultations</h1>
          <p className="text-gray-600 mt-2">Manage consultation requests</p>
        </div>
      </div>

      <ConsultationsTable />
    </div>
  )
}
