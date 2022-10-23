import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { BlogForm } from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const handleSubmit = jest.fn()

  render(<BlogForm handleBlogSubmit={handleSubmit} />)

  // Fill in form
  const title = screen.getByLabelText('title')
  await user.type(title, 'test_title')
  const author = screen.getByLabelText('author')
  await user.type(author, 'test_author')
  const url = screen.getByLabelText('url')
  await user.type(url, 'test_url')

  const submitBtn = screen.getByText('create')
  await user.click(submitBtn)

  expect(handleSubmit.mock.calls).toHaveLength(1)
  expect(handleSubmit.mock.calls[0][0].title).toBe('test_title')
  expect(handleSubmit.mock.calls[0][0].author).toBe('test_author')
  expect(handleSubmit.mock.calls[0][0].url).toBe('test_url')
})
