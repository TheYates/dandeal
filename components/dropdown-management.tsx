"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Trash2, Edit2, Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { useDropdownOptions } from "@/hooks/use-dropdown-options";

interface DropdownManagementProps {
  title: string;
  description: string;
  type: "services" | "shipping_methods" | "cargo_types";
}

const ITEMS_PER_PAGE = 10;

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
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");

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
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error("Failed to delete option");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteConfirm = (id: string, name: string) => {
    setDeleteConfirmId(id);
    setDeleteConfirmName(name);
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

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOptions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOptions = filteredOptions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
            onKeyDown={(e) => e.key === "Enter" && handleAddOption()}
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

        {/* Search Filter */}
        {options.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search options..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
              disabled={loading}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Options List */}
        <div className="space-y-1">
          {loading ? (
            <div className="text-center py-3">
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-orange-600" />
            </div>
          ) : options.length === 0 ? (
            <div className="text-center py-3 text-sm text-slate-500 dark:text-slate-400">
              No options added yet
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="text-center py-3 text-sm text-slate-500 dark:text-slate-400">
              No options match your search
            </div>
          ) : (
            paginatedOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded border border-slate-200 dark:bg-background hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                {editingId === option.id ? (
                  <div className="flex gap-1 flex-1">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 h-8 text-sm"
                      autoFocus
                      disabled={isSubmitting}
                    />
                    <Button
                      onClick={() => handleSaveEdit(option.id)}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 h-7 px-2 text-xs"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                      {option.label}
                    </span>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        onClick={() => startEdit(option.id, option.label)}
                        size="icon-sm"
                        variant="ghost"
                        className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        disabled={isSubmitting}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        onClick={() => openDeleteConfirm(option.id, option.label)}
                        size="icon-sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredOptions.length > ITEMS_PER_PAGE && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(totalPages, prev + 1)
                      )
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteConfirmId !== null}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Option</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deleteConfirmName}"? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel
                onClick={() => setDeleteConfirmId(null)}
                disabled={isSubmitting}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  deleteConfirmId && handleDeleteOption(deleteConfirmId)
                }
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
