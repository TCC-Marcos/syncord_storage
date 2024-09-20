<template>
  <div class="row q-pa-md q-gutter-md justify-center">
    <div class="col-12 q-gutter-md">
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
      >
        <div class="row justify-center">
          <div class="col-9 q-gutter-xs row">
            <q-input
              filled
              v-model="name"
              label="Nome Completo"
              lazy-rules
              class="col-lg-5 col-xs-5"
              :rules="[ val => val && val.length > 0 || 'Campo obrigatorio' ]"
            />
            <q-input
              filled
              v-model="cpf"
              label="CPF"
              lazy-rules
              mask="###.###.###-##"
              class="col-lg-3 col-xs-3"
              :rules="[ val => val && val.length > 0 || 'Campo obrigatorio' ]"
            />
            <q-input filled v-model="dataNascimento" label="Data nascimento" mask="date" lazy-rules
              class="col-lg-3 col-xs-3" :rules="[val => !!val || 'Campo obrigatorio']">
              <template v-slot:append>
                <q-icon name="event">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="dataNascimento">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Fechar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input
              filled
              v-model="celular"
              label="Celular"
              mask="(##) # ####-####"
              lazy-rules
              class="col-lg-4 col-xs-4"
              :rules="[ val => val && val.length > 0 || 'Campo obrigatorio' ]"
            />
            <q-input
              filled
              v-model="email"
              label="E-mail"
              lazy-rules
              class="col-lg-7 col-xs-7"
              :rules="[ val => val && val.length > 0 || 'Campo obrigatorio' ]"
            />
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
import { ref } from 'vue'

export default {
  setup () {
    const name = ref(null)
    const dataNascimento = ref(null)
    const cpf = ref(null)
    const telefone = ref(null)

    return {
      name,
      dataNascimento,
      cpf,
      telefone,

      onSubmit () {
      },

      onReset () {
        name.value = null
        dataNascimento.value = null
        cpf.value = null
        telefone.value = null
      }
    }
  }
}
</script>
