import axios from 'axios'
import { useEffect, useState } from 'react'

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])
  const [token, setToken] = useState(null)

  useEffect(() => {
    const initial = async () => {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        setToken(user.token)
      }

      if (!token) return
      try {
        const config = { headers: { Authorization: `bearer ${token}` } }
        const request = axios.get(baseUrl, config)
        const response = await request
        setResources(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    initial()
  }, [baseUrl, token])

  const create = async (newObject) => {
    const config = { headers: { Authorization: `bearer ${token}` } }
    const response = await axios.post(baseUrl, newObject, config)
    setResources(resources.concat(response.data))
    return response.data
  }

  const update = async (id, newObject) => {
    const config = { headers: { Authorization: `bearer ${token}` } }
    const request = axios.put(`${baseUrl}/${id}`, newObject, config)
    const response = await request

    setResources(
      resources.map((resource) =>
        resource.id !== id ? resource : response.data
      )
    )
    return response.data
  }

  const remove = async (id) => {
    const config = { headers: { Authorization: `bearer ${token}` } }
    const request = axios.delete(`${baseUrl}/${id}`, config)
    const response = await request
    setResources(resources.filter((resource) => resource.id !== id))
    return response.data
  }

  return { resources, create, update, remove }
}
