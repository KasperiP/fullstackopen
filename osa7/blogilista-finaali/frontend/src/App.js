import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './app.css'
import Blogs from './components/Blogs/Blogs'
import Notification from './components/Notification/Notification'
import UsersList from './components/Users/UsersList/UsersList'
import ViewUser from './components/Users/ViewUser/ViewUser'
import loginService from './services/login'

const App = () => {
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState([null, null])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleNotification = ([message, type]) => {
    setNotification([message, type])
    setTimeout(() => {
      setNotification([null, null])
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      handleNotification(['Wrong credentials', 'error'])
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification[0]} type={'error'} />
        <form onSubmit={handleLogin}>
          <div>
            Username{' '}
            <input
              type="text"
              id="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            Password{' '}
            <input
              type="password"
              id="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit" id="loginBtn">
            login
          </button>
        </form>
      </div>
    )
  }

  return (
    <Router>
      <div>
        <h2>blogs</h2>
        <Notification message={notification[0]} type={notification[1]} />
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>logout</button>
        <Routes>
          <Route
            path="/"
            element={<Blogs handleNotification={handleNotification} />}
          />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/:id" element={<ViewUser />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
