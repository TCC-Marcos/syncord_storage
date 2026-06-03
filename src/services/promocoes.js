import useApi from 'src/composables/UseApi'

export default function promocaoesService () {
  const { list, post, update, remove, listById } = useApi('promocao')

  return {
    list,
    post,
    update,
    remove,
    listById
  }
}
