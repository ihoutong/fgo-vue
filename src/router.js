import Vue from 'vue'
import Router from 'vue-router'
import ServantList from './components/ServantList.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ServantList',
      component: ServantList
    },
  ]
})
