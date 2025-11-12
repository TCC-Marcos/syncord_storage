import useApi from 'src/composables/UseApi'

export default function usuariosService () {
  const { list, post, update, remove } = useApi('usuario')

  return {
    list,
    post,
    update,
    remove
  }
}
