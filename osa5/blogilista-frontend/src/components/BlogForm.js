import PropTypes from 'prop-types'
import { useState } from 'react'

export const BlogForm = ({ handleBlogSubmit }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const submit = (event) => {
    event.preventDefault()
    handleBlogSubmit({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    })
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          title{' '}
          <input
            value={blogTitle}
            onChange={({ target }) => setBlogTitle(target.value)}
            name="blogTitle"
          />
        </div>
        <div>
          author{' '}
          <input
            value={blogAuthor}
            onChange={({ target }) => setBlogAuthor(target.value)}
            name="blogAuthor"
          />
        </div>
        <div>
          url{' '}
          <input
            value={blogUrl}
            onChange={({ target }) => setBlogUrl(target.value)}
            name="blogUrl"
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  handleBlogSubmit: PropTypes.func.isRequired,
}
