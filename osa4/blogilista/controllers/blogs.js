const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const validateId = (id) => {
  return id.match(/^[0-9a-fA-F]{24}$/)
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return response.status(200).json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body

  const user = request.user

  if (!title || !url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const blogObj = {
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  }

  const blog = new Blog(blogObj)

  const newBlog = await blog.save()

  // Add blog to user
  user.blogs = user.blogs.concat(newBlog._id)
  await user.save()

  return response.status(201).json(newBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  // Validate id
  if (!validateId(id)) {
    return response.status(400).json({ error: 'invalid id' })
  }

  const user = request.user
  const blogToDelete = await Blog.findById(id)

  if (!blogToDelete || !user) {
    return response.status(404).json({ error: 'blog not found' }).end()
  }

  if (blogToDelete.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'unauthorized' })
  }

  const deleted = await Blog.findOneAndRemove({ _id: id })
  if (!deleted) {
    return response.status(404).json({ error: 'blog not found' }).end()
  }

  // Remove blog from user
  user.blogs = user.blogs.filter((blogObj) => blogObj.toString() !== id)
  await user.save()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  // Am I blind or you didn't need to fix this endpoint?

  const { title, author, url, likes } = request.body

  const { id } = request.params

  if (likes === undefined) {
    return response.status(400).end()
  }

  // Validate id
  if (!validateId(id)) {
    return response.status(400).json({ error: 'invalid id' })
  }

  const blogObj = {
    title,
    author,
    url,
    likes: likes || 0,
  }

  const newBlog = await Blog.findByIdAndUpdate(id, blogObj, { new: true })

  return response.status(204).json(newBlog)
})
module.exports = blogsRouter
