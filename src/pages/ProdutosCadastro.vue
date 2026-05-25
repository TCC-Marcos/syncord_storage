<template>
  <q-page class="flex flex-center bg-grey-2 q-pa-md q-pa-sm-xl">
    <q-card class="q-pa-md q-pa-sm-lg shadow-2" style="width: 100%; max-width: 900px; border-radius: 16px;">

      <q-card-section class="q-px-none q-pt-none">
        <div class="row items-center justify-between no-wrap">
          <div>
            <h1 class="text-h5 text-sm-h4 text-weight-bold text-grey-9 q-ma-none">Cadastro de Produtos</h1>
            <p class="text-caption text-grey-6 q-ma-none">Insira os detalhes do novo produto para o catálogo</p>
          </div>
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="arrow_back"
            :to="{ name: 'estoque' }"
            size="lg"
          >
            <q-tooltip class="bg-primary">Voltar para o Estoque</q-tooltip>
          </q-btn>
        </div>
        <q-separator class="q-mt-md q-mb-lg" />
      </q-card-section>

      <q-card-section class="q-pa-none">
        <q-form ref="formRef" @submit="onSubmit" @reset="onReset" class="q-gutter-y-md">

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-8">
              <q-input
                outlined
                v-model="descricao"
                label="Nome / Descrição do produto"
                placeholder="Ex: Teclado Mecânico RGB"
                :rules="[ val => val && val.trim().length > 0 || 'Preencha esse campo']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                type="number"
                step="0.01"
                v-model.number="preco"
                label="Preço de Venda"
                prefix="R$"
                :rules="[ val => val !== null && val > 0 || 'Digite um valor maior que zero']"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                outlined
                type="number"
                v-model.number="estoque"
                label="Estoque Inicial"
                placeholder="0"
                :rules="[ val => val !== null && val >= 0 || 'Digite um valor válido']"
              />
            </div>
            <div class="col-12 col-md-8">
              <q-select
                outlined
                v-model="categoriaId"
                :options="categorias"
                label="Categoria"
                emit-value
                map-options
                :rules="[ val => !!val || 'Selecione uma categoria' ]"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12">
              <q-input
                outlined
                v-model="observacao"
                label="Observações / Detalhes Técnicos"
                type="textarea"
                rows="3"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-file
                outlined
                v-model="imagem"
                label="Imagem Principal (Capa)"
                accept=".jpg, .jpeg, .png, .webp"
              >
                <template v-slot:prepend>
                  <q-icon name="image" color="primary" />
                </template>
              </q-file>
            </div>
            <div class="col-12 col-sm-6">
              <q-file
                outlined
                v-model="imagens"
                label="Galeria de Fotos (Até 5 imagens)"
                multiple
                max-files="5"
                accept=".jpg, .jpeg, .png, .webp"
              >
                <template v-slot:prepend>
                  <q-icon name="collections" color="primary" />
                </template>
              </q-file>
            </div>
          </div>

          <div class="row justify-end q-gutter-sm q-pt-md">
            <q-btn label="Limpar" type="reset" color="grey-7" flat class="q-px-lg" />
            <q-btn label="Salvar" type="submit" color="primary" unevaluated class="q-px-xl text-weight-bold" />
          </div>

        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'
import produtosService from 'src/services/produtos'
import { ref, nextTick } from 'vue'

export default {
  setup () {
    const { post, uploads, upload } = produtosService()
    const $q = useQuasar()

    // ref do form
    const formRef = ref(null)

    const descricao = ref(null)
    const preco = ref(null)
    const estoque = ref(null)
    const observacao = ref(null)
    const categoriaId = ref(null)
    const imagem = ref([])
    const imagens = ref([])
    const categorias = ref([
      { label: 'Computadores', value: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
      { label: 'Celulares', value: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
      { label: 'Processadores', value: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }
    ])

    const cadastrarProduto = async () => {
      try {
        const produto = {
          descricao: descricao.value,
          preco: preco.value,
          estoque: estoque.value,
          observacao: observacao.value,
          // categoriaId pode ser objeto se estiver usando option object, trate conforme necessário
          categoriaId: categoriaId.value ? categoriaId.value.value || categoriaId.value : null,
          ativo: true
        }

        const produtoCadastrado = await post(produto)
        console.log(produtoCadastrado)

        if (imagens.value.length > 0) {
          await uploads(produtoCadastrado.id, imagens.value)
        }

        if (imagem.value) {
          await upload(produtoCadastrado.id, imagem.value)
        }

        $q.notify({
          message: 'Produto cadastrado com sucesso!',
          color: 'positive'
        })

        // limpa campos e validações
        onReset()
      } catch (error) {
        console.error(error)
        $q.notify({
          message: 'Erro ao cadastrar produto',
          color: 'negative'
        })
      }
    }

    const onSubmit = async () => {
      await cadastrarProduto()
    }

    const onReset = async () => {
      descricao.value = null
      preco.value = null
      estoque.value = null
      observacao.value = null
      categoriaId.value = null
      imagens.value = []
      imagem.value = []

      await nextTick()
      // <-- limpa as validações do q-form
      formRef.value.resetValidation()
    }

    return {
      formRef,
      descricao,
      preco,
      estoque,
      categoriaId,
      observacao,
      imagem,
      imagens,
      categorias,
      onSubmit,
      onReset
    }
  }
}
</script>
