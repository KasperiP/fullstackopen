import { useState } from 'react'
import { useResource } from '../../hooks/useResource'
import { BlogForm } from './BlogForm/BlogForm'
import BlogItem from './BlogItem/BlogItem'

const Blogs = ({ handleNotification }) => {
  const [visible, setVisible] = useState(false)
  const blogService = useResource('/api/blogs')

  const handleBlogSubmit = async (blogObj) => {
    try {
      const response = await blogService.create(blogObj)
      handleNotification([
        `a new blog ${response.title} by ${response.author} added`,
        'success',
      ])
      setVisible(false)
    } catch (error) {
      console.log(error)
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
        {blogService.resources
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
