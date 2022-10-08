import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import Blog from './Blog'

const blog = {
  title: 'test_title',
  author: 'test_author',
  url: 'test_com',
  likes: 0,
  user: {
    username: 'username',
    name: 'name',
    id: 'id',
  },
}

test('renders content', () => {
  render(<Blog blog={blog} handleDelete={() => {}} handleLike={() => {}} />)

  expect(screen.getByText('test_title')).toBeDefined()
})

test('expect not collapsed by default', () => {
  render(<Blog blog={blog} handleDelete={() => {}} handleLike={() => {}} />)

  const title = screen.getByText('test_title')
  const author = screen.getByText('test_author')
  const url = screen.queryByText('test_com')
  const likes = screen.queryByText('likes 0')

  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(url).toBeNull()
  expect(likes).toBeNull()
})

test('clicking the button displays all data', async () => {
  render(<Blog blog={blog} handleDelete={() => {}} handleLike={() => {}} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const url = screen.queryByText('test_com')
  const likes = screen.queryByText('likes 0')
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
})

test('clicking button twice calls handle twice', async () => {
  const mockHandler = jest.fn()

  render(<Blog blog={blog} handleDelete={() => {}} handleLike={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  screen.debug()

  expect(mockHandler.mock.calls).toHaveLength(2)
})
