"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Contact {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: "new" | "read" | "responded" | "archived"
  createdAt: string
  updatedAt: string
}

interface ContactDetailDialogProps {
  contact: Contact | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactDetailDialog({ contact, open, onOpenChange }: ContactDetailDialogProps) {
  if (!contact) return null

  const getStatusColor = (status: Contact["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "read":
        return "bg-yellow-100 text-yellow-800"
      case "responded":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Contact Message Details</DialogTitle>
            <p className="text-sm text-slate-500 mt-1">ID: {contact.id}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between pb-4 border-b">
            <span className="text-sm font-medium text-slate-600">Status</span>
            <Badge className={getStatusColor(contact.status)}>
              {contact.status}
            </Badge>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Name</p>
                <p className="text-sm font-medium text-slate-900">{contact.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Email</p>
                <p className="text-sm font-medium text-slate-900">{contact.email}</p>
              </div>
              {contact.phone && (
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-medium text-slate-900">{contact.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Subject & Message */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Message Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Subject</p>
                <p className="text-sm font-medium text-slate-900 mt-1">{contact.subject}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Message</p>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded mt-1 whitespace-pre-wrap">
                  {contact.message}
                </p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Submitted:</span>
              <span className="text-slate-700 font-medium">{formatDate(contact.createdAt)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Last Updated:</span>
              <span className="text-slate-700 font-medium">{formatDate(contact.updatedAt)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

