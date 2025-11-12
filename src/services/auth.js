import useApi from 'src/composables/UseApi'

export default function authService () {
  const { login } = useApi('auth')

  return {
    login
  }
}
