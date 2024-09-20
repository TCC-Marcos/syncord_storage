<template>
  <q-page class="row flex-center">
    <div class="column q-pa-md q-gutter-sm items-center">
      <q-btn color="primary" :to="{name: 'estoque'}" label="Estoque Produtos" size="xl"/>
      <br>
      <q-btn color="primary" :to="{name: 'cadastro'}" label="Cadastro Produtos" size="xl"/>
      <br>
      <q-btn color="primary" :to="{name: 'usuarios'}" label="Usuários" size="xl"/>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage'
})
</script>
