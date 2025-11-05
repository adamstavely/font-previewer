import { createRouter, createWebHistory } from 'vue-router'
import FontPreviewer from './components/FontPreviewer.vue'
import FontDetail from './components/FontDetail.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: FontPreviewer
  },
  {
    path: '/font/:fontName',
    name: 'font-detail',
    component: FontDetail,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

