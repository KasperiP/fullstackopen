import { useEffect, useState } from 'react'
import './app.css'
import Blog from './components/Blog'
import { BlogForm } from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  if (type === 'error') {
    return (
      <div
        style={{
          color: 'red',
          background: 'pink',
          padding: '10px',
        }}
      >
        {message}
      </div>
    )
  }

  if (type === 'success') {
    return (
      <div
        style={{
          color: 'green',
          background: 'lightgreen',
          padding: '10px',
        }}
      >
        {message}
      </div>
    )
  }
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState([null, null])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [visible, setVisible] = useState(false)

  const handleNotification = ([message, type]) => {
    setNotification([message, type])
    setTimeout(() => {
      setNotification([null, null])
    }, 5000)
  }

  useEffect(() => {
    const initial = async () => {
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      } catch (error) {
        console.log(error?.response?.data?.error)
      }
    }
    initial()
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      handleNotification(['Wrong credentials', 'error'])
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleBlogSubmit = async (blogObj) => {
    try {
      const response = await blogService.create(blogObj)
      setBlogs([...blogs, response])
      handleNotification([
        `a new blog ${response.title} by ${response.author} added`,
        'success',
      ])
      setVisible(false)
    } catch (exception) {
      console.log(exception)
      handleNotification(['Blog creation failed', 'error'])
    }
  }

  const handleLike = async (blog) => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
      }

      const updatedBlogCopy = {
        ...updatedBlog,
      }

      delete updatedBlogCopy.user

      await blogService.update(blog.id, updatedBlogCopy)

      setBlogs(blogs.map((b) => (b.id !== blog.id ? b : updatedBlog)))

      handleNotification([
        `blog ${updatedBlog.title} by ${updatedBlog.author} liked`,
        'success',
      ])
    } catch (error) {
      console.log(error)
      handleNotification(['Blog like failed', 'error'])
    }
  }

  const handleDelete = async (blog) => {
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      handleNotification([
        `blog ${blog.title} by ${blog.author} deleted`,
        'success',
      ])
    } catch (error) {
      console.log(error)
      handleNotification(['Blog delete failed', 'error'])
    }
  }

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification[0]} type={'error'} />
        <form onSubmit={handleLogin}>
          <div>
            Username{' '}
            <input
              type="text"
              id="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            Password{' '}
            <input
              type="password"
              id="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit" id="loginBtn">
            login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification[0]} type={notification[1]} />
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>

      {visible ? (
        <>
          <BlogForm handleBlogSubmit={handleBlogSubmit} />
          <button onClick={() => setVisible(false)}>cancel</button>
        </>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => setVisible(true)}>new blog</button>
        </div>
      )}

      <ul className="blog">
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={handleLike}
              handleDelete={handleDelete}
            />
          ))}
      </ul>
    </div>
  )
}

export default App
