"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  postCount: number
  color: string
}

const mockCategories: Category[] = [
  { id: "1", name: "Development", postCount: 8, color: "bg-blue-500/10 text-blue-400" },
  { id: "2", name: "AI & Tech", postCount: 5, color: "bg-purple-500/10 text-purple-400" },
  { id: "3", name: "CSS", postCount: 3, color: "bg-green-500/10 text-green-400" },
  { id: "4", name: "Backend", postCount: 4, color: "bg-orange-500/10 text-orange-400" },
  { id: "5", name: "TypeScript", postCount: 6, color: "bg-cyan-500/10 text-cyan-400" },
  { id: "6", name: "UX/UI", postCount: 2, color: "bg-pink-500/10 text-pink-400" },
  { id: "7", name: "Design", postCount: 1, color: "bg-yellow-500/10 text-yellow-400" },
]

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const { toast } = useToast()

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Category name required",
        description: "Please enter a name for the new category.",
        variant: "destructive",
      })
      return
    }

    if (categories.some((cat) => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      toast({
        title: "Category already exists",
        description: "A category with this name already exists.",
        variant: "destructive",
      })
      return
    }

    const colors = [
      "bg-blue-500/10 text-blue-400",
      "bg-purple-500/10 text-purple-400",
      "bg-green-500/10 text-green-400",
      "bg-orange-500/10 text-orange-400",
      "bg-cyan-500/10 text-cyan-400",
      "bg-pink-500/10 text-pink-400",
      "bg-yellow-500/10 text-yellow-400",
      "bg-red-500/10 text-red-400",
    ]

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      postCount: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
    }

    setCategories([...categories, newCategory])
    setNewCategoryName("")

    toast({
      title: "Category created",
      description: `"${newCategory.name}" has been added to your categories.`,
    })
  }

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id)
    setEditingName(category.name)
  }

  const handleSaveEdit = () => {
    if (!editingName.trim()) {
      toast({
        title: "Category name required",
        description: "Please enter a name for the category.",
        variant: "destructive",
      })
      return
    }

    if (categories.some((cat) => cat.id !== editingId && cat.name.toLowerCase() === editingName.trim().toLowerCase())) {
      toast({
        title: "Category already exists",
        description: "A category with this name already exists.",
        variant: "destructive",
      })
      return
    }

    setCategories(categories.map((cat) => (cat.id === editingId ? { ...cat, name: editingName.trim() } : cat)))

    setEditingId(null)
    setEditingName("")

    toast({
      title: "Category updated",
      description: "The category name has been updated successfully.",
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName("")
  }

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    if (!category) return

    if (category.postCount > 0) {
      toast({
        title: "Cannot delete category",
        description: `"${category.name}" has ${category.postCount} posts. Move or delete the posts first.`,
        variant: "destructive",
      })
      return
    }

    setCategories(categories.filter((cat) => cat.id !== categoryId))

    toast({
      title: "Category deleted",
      description: `"${category.name}" has been removed from your categories.`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Add New Category */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Add New Category</h3>
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="new-category" className="sr-only">
              Category name
            </Label>
            <Input
              id="new-category"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name..."
              className="bg-input/50 border-border/50 focus:bg-input focus:border-ring"
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            />
          </div>
          <Button onClick={handleAddCategory} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Categories List */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Manage Categories</h3>
          <div className="text-sm text-muted-foreground">{categories.length} categories</div>
        </div>

        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border/30 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Badge className={`${category.color} hover:${category.color}`}>{category.name}</Badge>
                <span className="text-sm text-muted-foreground">
                  {category.postCount} {category.postCount === 1 ? "post" : "posts"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {editingId === category.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-32 h-8 text-sm bg-input/50 border-border/50 focus:bg-input focus:border-ring"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit()
                        if (e.key === "Escape") handleCancelEdit()
                      }}
                      autoFocus
                    />
                    <Button size="sm" variant="ghost" onClick={handleSaveEdit} className="h-8 w-8 p-0">
                      <Check className="h-3 w-3 text-green-400" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-8 w-8 p-0">
                      <X className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStartEdit(category)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      disabled={category.postCount > 0}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No categories yet. Create your first category above.</p>
          </div>
        )}
      </div>

      {/* Category Guidelines */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Category Guidelines</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Categories help organize your content and make it easier for readers to find related posts.</p>
          <p>• Use clear, descriptive names that reflect the content type or topic.</p>
          <p>• Categories with posts cannot be deleted until all posts are moved or removed.</p>
          <p>• Consider creating broad categories that can accommodate multiple related topics.</p>
        </div>
      </div>
    </div>
  )
}
