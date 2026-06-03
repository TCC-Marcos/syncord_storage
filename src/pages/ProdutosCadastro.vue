<template>
  <q-page class="flex flex-center bg-grey-2 q-pa-md q-pa-sm-xl">
    <q-card class="q-pa-md q-pa-sm-lg shadow-2" style="width: 100%; max-width: 900px; border-radius: 16px;">

      <q-card-section class="q-px-none q-pt-none">
        <div class="row items-center justify-between no-wrap">
          <div>
            <h1 class="text-h5 text-sm-h4 text-weight-bold text-grey-9 q-ma-none">
              {{ isEditing ? 'Editar Produto' : 'Cadastro de Produtos' }}
            </h1>
            <p class="text-caption text-grey-6 q-ma-none">
              {{ isEditing ? 'Atualize os detalhes do produto no catálogo' : 'Insira os detalhes do novo produto para o catálogo' }}
            </p>
          </div>
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="list"
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

              <div v-if="imagemAtualUrl" class="q-mb-md">
                <div class="text-caption text-grey-8 q-mb-xs">Imagem Atual:</div>
                <div class="relative-position" style="width: 120px; height: 120px;">
                  <q-img
                    :src="imagemAtualUrl"
                    style="width: 100%; height: 100%; border-radius: 8px; border: 1px solid #ccc;"
                    fit="cover"
                  />
                  <q-btn
                    round
                    color="negative"
                    icon="delete"
                    size="sm"
                    class="absolute-top-right q-ma-xs shadow-3"
                    @click="deletarImagemPrincipal"
                  >
                    <q-tooltip class="bg-negative">Apagar imagem principal</q-tooltip>
                  </q-btn>
                </div>
              </div>

              <q-file
                outlined
                v-model="imagem"
                :label="imagemAtualUrl ? 'Selecionar Nova Imagem para Substituir' : 'Imagem Principal (Capa)'"
                accept=".jpg, .jpeg, .png, .webp"
                clearable
                @update:model-value="onNovaImagemSelecionada"
                :hint="isEditing && !imagemAtualUrl ? 'Nenhuma imagem cadastrada. Selecione uma.' : ''"
              >
                <template v-slot:prepend>
                  <q-icon name="image" color="primary" />
                </template>
              </q-file>
            </div>

            <div class="col-12 col-sm-6">

              <div v-if="imagensAtuaisUrls.length > 0" class="q-mb-md">
                <div class="text-caption text-grey-8 q-mb-xs">Galeria Atual:</div>
                <div class="row q-gutter-sm">

                  <div
                    v-for="(url, index) in imagensAtuaisUrls"
                    :key="index"
                    class="relative-position"
                    style="width: 80px; height: 80px;"
                  >
                    <q-img
                      :src="url"
                      style="width: 100%; height: 100%; border-radius: 8px; border: 1px solid #ccc;"
                      fit="cover"
                    />
                    <q-btn
                      round
                      color="negative"
                      icon="close"
                      size="xs"
                      class="absolute-top-right shadow-3"
                      style="top: -6px; right: -6px;"
                      @click="deletarImagemGaleria(index, url)"
                    >
                      <q-tooltip class="bg-negative">Remover foto</q-tooltip>
                    </q-btn>
                  </div>

                </div>
              </div>

              <q-file
                outlined
                v-model="imagens"
                label="Nova Galeria de Fotos (Até 5 imagens)"
                multiple
                max-files="5"
                accept=".jpg, .jpeg, .png, .webp"
                clearable
                :hint="isEditing && imagensAtuaisUrls.length > 0 ? 'Selecionar novas imagens substituirá a galeria atual' : ''"
              >
                <template v-slot:prepend>
                  <q-icon name="collections" color="primary" />
                </template>
              </q-file>
            </div>
          </div>

          <div class="row justify-end q-gutter-sm q-pt-md">
            <q-btn label="Cancelar" type="reset" color="grey-7" flat class="q-px-lg" :to="{ name: 'estoque' }" v-if="isEditing" />
            <q-btn label="Limpar" type="reset" color="grey-7" flat class="q-px-lg" v-else />

            <q-btn
              :label="isEditing ? 'Atualizar' : 'Salvar'"
              type="submit"
              color="primary"
              unevaluated
              class="q-px-xl text-weight-bold"
            />
          </div>

        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref, nextTick, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import produtosService from 'src/services/produtos'

