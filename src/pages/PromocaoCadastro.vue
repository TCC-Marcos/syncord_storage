<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <q-btn
        flat
        icon="arrow_back"
        label="Voltar para Promoções"
        color="primary"
        @click="router.push({ name: 'promocoes' })"
      />
    </div>
    <q-form ref="formRef" @submit.prevent="save">
      <div class="row q-col-gutter-md">
        <!-- Dados Promoção -->
        <div class="col-12 col-md-5">
          <q-card>
            <q-card-section>
              <div class="text-h6">
                {{ isEditing ? 'Editar Promoção' : 'Nova Promoção' }}
              </div>
            </q-card-section>

            <q-card-section>
              <q-input
                v-model="form.titulo"
                label="Título *"
                outlined
                lazy-rules
                :rules="[val => !!val || 'Informe o título']"
              />

              <q-input
                v-model="form.descricao"
                label="Descrição"
                type="textarea"
                outlined
                class="q-mt-md"
              />

              <q-toggle
                v-model="form.ativo"
                label="Ativa"
                class="q-mt-md"
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- Produtos -->
        <div class="col-12 col-md-7">
          <q-card>
            <q-card-section class="row items-center justify-between">
              <div class="text-h6">Produtos da Promoção</div>

              <q-btn
                color="primary"
                icon="add"
                label="Adicionar Produto"
                @click="addProduto"
              />
            </q-card-section>

            <q-card-section>
              <div v-if="!form.produtos.length" class="text-grey">
                Nenhum produto adicionado.
              </div>

              <div
                v-for="(item, index) in form.produtos"
                :key="index"
                class="row q-col-gutter-sm q-mb-md"
              >
                <!-- Produto -->
                <div class="col-5">
                  <q-select
                    v-model="item.produtoId"
                    :options="produtos"
                    option-value="id"
                    option-label="descricao"
                    emit-value
                    map-options
                    outlined
                    label="Produto *"
                    lazy-rules
                    :rules="[
                      val => !!val || 'Selecione um produto'
                    ]"
                  />
                </div>

                <!-- Desconto -->
                <div class="col-2">
                  <q-input
                    v-model.number="item.desconto"
                    type="number"
                    outlined
                    label="% Desc. *"
                    lazy-rules
                    :rules="[
                      val => val !== null && val !== '' || 'Informe o desconto',
                      val => val > 0 || 'Desconto deve ser maior que 0',
                      val => val <= 100 || 'Máximo 100%'
                    ]"
                  />
                </div>

                <!-- Validade -->
                <div class="col-3">
                  <q-input
                    v-model="item.dataValidade"
                    type="date"
                    outlined
                    label="Validade *"
                    lazy-rules
                    :rules="[
                      val => !!val || 'Informe a validade'
                    ]"
                  />
                </div>

                <!-- Remover -->
                <div class="col-2 flex flex-center">
                  <q-btn
                    icon="delete"
                    color="negative"
                    flat
                    @click="removeProduto(index)"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Botões -->
      <div class="q-mt-lg">
        <q-btn
          color="primary"
          label="Salvar"
          type="submit"
        />

        <q-btn
          flat
          color="grey"
          label="Cancelar"
          class="q-ml-sm"
          @click="router.back()"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import promocoesService from 'src/services/promocoes'
import produtosService from 'src/services/produtos'

export default {
  name: 'PromocoesPage',

  setup () {
    const { post, update, listById } = promocoesService()
    const { list: listProdutos } = produtosService()

    const $q = useQuasar()
    const route = useRoute()
    const router = useRouter()

    const promocaoId = ref(null)
    const produtos = ref([])
    const formRef = ref(null)

    const isEditing = computed(() => !!promocaoId.value)

    const form = ref({
      id: null,
      titulo: '',
      descricao: '',
      ativo: true,
      produtos: []
    })

    onMounted(async () => {
      await carregarProdutos()

      if (route.params.id) {
        promocaoId.value = route.params.id
        await carregarPromocao()
      }
    })

    const carregarProdutos = async () => {
      try {
        const data = await listProdutos()
        produtos.value = data
      } catch (error) {
        console.error(error)
        $q.notify({
          message: 'Erro ao carregar produtos',
          color: 'negative'
        })
      }
    }

    const carregarPromocao = async () => {
      try {
        $q.loading.show()

        const promocao = await listById(promocaoId.value)

        form.value = {
          id: promocao.id,
          titulo: promocao.titulo,
          descricao: promocao.descricao,
          ativo: promocao.ativo,
          produtos: promocao.produtos.map(p => ({
            id: p.id,
            produtoId: p.produtoId,
            desconto: p.desconto,
            dataValidade: p.dataValidade
              ? p.dataValidade.substring(0, 10)
              : null
          }))
        }
      } catch (error) {
        console.error(error)
        $q.notify({
          message: 'Erro ao carregar promoção',
          color: 'negative'
        })
      } finally {
        $q.loading.hide()
      }
    }

    const addProduto = () => {
      form.value.produtos.push({
        id: null,
        produtoId: null,
        desconto: null,
        dataValidade: null
      })
    }

    const removeProduto = (index) => {
      form.value.produtos.splice(index, 1)
    }

    const save = async () => {
      try {
        const valid = await formRef.value.validate()

        if (!valid) {
          $q.notify({
            message: 'Preencha os campos obrigatórios',
            color: 'warning'
          })
          return
        }

        if (!form.value.produtos.length) {
          $q.notify({
            message: 'Adicione pelo menos um produto',
            color: 'warning'
          })
          return
        }

        $q.loading.show()

        const payload = {
          ...(isEditing.value && { id: promocaoId.value }),
          titulo: form.value.titulo,
          descricao: form.value.descricao,
          ativo: form.value.ativo,
          produtos: form.value.produtos
        }

        if (isEditing.value) {
          await update(payload)

          $q.notify({
            message: 'Promoção atualizada com sucesso!',
            color: 'positive'
          })
        } else {
          await post(payload)

          $q.notify({
            message: 'Promoção criada com sucesso!',
            color: 'positive'
          })
        }

        router.push({ name: 'promocoes' })
      } catch (error) {
        console.error(error)

        $q.notify({
          message: 'Erro ao salvar promoção',
          color: 'negative'
        })
      } finally {
        $q.loading.hide()
      }
    }

    return {
      router,
      formRef,
      produtos,
      form,
      isEditing,
      save,
      addProduto,
      removeProduto
    }
  }
}
</script>
