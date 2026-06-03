import useApi from 'src/composables/UseApi'

export default function produtosService () {
  const { list, post, uploads, upload, update, remove, listById, listImages } = useApi('produto')

  return {
    list,
    post,
    uploads,
    upload,
    update,
    remove,
    listById,
    listImages
  }
}
