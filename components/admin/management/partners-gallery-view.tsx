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
} from "@/components/ui/dialog";
import { Trash2, Plus, Edit2, Loader2, ZoomIn, ZoomOut, X } from "lucide-react";
import { usePartners, usePartnerMutations } from "@/hooks/use-convex-partners";
import { CardSkeleton } from "./table-skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

export function PartnersGalleryView() {
  const { partners, isLoading: loading } = usePartners(false);
  const { create: addPartnerMutation, update: updatePartnerMutation, delete: deletePartnerMutation } = usePartnerMutations();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>(null);
  const [newPartner, setNewPartner] = useState({ name: "", icon: "", image: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [zoom, setZoom] = useState(1);

  const handleAddPartner = async () => {
    if (!newPartner.name || (!newPartner.icon && !newPartner.image)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addPartnerMutation({
        name: newPartner.name,
        icon: newPartner.icon || undefined,
        image: newPartner.image || undefined,
      });
      setNewPartner({ name: "", icon: "", image: "" });
      setIsAddDialogOpen(false);
      toast.success("Partner added successfully");
    } catch (error) {
      toast.error("Failed to add partner");
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
      await updatePartnerMutation(editingPartner._id as Id<"partners">, {
        name: editingPartner.name,
        icon: editingPartner.icon || undefined,
        image: editingPartner.image || undefined,
      });
      setIsEditDialogOpen(false);
      setEditingPartner(null);
      toast.success("Partner updated successfully");
    } catch (error) {
      toast.error("Failed to update partner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePartner = async (id: Id<"partners">) => {
    if (confirm("Are you sure you want to delete this partner?")) {
      try {
        await deletePartnerMutation(id);
        toast.success("Partner deleted successfully");
      } catch (error) {
        toast.error("Failed to delete partner");
      }
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {partners.map((partner) => (
              <div
                key={partner._id}
                className="relative group border border-slate-700 rounded-lg p-4 bg-gray-50 dark:bg-background hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedImage(partner)}
              >
                {/* Image Container */}
                <div className="w-full h-32 bg-white rounded-md flex items-center justify-center mb-3 overflow-hidden">
                  {partner.image ? (
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-5xl">{partner.icon}</div>
                  )}
                </div>

                {/* Partner Name */}
                <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                  {partner.name}
                </p>
                <p className="text-xs text-slate-500 mb-3">Order: {partner.order}</p>

                {/* Action Buttons */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <Dialog open={isEditDialogOpen && editingPartner?._id === partner._id} onOpenChange={(open) => {
                    if (!open) {
                      setEditingPartner(null);
                    }
                    setIsEditDialogOpen(open);
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPartner(partner);
                        }}
                      >
                        <Edit2 className="w-3 h-3" />
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
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePartner(partner._id);
                    }}
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Image Zoom Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-white dark:bg-slate-900">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {selectedImage.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedImage(null);
                  setZoom(1);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 flex flex-col items-center gap-4">
              {/* Image Display */}
              <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center overflow-auto max-h-96">
                {selectedImage.image ? (
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.name}
                    style={{ transform: `scale(${zoom})` }}
                    className="transition-transform duration-200 object-contain"
                  />
                ) : (
                  <div style={{ fontSize: `${5 * zoom}rem` }}>
                    {selectedImage.icon}
                  </div>
                )}
              </div>

              {/* Zoom Controls */}
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(3, zoom + 0.2))}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(1)}
                >
                  Reset
                </Button>
              </div>

              {/* Partner Info */}
              <div className="w-full text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <p><strong>Name:</strong> {selectedImage.name}</p>
                <p><strong>Order:</strong> {selectedImage.order}</p>
                {selectedImage.image && (
                  <p><strong>Image URL:</strong> <span className="break-all text-xs">{selectedImage.image}</span></p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

