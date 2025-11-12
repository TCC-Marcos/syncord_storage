<template>
  <div class="container">
    <div class="row justify-center form-row">
      <div class="col-3 q-pa-md q-mx-lg-lg form-login">
        <strong class="q-ml-x q-mb-md text-h5">Acesse sua conta</strong>

        <q-form @submit="onSubmit" class="q-pt-md q-gutter-md">
          <q-input class="q-mt-md" outlined v-model="email" label="Usuário"/>
          <q-input class="q-mt-md" outlined v-model="senha"
                   :type="isPwd ? 'password' : 'text'">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer" @click="isPwd = !isPwd"/>
            </template>
          </q-input>
          <div class="cursor-pointer q-my-xs text-weight-light">Esqueceu a senha?</div>

          <div class="row q-gutter-xs justify-end">
            <q-btn label="Entrar" class="q-mt-lg" type="submit"
                   style="background-color: #0597F2; color: #F2F2F2"/>
            <q-btn label="Criar conta" class="q-mt-lg" :to="{name: 'singUp'}"
                   style="background-color: #fff; color: #000"/>
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import authService from 'src/services/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const senha = ref('')
const isPwd = ref(true)

const { login: loginApi } = authService() // sua função que chama o backend

const fazerLogin = async () => {
  try {
    const dadosLogin = { email: email.value, senha: senha.value }
    const res = await loginApi(dadosLogin) // { accessToken, refreshToken }

    // Salva tokens e marca como logado
    authStore.login(res)

    // Redireciona para home
    router.push({ name: 'home' })
  } catch (error) {
    console.log(error)
  }
}

const onSubmit = async () => {
  await fazerLogin()
}
</script>

<style lang="sass" scoped>
.container
  display: flex
  justify-content: center
  align-items: center
  height: 80vh

.form-login
  background-color: #F2F2F2
  border-radius: 0.5em

.form-row
  width: 100%
  @media (min-width: 1920px)
    width: 80%
</style>
