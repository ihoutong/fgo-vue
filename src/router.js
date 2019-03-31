import Vue from 'vue';
import Router from 'vue-router';
import ServantList from './views/ServantList.vue';
import CraftEssenceList from './views/CraftEssenceList.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ServantList',
      component: ServantList,
    },
    {
      path: '/ce',
      name: 'CraftEssenceList',
      component: CraftEssenceList,
    }
  ],
  linkExactActiveClass: 'active',
})

// {
//   path: '/about',
//   name: 'about',
//   // route level code-splitting
//   // this generates a separate chunk (about.[hash].js) for this route
//   // which is lazy-loaded when the route is visited.
//   component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
// },