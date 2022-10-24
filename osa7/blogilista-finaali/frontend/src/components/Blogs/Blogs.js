import { useEffect, useState } from 'react'
import blogService from '../../services/blogs'
import { BlogForm } from './BlogForm/BlogForm'
import BlogItem from './BlogItem/BlogItem'

const Blogs = ({ handleNotification }) => {
  const [blogs, setBlogs] = useState([])
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
  }, [])

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

  return (
    <div>
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
            <BlogItem
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

export default Blogs