export default {
  setup () {
    const { post, uploads, upload, update, listById, listImages } = produtosService()
    const $q = useQuasar()
    const route = useRoute()
    const router = useRouter()

    const formRef = ref(null)
    const produtoId = ref(null)
    const isEditing = computed(() => !!produtoId.value)

    const descricao = ref(null)
    const preco = ref(null)
    const estoque = ref(null)
    const observacao = ref(null)
    const categoriaId = ref(null)

    const imagemAtualUrl = ref(null)
    const imagensAtuaisUrls = ref([])
    const imagem = ref(null)
    const imagens = ref([])

    const categorias = ref([
      { label: 'Computadores', value: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
      { label: 'Celulares', value: '2fa85f64-5717-4562-b3fc-2c963f66afa6' },
      { label: 'Processadores', value: '1fa85f64-5717-4562-b3fc-2c963f66afa6' }
    ])

    onMounted(async () => {
      if (route.params.id) {
        produtoId.value = route.params.id
        await carregarProdutoParaEdicao()
      }
    })

    const carregarProdutoParaEdicao = async () => {
      try {
        $q.loading.show()
        const produto = await listById(produtoId.value)

        descricao.value = produto.descricao
        preco.value = produto.preco
        estoque.value = produto.estoque
        observacao.value = produto.observacao
        categoriaId.value = produto.categoriaId
        imagemAtualUrl.value = produto.imagem

        try {
          console.log('Carregando galeria de imagens para o produto ID:', produtoId.value)
          const galeria = await listImages(produtoId.value)
          console.log('Galeria de imagens do produto:', galeria)
          if (galeria && galeria.length > 0) {
            imagensAtuaisUrls.value = galeria.map(img => img.Url || img.url)
          }
        } catch (erroGaleria) {
          console.warn('O produto não possui imagens extras na galeria.')
        }
      } catch (error) {
        console.error(error)
        $q.notify({ message: 'Erro ao carregar dados do produto', color: 'negative' })
      } finally {
        $q.loading.hide()
      }
    }

    const onNovaImagemSelecionada = (novoArquivo) => {
      if (novoArquivo) {
        // Opcional: esconder a imagem atual se o usuário fez upload de uma nova
      }
    }

    // --- FUNÇÕES DE EXCLUSÃO DE IMAGEM ---

    const deletarImagemPrincipal = () => {
      $q.dialog({
        title: 'Excluir Imagem',
        message: 'Tem certeza que deseja remover a imagem principal deste produto?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        // TODO: Se você tiver uma rota na API C# para apagar fisicamente, chame aqui.
        // Exemplo: await api.delete(`/produtos/${produtoId.value}/imagem-principal`)

        imagemAtualUrl.value = null
        $q.notify({ message: 'Imagem principal removida visualmente.', color: 'warning' })
      })
    }

    const deletarImagemGaleria = (index, url) => {
      $q.dialog({
        title: 'Remover da Galeria',
        message: 'Deseja remover esta foto da galeria?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        // TODO: Se tiver endpoint para apagar a foto específica, chame aqui usando a URL ou ID.
        // Exemplo: await api.delete(`/produtos/imagem-galeria?url=${url}`)

        // Remove localmente do array do frontend
        imagensAtuaisUrls.value.splice(index, 1)
        $q.notify({ message: 'Foto removida da galeria.', color: 'warning' })
      })
    }

    // --- FIM FUNÇÕES DE EXCLUSÃO ---

    const salvarProduto = async () => {
      try {
        $q.loading.show()

        const produto = {
          id: produtoId.value,
          descricao: descricao.value,
          preco: preco.value,
          estoque: estoque.value,
          observacao: observacao.value,
          categoriaId: categoriaId.value ? (categoriaId.value.value || categoriaId.value) : null,
          ativo: true
        }

        let produtoSalvoId

        if (isEditing.value) {
          await update(produto)
          produtoSalvoId = produtoId.value
          $q.notify({ message: 'Produto atualizado com sucesso!', color: 'positive' })
        } else {
          const produtoCadastrado = await post(produto)
          produtoSalvoId = produtoCadastrado.id

          console.log('Produto salvo com ID:', produtoSalvoId)
          console.log('Imagens do produto:', imagens.value)
          console.log('Imagem principal do produto:', imagem.value)

          if (imagens.value && imagens.value.length > 0) {
            await uploads(produtoSalvoId, imagens.value)
          }

          if (imagem.value) {
            await upload(produtoSalvoId, imagem.value)
          }

          if (isEditing.value) {
            router.push({ name: 'estoque' })
          }
          $q.notify({ message: 'Produto cadastrado com sucesso!', color: 'positive' })
          onReset()
        }
      } catch (error) {
        console.error(error)
        $q.notify({
          message: isEditing.value ? 'Erro ao atualizar produto' : 'Erro ao cadastrar produto',
          color: 'negative'
        })
      } finally {
        $q.loading.hide()
      }
    }

    const onSubmit = async () => {
      await salvarProduto()
    }

    const onReset = async () => {
      descricao.value = null
      preco.value = null
      estoque.value = null
      observacao.value = null
      categoriaId.value = null
      imagens.value = []
      imagem.value = null
      imagemAtualUrl.value = null
      imagensAtuaisUrls.value = []

      await nextTick()
      if (formRef.value) {
        formRef.value.resetValidation()
      }
    }

    return {
      formRef,
      isEditing,
      descricao,
      preco,
      estoque,
      categoriaId,
      observacao,
      imagemAtualUrl,
      imagensAtuaisUrls,
      imagem,
      imagens,
      categorias,
      onSubmit,
      onReset,
      onNovaImagemSelecionada,
      deletarImagemPrincipal,
      deletarImagemGaleria
    }
  }
}
</script>
