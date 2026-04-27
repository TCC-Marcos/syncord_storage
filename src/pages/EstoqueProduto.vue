<template>
    <div class="flex q-pa-xl bg-grey-2" style="min-height: 100vh;">
      <div class="column items-center" style="width: 100%;">
        <div class="row justify-center q-mb-md">
          <h3>Estoque</h3>
        </div>
        <div class="row justify-center" style="width: 100%;">
          <q-table
            flat bordered
            title="Produtos"
            :rows="rows"
            :columns="columns"
            row-key="name"
            :filter="filter"
            binary-state-sort
            style="width: 100%; max-width: 90%; border-radius: 16px;"
          >
            <template v-slot:top-right>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-slot:body-cell-imagem="props">
              <q-td :props="props">
                <img :src="props.row.imagem" width="50" height="50" style="border-radius: 8px;" />
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-sm">
                <q-btn glossy icon="delete" color="negative" dense size="sm" @click="removeProduto(props.row.id)" />
                <q-btn glossy icon="edit" color="primary" dense size="sm" :to="{name: 'editar', params: { id: props.row.id }}" />
                <q-btn glossy icon="remove" color="black" dense size="sm" :to="{name: 'home'}" />
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>
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
