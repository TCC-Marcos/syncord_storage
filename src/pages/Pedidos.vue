<template>
  <q-page class="bg-grey-2 q-pa-md q-pa-sm-xl">
    <q-card class="shadow-2" style="width: 100%; max-width: 1200px; border-radius: 16px;">

      <!-- Cabeçalho -->
      <q-card-section>
        <div class="row items-center justify-between">
          <div>
            <h1 class="text-h5 text-sm-h4 text-weight-bold text-grey-9 q-ma-none">Gerenciamento de Pedidos</h1>
            <p class="text-caption text-grey-6 q-ma-none">Monitore as vendas e atualize o fluxo de entrega</p>
          </div>
        </div>
      </q-card-section>

      <!-- Filtros por Abas (Esteira de Produção) -->
      <q-tabs
        v-model="abaAtual"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="todos" label="Todos" />
        <q-tab name="pendente" class="text-warning" label="⏳ Pendentes" />
        <q-tab name="pago" class="text-positive" label="📦 A Despachar" />
        <q-tab name="enviado" class="text-info" label="🚚 Enviados" />
        <q-tab name="cancelado" class="text-negative" label="❌ Cancelados" />
      </q-tabs>

      <q-separator />

      <!-- Tabela de Pedidos -->
      <q-card-section class="q-pa-none">
        <q-table
          flat
          :rows="pedidosFiltrados"
          :columns="columns"
          row-key="id"
          class="no-shadow"
        >
          <!-- Customização da coluna de Status -->
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                :color="getColorStatus(props.row.status)"
                text-color="white"
                dense
                class="text-weight-bold"
              >
                {{ props.row.status.toUpperCase() }}
              </q-chip>
            </q-td>
          </template>

          <!-- Botões de Ação do ADM -->
          <template v-slot:body-cell-acoes="props">
            <q-td :props="props" class="q-gutter-x-xs">
              <!-- Botão para abrir o modal de detalhes do pedido -->
              <q-btn
                flat
                round
                icon="visibility"
                color="primary"
                @click="verDetalhes(props.row)"
              >
                <q-tooltip>Ver Detalhes do Pedido</q-tooltip>
              </q-btn>

              <!-- Botão rápido para despachar (só aparece se o status for 'pago') -->
              <q-btn
                v-if="props.row.status === 'pago'"
                flat
                round
                icon="local_shipping"
                color="positive"
                @click="abrirModalDespacho(props.row)"
              >
                <q-tooltip>Despachar Pedido</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>

    </q-card>
  </q-page>
</template>
<script>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'PedidosAdminPage',
  setup () {
    const $q = useQuasar()

    // Controla qual aba está ativa no topo ('todos', 'pendente', 'pago', etc.)
    const abaAtual = ref('todos')

    // Definição das colunas da tabela
    const columns = [
      { name: 'id', align: 'left', label: 'Nº Pedido', field: 'id', sortable: true },
      { name: 'cliente', align: 'left', label: 'Cliente', field: row => row.usuario.nome, sortable: true },
      { name: 'data', align: 'left', label: 'Data/Hora', field: 'criadoEm', sortable: true },
      { name: 'total', align: 'right', label: 'Valor Total', field: 'valorTotal', format: val => `R$ ${val.toFixed(2)}`, sortable: true },
      { name: 'status', align: 'center', label: 'Status', field: 'status', sortable: true },
      { name: 'acoes', align: 'center', label: 'Ações' }
    ]

    // Simulação dos dados que o seu C# com MySQL vai retornar (JSON do Backend)
    const rows = ref([
      {
        id: 1001,
        criadoEm: '20/05/2026 14:32',
        valorTotal: 349.90,
        status: 'pago', // Cairá na aba "A Despachar"
        usuario: { nome: 'Carlos Eduardo Santos' }
      },
      {
        id: 1002,
        criadoEm: '20/05/2026 15:10',
        valorTotal: 1250.00,
        status: 'pendente', // Aguardando Pix/Boleto
        usuario: { nome: 'Mariana Costa Lima' }
      },
      {
        id: 1003,
        criadoEm: '19/05/2026 10:15',
        valorTotal: 89.90,
        status: 'enviado', // Já está na transportadora
        usuario: { nome: 'Lucas Almeida Barbosa' }
      },
      {
        id: 1004,
        criadoEm: '18/05/2026 09:00',
        valorTotal: 520.00,
        status: 'cancelado', // Pagamento recusado
        usuario: { nome: 'Roberta Souza Dias' }
      }
    ])

    // LÓGICA DE OURO: Filtra a lista reativamente baseado na aba clicada pelo ADM
    const pedidosFiltrados = computed(() => {
      if (abaAtual.value === 'todos') {
        return rows.value
      }
      // Retorna apenas os pedidos que possuem o status igual ao nome da aba
      return rows.value.filter(pedido => pedido.status === abaAtual.value)
    })

    // Retorna a cor do Badge/Chip baseada no status do pedido
    const getColorStatus = (status) => {
      const cores = {
        pendente: 'warning', // Laranja/Amarelo
        pago: 'positive', // Verde (Pronto para despachar)
        enviado: 'info', // Azul
        cancelado: 'negative' // Vermelho
      }
      return cores[status] || 'grey'
    }

    // Ação: Abrir modal de detalhes (Aqui você fará a integração depois)
    const verDetalhes = (pedido) => {
      $q.notify({
        message: `Abrindo detalhes do pedido nº ${pedido.id}`,
        icon: 'info',
        color: 'primary'
      })
    }

    // Ação: Despachar o pedido (Simula a inserção do rastreio e mudança de status)
    const abrirModalDespacho = (pedido) => {
      $q.dialog({
        title: 'Despachar Pedido',
        message: `Digite o código de rastreio para o pedido nº ${pedido.id}:`,
        prompt: {
          model: '',
          type: 'text' // Campo de texto para o operador digitar
        },
        cancel: true,
        persistent: true
      }).onOk(codigoRastreio => {
        if (!codigoRastreio.trim()) {
          $q.notify({ message: 'Código de rastreio obrigatório', color: 'negative' })
          return
        }

        // Simula a atualização do status que você enviaria para o C# via axios
        pedido.status = 'enviado'

        $q.notify({
          message: 'Pedido despachado! Status alterado para Enviado.',
          icon: 'local_shipping',
          color: 'positive'
        })
      })
    }

    return {
      abaAtual,
      columns,
      pedidosFiltrados,
      getColorStatus,
      verDetalhes,
      abrirModalDespacho
    }
  }
}
</script>
