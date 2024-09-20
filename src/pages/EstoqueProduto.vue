<template>
    <div class="q-pa-md">
      <h3>Estoque</h3>
      <q-table
        flat bordered
        title="Produtos"
        :rows="rows"
        :columns="columns"
        row-key="name"
        :filter="filter"
        binary-state-sort
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-sm">
            <q-btn glossy icon="delete" color="negative" dense size="sm" :to="{name: 'estoque'}" />
            <q-btn glossy icon="edit" color="primary" dense size="sm" :to="{name: 'cadastro'}" />
            <q-btn glossy icon="remove" color="black" dense size="sm" :to="{name: 'home'}" />
          </q-td>
        </template>
      </q-table>
    </div>
</template>

<script>
import { ref } from 'vue'

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Descrição produto',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'preco', align: 'center', label: 'Valor', field: 'preco', sortable: true },
  { name: 'estoque', label: 'Estoque', field: 'estoque' },
  { name: 'actions', label: 'Ações', field: 'actions', aling: 'right' }
]

const rows = [
  {
    id: 1,
    name: 'Apple iPhone 15 256GB Preto 5G Tela 6,1" Câm. Traseira 48+12MP Frontal 12MP',
    preco: 'R$ 5899,90',
    estoque: 5
  },
  {
    id: 2,
    name: 'Processador AMD Ryzen 5 7600X 4.7GHz/ 5.3GHz Hexa-Core 38MB AM5 - 100-100000593WOF',
    preco: 'R$ 1498,99',
    estoque: 10
  },
  {
    id: 3,
    name: 'ROTEADOR TP-LINK AC1350 ARCHER C60',
    preco: 'R$ 429,00',
    estoque: 3
  },
  {
    id: 4,
    name: 'Sony Play Station 5 Com 2 controles',
    preco: 'R$ 4499,00',
    estoque: 2
  },
  {
    id: 5,
    name: 'Placa de Vídeo Gigabyte NVIDIA GeForce RTX 4060 Gaming OC, 8G, 8GB, GDDR6, DLSS, Ray Tracing',
    preco: 'R$ 1959,99',
    estoque: 0
  },
  {
    id: 6,
    name: 'Kingston Memória Ram Fury Renegade Rgb 1x16gb DDR5 7200mhz Colorido',
    preco: 'R$ 719,99',
    estoque: 10
  },
  {
    id: 7,
    name: 'Microsoft Xbox Series X 1TB Standard - Preto',
    preco: 'R$ 4079,00',
    estoque: 4
  },
  {
    id: 8,
    name: 'Controle Microsoft Xbox Carbon Black, Sem Fio, Para Xbox Series X e S, Preto',
    preco: 'R$ 329,00',
    estoque: 15
  }
]

export default {
  setup () {
    return {
      filter: ref(''),
      columns,
      rows: ref(rows)
    }
  }
}
</script>
