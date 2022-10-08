const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
]

// Authorization token. Used to authenticate the user.
let token = null

beforeEach(async () => {
  await Blog.deleteMany({})

  const user = (await User.find({}))[0]

  const userTokenObj = {
    username: user.username,
    id: user._id,
  }

  // Expires in 1 hour
  const jwtToken = jwt.sign(userTokenObj, process.env.SECRET, {
    expiresIn: 60 * 60,
  })

  token = `bearer ${jwtToken}`

  for (const blogObj of initialBlogs) {
    blogObj.user = user._id.toString()
    const blog = new Blog(blogObj)
    await blog.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .set('Authorization', token)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('return 401 unauthorized when no token is provided', async () => {
  await api.get('/api/blogs').expect(401)
})

test('right amount of blogs are returned', async () => {
  const response = await api.get('/api/blogs').set('Authorization', token)

  expect(response.body).toHaveLength(6)
})

test('blog has id field', async () => {
  const response = await api.get('/api/blogs').set('Authorization', token)

  expect(response.body[0].id).toBeDefined()
})

test('new blogs can be added', async () => {
  await api
    .post('/api/blogs')
    .send({
      title: 'Kummeli',
      author: 'EsimerkkiAuthor',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 69,
    })
    .set('Authorization', token)

  const response = await api.get('/api/blogs').set('Authorization', token)

  expect(response.body).toHaveLength(7)
})

test('if like not defined 0 is used', async () => {
  await api
    .post('/api/blogs')
    .send({
      title: 'Kummeli2',
      author: 'EsimerkkiAuthor2',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    })
    .set('Authorization', token)

  const response = await api.get('/api/blogs').set('Authorization', token)

  expect(response.body[response.body.length - 1].likes).toBe(0)
})

test('status 400 when no title or url', async () => {
  await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send({
      author: 'EsimerkkiAuthor2',
      likes: 2,
    })
    .expect(400)
})

test('blog can be deleted', async () => {
  const response = await api.get('/api/blogs').set('Authorization', token)

  expect(response.body).toHaveLength(6)

  await api
    .delete(`/api/blogs/${response.body[0].id}`)
    .set('Authorization', token)
    .expect(204)

  const blogsAfterDelete = await api
    .get('/api/blogs')
    .set('Authorization', token)
  expect(blogsAfterDelete.body).toHaveLength(5)
})

test('404 when blog not found when deleting', async () => {
  const response = await api.get('/api/blogs').set('Authorization', token)
  await api
    .delete(`/api/blogs/${response.body[0].id}`)
    .set('Authorization', token)
    .expect(204)

  // Delete again here
  await api
    .delete(`/api/blogs/${response.body[0].id}`)
    .set('Authorization', token)
    .expect(404)
})

test('blog can be updated', async () => {
  const response = await api.get('/api/blogs').set('Authorization', token)

  const updatedBlog = {
    title: 'UpdatedBlog',
    author: 'Updater',
    url: 'url',
    likes: 0,
  }

  await api
    .put(`/api/blogs/${response.body[response.body.length - 1].id}`)
    .set('Authorization', token)
    .send(updatedBlog)
    .expect(204)

  const blogsAfterUpdate = await api
    .get('/api/blogs')
    .set('Authorization', token)

  expect(blogsAfterUpdate.body[blogsAfterUpdate.body.length - 1].title).toBe(
    'UpdatedBlog'
  )
})

test('400 when missing likes when updating', async () => {
  const response = await api.get('/api/blogs').set('Authorization', token)

  const updatedBlog = {
    title: 'UpdatedBlog',
    author: 'Updater',
    url: 'url',
  }

  await api
    .put(`/api/blogs/${response.body[response.body.length - 1].id}`)
    .set('Authorization', token)
    .send(updatedBlog)
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})
