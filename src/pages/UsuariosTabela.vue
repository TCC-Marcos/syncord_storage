<template>
  <q-page class="bg-grey-2 q-pa-md">
    <q-card class="shadow-2" style="border-radius: 16px">
      <!-- Header -->
      <q-card-section>
        <div class="row items-center justify-between">
          <div>
            <h1 class="text-h5 text-weight-bold q-ma-none">
              Usuários Cadastrados
            </h1>
            <p class="text-grey-6 q-ma-none">
              Lista de usuários do sistema
            </p>
          </div>

          <div class="row q-gutter-sm">
            <q-btn
              color="primary"
              icon="add"
              label="Novo Usuário"
              :to="{ name: 'usuarios-new' }"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Filtro -->
      <q-card-section>
        <q-input
          v-model="filter"
          outlined
          dense
          debounce="300"
          placeholder="Buscar por nome, email ou CPF"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>

      <!-- Tabela -->
      <q-card-section>
        <q-table
          flat
          bordered
          :rows="usuarios"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :filter="filter"
          no-data-label="Nenhum usuário encontrado"
        >
          <!-- Data nascimento -->
          <template v-slot:body-cell-dataNascimento="props">
            <q-td :props="props">
              {{ formatDate(props.row.dataNascimento) }}
            </q-td>
          </template>

          <!-- CPF -->
          <template v-slot:body-cell-cpf="props">
            <q-td :props="props">
              {{ formatCPF(props.row.cpf) }}
            </q-td>
          </template>

          <!-- Telefone -->
          <template v-slot:body-cell-telefone="props">
            <q-td :props="props">
              {{ formatPhone(props.row.telefone) }}
            </q-td>
          </template>

          <!-- Role -->
          <template v-slot:body-cell-role="props">
            <q-td :props="props">
              <q-badge
                :color="props.row.role === 'admin' ? 'negative' : 'primary'"
              >
                {{ props.row.role }}
              </q-badge>
            </q-td>
          </template>

          <!-- Ações -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="visibility"
                color="black"
                @click="viewUser(props.row)"
              >
                <q-tooltip>Visualizar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                :to="{
                  name: 'usuarios-edit',
                  params: { id: props.row.id }
                }"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal de visualização -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 450px">
        <q-card-section class="row items-center">
          <div class="text-h6">Detalhes do Usuário</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section v-if="selectedUser">
          <div class="q-mb-sm">
            <strong>Nome:</strong> {{ selectedUser.nome }}
          </div>
          <div class="q-mb-sm">
            <strong>Email:</strong> {{ selectedUser.email }}
          </div>
          <div class="q-mb-sm">
            <strong>CPF:</strong> {{ formatCPF(selectedUser.cpf) }}
          </div>
          <div class="q-mb-sm">
            <strong>Telefone:</strong> {{ formatPhone(selectedUser.telefone) }}
          </div>
          <div class="q-mb-sm">
            <strong>Data Nascimento:</strong>
            {{ formatDate(selectedUser.dataNascimento) }}
          </div>
          <div class="q-mb-sm">
            <strong>Role:</strong> {{ selectedUser.role }}
          </div>
          <div class="q-mb-sm">
            <strong>Discord ID:</strong>
            {{ selectedUser.discordID || '-' }}
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import usuariosService from 'src/services/usuarios'

export default {
  setup () {
    const { list } = usuariosService()
    const $q = useQuasar()

    const usuarios = ref([])
    const loading = ref(false)
    const filter = ref('')
    const showDialog = ref(false)
    const selectedUser = ref(null)

    const columns = [
      {
        name: 'nome',
        label: 'Nome',
        field: 'nome',
        align: 'left',
        sortable: true
      },
      {
        name: 'email',
        label: 'Email',
        field: 'email',
        align: 'left',
        sortable: true
      },
      {
        name: 'cpf',
        label: 'CPF',
        field: 'cpf',
        align: 'left'
      },
      {
        name: 'telefone',
        label: 'Telefone',
        field: 'telefone',
        align: 'left'
      },
      {
        name: 'dataNascimento',
        label: 'Nascimento',
        field: 'dataNascimento',
        align: 'left'
      },
      {
        name: 'role',
        label: 'Perfil',
        field: 'role',
        align: 'center'
      },
      {
        name: 'actions',
        label: 'Ações',
        align: 'center'
      }
    ]

    const loadUsers = async () => {
      try {
        loading.value = true

        const response = await list()
        usuarios.value = response || []
      } catch (error) {
        console.error(error)

        $q.notify({
          message: 'Erro ao carregar usuários',
          color: 'negative'
        })
      } finally {
        loading.value = false
      }
    }

    const formatDate = (date) => {
      if (!date) return '-'

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    }

    const formatCPF = (cpf) => {
      if (!cpf) return '-'

      return cpf.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4'
      )
    }

    const formatPhone = (phone) => {
      if (!phone) return '-'

      return phone.replace(
        /(\d{2})(\d{5})(\d{4})/,
        '($1) $2-$3'
      )
    }

    const viewUser = (user) => {
      selectedUser.value = user
      showDialog.value = true
    }

    onMounted(() => {
      loadUsers()
    })

    return {
      usuarios,
      columns,
      loading,
      filter,
      showDialog,
      selectedUser,
      formatDate,
      formatCPF,
      formatPhone,
      viewUser
    }
  }
}
</script>
