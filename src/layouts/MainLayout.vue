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
          <a
            href="/"
            style="text-decoration: none; color: #F2F2F2"
          >
            Syncord Storage
          </a>
        </q-toolbar-title>

        <q-btn
          flat
          round
          color="#F2F2F2"
          icon="person"
          :to="{ name: 'login' }"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      overlay
      v-model="leftDrawerOpen"
      elevated
      bordered
    >
      <q-list>
        <q-item-label header>
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
    title: 'Home',
    caption: 'Página inicial',
    icon: 'home',
    route: { name: 'home' }
  },
  {
    title: 'Estoque',
    caption: 'Visualizar produtos',
    icon: 'inventory_2',
    route: { name: 'estoque' }
  },
  {
    title: 'Cadastrar Produtos',
    caption: 'Adicionar produtos',
    icon: 'add_box',
    route: { name: 'cadastro' }
  },
  {
    title: 'Pedidos',
    caption: 'Gerenciar pedidos',
    icon: 'shopping_cart',
    route: { name: 'pedidos' }
  },
  {
    title: 'Promoções/Mensagens',
    caption: 'Gerenciar promoções',
    icon: 'discord',
    route: { name: 'promocoes' }
  },
  {
    title: 'Nova Promoção',
    caption: 'Cadastrar promoção',
    icon: 'campaign',
    route: { name: 'promocoes-new' }
  },
  {
    title: 'Usuários',
    caption: 'Gerenciar usuários',
    icon: 'group',
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

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer
    }
  }
})
</script>
