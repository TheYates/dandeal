"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Trash2, Plus, Edit2, Loader2, Star } from "lucide-react";
import { useTestimonials, Testimonial } from "@/hooks/use-testimonials";
import { TestimonialsManagementSkeleton } from "./table-skeleton";

export function TestimonialsManagement() {
  const {
    testimonials,
    loading,
    fetchTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
  } = useTestimonials();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [deletingTestimonial, setDeletingTestimonial] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    clientName: "",
    clientTitle: "",
    clientCompany: "",
    content: "",
    rating: "5",
    image: "",
  });

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleAddTestimonial = async () => {
    if (!newTestimonial.clientName || !newTestimonial.content) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addTestimonial(
        newTestimonial.clientName,
        newTestimonial.content,
        newTestimonial.clientTitle,
        newTestimonial.clientCompany,
        newTestimonial.rating,
        newTestimonial.image
      );
      setNewTestimonial({
        clientName: "",
        clientTitle: "",
        clientCompany: "",
        content: "",
        rating: "5",
        image: "",
      });
      setIsAddDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTestimonial = async () => {
    if (!editingTestimonial || !editingTestimonial.clientName || !editingTestimonial.content) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateTestimonial(editingTestimonial.id, {
        clientName: editingTestimonial.clientName,
        clientTitle: editingTestimonial.clientTitle,
        clientCompany: editingTestimonial.clientCompany,
        content: editingTestimonial.content,
        rating: editingTestimonial.rating,
        image: editingTestimonial.image,
      });
      setIsEditDialogOpen(false);
      setEditingTestimonial(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTestimonial = async () => {
    if (!deletingTestimonial) return;

    setIsSubmitting(true);
    try {
      await deleteTestimonial(deletingTestimonial.id);
      setIsDeleteDialogOpen(false);
      setDeletingTestimonial(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <TestimonialsManagementSkeleton />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Testimonials</CardTitle>
          <CardDescription>
            Manage customer testimonials displayed on the homepage
          </CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Testimonial</DialogTitle>
              <DialogDescription>
                Add a new customer testimonial to display on the homepage
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  value={newTestimonial.clientName}
                  onChange={(e) =>
                    setNewTestimonial({
                      ...newTestimonial,
                      clientName: e.target.value,
                    })
                  }
                  placeholder="e.g., John Doe"
                />
              </div>
              <div>
                <Label htmlFor="clientTitle">Client Title</Label>
                <Input
                  id="clientTitle"
                  value={newTestimonial.clientTitle}
                  onChange={(e) =>
                    setNewTestimonial({
                      ...newTestimonial,
                      clientTitle: e.target.value,
                    })
                  }
                  placeholder="e.g., CEO, Manager"
                />
              </div>
              <div>
                <Label htmlFor="clientCompany">Client Company</Label>
                <Input
                  id="clientCompany"
                  value={newTestimonial.clientCompany}
                  onChange={(e) =>
                    setNewTestimonial({
                      ...newTestimonial,
                      clientCompany: e.target.value,
                    })
                  }
                  placeholder="e.g., ABC Company"
                />
              </div>
              <div>
                <Label htmlFor="content">Testimonial Content *</Label>
                <Textarea
                  id="content"
                  value={newTestimonial.content}
                  onChange={(e) =>
                    setNewTestimonial({
                      ...newTestimonial,
                      content: e.target.value,
                    })
                  }
                  placeholder="Enter the testimonial text"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={newTestimonial.rating}
                  onChange={(e) =>
                    setNewTestimonial({
                      ...newTestimonial,
                      rating: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={newTestimonial.image}
                  onChange={(e) =>
                    setNewTestimonial({
                      ...newTestimonial,
                      image: e.target.value,
                    })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleAddTestimonial}
                disabled={isSubmitting}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Add Testimonial
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {testimonials.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No testimonials yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="border rounded-lg p-4 flex items-start justify-between gap-4 hover:bg-gray-50 dark:hover:bg-slate-900"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{testimonial.clientName}</h3>
                    {testimonial.clientTitle && (
                      <span className="text-xs text-gray-500">
                        {testimonial.clientTitle}
                      </span>
                    )}
                  </div>
                  {testimonial.clientCompany && (
                    <p className="text-xs text-gray-500">{testimonial.clientCompany}</p>
                  )}
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                    {testimonial.content}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: parseInt(testimonial.rating) }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTestimonial(testimonial)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    {editingTestimonial && (
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Testimonial</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-clientName">Client Name</Label>
                            <Input
                              id="edit-clientName"
                              value={editingTestimonial.clientName}
                              onChange={(e) =>
                                setEditingTestimonial({
                                  ...editingTestimonial,
                                  clientName: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-clientTitle">Client Title</Label>
                            <Input
                              id="edit-clientTitle"
                              value={editingTestimonial.clientTitle || ""}
                              onChange={(e) =>
                                setEditingTestimonial({
                                  ...editingTestimonial,
                                  clientTitle: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-clientCompany">Client Company</Label>
                            <Input
                              id="edit-clientCompany"
                              value={editingTestimonial.clientCompany || ""}
                              onChange={(e) =>
                                setEditingTestimonial({
                                  ...editingTestimonial,
                                  clientCompany: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-content">Testimonial Content</Label>
                            <Textarea
                              id="edit-content"
                              value={editingTestimonial.content}
                              onChange={(e) =>
                                setEditingTestimonial({
                                  ...editingTestimonial,
                                  content: e.target.value,
                                })
                              }
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-rating">Rating (1-5)</Label>
                            <Input
                              id="edit-rating"
                              type="number"
                              min="1"
                              max="5"
                              value={editingTestimonial.rating}
                              onChange={(e) =>
                                setEditingTestimonial({
                                  ...editingTestimonial,
                                  rating: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-image">Image URL</Label>
                            <Input
                              id="edit-image"
                              value={editingTestimonial.image || ""}
                              onChange={(e) =>
                                setEditingTestimonial({
                                  ...editingTestimonial,
                                  image: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button
                            onClick={handleUpdateTestimonial}
                            disabled={isSubmitting}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            {isSubmitting && (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            Update
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>

                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingTestimonial(testimonial)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Testimonial</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this testimonial? This action
                          cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                          onClick={handleDeleteTestimonial}
                          disabled={isSubmitting}
                          variant="destructive"
                        >
                          {isSubmitting && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          )}
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

