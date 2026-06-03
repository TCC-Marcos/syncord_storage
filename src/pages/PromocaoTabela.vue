<template>
  <q-page class="q-pa-md">
    <q-card>
      <!-- Header -->
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">Promoções</div>

        <div class="row q-gutter-sm">
          <q-input
            v-model="filter"
            outlined
            dense
            debounce="300"
            placeholder="Buscar promoção..."
            style="width: 250px"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-btn
            color="primary"
            icon="add"
            label="Nova Promoção"
            @click="novo"
          />
        </div>
      </q-card-section>

      <!-- Table -->
      <q-card-section>
        <q-table
          :rows="promocoes"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :filter="filter"
          flat
          bordered
        >
          <!-- Status -->
          <template #body-cell-ativo="props">
            <q-td :props="props">
              <q-badge
                :color="props.row.ativo ? 'positive' : 'negative'"
              >
                {{ props.row.ativo ? 'Ativa' : 'Inativa' }}
              </q-badge>
            </q-td>
          </template>

          <!-- Quantidade produtos -->
          <template #body-cell-produtos="props">
            <q-td :props="props">
              {{ props.row.produtos?.length || 0 }}
            </q-td>
          </template>

          <!-- Ações -->
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="edit"
                @click="editar(props.row.id)"
              />

              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                @click="confirmDelete(props.row)"
              />
            </q-td>
          </template>

          <!-- Empty state -->
          <template #no-data>
            <div class="full-width row flex-center text-grey q-gutter-sm q-pa-lg">
              <q-icon name="info" size="24px" />
              <span>Nenhuma promoção encontrada.</span>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import promocoesService from 'src/services/promocoes'

export default {
  name: 'PromocoesPage',

  setup () {
    const { list, remove } = promocoesService()

    const $q = useQuasar()
    const router = useRouter()

    const loading = ref(false)
    const filter = ref('')
    const promocoes = ref([])

    const columns = [
      {
        name: 'titulo',
        label: 'Título',
        field: 'titulo',
        align: 'left',
        sortable: true
      },
      {
        name: 'descricao',
        label: 'Descrição',
        field: 'descricao',
        align: 'left'
      },
      {
        name: 'ativo',
        label: 'Status',
        field: 'ativo',
        align: 'center',
        sortable: true
      },
      {
        name: 'produtos',
        label: 'Qtd. Produtos',
        field: row => row.produtos?.length || 0,
        align: 'center',
        sortable: true
      },
      {
        name: 'acoes',
        label: 'Ações',
        align: 'center'
      }
    ]

    onMounted(() => {
      carregarPromocoes()
    })

    const carregarPromocoes = async () => {
      try {
        loading.value = true

        const data = await list()
        promocoes.value = data
      } catch (error) {
        console.error(error)

        $q.notify({
          message: 'Erro ao carregar promoções',
          color: 'negative'
        })
      } finally {
        loading.value = false
      }
    }

    const novo = () => {
      router.push({ name: 'promocoes-new' })
    }

    const editar = (id) => {
      router.push({
        name: 'promocoes-edit',
        params: { id }
      })
    }

    const confirmDelete = (item) => {
      $q.dialog({
        title: 'Confirmar exclusão',
        message: `Deseja excluir a promoção "${item.titulo}"?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        await excluir(item.id)
      })
    }

    const excluir = async (id) => {
      try {
        $q.loading.show()

        await remove(id)

        $q.notify({
          message: 'Promoção excluída com sucesso!',
          color: 'positive'
        })

        await carregarPromocoes()
      } catch (error) {
        console.error(error)

        $q.notify({
          message: 'Erro ao excluir promoção',
          color: 'negative'
        })
      } finally {
        $q.loading.hide()
      }
    }

    return {
      columns,
      loading,
      filter,
      promocoes,
      novo,
      editar,
      confirmDelete
    }
  }
}
</script>
