import Vue from 'vue'
import Router from 'vue-router'
import ServantList from './components/ServantList.vue'
import CraftEssenceList from './components/CraftEssenceList.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ServantList',
      component: ServantList
    },
    {
      path: '/ce',
      name: 'CraftEssenceList',
      component: CraftEssenceList
    }
  ],
  linkExactActiveClass: "active"
})
