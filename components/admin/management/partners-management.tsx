"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Trash2, Plus, Edit2, Loader2 } from "lucide-react";
import { usePartners } from "@/hooks/use-partners";
import { CardSkeleton } from "./table-skeleton";

export function PartnersManagement() {
  const { partners, loading, addPartner, updatePartner, deletePartner } =
    usePartners();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>(null);
  const [deletingPartner, setDeletingPartner] = useState<any>(null);
  const [newPartner, setNewPartner] = useState({ name: "", icon: "", image: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddPartner = async () => {
    if (!newPartner.name || (!newPartner.icon && !newPartner.image)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addPartner(newPartner.name, newPartner.icon, newPartner.image);
      setNewPartner({ name: "", icon: "", image: "" });
      setIsAddDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePartner = async () => {
    if (!editingPartner.name || (!editingPartner.icon && !editingPartner.image)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updatePartner(editingPartner.id, {
        name: editingPartner.name,
        icon: editingPartner.icon,
        image: editingPartner.image,
      });
      setIsEditDialogOpen(false);
      setEditingPartner(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePartner = async () => {
    if (!deletingPartner) return;
    
    setIsSubmitting(true);
    try {
      await deletePartner(deletingPartner.id);
      setIsDeleteDialogOpen(false);
      setDeletingPartner(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <CardSkeleton />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Partners & Accreditations</CardTitle>
          <CardDescription>
            Manage partner logos and accreditations displayed on the homepage
          </CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4" />
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Partner</DialogTitle>
              <DialogDescription>
                Add a new partner or accreditation to display on the homepage
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="partner-name">Partner Name</Label>
                <Input
                  id="partner-name"
                  placeholder="e.g., JCTRANS, DP World"
                  value={newPartner.name}
                  onChange={(e) =>
                    setNewPartner({ ...newPartner, name: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="partner-icon">Icon (Emoji) - Optional</Label>
                <Input
                  id="partner-icon"
                  placeholder="e.g., 🚚, ✈️, 📦"
                  value={newPartner.icon}
                  onChange={(e) =>
                    setNewPartner({ ...newPartner, icon: e.target.value })
                  }
                  className="mt-2"
                  maxLength={2}
                />
              </div>
              <div>
                <Label htmlFor="partner-image">Image URL - Optional</Label>
                <Input
                  id="partner-image"
                  placeholder="e.g., https://example.com/logo.png"
                  value={newPartner.image}
                  onChange={(e) =>
                    setNewPartner({ ...newPartner, image: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
              <Button
                onClick={handleAddPartner}
                disabled={isSubmitting || !newPartner.name || (!newPartner.icon && !newPartner.image)}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Partner"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {partners.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No partners added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  {partner.image ? (
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <div className="text-4xl">{partner.icon}</div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {partner.name}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isEditDialogOpen && editingPartner?.id === partner.id} onOpenChange={(open) => {
                    if (!open) {
                      setEditingPartner(null);
                    }
                    setIsEditDialogOpen(open);
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPartner(partner)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Partner</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="edit-name">Partner Name</Label>
                          <Input
                            id="edit-name"
                            value={editingPartner?.name || ""}
                            onChange={(e) =>
                              setEditingPartner({
                                ...editingPartner,
                                name: e.target.value,
                              })
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-icon">Icon (Emoji) - Optional</Label>
                          <Input
                            id="edit-icon"
                            value={editingPartner?.icon || ""}
                            onChange={(e) =>
                              setEditingPartner({
                                ...editingPartner,
                                icon: e.target.value,
                              })
                            }
                            className="mt-2"
                            maxLength={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-image">Image URL - Optional</Label>
                          <Input
                            id="edit-image"
                            value={editingPartner?.image || ""}
                            onChange={(e) =>
                              setEditingPartner({
                                ...editingPartner,
                                image: e.target.value,
                              })
                            }
                            className="mt-2"
                            placeholder="https://example.com/logo.png"
                          />
                        </div>
                        <Button
                          onClick={handleUpdatePartner}
                          disabled={isSubmitting}
                          className="w-full bg-orange-600 hover:bg-orange-700"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            "Update Partner"
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDeletingPartner(partner);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setDeletingPartner(null);
        }
        setIsDeleteDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Partner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingPartner?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeletePartner}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

