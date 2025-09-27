interface User {
  id: number
  username: string
  password: string
}

interface Post {
  id: number
  title: string
  content: string
  author: string
  date: string
}

let users: User[] = [
  { id: 1, username: "admin", password: "password" },
]

let posts: Post[] = [
  {
    id: 1,
    title: "Getting Started with BlogSpace",
    content: "This is your first post on BlogSpace! You can add more after logging in.",
    author: "System",
    date: new Date().toLocaleDateString(),
  },
]

export const db = {
  getUsers: () => users,
  addUser: (username: string, password: string) => {
    const newUser = { id: users.length + 1, username, password }
    users.push(newUser)
    return newUser
  },
  findUser: (username: string, password: string) =>
    users.find((u) => u.username === username && u.password === password),

  getPosts: () => posts,
  addPost: (title: string, content: string, author: string) => {
    const newPost = {
      id: posts.length + 1,
      title,
      content,
      author,
      date: new Date().toLocaleDateString(),
    }
    posts.push(newPost)
    return newPost
  },
}
