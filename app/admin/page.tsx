"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminPostsList } from "@/components/admin-posts-list"
import { CategoryManager } from "@/components/category-manager"
import { Button } from "@/components/ui/button"
import { Plus, BarChart3, Users, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("posts")

  const handleNewPost = () => {
    router.push("/admin/editor")
  }

  const stats = [
    {
      title: "Total Posts",
      value: "24",
      icon: FileText,
      change: "+3 this week",
    },
    {
      title: "Total Views",
      value: "12.5K",
      icon: BarChart3,
      change: "+18% this month",
    },
    {
      title: "Comments",
      value: "89",
      icon: Users,
      change: "+12 today",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {activeTab === "posts" && "Dashboard"}
                {activeTab === "categories" && "Category Management"}
                {activeTab === "settings" && "Settings"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {activeTab === "posts" && "Manage your blog content and settings"}
                {activeTab === "categories" && "Organize your content with categories"}
                {activeTab === "settings" && "Configure your blog settings"}
              </p>
            </div>
            {activeTab === "posts" && (
              <Button onClick={handleNewPost} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            )}
          </div>

          {activeTab === "posts" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat) => (
                  <div key={stat.title} className="glass-card rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                        <p className="text-xs text-primary mt-1">{stat.change}</p>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Posts List */}
              <AdminPostsList />
            </>
          )}

          {activeTab === "categories" && <CategoryManager />}

          {activeTab === "settings" && (
            <div className="glass-card rounded-xl p-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Settings</h2>
              <p className="text-muted-foreground">Settings panel coming soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
