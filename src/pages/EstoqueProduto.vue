<template>
  <q-page class="flex flex-center bg-grey-2 q-pa-md q-pa-sm-xl">
      <!-- Card/Container Principal para abraçar a tabela e o topo -->
      <q-card class="q-pa-md q-pa-sm-lg shadow-2" style="width: 100%; max-width: 1200px; border-radius: 16px;">

        <!-- Cabeçalho do Estoque -->
        <q-card-section class="q-px-none q-pt-none q-mb-md">
          <div class="row items-center justify-between no-wrap">
            <div>
              <h1 class="text-h5 text-sm-h4 text-weight-bold text-grey-9 q-ma-none">Controle de Estoque</h1>
              <p class="text-caption text-grey-6 q-ma-none">Visualize, edite e gerencie o catálogo de produtos ativos</p>
            </div>
            <!-- Botão de Atalho para Novo Cadastro -->
            <q-btn
              color="primary"
              icon="add"
              label="Novo Produto"
              :to="{ name: 'cadastro' }"
              class="text-weight-bold q-px-md"
              unevaluated
            />
          </div>
          <q-separator class="q-mt-md" />
        </q-card-section>

        <!-- Tabela Restruturada -->
        <q-table
          flat
          bordered
          title="Lista de Produtos"
          title-class="text-subtitle1 text-weight-bold text-grey-8"
          :rows="rows"
          :columns="columns"
          row-key="id"
          :filter="filter"
          binary-state-sort
          class="no-shadow border-radius-table"
        >
          <!-- Topo da Tabela (Barra de Busca) -->
          <template v-slot:top-right>
            <q-input
              outlined
              dense
              debounce="300"
              v-model="filter"
              placeholder="Buscar produto..."
              style="width: 250px;"
            >
              <template v-slot:append>
                <q-icon name="search" color="grey-6" />
              </template>
            </q-input>
          </template>

          <!-- Renderização da Imagem -->
          <template v-slot:body-cell-imagem="props">
            <q-td :props="props">
              <q-avatar rounded size="48px" class="bg-grey-3">
                <img :src="props.row.imagem || ''" style="object-fit: cover;" />
              </q-avatar>
            </q-td>
          </template>

          <!-- Renderização das Ações (Botões Modernizados) -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-x-sm">
              <!-- Editar -->
              <q-btn
                flat
                round
                icon="edit"
                color="primary"
                size="sm"
                :to="{ name: 'editar', params: { id: props.row.id } }"
              >
                <q-tooltip>Editar Produto</q-tooltip>
              </q-btn>

              <!-- Deletar -->
              <q-btn
                flat
                round
                icon="delete"
                color="negative"
                size="sm"
                @click="removeProduto(props.row.id)"
              >
                <q-tooltip>Excluir Produto</q-tooltip>
              </q-btn>

              <!-- Voltar/Home -->
              <!-- <q-btn
                flat
                round
                icon="home"
                color="grey-7"
                size="sm"
                :to="{ name: 'home' }"
              >
                <q-tooltip>Ir para o Painel</q-tooltip>
              </q-btn> -->
            </q-td>
          </template>
        </q-table>

      </q-card>
 </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar' // 1. Importe o useQuasar
import produtosService from 'src/services/produtos'

const columns = [
  { name: 'imagem', align: 'center', label: 'Imagem', field: 'imagem' },
  {
    name: 'name',
    required: true,
    label: 'Descrição produto',
    align: 'left',
    field: 'descricao',
    format: val => `${val}`,
    sortable: true
  },
  { name: 'preco', align: 'center', label: 'Valor', field: 'preco', format: val => `R$ ${val.toFixed(2).replace('.', ',')}`, sortable: true },
  { name: 'estoque', label: 'Estoque', field: 'estoque', align: 'center', sortable: true },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'right' }
]

export default {
  setup () {
    const $q = useQuasar() // 2. Inicialize a variável do Quasar
    const produtos = ref([])
    const { list, remove } = produtosService()

    onMounted(() => {
      getProdutos()
    })

    const getProdutos = async () => {
      const data = await list()
      produtos.value = data
      console.log(produtos.value)
    }

    // 3. Atualize a função para chamar o $q.dialog
    const removeProduto = async (id) => {
      $q.dialog({
        title: 'Confirmação',
        message: 'Tem certeza de que deseja excluir este produto?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        // O que acontece se o usuário clicar em "OK"
        try {
          await remove(id)
          getProdutos()

          // Opcional: Mostra um aviso de sucesso
          $q.notify({
            type: 'positive',
            message: 'Produto removido com sucesso!'
          })
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: 'Erro ao remover produto.'
          })
        }
      })
    }

    return {
      filter: ref(''),
      columns,
      rows: ref(produtos),
      removeProduto
    }
  }
}
</script>
  <style scoped>
  .style-container {
    width: 100%;
  }
  .border-radius-table {
    border-radius: 8px;
  }
</style>
