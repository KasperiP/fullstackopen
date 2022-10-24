import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const config = { headers: { Authorization: token } }
  const request = axios.get(baseUrl, config)
  const response = await request
  return response.data
}

const create = async (newObject) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const config = { headers: { Authorization: token } }
  const request = axios.put(`${baseUrl}/${id}`, newObject, config)
  const response = await request
  return response.data
}

const remove = async (id) => {
  const config = { headers: { Authorization: token } }
  const request = axios.delete(`${baseUrl}/${id}`, config)
  const response = await request
  return response.data
}

export default { getAll, create, update, setToken, remove }
