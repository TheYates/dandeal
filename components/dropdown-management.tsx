"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListSkeleton } from "./table-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDropdownOptions } from "@/hooks/use-dropdown-options";

interface DropdownManagementProps {
  title: string;
  description: string;
  type: "services" | "shipping_methods" | "cargo_types";
}

export function DropdownManagement({
  title,
  description,
  type,
}: DropdownManagementProps) {
  const { options, loading, addOption, updateOption, deleteOption } =
    useDropdownOptions(type);
  const [newOption, setNewOption] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddOption = async () => {
    if (!newOption.trim()) {
      toast.error("Please enter an option value");
      return;
    }

    setIsSubmitting(true);
    try {
      await addOption(newOption, newOption);
      setNewOption("");
      toast.success("Option added successfully");
    } catch (error) {
      toast.error("Failed to add option");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOption = async (id: string) => {
    setIsSubmitting(true);
    try {
      await deleteOption(id);
      toast.success("Option deleted successfully");
    } catch (error) {
      toast.error("Failed to delete option");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (!editValue.trim()) {
      toast.error("Please enter a value");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateOption(id, { label: editValue, value: editValue });
      setEditingId(null);
      setEditValue("");
      toast.success("Option updated successfully");
    } catch (error) {
      toast.error("Failed to update option");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (id: string, value: string) => {
    setEditingId(id);
    setEditValue(value);
  };

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
            onKeyPress={(e) => e.key === "Enter" && handleAddOption()}
            disabled={isSubmitting}
          />
          <Button
            onClick={handleAddOption}
            size="sm"
            className="gap-2 bg-orange-500 hover:bg-orange-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Add
          </Button>
        </div>

        {/* Options List */}
        <div className="space-y-2">
          {loading ? (
            <ListSkeleton items={4} />
          ) : options.length === 0 ? (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400">
              No options added yet
            </div>
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
                      disabled={isSubmitting}
                    />
                    <Button
                      onClick={() => handleSaveEdit(option.id)}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      size="sm"
                      variant="outline"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <Badge variant="outline" className="text-sm">
                      {option.label}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startEdit(option.id, option.label)}
                        size="sm"
                        variant="ghost"
                        className="text-slate-600 hover:text-slate-900 dark:text-white"
                        disabled={isSubmitting}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteOption(option.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-900 dark:text-white"
                        disabled={isSubmitting}
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
  );
}
