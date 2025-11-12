<template>
  <div class="flex flex-center q-pa-xl bg-grey-2" style="min-height: 100vh;">
    <q-card class="q-pa-lg shadow-4" style="width: 100%; max-width: 87%; border-radius: 16px;">
      <q-card-section>
        <div class="row justify-between q-col-gutter-md">
          <div class="col-md-11 text-h4 text-center q-mb-md">Cadastro de Produtos</div>
          <div class="col md-1 text-right q-mb-md q-mx-md">
            <q-btn
              flat
              dense
              round
              icon="list"
              aria-label="Menu"
              :to="{name: 'estoque'}"
              size="xl"
            />
          </div>
        </div>
        <q-form ref="formRef" @submit="onSubmit" @reset="onReset" class="q-gutter-md">

          <!-- Linha 1 -->
          <div class="row q-col-gutter-md">
            <q-input
              filled
              v-model="descricao"
              label="Descrição do produto"
              class="col-12 col-md-8"
              :rules="[ val => val && val.length > 0 || 'Preencha esse campo']"
            />
            <q-input
              filled
              type="decimal"
              v-model="preco"
              label="Preço R$"
              class="col-12 col-md-4"
              :rules="[ val => val && val > 0 || 'Digite um valor válido']"
            />
          </div>

          <!-- Linha 2 -->
          <div class="row q-col-gutter-md">
            <q-input
              filled
              type="number"
              v-model="estoque"
              label="Estoque"
              class="col-12 col-md-4"
              :rules="[ val => val && val > 0 || 'Digite um valor válido']"
            />
            <q-select
              filled
              v-model="categoriaId"
              :options="categorias"
              label="Categoria"
              class="col-12 col-md-8"
            />
          </div>

          <!-- Linha 3 -->
          <div class="row q-col-gutter-md">
            <q-input
              filled
              v-model="observacao"
              label="Observação"
              type="textarea"
              class="col-12"
              :rules="[ val => val && val.length > 0 || 'Preencha esse campo']"
            />
          </div>

          <!-- Linha 4 (upload) -->
          <div class="row q-col-gutter-md">
            <q-file
              v-model="imagem"
              standout
              label="Imagem principal do produto"
              class="col"
              style="max-width: 100%;"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            <q-file
              v-model="imagens"
              standout
              label="Imagens do produto"
              multiple
              max-files="5"
              class="col-10"
              style="max-width: 100%;"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>

          <!-- Botões -->
          <div class="row justify-end q-mt-md">
            <q-btn label="Limpar" type="reset" color="negative" flat />
            <q-btn label="Enviar" type="submit" color="primary" class="q-mr-sm" />
          </div>

        </q-form>
      </q-card-section>
    </q-card>
  </div>
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
