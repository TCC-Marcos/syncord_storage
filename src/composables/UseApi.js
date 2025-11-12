import { api } from 'src/boot/axios'

export default function useApi (url) {
  const list = async () => {
    try {
      const { data } = await api.get(url)
      console.log(data)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  const post = async (form) => {
    try {
      const { data } = await api.post(url, form)
      console.log(data)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  const uploads = async (id, files) => {
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      const { data } = await api.post(`${url}/${id}/uploads`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  const upload = async (id, file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await api.post(`${url}/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  const update = async (form) => {
    try {
      const { data } = await api.put(`${url}/${form.id}`, form)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  const remove = async (form) => {
    try {
      const { data } = await api.delete(`${url}/${form}`)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  return { list, post, uploads, upload, update, remove }
}
