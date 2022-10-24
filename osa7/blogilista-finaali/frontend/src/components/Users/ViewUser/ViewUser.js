import { useParams } from 'react-router-dom'
import { useResource } from '../../../hooks/useResource'

const ViewUser = () => {
  const id = useParams().id
  const usersService = useResource('/api/users')

  const user = usersService.resources.find((user) => user.id === id)

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default ViewUser
