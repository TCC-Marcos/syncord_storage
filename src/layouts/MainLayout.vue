<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <a href="/" style="text-decoration: none; color: #F2F2F2">Syncord Storage</a>
        </q-toolbar-title>

        <!--<div>Quasar v{{ $q.version }}</div>-->
      </q-toolbar>
    </q-header>

    <q-drawer
      overlay
      v-model="leftDrawerOpen"
      elevated
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Menu
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Estoque',
    caption: 'Visualizar produtos ',
    icon: 'inventory_2',
    route: { name: 'estoque' }
  },
  {
    title: 'Cadastrar Produtos',
    caption: 'Adicionar produtos',
    icon: 'add',
    route: { name: 'cadastro' }
  },
  {
    title: 'Usuários',
    caption: 'Gerenciar Usuários',
    icon: 'person',
    route: { name: 'usuarios' }
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
