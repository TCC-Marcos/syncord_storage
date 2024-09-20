<template>
    <div class="row q-pa-md q-gutter-md justify-center">
      <div class="col-12 q-gutter-md">
        <h3>Cadastro de produtos</h3>
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          <div class="row justify-center">
            <div class="col-12 q-gutter-xs row">
              <q-input
                  filled
                  v-model="descricao"
                  label="Decrição do produto"
                  hint=""
                  lazy-rules
                  class="col-lg-4 col-xs-4"
                  :rules="[ val => val && val.length > 0 || 'Preencha esse campo']"
              />
              <q-input
                  filled
                  v-model="codigo"
                  type="number"
                  label="Codigo"
                  hint=""
                  lazy-rules
                  class="col-lg-2 col-xs-2"
                  :rules="[
                  val => val && val.length > 0 || 'Preencha esse campo',
                  val => val > 0 && val < 100 || 'Digite um valor positivo'
                  ]"
              />
              <q-input
                  filled
                  type="decimal"
                  v-model="preco"
                  label="Preço R$"
                  lazy-rules
                  class="col-lg-3 col-xs-3"
                  :rules="[
                  val => val !== null && val !== '' || 'Preencha esse campo',
                  val => val > 0 && val < 100 || 'Digite um valor positivo'
                  ]"
              />
              <q-input
                  filled
                  type="number"
                  v-model="estoque"
                  label="Estoque"
                  lazy-rules
                  class="col-lg-2 col-xs-2"
                  :rules="[
                  val => val !== null && val !== '' || 'Preencha esse campo',
                  val => val > 0 && val < 100 || 'Digite um valor positivo'
                  ]"
              />
              <q-input
                  filled
                  v-model="observacao"
                  label="Observação"
                  hint=""
                  lazy-rules
                  class="col-lg-5 col-xs-5"
                  :rules="[ val => val && val.length > 0 || 'Preencha esse campo']"
              />
              <q-input
                  filled
                  v-model="categoria"
                  label="Categoria"
                  hint=""
                  lazy-rules
                  class="col-lg-3 col-xs-3"
                  :rules="[ val => val && val.length > 0 || 'Preencha esse campo']"
              />
              <q-file filled v-model="imagem" label="Foto" class="col-lg-3 col-xs-3">
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
          </div>
          <div class="row justify-end">
            <div class="col-lg-2 col-xs-2" >
              <q-btn label="Enviar" type="submit" color="primary"/>
              <q-btn label="Limpar" type="reset" color="negative" flat class="q-ml-sm" />
            </div>
          </div>
        </q-form>
      </div>
    </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

export default {
  setup () {
    const $q = useQuasar()

    const descricao = ref(null)
    const preco = ref(null)
    const estoque = ref(null)
    const imagem = ref(null)
    const codigo = ref(null)
    const categoria = ref(null)
    const observacao = ref(null)

    return {
      descricao,
      preco,
      estoque,
      imagem,
      codigo,
      categoria,
      observacao,

      onSubmit () {
        $q.notify({
          message: 'Ok',
          color: 'positive'
        })
      },

      onReset () {
        descricao.value = null
        preco.value = null
        estoque.value = null
        imagem.value = null
        codigo.value = null
        categoria.value = null
        observacao.value = null
      }
    }
  }
}
</script>
