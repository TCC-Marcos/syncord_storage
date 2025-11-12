<template>
  <div class="flex flex-center q-pa-xl bg-grey-2" style="min-height: 100vh;">
    <q-card class="q-pa-md shadow-4" style="width: 100%; max-width: 50%; border-radius: 16px;">
      <q-card-section>
        <div class="row justify-between q-col-gutter-md">
          <div class="col-md-12 text-h4 text-center q-mb-md">Cadastro Usuários</div>
        </div>
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          <!-- Linha 1-->
          <div class="row q-col-gutter-xs justify-center">
            <q-input
            filled
            v-model="name"
            label="Nome Completo"
            lazy-rules
            class="col-lg-6 col-xs-6"
            :rules="[ val => val && val.length > 0 || 'Campo obrigatorio' ]"
            />
            <q-input filled v-model="dataNascimento" label="Data nascimento" mask="date" lazy-rules
              class="col-lg-4 col-xs-4" :rules="[val => !!val || 'Campo obrigatorio']">
              <template v-slot:append>
                <q-icon name="event">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="dataNascimento">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Fechar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <!-- Linha 2 -->
          <div class="row q-col-gutter-xs justify-center">
            <q-input
              filled
              v-model="cpf"
              label="CPF"
              lazy-rules
              mask="###.###.###-##"
              class="col-lg-5 col-xs-5"
              :rules="[ validarCPF ]"
            />
            <q-input
              filled
              v-model="telefone"
              label="Telefone"
              mask="(##) # ####-####"
              lazy-rules
              class="col-lg-5 col-xs-5"
              :rules="[ val => val && val.length > 0 || 'Campo obrigatorio' ]"
            />
          </div>
          <!-- Linha 3 -->
          <div class="row q-col-gutter-xs justify-center">
            <q-input
              filled
              v-model="email"
              label="E-mail"
              lazy-rules
              class="col-lg-10 col-xs-10"
              :rules="[
                val => val && val.length > 0 || 'Campo obrigatorio',
                val => val.includes('@') || 'E-mail inválido',
                val => val.includes('.') || 'E-mail inválido',
              ]"
            />
          </div>
          <!-- Linha 4 -->
          <div class="row q-col-gutter-xs justify-center">
            <q-input
              filled
              v-model="senha"
              label="Senha"
              lazy-rules
              type="password"
              class="col-lg-5 col-xs-5"
              :rules="[ val => val && val.length > 0 || 'Campo obrigatorio' ]"
            />
            <q-input
              filled
              v-model="senhaConfirmacao"
              label="Confirma senha"
              lazy-rules
              type="password"
              class="col-lg-5 col-xs-5"
              :rules="[
                val => val && val.length > 0 || 'Campo obrigatorio',
                val => val === senha || 'Senhas não são iguais'

              ]"
            />
          </div>
          <!-- Botões -->
          <div class="row justify-end">
              <q-btn label="Limpar" type="reset" color="negative" flat class="q-ml-sm" />
              <q-btn label="Enviar" type="submit" color="primary"/>
            </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import usuariosService from 'src/services/usuarios'
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup () {
    const { post } = usuariosService()
    const $q = useQuasar()
    const name = ref(null)
    const dataNascimento = ref(null)
    const cpf = ref(null)
    const telefone = ref(null)
    const email = ref(null)
    const senha = ref(null)
    const senhaConfirmacao = ref(null)
    function validarCPF (val) {
      if (!val) return 'Campo obrigatório'

      const cpf = val.replace(/\D/g, '')

      if (cpf.length !== 11) return 'CPF inválido'

      if (/^(\d)\1{10}$/.test(cpf)) return 'CPF inválido'

      let soma = 0
      let resto

      for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i)
      }
      resto = (soma * 10) % 11
      if (resto === 10 || resto === 11) resto = 0
      if (resto !== parseInt(cpf.substring(9, 10))) return 'CPF inválido'

      soma = 0
      for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i)
      }
      resto = (soma * 10) % 11
      if (resto === 10 || resto === 11) resto = 0
      if (resto !== parseInt(cpf.substring(10, 11))) return 'CPF inválido'

      return true
    }
    function formatDateToIsoDateOnly (value) {
      // aceita Date, timestamp, ou string; cria Date e retorna yyyy-MM-dd
      const d = new Date(value)
      if (Number.isNaN(d.getTime())) return value // retorna original se inválido
      return d.toISOString().split('T')[0] // "yyyy-mm-dd"
    }

    function onlyDigits (str) {
      return String(str || '').replace(/\D+/g, '')
    }

    const cadastroUsuarios = async () => {
      try {
        const usuario = {
          nome: name.value,
          email: email.value,
          dataNascimento: formatDateToIsoDateOnly(dataNascimento.value),
          telefone: onlyDigits(telefone.value),
          cpf: onlyDigits(cpf.value),
          senha: senha.value
        }

        const usuarioCadastrado = await post(usuario)
        console.log(usuarioCadastrado)

        $q.notify({
          message: 'Produto cadastrado com sucesso!',
          color: 'positive'
        })

        onReset()
      } catch (error) {
        console.error(error)
        $q.notify({
          message: 'Erro ao cadastrar produto',
          color: 'negative'
        })
      }
    }
    const onSubmit = async () => {
      await cadastroUsuarios()
    }

    const onReset = () => {
      name.value = null
      dataNascimento.value = null
      cpf.value = null
      telefone.value = null
      email.value = null
      senha.value = null
      senhaConfirmacao.value = null
    }

    return {
      name,
      dataNascimento,
      cpf,
      telefone,
      email,
      senha,
      senhaConfirmacao,
      validarCPF,
      onSubmit,
      cadastroUsuarios,
      onReset
    }
  }
}
</script>
