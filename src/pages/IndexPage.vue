<template>
  <q-page class="bg-grey-1 q-pa-lg">
    <!-- Cabeçalho do Dashboard -->
    <div class="row q-col-gutter-sm justify-between items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-primary q-ma-none">Painel Administrativo</h1>
        <p class="text-subtitle2 text-grey-7 q-ma-none">Gerencie a operação do seu e-commerce</p>
      </div>
    </div>

    <!-- Grid de Atalhos / Cards -->
    <div class="row q-col-gutter-lg justify-center">

      <!-- Card: Pedidos (Novo) -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="my-card text-center q-pa-md hover-scale cursor-pointer" @click="$router.push({ name: 'pedidos' })">
          <q-card-section class="bg-amber-1 text-amber-9 rounded-borders q-pa-md inline-block">
            <q-icon name="shopping_cart" size="xl" />
          </q-card-section>

          <q-card-section class="q-pt-md">
            <div class="text-h6 text-weight-bold text-grey-9">Pedidos</div>
            <div class="text-caption text-grey-6">Gerencie vendas e status de entrega</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Card: Estoque de Produtos -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="my-card text-center q-pa-md hover-scale cursor-pointer" @click="$router.push({ name: 'estoque' })">
          <q-card-section class="bg-blue-1 text-blue-9 rounded-borders q-pa-md inline-block">
            <q-icon name="inventory_2" size="xl" />
          </q-card-section>

          <q-card-section class="q-pt-md">
            <div class="text-h6 text-weight-bold text-grey-9">Estoque</div>
            <div class="text-caption text-grey-6">Controle de quantidades e produtos</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Card: Cadastro de Produtos -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="my-card text-center q-pa-md hover-scale cursor-pointer" @click="$router.push({ name: 'cadastro' })">
          <q-card-section class="bg-green-1 text-green-9 rounded-borders q-pa-md inline-block">
            <q-icon name="add_box" size="xl" />
          </q-card-section>

          <q-card-section class="q-pt-md">
            <div class="text-h6 text-weight-bold text-grey-9">Novo Produto</div>
            <div class="text-caption text-grey-6">Cadastre novos itens no catálogo</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Card: Usuários -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="my-card text-center q-pa-md hover-scale cursor-pointer" @click="$router.push({ name: 'usuarios' })">
          <q-card-section class="bg-purple-1 text-purple-9 rounded-borders q-pa-md inline-block">
            <q-icon name="people" size="xl" />
          </q-card-section>

          <q-card-section class="q-pt-md">
            <div class="text-h6 text-weight-bold text-grey-9">Usuários</div>
            <div class="text-caption text-grey-6">Administre clientes e permissões</div>
          </q-card-section>
        </q-card>
      </div>

        <!-- Card: Pedidos (Novo) -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="my-card text-center q-pa-md hover-scale cursor-pointer" @click="$router.push({ name: 'promocoes' })">
          <q-card-section class="bg-grey-3 text-black-10 rounded-borders q-pa-md inline-block">
            <q-icon name="discord" size="xl" />
          </q-card-section>

          <q-card-section class="q-pt-md">
            <div class="text-h6 text-weight-bold text-grey-9">Mensagens/Promoções</div>
            <div class="text-caption text-grey-6">Gerencie o envio de mensagens</div>
          </q-card-section>
        </q-card>
      </div>

    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useAuthStore } from 'src/stores/auth'

export default defineComponent({
  name: 'IndexPage'
})

const authStore = useAuthStore()

console.log(authStore.isLoggedIn, 'IndexPage carregada')

</script>

<style scoped>
.my-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* Efeito sutil de zoom e sombra ao passar o mouse */
.hover-scale:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
  border-color: var(--q-primary);
}

.inline-block {
  display: inline-block;
}
</style>
