import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import userService from '../../services/users'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const initial = async () => {
      try {
        const users = await userService.getAll()
        setUsers(users)
      } catch (error) {
        console.log(error)
      }
    }
    initial()
  }, [])

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Users
