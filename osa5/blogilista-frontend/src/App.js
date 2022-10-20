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
  const [errMsg, setErrMsg] = useState(null)
  const [message, setMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [visible, setVisible] = useState(false)

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
      setErrMsg('wrong credentials')
      setTimeout(() => {
        setErrMsg(null)
      }, 5000)
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
      setMessage(`a new blog ${response.title} by ${response.author} added`)
      setVisible(false)
    } catch (exception) {
      setErrMsg('blog creation failed')
      setVisible(false)
      setTimeout(() => {
        setErrMsg(null)
      }, 5000)
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

      setMessage(`blog ${updatedBlog.title} by ${updatedBlog.author} liked`)
    } catch (error) {
      setErrMsg('blog like failed')
      setTimeout(() => {
        setErrMsg(null)
      }, 5000)
    }
  }

  const handleDelete = async (blog) => {
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      setMessage(`blog ${blog.title} by ${blog.author} deleted`)
    } catch (error) {
      setErrMsg('blog delete failed')
      setTimeout(() => {
        setErrMsg(null)
      }, 5000)
    }
  }

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errMsg} type={'error'} />
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
      <Notification message={errMsg} type={'error'} />
      <Notification message={message} type={'success'} />
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
