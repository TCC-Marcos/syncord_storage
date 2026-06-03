<template>
<q-page class="flex flex-center bg-grey-2 q-pa-md q-pa-sm-xl">
    <q-card class="q-pa-md q-pa-sm-lg shadow-2" style="width: 100%; max-width: 750px; border-radius: 16px;">

      <q-card-section class="q-px-none q-pt-none">
        <div class="row items-center justify-between no-wrap">
          <div>
            <h1 class="text-h5 text-sm-h4 text-weight-bold text-grey-9 q-ma-none">
              {{ isEditing ? 'Editar Usuário' : 'Cadastro de Usuários' }}
            </h1>
            <p class="text-caption text-grey-6 q-ma-none">Registre novos clientes ou operadores no sistema</p>
          </div>
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="arrow_back"
            @click="$router.push({ name: 'usuarios' })"
            size="lg"
          >
            <q-tooltip class="bg-primary">Voltar para o Painel</q-tooltip>
          </q-btn>
        </div>
        <q-separator class="q-mt-md q-mb-lg" />
      </q-card-section>

      <q-card-section class="q-pa-none">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-y-md"
        >
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-7 col-md-8">
              <q-input
                outlined
                v-model="name"
                label="Nome Completo"
                lazy-rules
                :rules="[ val => val && val.trim().length > 0 || 'Campo obrigatório' ]"
              />
            </div>
            <div class="col-12 col-sm-5 col-md-4">
              <q-input
                outlined
                v-model="dataNascimento"
                label="Data de Nascimento"
                mask="##/##/####"
                lazy-rules
                :rules="[val => !!val || 'Campo obrigatório']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="dataNascimento" mask="DD/MM/YYYY">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Fechar" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                outlined
                v-model="cpf"
                label="CPF"
                lazy-rules
                mask="###.###.###-##"
                :rules="[ validarCPF ]"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                outlined
                v-model="telefone"
                label="Telefone"
                mask="(##) # ####-####"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Campo obrigatório' ]"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <q-input
                outlined
                v-model="email"
                label="E-mail"
                type="email"
                lazy-rules
                :rules="[
                  val => val && val.length > 0 || 'Campo obrigatório',
                  val => val.includes('@') && val.includes('.') || 'E-mail inválido'
                ]"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-12 col-sm-6">
              <q-input
                outlined
                v-model="senha"
                :label="isEditing ? 'Nova Senha (opcional)' : 'Senha'"
                lazy-rules
                type="password"
                :rules="[
                  val => isEditing || (val && val.length > 0) || 'Campo obrigatório'
                ]"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                outlined
                v-model="senhaConfirmacao"
                :label="isEditing ? 'Confirmar Nova Senha' : 'Confirmar Senha'"
                lazy-rules
                type="password"
                :rules="[
                  val => isEditing || (val && val.length > 0) || 'Campo obrigatório',
                  val => !senha || val === senha || 'As senhas não são iguais'
                ]"
              />
            </div>
          </div>

          <div class="row justify-end q-gutter-sm q-pt-md">
            <q-btn label="Limpar" type="reset" color="grey-7" flat class="q-px-lg" />
            <q-btn
              :label="isEditing ? 'Salvar Alterações' : 'Cadastrar Usuário'"
              type="submit"
              color="primary"
              class="q-px-xl text-weight-bold"
            />
          </div>

        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import usuariosService from 'src/services/usuarios'
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'

export default {
  setup () {
    const { post, update, listById, updatePassword } = usuariosService()

    const $q = useQuasar()
    const route = useRoute()
    const router = useRouter()

    const usuarioId = ref(route.params.id || null)

    const isEditing = computed(() => !!usuarioId.value)

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
      if (!value) return null

      const [day, month, year] = value.split('/')

      return `${year}-${month}-${day}`
    }

    function formatDateToBR (value) {
      if (!value) return null

      const [year, month, day] = value.split('-')

      return `${day}/${month}/${year}`
    }

    function onlyDigits (str) {
      return String(str || '').replace(/\D+/g, '')
    }

    function formatCPF (value) {
      if (!value) return null

      return value.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4'
      )
    }

    function formatPhone (value) {
      if (!value) return null

      return value.replace(
        /(\d{2})(\d{5})(\d{4})/,
        '($1) $2-$3'
      )
    }

    const loadUsuario = async () => {
      if (!isEditing.value) return

      try {
        $q.loading.show()

        const usuario = await listById(usuarioId.value)

        name.value = usuario.nome
        email.value = usuario.email
        dataNascimento.value = formatDateToBR(usuario.dataNascimento)
        cpf.value = formatCPF(usuario.cpf)
        telefone.value = formatPhone(usuario.telefone)
      } catch (error) {
        console.error(error)

        $q.notify({
          message: 'Erro ao carregar usuário',
          color: 'negative'
        })
      } finally {
        $q.loading.hide()
      }
    }

    const save = async () => {
      try {
        $q.loading.show()

        const payload = {
          id: usuarioId.value,
          nome: name.value,
          email: email.value,
          dataNascimento: formatDateToIsoDateOnly(dataNascimento.value),
          telefone: onlyDigits(telefone.value),
          cpf: onlyDigits(cpf.value),
          discordId: null
        }

        if (isEditing.value) {
          await update(payload)

          if (senha.value) {
            await updatePassword(usuarioId.value, senha.value)
          }

          $q.notify({
            message: 'Usuário atualizado com sucesso!',
            color: 'positive'
          })
        } else {
          await post({
            ...payload,
            senha: senha.value
          })

          $q.notify({
            message: 'Usuário cadastrado com sucesso!',
            color: 'positive'
          })
        }

        router.push({ name: 'usuarios' })
      } catch (error) {
        console.error(error)

        $q.notify({
          message: 'Erro ao salvar usuário',
          color: 'negative'
        })
      } finally {
        $q.loading.hide()
      }
    }

    const onSubmit = async () => {
      await save()
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

    onMounted(() => {
      loadUsuario()
    })

    return {
      isEditing,
      name,
      dataNascimento,
      cpf,
      telefone,
      email,
      senha,
      senhaConfirmacao,
      validarCPF,
      onSubmit,
      onReset
    }
  }
}
</script>
