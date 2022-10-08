const User = require('../models/user')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const likes = blogs.map((blog) => blog.likes)
  const max = Math.max(...likes)
  const favorite = blogs.find((blog) => blog.likes === max)
  return favorite || null
}

const mostBlogs = (blogs) => {
  const authors = blogs.map((blog) => blog.author)
  const uniqueAuthors = [...new Set(authors)]

  let mostBlogsAuthor
  uniqueAuthors.forEach((name) => {
    const authorBlogs = authors.filter(
      (authorName) => authorName === name
    ).length

    if (!mostBlogsAuthor) {
      mostBlogsAuthor = {
        author: name,
        blogs: authorBlogs,
      }
    } else {
      if (mostBlogsAuthor.blogs < authorBlogs) {
        mostBlogsAuthor = {
          author: name,
          blogs: authorBlogs,
        }
      }
    }
  })

  return mostBlogsAuthor || null
}

const mostLikes = (blogs) => {
  const authors = blogs.map((blog) => blog.author)
  const uniqueAuthors = [...new Set(authors)]

  let mostLikedAuthor
  uniqueAuthors.forEach((authorName) => {
    const likes = blogs
      .filter((blog) => blog.author === authorName)
      .reduce((sum, blog) => sum + blog.likes, 0)

    if (!mostLikedAuthor) {
      mostLikedAuthor = {
        author: authorName,
        likes,
      }
    } else {
      if (mostLikedAuthor.likes < likes) {
        mostLikedAuthor = {
          author: authorName,
          likes,
        }
      }
    }
  })

  return mostLikedAuthor || null
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  usersInDb,
}
