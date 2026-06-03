const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/IndexPage.vue') },
      { path: 'estoque', name: 'estoque', component: () => import('pages/EstoqueProduto.vue') },
      { path: 'cadastro', name: 'cadastro', component: () => import('pages/ProdutosCadastro.vue') },
      { path: 'cadastro/:id?', name: 'editar', component: () => import('pages/ProdutosCadastro.vue') },
      { path: 'login', name: 'login', component: () => import('pages/TelaLogin.vue') },
      { path: 'usuarios', name: 'usuarios', component: () => import('pages/UsuariosTabela.vue') },
      { path: 'usuarios/novo', name: 'usuarios-new', component: () => import('pages/UsuariosCadastro.vue') },
      { path: 'usuarios/:id?', name: 'usuarios-edit', component: () => import('pages/UsuariosCadastro.vue') },
      { path: 'pedidos', name: 'pedidos', component: () => import('pages/Pedidos.vue') },
      { path: 'promocoes', name: 'promocoes', component: () => import('pages/PromocaoTabela.vue') },
      { path: 'promocoes/novo', name: 'promocoes-new', component: () => import('pages/PromocaoCadastro.vue') },
      { path: 'promocoes/:id?', name: 'promocoes-edit', component: () => import('pages/PromocaoCadastro.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
