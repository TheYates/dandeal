"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Download, Trash2, Search, Loader2, Eye } from "lucide-react"
import { ConsultationDetailDialog } from "./consultation-detail-dialog"

interface Consultation {
  id: string
  name: string
  email: string
  phone: string
  service: string
  message: string | null
  status: "new" | "contacted" | "in_progress" | "completed" | "cancelled"
  createdAt: string
  updatedAt: string
}

const services = [
  "Shipping",
  "Logistics",
  "Import",
  "Export",
  "International Procurement",
  "Customs Clearance",
  "Warehousing",
]

export function ConsultationsTable() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [serviceFilter, setServiceFilter] = useState<string>("all")
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchConsultations()
  }, [])

  const fetchConsultations = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/submissions?type=consultations")
      const data = await response.json()
      setConsultations(data.submissions || [])
    } catch (error) {
      console.error("Error fetching consultations:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredConsultations = useMemo(() => {
    return consultations.filter((consultation) => {
      const matchesSearch =
        consultation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.phone.includes(searchTerm)

      const matchesStatus = statusFilter === "all" || consultation.status === statusFilter
      const matchesService = serviceFilter === "all" || consultation.service === serviceFilter

      return matchesSearch && matchesStatus && matchesService
    })
  }, [consultations, searchTerm, statusFilter, serviceFilter])

  const updateStatus = async (id: string, newStatus: Consultation["status"]) => {
    try {
      const response = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, type: "consultations" }),
      })
      if (response.ok) {
        setConsultations(consultations.map((c) => (c.id === id ? { ...c, status: newStatus } : c)))
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const deleteConsultation = async (id: string) => {
    try {
      const response = await fetch("/api/admin/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type: "consultations" }),
      })
      if (response.ok) {
        setConsultations(consultations.filter((c) => c.id !== id))
      }
    } catch (error) {
      console.error("Error deleting consultation:", error)
    }
  }

  const exportData = () => {
    const csv = [
      ["ID", "Name", "Email", "Phone", "Service", "Message", "Status", "Submitted"],
      ...filteredConsultations.map((c) => [
        c.id,
        c.name,
        c.email,
        c.phone,
        c.service,
        c.message || "",
        c.status,
        new Date(c.createdAt).toLocaleString(),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `consultations-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const getStatusColor = (status: Consultation["status"]) => {
    switch (status) {
      case "new":
        return "bg-yellow-100 text-yellow-800"
      case "contacted":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
    }
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Consultation Requests</CardTitle>
        <CardDescription>Manage and track all consultation bookings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-white"
          >
            <option value="all">All Services</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button onClick={exportData} variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Message</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Submitted</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredConsultations.map((consultation) => (
                  <tr key={consultation.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{consultation.name}</div>
                      <div className="text-xs text-slate-500">{consultation.id}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{consultation.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{consultation.service}</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{consultation.message || "-"}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(consultation.status)}>{consultation.status.replace("_", " ")}</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs">
                      {new Date(consultation.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedConsultation(consultation)
                              setDialogOpen(true)
                            }}
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(consultation.id, "new")}>
                            Mark New
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(consultation.id, "contacted")}>
                            Mark Contacted
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(consultation.id, "in_progress")}>
                            Mark In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(consultation.id, "completed")}>
                            Mark Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(consultation.id, "cancelled")}>
                            Mark Cancelled
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteConsultation(consultation.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredConsultations.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No consultation requests found matching your criteria.
          </div>
        )}

        {!loading && (
          <div className="text-xs text-slate-500 pt-2">
            Showing {filteredConsultations.length} of {consultations.length} submissions
          </div>
        )}
      </CardContent>
    </Card>

    <ConsultationDetailDialog consultation={selectedConsultation} open={dialogOpen} onOpenChange={setDialogOpen} />
  </>
  )
}

