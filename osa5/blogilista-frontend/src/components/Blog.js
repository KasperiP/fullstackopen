import PropTypes from 'prop-types'
import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    padding: 5,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    marginTop: 10,
  }

  const likeBlog = (event) => {
    event.preventDefault()
    handleLike(blog)
  }

  const deleteBlog = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      handleDelete(blog)
    }
  }

  const isOwner = () => {
    return (
      blog.user.username ===
      JSON.parse(window.localStorage.getItem('loggedBlogappUser'))?.username
    )
  }

  return (
    <div style={blogStyle}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <p>{blog.title}</p>
        <p>{blog.author}</p>
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes} <button onClick={likeBlog}>like</button>
          </p>
          <p>{blog.user.username}</p>
          {isOwner() && <button onClick={deleteBlog}>remove</button>}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
}

export default Blog
