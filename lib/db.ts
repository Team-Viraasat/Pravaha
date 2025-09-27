interface User {
  id: number
  username: string
  password: string
  role: "admin" | "user"
}

interface Post {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
  slug: string
  content: string
  upvotes: number
  downvotes: number
  authorId?: number // associate post with creator
}

interface Vote {
  id: number
  userId: number
  postId: string
  type: "upvote" | "downvote"
}

interface Comment {
  id: string
  postId: string
  name: string
  email?: string
  content: string
  timestamp: string
}

const users: User[] = [{ id: 1, username: "admin", password: "password", role: "admin" }]

const posts: Post[] = [
  {
    id: "1",
    title: "Building Modern Web Applications with Next.js",
    excerpt:
      "Explore the latest features and best practices for creating scalable web applications using Next.js 14 and React Server Components.",
    category: "Development",
    author: "Sarah Chen",
    date: "Dec 15, 2024",
    readTime: "8 min read",
    slug: "building-modern-web-apps-nextjs",
    upvotes: 12,
    downvotes: 2,
    content: `# Building Modern Web Applications with Next.js

Next.js has revolutionized the way we build React applications. With the introduction of the App Router and React Server Components, developers now have powerful tools to create fast, scalable web applications.

## Key Features

- **App Router**: A new paradigm for routing in Next.js
- **Server Components**: Render components on the server for better performance
- **Streaming**: Progressive loading of UI components
- **Built-in Optimizations**: Image optimization, font loading, and more

## Getting Started

To create a new Next.js application:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

This will set up a new Next.js project with all the latest features enabled by default.`,
  },
  {
    id: "2",
    title: "The Future of AI in Web Development",
    excerpt:
      "How artificial intelligence is transforming the way we build, test, and deploy web applications in 2024 and beyond.",
    category: "AI & Tech",
    author: "Marcus Johnson",
    date: "Dec 12, 2024",
    readTime: "6 min read",
    slug: "future-ai-web-development",
    upvotes: 8,
    downvotes: 1,
    content: `# The Future of AI in Web Development

Artificial Intelligence is no longer a futuristic concept—it's actively reshaping how we approach web development today. From code generation to automated testing, AI tools are becoming indispensable for modern developers.

## AI-Powered Development Tools

- **Code Generation**: Tools like GitHub Copilot and v0 help generate code snippets and entire components
- **Automated Testing**: AI can generate test cases and identify potential bugs
- **Performance Optimization**: Machine learning algorithms optimize bundle sizes and loading times
- **Accessibility**: AI tools help ensure web applications are accessible to all users

## The Impact on Developers

While AI won't replace developers, it's changing how we work. Developers who embrace AI tools are becoming more productive and can focus on higher-level problem-solving rather than repetitive coding tasks.`,
  },
  {
    id: "3",
    title: "Mastering CSS Grid and Flexbox",
    excerpt: "A comprehensive guide to modern CSS layout techniques that every frontend developer should know.",
    category: "CSS",
    author: "Elena Rodriguez",
    date: "Dec 10, 2024",
    readTime: "12 min read",
    slug: "mastering-css-grid-flexbox",
    upvotes: 15,
    downvotes: 0,
    content: `# Mastering CSS Grid and Flexbox

CSS Grid and Flexbox are two powerful layout systems that have transformed how we create responsive web designs. Understanding when and how to use each one is crucial for modern web development.

## CSS Flexbox

Flexbox is perfect for one-dimensional layouts:

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## CSS Grid

Grid excels at two-dimensional layouts:

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
\`\`\`

## When to Use Which

- **Flexbox**: Navigation bars, centering content, distributing space
- **Grid**: Complex layouts, card grids, magazine-style designs

Both can work together in the same design for maximum flexibility.`,
  },
]

const votes: Vote[] = []
const comments: Comment[] = []

export const db = {
  getUsers: () => users,
  addUser: (username: string, password: string, role: "admin" | "user" = "user") => {
    const newUser = { id: users.length + 1, username, password, role }
    users.push(newUser)
    return newUser
  },
  findUser: (username: string, password: string) =>
    users.find((u) => u.username === username && u.password === password),
  userExists: (username: string) => users.some((u) => u.username === username),

  getPosts: () => posts,
  addPost: (title: string, content: string, author: string, excerpt?: string, category?: string, authorId?: number) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    const newPost: Post = {
      id: (posts.length + 1).toString(),
      title,
      excerpt: excerpt || content.substring(0, 150) + "...",
      category: category || "General",
      author,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      readTime: Math.ceil(content.split(" ").length / 200) + " min read",
      slug,
      content,
      upvotes: 0,
      downvotes: 0,
      authorId, // persist authorId
    }
    posts.push(newPost)
    return newPost
  },
  getPostBySlug: (slug: string) => posts.find((post) => post.slug === slug),
  getPostById: (id: string) => posts.find((post) => post.id === id), // fetch by id
  votePost: (userId: number, postId: string, voteType: "upvote" | "downvote") => {
    // Remove existing vote by this user for this post
    const existingVoteIndex = votes.findIndex((v) => v.userId === userId && v.postId === postId)
    if (existingVoteIndex !== -1) {
      const existingVote = votes[existingVoteIndex]
      const post = posts.find((p) => p.id === postId)
      if (post) {
        // Remove the old vote count
        if (existingVote.type === "upvote") {
          post.upvotes--
        } else {
          post.downvotes--
        }
      }
      votes.splice(existingVoteIndex, 1)
    }

    // Add new vote
    const newVote: Vote = {
      id: votes.length + 1,
      userId,
      postId,
      type: voteType,
    }
    votes.push(newVote)

    // Update post vote count
    const post = posts.find((p) => p.id === postId)
    if (post) {
      if (voteType === "upvote") {
        post.upvotes++
      } else {
        post.downvotes++
      }
    }

    return post
  },
  getUserVote: (userId: number, postId: string) => {
    return votes.find((v) => v.userId === userId && v.postId === postId)
  },
  getCommentsByPostId: (postId: string) => comments.filter((c) => c.postId === postId),
  addComment: (postId: string, name: string, email: string | undefined, content: string) => {
    const newComment: Comment = {
      id: (comments.length + 1).toString(),
      postId,
      name,
      email,
      content,
      timestamp: new Date().toISOString(),
    }
    comments.unshift(newComment)
    return newComment
  },
}
