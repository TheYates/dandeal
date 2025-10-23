"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit2 } from "lucide-react"

interface DropdownOption {
  id: string
  value: string
}

interface DropdownManagementProps {
  title: string
  description: string
  options: DropdownOption[]
  onOptionsChange: (options: DropdownOption[]) => void
}

export function DropdownManagement({ title, description, options, onOptionsChange }: DropdownManagementProps) {
  const [newOption, setNewOption] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const addOption = () => {
    if (newOption.trim()) {
      const newId = `opt_${Date.now()}`
      onOptionsChange([...options, { id: newId, value: newOption }])
      setNewOption("")
    }
  }

  const deleteOption = (id: string) => {
    onOptionsChange(options.filter((opt) => opt.id !== id))
  }

  const startEdit = (id: string, value: string) => {
    setEditingId(id)
    setEditValue(value)
  }

  const saveEdit = (id: string) => {
    if (editValue.trim()) {
      onOptionsChange(options.map((opt) => (opt.id === id ? { ...opt, value: editValue } : opt)))
      setEditingId(null)
      setEditValue("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Option */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter new option..."
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addOption()}
          />
          <Button onClick={addOption} size="sm" className="gap-2 bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        {/* Options List */}
        <div className="space-y-2">
          {options.length === 0 ? (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400">No options added yet</div>
          ) : (
            options.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200 dark:bg-background"
              >
                {editingId === option.id ? (
                  <div className="flex gap-2 flex-1">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <Button onClick={() => saveEdit(option.id)} size="sm" className="bg-green-500 hover:bg-green-600">
                      Save
                    </Button>
                    <Button onClick={() => setEditingId(null)} size="sm" variant="outline">
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <Badge variant="outline" className="text-sm">
                      {option.value}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startEdit(option.id, option.value)}
                        size="sm"
                        variant="ghost"
                        className="text-slate-600 hover:text-slate-900 dark:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteOption(option.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-900 dark:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
